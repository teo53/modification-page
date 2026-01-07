"""
경로 설정 유틸리티
모든 스크립트가 일관된 경로를 사용하도록 중앙 관리

사용법:
    from utils.paths import PATHS
    output_path = PATHS["output"] / "image.png"
"""
from pathlib import Path

# 기본 디렉토리
BASE_DIR = Path(__file__).parent.parent  # scraper/

# 경로 정책에 따른 폴더 구조
PATHS = {
    # 기본 폴더
    "base": BASE_DIR,
    
    # 입력 (원본 이미지)
    "input": BASE_DIR / "input",
    "input_source": BASE_DIR / "input" / "source",        # 수동 입력 원본
    "input_scraped": BASE_DIR / "input" / "scraped",      # 스크래핑된 원본
    
    # 이미지 출력
    "output": BASE_DIR / "output",
    "temp_candidates": BASE_DIR / "output" / "temp_candidates",
    
    # 스크래핑 결과
    "reports": BASE_DIR / "reports",
    "reports_daily": BASE_DIR / "reports" / "daily",
    "reports_archive": BASE_DIR / "reports" / "archive",
    
    # 스크립트 폴더
    "generators": BASE_DIR / "generators",
    "crawlers": BASE_DIR / "crawlers",
    "utils": BASE_DIR / "utils",
}


def ensure_dirs():
    """모든 필수 디렉토리 생성"""
    for key, path in PATHS.items():
        if "." not in path.name:  # 파일이 아닌 폴더만
            path.mkdir(parents=True, exist_ok=True)


def get_dated_filename(prefix: str, ext: str = "xlsx") -> Path:
    """날짜 기반 파일명 생성
    
    Args:
        prefix: 파일 접두사 (예: "results", "ads")
        ext: 확장자 (기본: xlsx)
    
    Returns:
        Path: reports/daily/YYYY-MM-DD_prefix.ext
    """
    from datetime import datetime
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"{date_str}_{prefix}.{ext}"
    return PATHS["reports_daily"] / filename


def get_ad_filename(ad_id: str, ext: str = "png") -> Path:
    """광고 ID 기반 파일명 생성
    
    Args:
        ad_id: 광고 ID
        ext: 확장자 (기본: png)
    
    Returns:
        Path: output/ad_{id}_{timestamp}.ext
    """
    import time
    timestamp = int(time.time())
    filename = f"ad_{ad_id}_{timestamp}.{ext}"
    return PATHS["output"] / filename


# 모듈 로드시 디렉토리 확인
ensure_dirs()
