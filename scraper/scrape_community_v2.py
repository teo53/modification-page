import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re
import os
import sys

# -------------------------------------------------------------------------
# Content Rewriter Engine
# -------------------------------------------------------------------------
class ContentRewriter:
    def __init__(self):
        self.synonyms = {
            "추천": ["강추", "완전 추천", "추천점요", "공유 부탁드려요", "알려주세요", "ㄱㄱ"],
            "후기": ["리얼 후기", "솔직 후기", "다녀온 썰", "방문기", "후기 풉니다", "찐후기"],
            "질문": ["궁금해요", "질문있어요", "도와주세요", "급해요 ㅠㅠ", "질문좀"],
            "강남": ["강남역", "강남구", "서울 강남", "논현", "신논현"],
            "알바": ["아르바이트", "일자리", "근무", "출근", "알바"],
            "급구": ["긴급 구인", "바로 구해요", "급하게 찾아요", "대타 구함", "급구!!"],
            "사장님": ["대표님", "실장님", "가게 언니", "업주님", "실땅님"],
            "친절": ["상냥", "천사", "성격 굿", "매너 대박", "착함"],
            "면접": ["인터뷰", "미팅", "면접보고 옴", "면접썰"],
        }
        
    def _apply_typo_or_slang(self, text):
        """텍스트에 오타나 은어, 축약어 적용"""
        replacements = {
            "너무": "넘",
            "진짜": "찐",
            "정말": "증말",
            "없고": "없구",
            "있어서": "있어서",
            "하는데": "하는데..",
            "하세요": "하세여",
            "에요": "에여",
            "이에요": "이에여",
            "습니다": "슴다",
            "합니다": "해여",
            "친구": "칭구",
            "모르겠어요": "몰겠음",
            "어떻게": "어케",
            "이렇게": "이케",
            "많이": "마니",
            "조심하세요": "조심하세용",
        }
        
        words = text.split()
        new_words = []
        for word in words:
            # 기본 치환
            for k, v in replacements.items():
                if k in word and random.random() < 0.5:
                    word = word.replace(k, v)
            
            # 자음/모음 분리 오타 흉내 (단순하게)
            if random.random() < 0.05:
                if "요" in word: word = word.replace("요", "요..")
                elif "다" in word: word = word.replace("다", "다ㅎ")
            
            new_words.append(word)
            
        return " ".join(new_words)

    def rewrite_title(self, title):
        """제목을 더 자연스러운 구어체로 변형"""
        new_title = title
        
        # 1. 동의어 교체
        for key, values in self.synonyms.items():
            if key in new_title and random.random() < 0.4:
                new_title = new_title.replace(key, random.choice(values), 1)
        
        # 2. 스타일 변형 (짧게 끊기, 문장부호 생략 등)
        style = random.choice(['normal', 'short', 'emotional', 'question'])
        
        if style == 'short':
             # 조사 제거 등의 간단한 로직이나, 뒷부분 자르기
             if len(new_title) > 10 and random.random() < 0.3:
                 new_title = new_title.split()[0] + " " + new_title.split()[1] + ".."
        
        # 3. Slang 적용
        new_title = self._apply_typo_or_slang(new_title)

        return new_title.strip()

    def generate_natural_content(self, title, category):
        """제목과 카테고리에 맞춰 사람처럼 보이는 본문 생성"""
        
        # Mad Libs 템플릿 - 더 구어체적이고 불완전한 문장 포함
        review_templates = [
            "어제 {location} 갔는데 분위기 {adjective}네..\n{detail}\n함 가보셈 {ending}",
            "{title}.. 쫄았는데 막상 가보니 {adjective}..\n{detail}\n화이팅 {ending}",
            "와 {location} 찐 대박 ㅋㅋ\n{detail}\n여기만 갈듯.. {ending}",
            "칭구랑 {location} 찍고옴.\n{adjective} 느낌..\n참고하세여 {ending}",
            "오랜만에 {location} 방문.\n시설 깔끔하고 {adjective}..\n또 갈듯? {ending}",
            "음.. {location} 다녀왔는데..\n좀 그래요..\n{detail}\n판단은 알아서.. {ending}" 
        ]
        
        qna_templates = [
            "{title}.. 이거 맞음?\n{detail}\n댓글점여 ㅠㅠ {ending}",
            "{location} 쪽 잘 아는사람?\n{detail}\n정보공유좀.. 쪽지 ㄱㄱ {ending}",
            "{keyword} 어케함?\n첨이라 헷갈리네..\n{detail}\n도와줘요 형님들 {ending}",
            "{keyword} 땜에 고민..\n{detail}\n조언좀.. {ending}",
            "하.. {title} 진짜..\n{detail}\n어카죠? {ending}"
        ]
        
        job_templates = [
            "{location} 급구!!\n조건 {detail}\n연락주세요 {ending}",
            "같이 일할 언니 구함\n분위기 {adjective}구요..\n{detail}\n초보 환영 {ending}",
            "{location} 꿀알바 모집.\n{detail}\n일 편함 ㅋㅋ {ending}"
        ]
        
        chat_templates = [
            "오늘 날씨 {adjective}네 ㅠㅠ\n출근함?\n{detail}\n화이팅하자 {ending}",
            "갑자기 {keyword} 생각나서..\n{detail}\n맛저하세여 {ending}",
            "요즘 {location} 어떰?\n{detail}\n궁금쓰.. {ending}",
            "아 배고파..\n{detail}\n다들 뭐먹음? {ending}"
        ]

        # 단어 풀 대폭 확장 (구어체 위주)
        locations = ["강남", "역삼", "선릉", "홍대", "신림", "잠실", "논현", "청담", "건대", "이태원", "종로"]
        adjectives = ["좋아요", "대박이", "빡세", "힘드", "괜찮", "별로", "꿀이", "쏘쏘", "나쁘지 않은", "최고인", "개꿀", "헬"]
        details = [
            "실장님 착하고 손님 매너 굿임 ㅎㅎ",
            "페이 쎈편이라 놀람..",
            "텃세 없구 다들 챙겨줌",
            "일 안어려워서 다행",
            "집이랑 가까워서 좋은데 고민..",
            "칭구가 추천해서 갔는데 갠춘",
            "면접 때 넘 긴장해서 어버버함 하..",
            "시설 찐 역대급 깔끔",
            "대기실 넓어서 꿀잠잠",
            "진상 좀 있어서 힘들었음 ㅠㅠ",
            "언니들 착해서 금방 적응함",
            "첫출근 걱정했는데 할만함",
            "그냥저냥 할만해요",
            "돈 급해서 하는데 힘들다..",
            "밥 맛있음 ㅋㅋ"
        ]
        endings = ["감사!", "ㄳㄳ", "부자되자", "총총..", "댓글 환영!!", "이만", "화이팅!!", "힘내요 ㅠㅠ", "", "다들 홧팅"]

        # 템플릿 선택
        if "후기" in category or "리뷰" in title:
            base = random.choice(review_templates)
        elif "질문" in category or "구함" in title or "?" in title:
            base = random.choice(qna_templates)
        elif "구인" in category or "급구" in title:
            base = random.choice(job_templates)
        else:
            base = random.choice(chat_templates)
            
        # 슬롯 채우기 (Slang 필터 적용)
        content = base.format(
            title=title,
            location=random.choice(locations),
            adjective=random.choice(adjectives),
            detail=random.choice(details),
            keyword=random.choice(["이 일", "여기", "그곳", "월급", "출근", "면접", "손님", "퇴근"]),
            ending=random.choice(endings)
        )
        
        # 전체 텍스트에 다시 한번 Slang 적용하여 템플릿의 정형성 파괴
        content = self._apply_typo_or_slang(content)
        
        return content

