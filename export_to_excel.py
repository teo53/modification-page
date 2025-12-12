import json
import pandas as pd

# JSON 로드
with open('src/data/scraped_ads.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 플랫한 구조로 변환
rows = []
for ad in data:
    row = {
        'ID': ad.get('id'),
        'URL': ad.get('url'),
        '제목': ad.get('title'),
        '수집일시': ad.get('scraped_at'),
        '닉네임': ad.get('advertiser', {}).get('nickname'),
        '전화번호': ad.get('advertiser', {}).get('phone'),
        '카카오ID': ad.get('advertiser', {}).get('kakao_id'),
        '텔레그램ID': ad.get('advertiser', {}).get('telegram_id'),
        '업체명': ad.get('advertiser', {}).get('business_name'),
        '근무지역': ad.get('advertiser', {}).get('work_location'),
        '조회수': ad.get('advertiser', {}).get('views'),
        '업종': ad.get('recruitment', {}).get('job_type'),
        '고용형태': ad.get('recruitment', {}).get('employment_type'),
        '급여': ad.get('recruitment', {}).get('salary'),
        '마감일': ad.get('recruitment', {}).get('deadline'),
        '회사명': ad.get('company', {}).get('company_name'),
        '회사주소': ad.get('company', {}).get('company_address'),
        '대표자': ad.get('company', {}).get('representative'),
        '썸네일': ad.get('thumbnail'),
        '상세이미지': ', '.join(ad.get('detail_images', []))
    }
    rows.append(row)

df = pd.DataFrame(rows)
df.to_excel('scraped_ads_export.xlsx', index=False, engine='openpyxl')
print(f"완료: {len(rows)}개 광고 -> scraped_ads_export.xlsx")
