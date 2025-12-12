"""
AI 워터마크 제거 스크립트 (개선 버전)
=====================================
queenalba.net 배경 워터마크를 정밀하게 감지하여 제거

특징:
- 상단/하단 바 자동 크롭
- 배경 워터마크 텍스트 감지 및 인페인팅
- 원본 품질 최대한 보존

사용법:
    python remove_watermark_ai.py [이미지파일 또는 폴더]
"""

import cv2
import numpy as np
from PIL import Image
import os
import sys
import argparse
from pathlib import Path


class AIWatermarkRemover:
    def __init__(self, output_dir="cleaned_images"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
    
    def detect_queenalba_bars(self, img: np.ndarray):
        """
        퀸알바 상단/하단 바 감지 (정밀 버전)
        - 상단: 로고 + 연락처 정보 (검정 배경, 보라/하늘색 텍스트)
        - 하단: 연락처 정보 (검정 배경)
        """
        height, width = img.shape[:2]
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # 상단 바 감지
        header_end = 0
        consecutive_content = 0
        
        for y in range(min(200, height // 5)):
            row_hsv = hsv[y, :]
            
            # 어두운 영역 (V < 40) 비율
            dark_ratio = np.mean(row_hsv[:, 2] < 40)
            
            # 콘텐츠 영역으로 전환되면 (어두운 비율이 낮아지면)
            if dark_ratio < 0.5:
                consecutive_content += 1
                if consecutive_content > 10:  # 10줄 연속 콘텐츠면 헤더 끝
                    break
            else:
                header_end = y + 1
                consecutive_content = 0
        
        # 하단 바 감지
        footer_start = height
        consecutive_content = 0
        
        for y in range(height - 1, max(height - 200, height * 4 // 5), -1):
            row_hsv = hsv[y, :]
            dark_ratio = np.mean(row_hsv[:, 2] < 40)
            
            if dark_ratio < 0.5:
                consecutive_content += 1
                if consecutive_content > 10:
                    break
            else:
                footer_start = y
                consecutive_content = 0
        
        return header_end, height - footer_start
    
    def create_watermark_mask_precise(self, img: np.ndarray):
        """
        'queenalba.net' 워터마크 정밀 감지
        워터마크 특성: 반투명 회색 텍스트, 주기적 패턴
        """
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        
        # 가우시안 블러로 원본 이미지 추정
        blurred = cv2.GaussianBlur(gray, (51, 51), 0)
        
        # 원본 - 블러 = 텍스트 및 디테일
        diff = cv2.absdiff(gray, blurred)
        
        # 워터마크는 특정 밝기 범위의 반복 패턴
        # 임계값 적용 (너무 강하거나 약한 에지 제외)
        _, mask = cv2.threshold(diff, 8, 255, cv2.THRESH_BINARY)
        
        # 작은 노이즈 제거
        kernel = np.ones((2, 2), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # 워터마크 영역만 선택 (텍스트가 아닌 영역)
        # 텍스트는 일반적으로 더 강한 대비를 가짐
        strong_edges = cv2.Canny(gray, 100, 200)
        strong_edges_dilated = cv2.dilate(strong_edges, np.ones((5, 5), np.uint8), iterations=2)
        
        # 강한 에지(텍스트) 영역 제외
        watermark_only = cv2.bitwise_and(mask, cv2.bitwise_not(strong_edges_dilated))
        
        # 마스크 확장 (인페인팅을 위해)
        watermark_only = cv2.dilate(watermark_only, np.ones((3, 3), np.uint8), iterations=1)
        
        return watermark_only
    
    def remove_watermark_safe(self, img: np.ndarray):
        """
        안전한 워터마크 제거 - 원본 최대 보존
        """
        mask = self.create_watermark_mask_precise(img)
        
        # 마스크 비율 체크
        mask_ratio = np.sum(mask > 0) / mask.size
        print(f"  워터마크 마스크: {mask_ratio:.1%}")
        
        if mask_ratio > 0.4:
            print("  ⚠️ 마스크가 너무 큼 - 선택적 제거 진행")
            # 마스크를 더 보수적으로 수정
            mask = self.create_conservative_mask(img)
            mask_ratio = np.sum(mask > 0) / mask.size
            print(f"  보수적 마스크: {mask_ratio:.1%}")
        
        if mask_ratio < 0.01:
            print("  ✅ 워터마크가 거의 감지되지 않음 - 원본 유지")
            return img
        
        if mask_ratio > 0.5:
            print("  ⚠️ 마스크가 여전히 너무 큼 - 원본 유지")
            return img
        
        # OpenCV Telea 인페인팅 (부드러운 결과)
        result = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
        
        # 원본과 블렌딩 (50% 혼합으로 자연스럽게)
        alpha = 0.7  # 인페인팅 결과 비율
        blended = cv2.addWeighted(result, alpha, img, 1 - alpha, 0)
        
        print("  ✅ 인페인팅 + 블렌딩 적용")
        return blended
    
    def create_conservative_mask(self, img: np.ndarray):
        """
        보수적인 마스크 - 명확한 워터마크만 감지
        """
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 매우 약한 에지만 감지 (워터마크는 약함)
        edges = cv2.Canny(gray, 20, 50)
        
        # 강한 에지 (텍스트, 경계선) 제외
        strong = cv2.Canny(gray, 80, 160)
        strong_dilated = cv2.dilate(strong, np.ones((7, 7), np.uint8), iterations=3)
        
        # 약한 에지에서 강한 에지 제외 = 워터마크
        mask = cv2.bitwise_and(edges, cv2.bitwise_not(strong_dilated))
        
        # 작은 점들 제거
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        
        return mask
    
    def crop_bars(self, img: np.ndarray):
        """
        상단/하단 바만 크롭 (본문 보존)
        """
        height, width = img.shape[:2]
        header, footer = self.detect_queenalba_bars(img)
        
        # 최소/최대 크롭 제한
        header = max(20, min(header, 100))
        footer = max(20, min(footer, 100))
        
        cropped = img[header:height - footer, :]
        print(f"  크롭: 상단 {header}px, 하단 {footer}px")
        
        return cropped
    
    def process_image(self, image_path: str, mode="full"):
        """
        이미지 처리
        mode:
          - "full": 크롭 + 워터마크 제거
          - "crop": 크롭만
          - "watermark": 워터마크 제거만
        """
        print(f"\n📷 처리 중: {image_path}")
        
        img = cv2.imread(image_path)
        if img is None:
            print(f"  ❌ 이미지 로드 실패")
            return None
        
        original_size = img.shape[:2]
        print(f"  원본 크기: {original_size[1]}x{original_size[0]}")
        
        result = img.copy()
        
        # 1. 크롭
        if mode in ["full", "crop"]:
            result = self.crop_bars(result)
        
        # 2. 워터마크 제거
        if mode in ["full", "watermark"]:
            result = self.remove_watermark_safe(result)
        
        # 저장
        filename = Path(image_path).stem + "_ai_cleaned" + Path(image_path).suffix
        output_path = os.path.join(self.output_dir, filename)
        cv2.imwrite(output_path, result, [cv2.IMWRITE_PNG_COMPRESSION, 0])  # 무손실
        
        new_size = result.shape[:2]
        print(f"  ✅ 저장: {output_path}")
        print(f"  새 크기: {new_size[1]}x{new_size[0]}")
        
        return output_path
    
    def process_directory(self, directory: str, mode="full"):
        """디렉토리 내 모든 이미지 처리"""
        extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
        
        files = []
        for ext in extensions:
            files.extend(Path(directory).glob(f'*{ext}'))
            files.extend(Path(directory).glob(f'*{ext.upper()}'))
        
        print(f"🗂️ {len(files)}개 이미지 발견")
        
        results = []
        for f in files:
            r = self.process_image(str(f), mode)
            if r:
                results.append(r)
        
        return results


def main():
    parser = argparse.ArgumentParser(description='AI 워터마크 제거 도구')
    parser.add_argument('input', help='이미지 파일 또는 디렉토리')
    parser.add_argument('-o', '--output', default='cleaned_images', help='출력 디렉토리')
    parser.add_argument('-m', '--mode', choices=['full', 'crop', 'watermark'], 
                       default='full', help='처리 모드: full(전체), crop(크롭만), watermark(워터마크만)')
    
    args = parser.parse_args()
    
    remover = AIWatermarkRemover(output_dir=args.output)
    
    if os.path.isfile(args.input):
        remover.process_image(args.input, args.mode)
    elif os.path.isdir(args.input):
        remover.process_directory(args.input, args.mode)
    else:
        print(f"❌ 파일/디렉토리 없음: {args.input}")
        sys.exit(1)
    
    print(f"\n✅ 완료! 결과: {args.output}/")


if __name__ == "__main__":
    main()