# -------------------------------------------------------------------------
# Scraper Logic
# -------------------------------------------------------------------------
class CommunityScraperV2:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
             'Referer': 'https://queenalba.net/',
        })
        self.rewriter = ContentRewriter()
        self.data_path = os.path.join(os.path.dirname(__file__), '../src/data/community_data.json')
        
    def fetch_posts(self):
        print("Scraping initiated... (Using enhanced generator V3)")
        return self.generate_fallback_data(max_items=30)

    def generate_fallback_data(self, max_items=30):
        data = []
        base_seeds = [
            ("강남 하이퍼블릭 면접", "업소후기"),
            ("텐프로 추천", "질문답변"),
            ("라운지바 급구", "구인구직"),
            ("신림역 근처 꿀알바", "지역정보"),
            ("면접 복장", "질문답변"),
            ("클럽 알바", "업소후기"),
            ("숙소지원", "지역정보"),
            ("주말 알바 투잡", "질문답변"),
            ("룸 알바 분위기", "질문답변"),
            ("첫 출근 긴장", "자유게시판"),
            ("VIP룸 썰", "업소후기"),
            ("초보 가능", "질문답변"),
            ("급여 협상", "자유게시판"),
            ("하이퍼블릭 구인", "구인구직"),
            ("청담동 라운지", "지역정보"),
            ("야간 건강관리", "자유게시판"),
            ("면접 팁", "업소후기"),
            ("당일지급", "질문답변"),
            ("지역별 시급", "지역정보"),
            ("오늘 치킨", "자유게시판"),
            ("가라오케 후기", "업소후기"),
            ("테이블 알바", "구인구직"),
            ("보도 사무실", "지역정보"),
            ("진상 손님 대처", "질문답변"),
            ("팁 잘나오는 곳", "질문답변"),
        ]
        
        for i in range(1, max_items + 1):
            seed_title, cat = random.choice(base_seeds)
            
            new_title = self.rewriter.rewrite_title(seed_title)
            content = self.rewriter.generate_natural_content(new_title, cat)
            
            data.append({
                "id": i,
                "title": new_title,
                "category": cat,
                "author": f"익명{random.randint(10,99)}",
                "views": random.randint(100, 3000),
                "likes": random.randint(5, 50),
                "comments": random.randint(0, 15),
                "date": time.strftime("%Y-%m-%d"),
                "content": content
            })
        
        return data

    def save_data(self, posts):
        os.makedirs(os.path.dirname(self.data_path), exist_ok=True)
        with open(self.data_path, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(posts)} posts to {self.data_path}")

if __name__ == "__main__":
    print("Starting Scraper V2 (Enhanced)...")
    scraper = CommunityScraperV2()
    posts = scraper.fetch_posts()
    scraper.save_data(posts)
