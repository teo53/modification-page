
# ============================================================
# 데이터 정확성 검증 (New)
# ============================================================
def verify_extracted_data(image_path: str, data: Dict, client: OpenAI) -> tuple[Dict, bool]:
    """
    추출된 데이터의 정확성 검증 (특히 숫자/금액)
    Returns: (수정된 데이터, 수정 여부)
    """
    try:
        with open(image_path, "rb") as f:
            base64_image = base64.b64encode(f.read()).decode('utf-8')
    except IOError:
        return data, False

    verify_prompt = f"""
    당신은 데이터 검증 전문가입니다. 
    이미지와 비교하여 추출된 데이터의 정확성을 검증하고 오류가 있다면 수정하세요.

    ## 추출된 데이터:
    {json.dumps(data, ensure_ascii=False, indent=2)}

    ## 검증 중점 사항 (Critical):
    1. **숫자/금액**: 이미지의 금액과 일치하는가? (자릿수 확인 필수: 6000 != 60000)
    2. **연락처**: 전화번호, 카톡ID가 정확한가? 오타 없는가?
    3. **제외**: '추출되지 않음', '?' 등의 불확실한 값은 삭제하거나 null로 처리

    ## 출력 형식:
    - 오류가 없다면: {{"verified": true}}
    - 오류가 있다면: 수정된 전체 JSON 데이터 반환 (verified 필드 없이)
    
    오직 JSON만 출력하세요.
    """

    try:
        if CONFIG["DEBUG_MODE"]:
            logger.info("🕵️ 데이터 정확성 검증 중...")

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": verify_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}", "detail": "high"}}
                ]
            }],
            max_tokens=4000,
            temperature=0
        )
        
        result = response.choices[0].message.content
        json_match = re.search(r'\{[\s\S]*\}', result)
        
        if json_match:
            verified_data = json.loads(json_match.group())
            if verified_data.get("verified") is True:
                return data, False
            
            # 수정된 데이터 병합 (없어진 필드 보존)
            logger.warning(f"⚠️ 데이터 오류 발견 및 수정됨")
            # 기존 스타일 정보는 유지 (검증은 텍스트 위주이므로)
            if "style" in data and "style" not in verified_data:
                verified_data["style"] = data["style"]
            return verified_data, True
            
    except Exception as e:
        logger.error(f"검증 중 오류: {e}")
        
    return data, False
