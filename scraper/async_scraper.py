#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QueenAlba Async Scraper

A high-performance asynchronous scraper using aiohttp with:
- Concurrent requests with semaphore-based rate limiting
- Proper error handling and retry logic
- CLI argument support for flexible configuration
- Multiple output formats (JSON, CSV, JSONL)

Usage:
    python async_scraper.py --pages 10 --output ./data/ads.json --format json
    python async_scraper.py --concurrent 3 --delay 2.0 --retry 5
"""

import asyncio
import argparse
import csv
import json
import logging
import os
import random
import re
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Optional, Dict, List, Any
from urllib.parse import urljoin

import aiohttp
from bs4 import BeautifulSoup

# Import credentials management
try:
    from credentials import QUEENALBA_CREDENTIALS, validate_credentials
except ImportError:
    QUEENALBA_CREDENTIALS = None
    validate_credentials = lambda u, p: bool(u and p)

# ============================================================
# Configuration
# ============================================================

BASE_URL = "https://queenalba.net"
LOGIN_URL = f"{BASE_URL}/member/login_ok.php"
ADULT_CHECK_URL = f"{BASE_URL}/adult_index.php"

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Referer": BASE_URL,
}


# ============================================================
# Custom Exceptions
# ============================================================

class ScraperError(Exception):
    """Base exception for scraper errors"""
    pass


class LoginError(ScraperError):
    """Raised when login fails"""
    pass


class NetworkError(ScraperError):
    """Raised for network-related errors"""
    def __init__(self, message: str, status_code: Optional[int] = None, url: Optional[str] = None):
        super().__init__(message)
        self.status_code = status_code
        self.url = url


class ParseError(ScraperError):
    """Raised when HTML parsing fails"""
    def __init__(self, message: str, url: Optional[str] = None):
        super().__init__(message)
        self.url = url


class RateLimitError(NetworkError):
    """Raised when rate limited by server"""
    pass


class SessionExpiredError(ScraperError):
    """Raised when session expires during scraping"""
    pass


# ============================================================
# Output Format
# ============================================================

class OutputFormat(Enum):
    JSON = "json"
    CSV = "csv"
    JSONL = "jsonl"


# ============================================================
# Data Classes
# ============================================================

@dataclass
class AdvertiserInfo:
    nickname: str = ""
    call_number: str = ""
    call_mgmt_number: str = ""
    phone: str = ""
    kakao_id: str = ""
    telegram_id: str = ""
    business_name: str = ""
    work_location: str = ""
    views: int = 0


@dataclass
class RecruitmentInfo:
    job_type: str = ""
    employment_type: str = ""
    salary: str = ""
    deadline: str = ""
    benefits: List[str] = field(default_factory=list)
    keywords: List[str] = field(default_factory=list)


@dataclass
class CompanyInfo:
    company_name: str = ""
    company_address: str = ""
    representative: str = ""


@dataclass
class AdData:
    id: int
    url: str
    title: str = ""
    scraped_at: str = ""
    advertiser: AdvertiserInfo = field(default_factory=AdvertiserInfo)
    recruitment: RecruitmentInfo = field(default_factory=RecruitmentInfo)
    detail_description: str = ""
    detail_images: List[str] = field(default_factory=list)
    thumbnail: str = ""
    company: CompanyInfo = field(default_factory=CompanyInfo)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "url": self.url,
            "title": self.title,
            "scraped_at": self.scraped_at,
            "advertiser": asdict(self.advertiser),
            "recruitment": asdict(self.recruitment),
            "detail": {
                "description": self.detail_description,
                "images": self.detail_images,
            },
            "thumbnail": self.thumbnail,
            "company": asdict(self.company),
            # Legacy fields for backward compatibility
            "location": self.advertiser.work_location,
            "pay": self.recruitment.salary,
            "phones": [self.advertiser.phone] if self.advertiser.phone else [],
            "content": self.detail_description,
        }

    def to_flat_dict(self) -> Dict[str, Any]:
        """Flatten for CSV export"""
        return {
            "id": self.id,
            "url": self.url,
            "title": self.title,
            "scraped_at": self.scraped_at,
            "nickname": self.advertiser.nickname,
            "phone": self.advertiser.phone,
            "kakao_id": self.advertiser.kakao_id,
            "telegram_id": self.advertiser.telegram_id,
            "business_name": self.advertiser.business_name,
            "work_location": self.advertiser.work_location,
            "views": self.advertiser.views,
            "job_type": self.recruitment.job_type,
            "salary": self.recruitment.salary,
            "deadline": self.recruitment.deadline,
            "company_name": self.company.company_name,
            "company_address": self.company.company_address,
            "thumbnail": self.thumbnail,
            "image_count": len(self.detail_images),
        }


# ============================================================
# Logging Setup
# ============================================================

def setup_logging(level: str = "INFO", log_file: Optional[str] = None) -> logging.Logger:
    """Configure logging with optional file output"""
    logger = logging.getLogger("scraper")
    logger.setLevel(getattr(logging, level.upper()))

    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler (optional)
    if log_file:
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


# ============================================================
# Async Scraper Class
# ============================================================

class AsyncQueenAlbaScraper:
    """Asynchronous scraper for QueenAlba with proper error handling"""

    def __init__(
        self,
        max_concurrent: int = 5,
        delay: float = 1.5,
        max_retries: int = 3,
        timeout: int = 30,
        logger: Optional[logging.Logger] = None
    ):
        self.max_concurrent = max_concurrent
        self.delay = delay
        self.max_retries = max_retries
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        self.logger = logger or logging.getLogger("scraper")
        self.semaphore: Optional[asyncio.Semaphore] = None
        self.session: Optional[aiohttp.ClientSession] = None
        self._logged_in = False

    async def __aenter__(self):
        """Async context manager entry"""
        self.semaphore = asyncio.Semaphore(self.max_concurrent)
        self.session = aiohttp.ClientSession(
            headers=DEFAULT_HEADERS,
            timeout=self.timeout
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()

    async def _random_delay(self):
        """Add randomized delay to avoid detection"""
        jitter = random.uniform(0.5, 1.5)
        await asyncio.sleep(self.delay * jitter)

    async def _fetch_with_retry(
        self,
        url: str,
        method: str = "GET",
        data: Optional[Dict] = None,
        allow_redirects: bool = True
    ) -> str:
        """Fetch URL with retry logic and proper error handling"""
        last_error: Optional[Exception] = None

        for attempt in range(1, self.max_retries + 1):
            try:
                async with self.semaphore:
                    if method.upper() == "POST":
                        async with self.session.post(
                            url, data=data, allow_redirects=allow_redirects
                        ) as response:
                            if response.status == 429:
                                retry_after = int(response.headers.get("Retry-After", 60))
                                raise RateLimitError(
                                    f"Rate limited. Retry after {retry_after}s",
                                    status_code=429,
                                    url=url
                                )
                            if response.status >= 400:
                                raise NetworkError(
                                    f"HTTP {response.status}",
                                    status_code=response.status,
                                    url=url
                                )
                            return await response.text()
                    else:
                        async with self.session.get(
                            url, allow_redirects=allow_redirects
                        ) as response:
                            if response.status == 429:
                                retry_after = int(response.headers.get("Retry-After", 60))
                                raise RateLimitError(
                                    f"Rate limited. Retry after {retry_after}s",
                                    status_code=429,
                                    url=url
                                )
                            if response.status >= 400:
                                raise NetworkError(
                                    f"HTTP {response.status}",
                                    status_code=response.status,
                                    url=url
                                )
                            return await response.text()

            except aiohttp.ClientError as e:
                last_error = NetworkError(f"Network error: {e}", url=url)
                self.logger.warning(
                    f"Attempt {attempt}/{self.max_retries} failed for {url}: {e}"
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff

            except RateLimitError as e:
                last_error = e
                self.logger.warning(f"Rate limited on {url}, waiting...")
                await asyncio.sleep(60)  # Wait before retry

            except Exception as e:
                last_error = NetworkError(f"Unexpected error: {e}", url=url)
                self.logger.error(f"Unexpected error fetching {url}: {e}")
                if attempt < self.max_retries:
                    await asyncio.sleep(2 ** attempt)

        raise last_error or NetworkError("Max retries exceeded", url=url)

    async def login(self, username: str, password: str) -> bool:
        """Login to QueenAlba with provided credentials"""
        if not validate_credentials(username, password):
            raise LoginError("Invalid credentials format")

        self.logger.info(f"Logging in as {username}...")

        try:
            # Get main page to establish session
            await self._fetch_with_retry(BASE_URL)

            # Adult verification
            await self._fetch_with_retry(ADULT_CHECK_URL)

            # Perform login
            login_data = {
                "mb_id": username,
                "mb_password": password,
            }
            await self._fetch_with_retry(LOGIN_URL, method="POST", data=login_data)

            # Verify login by checking protected page
            test_html = await self._fetch_with_retry(f"{BASE_URL}/guin_list.php")

            if "adult_index" in test_html or "login" in test_html.lower():
                raise LoginError("Login failed - redirected to login page")

            self._logged_in = True
            self.logger.info("Login successful!")
            return True

        except NetworkError as e:
            raise LoginError(f"Login failed due to network error: {e}")
        except Exception as e:
            raise LoginError(f"Login failed: {e}")

    async def get_ad_urls(self, max_pages: int = 5) -> List[str]:
        """Get list of ad detail URLs from listing pages"""
        if not self._logged_in:
            raise SessionExpiredError("Not logged in. Call login() first.")

        ad_urls: List[str] = []

        for page in range(1, max_pages + 1):
            list_url = f"{BASE_URL}/guin_list.php?page={page}"

            try:
                self.logger.info(f"Fetching listing page {page}/{max_pages}")
                html = await self._fetch_with_retry(list_url)

                soup = BeautifulSoup(html, "html.parser")
                links = soup.find_all("a", href=re.compile(r"guin_detail\.php\?num=\d+"))

                for link in links:
                    href = link.get("href", "")
                    full_url = urljoin(BASE_URL, href)
                    if full_url not in ad_urls:
                        ad_urls.append(full_url)

                self.logger.debug(f"Found {len(links)} links on page {page}")
                await self._random_delay()

            except NetworkError as e:
                self.logger.warning(f"Failed to fetch page {page}: {e}")
                continue

        self.logger.info(f"Total unique ad URLs found: {len(ad_urls)}")
        return ad_urls

    def _extract_text(self, element) -> str:
        """Safely extract text from an element"""
        if element:
            return element.get_text(strip=True)
        return ""

    def _parse_advertiser_info(self, soup: BeautifulSoup) -> AdvertiserInfo:
        """Parse advertiser information from HTML"""
        info = AdvertiserInfo()

        try:
            for row in soup.find_all("tr"):
                cells = row.find_all(["td", "th"])
                if len(cells) >= 2:
                    label = self._extract_text(cells[0])
                    value = self._extract_text(cells[1])

                    if "닉네임" in label:
                        info.nickname = value
                    elif "콜번호" in label and "관리" not in label:
                        info.call_number = value
                    elif "콜관리" in label:
                        info.call_mgmt_number = value
                    elif "전화" in label:
                        info.phone = value
                    elif "카톡" in label or "카카오" in label:
                        info.kakao_id = value
                    elif "텔레그램" in label:
                        info.telegram_id = value
                    elif "상호" in label:
                        info.business_name = value
                    elif "근무지역" in label or label == "지역":
                        info.work_location = value

            # Extract views
            view_match = re.search(r"조회[:\s]*([\d,]+)", soup.get_text())
            if view_match:
                info.views = int(view_match.group(1).replace(",", ""))

        except Exception as e:
            self.logger.debug(f"Error parsing advertiser info: {e}")

        return info

    def _parse_recruitment_info(self, soup: BeautifulSoup) -> RecruitmentInfo:
        """Parse recruitment information from HTML"""
        info = RecruitmentInfo()

        try:
            for row in soup.find_all("tr"):
                text = self._extract_text(row)

                if "업무내용" in text or "업종" in text:
                    info.job_type = text.split(":")[-1].strip() if ":" in text else text
                elif "고용형태" in text:
                    info.employment_type = text.split(":")[-1].strip() if ":" in text else text
                elif "급여" in text:
                    salary_match = re.search(r"([\d,]+원)", text)
                    info.salary = salary_match.group(1) if salary_match else text
                elif "마감" in text:
                    info.deadline = text.split(":")[-1].strip() if ":" in text else text

        except Exception as e:
            self.logger.debug(f"Error parsing recruitment info: {e}")

        return info

    def _parse_company_info(self, soup: BeautifulSoup) -> CompanyInfo:
        """Parse company information from HTML"""
        info = CompanyInfo()

        try:
            for row in soup.find_all("tr"):
                cells = row.find_all(["td", "th"])
                if len(cells) >= 2:
                    label = self._extract_text(cells[0])
                    value = self._extract_text(cells[1])

                    if "회사명" in label or "업체명" in label:
                        info.company_name = value
                    elif "회사주소" in label or label == "주소":
                        info.company_address = value
                    elif "대표자" in label:
                        info.representative = value

        except Exception as e:
            self.logger.debug(f"Error parsing company info: {e}")

        return info

    def _extract_images(self, soup: BeautifulSoup) -> List[str]:
        """Extract ad images from HTML"""
        images = []

        try:
            for img in soup.find_all("img"):
                src = img.get("src", "") or img.get("data-src", "")
                if src and "wys2/file_attach" in src:
                    if src.startswith("//"):
                        src = "https:" + src
                    elif src.startswith("/"):
                        src = BASE_URL + src
                    elif not src.startswith("http"):
                        src = BASE_URL + "/" + src

                    src = src.replace("/../", "/")

                    if src not in images:
                        images.append(src)

        except Exception as e:
            self.logger.debug(f"Error extracting images: {e}")

        return images

    async def scrape_ad(self, url: str) -> Optional[AdData]:
        """Scrape a single ad detail page"""
        try:
            match = re.search(r"num=(\d+)", url)
            ad_id = int(match.group(1)) if match else 0

            self.logger.info(f"Scraping ad #{ad_id}")

            html = await self._fetch_with_retry(url)

            # Check for session expiry
            if "adult_index" in html or "document.location.replace" in html:
                raise SessionExpiredError("Session expired during scraping")

            soup = BeautifulSoup(html, "html.parser")

            # Parse all sections
            advertiser = self._parse_advertiser_info(soup)
            recruitment = self._parse_recruitment_info(soup)
            company = self._parse_company_info(soup)
            images = self._extract_images(soup)

            # Extract title
            title = ""
            for selector in ["h1", "h2", ".title", ".tit"]:
                elem = soup.select_one(selector)
                if elem:
                    title = self._extract_text(elem)
                    if title and "퀸알바" not in title:
                        break

            if not title:
                title = advertiser.nickname or advertiser.business_name or f"Ad #{ad_id}"

            ad = AdData(
                id=ad_id,
                url=url,
                title=title,
                scraped_at=datetime.now().isoformat(),
                advertiser=advertiser,
                recruitment=recruitment,
                company=company,
                detail_images=images,
                thumbnail=images[0] if images else "",
            )

            self.logger.info(f"Scraped: {ad.title[:50]}...")
            return ad

        except SessionExpiredError:
            raise
        except ParseError as e:
            self.logger.warning(f"Parse error for {url}: {e}")
            return None
        except NetworkError as e:
            self.logger.warning(f"Network error for {url}: {e}")
            return None
        except Exception as e:
            self.logger.error(f"Unexpected error scraping {url}: {e}")
            return None

    async def scrape_all(
        self,
        ad_urls: List[str],
        max_ads: Optional[int] = None
    ) -> List[AdData]:
        """Scrape multiple ads concurrently"""
        urls_to_scrape = ad_urls[:max_ads] if max_ads else ad_urls

        self.logger.info(f"Starting to scrape {len(urls_to_scrape)} ads...")

        results: List[AdData] = []

        # Process in batches to avoid overwhelming the server
        batch_size = self.max_concurrent * 2

        for i in range(0, len(urls_to_scrape), batch_size):
            batch = urls_to_scrape[i:i + batch_size]

            tasks = [self.scrape_ad(url) for url in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)

            for result in batch_results:
                if isinstance(result, AdData):
                    results.append(result)
                elif isinstance(result, SessionExpiredError):
                    self.logger.error("Session expired. Stopping scrape.")
                    return results
                elif isinstance(result, Exception):
                    self.logger.debug(f"Task failed: {result}")

            # Delay between batches
            if i + batch_size < len(urls_to_scrape):
                await self._random_delay()

        self.logger.info(f"Successfully scraped {len(results)} ads")
        return results


# ============================================================
# Output Functions
# ============================================================

def save_json(ads: List[AdData], filepath: Path) -> None:
    """Save ads as JSON"""
    data = [ad.to_dict() for ad in ads]
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def save_jsonl(ads: List[AdData], filepath: Path) -> None:
    """Save ads as JSON Lines (one JSON object per line)"""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        for ad in ads:
            f.write(json.dumps(ad.to_dict(), ensure_ascii=False) + "\n")


def save_csv(ads: List[AdData], filepath: Path) -> None:
    """Save ads as CSV"""
    if not ads:
        return

    filepath.parent.mkdir(parents=True, exist_ok=True)

    # Use flat dict for CSV
    rows = [ad.to_flat_dict() for ad in ads]
    fieldnames = rows[0].keys()

    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def save_output(
    ads: List[AdData],
    filepath: Path,
    format: OutputFormat
) -> None:
    """Save ads in specified format"""
    if format == OutputFormat.JSON:
        save_json(ads, filepath)
    elif format == OutputFormat.JSONL:
        save_jsonl(ads, filepath)
    elif format == OutputFormat.CSV:
        save_csv(ads, filepath)


# ============================================================
# CLI
# ============================================================

def parse_args() -> argparse.Namespace:
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description="QueenAlba Async Scraper - High-performance ad scraper",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument(
        "--pages",
        type=int,
        default=int(os.getenv("SCRAPER_MAX_PAGES", "5")),
        help="Number of listing pages to scrape"
    )

    parser.add_argument(
        "--max-ads",
        type=int,
        default=None,
        help="Maximum number of ads to scrape (default: all)"
    )

    parser.add_argument(
        "--output", "-o",
        type=str,
        default=os.getenv("SCRAPER_OUTPUT_DIR", "./output") + "/scraped_ads.json",
        help="Output file path"
    )

    parser.add_argument(
        "--format", "-f",
        type=str,
        choices=["json", "csv", "jsonl"],
        default="json",
        help="Output format"
    )

    parser.add_argument(
        "--concurrent", "-c",
        type=int,
        default=int(os.getenv("SCRAPER_MAX_CONCURRENT", "5")),
        help="Maximum concurrent requests"
    )

    parser.add_argument(
        "--delay", "-d",
        type=float,
        default=float(os.getenv("SCRAPER_DELAY", "1.5")),
        help="Delay between requests in seconds"
    )

    parser.add_argument(
        "--retry", "-r",
        type=int,
        default=3,
        help="Number of retries for failed requests"
    )

    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="Request timeout in seconds"
    )

    parser.add_argument(
        "--username", "-u",
        type=str,
        default=os.getenv("QUEENALBA_USERNAME"),
        help="Login username (or set QUEENALBA_USERNAME env var)"
    )

    parser.add_argument(
        "--password", "-p",
        type=str,
        default=os.getenv("QUEENALBA_PASSWORD"),
        help="Login password (or set QUEENALBA_PASSWORD env var)"
    )

    parser.add_argument(
        "--log-level",
        type=str,
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default=os.getenv("LOG_LEVEL", "INFO"),
        help="Logging level"
    )

    parser.add_argument(
        "--log-file",
        type=str,
        default=os.getenv("LOG_FILE"),
        help="Log file path (optional)"
    )

    return parser.parse_args()


async def main():
    """Main entry point"""
    args = parse_args()

    # Setup logging
    logger = setup_logging(args.log_level, args.log_file)

    logger.info("=" * 60)
    logger.info("QueenAlba Async Scraper")
    logger.info("=" * 60)

    # Get credentials
    username = args.username
    password = args.password

    if not username or not password:
        if QUEENALBA_CREDENTIALS:
            username = QUEENALBA_CREDENTIALS.get("username")
            password = QUEENALBA_CREDENTIALS.get("password")

    if not username or not password:
        logger.error("No credentials provided.")
        logger.error("Set QUEENALBA_USERNAME and QUEENALBA_PASSWORD environment variables,")
        logger.error("or use --username and --password arguments.")
        sys.exit(1)

    # Run scraper
    try:
        async with AsyncQueenAlbaScraper(
            max_concurrent=args.concurrent,
            delay=args.delay,
            max_retries=args.retry,
            timeout=args.timeout,
            logger=logger
        ) as scraper:
            # Login
            await scraper.login(username, password)

            # Get ad URLs
            ad_urls = await scraper.get_ad_urls(args.pages)

            if not ad_urls:
                logger.warning("No ad URLs found.")
                return

            # Scrape ads
            ads = await scraper.scrape_all(ad_urls, args.max_ads)

            # Save output
            if ads:
                output_path = Path(args.output)
                output_format = OutputFormat(args.format)
                save_output(ads, output_path, output_format)
                logger.info(f"Saved {len(ads)} ads to {output_path}")
            else:
                logger.warning("No ads were scraped successfully")

    except LoginError as e:
        logger.error(f"Login failed: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        sys.exit(1)

    logger.info("=" * 60)
    logger.info("Scraping complete!")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
