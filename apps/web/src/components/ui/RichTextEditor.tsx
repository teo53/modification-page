import React, { useMemo, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { HelpCircle } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    simpleMode?: boolean;
}

const DEFAULT_TEMPLATE = `<div style="font-size: 16px; line-height: 1.8;">
<p><strong>■ 업소 소개</strong></p>
<p style="color: #aaa; margin-left: 12px;">업소의 특징과 강점을 작성해주세요</p>
<p><br></p>

<p><strong>■ 근무 시스템</strong></p>
<p style="color: #aaa; margin-left: 12px;">출퇴근 시간, 근무 타임 등을 작성해주세요</p>
<p><br></p>

<p><strong>■ 급여 정보</strong></p>
<p style="color: #aaa; margin-left: 12px;">급여 체계, 정산 방식 등을 작성해주세요</p>
<p><br></p>

<p><strong>■ 우대 사항</strong></p>
<p style="color: #aaa; margin-left: 12px;">우대하는 조건이나 경력을 작성해주세요</p>
<p><br></p>

<p><strong>■ 편의사항 & 복리후생</strong></p>
<p style="color: #aaa; margin-left: 12px;">숙소 제공, 식사 지원 등 편의사항을 작성해주세요</p>
</div>`;

// 폰트 목록 등록
const Font = Quill.import('formats/font') as any;
Font.whitelist = ['default', 'nanumgothic', 'malgun', 'dotum', 'gulim', 'batang', 'arial', 'times', 'courier'];
Quill.register(Font, true);

// 폰트 사이즈 등록
const Size = Quill.import('attributors/style/size') as any;
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'];
Quill.register(Size, true);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder: _placeholder, simpleMode = false }) => {
    const quillRef = useRef<ReactQuill>(null);
    const [showGuide, setShowGuide] = React.useState(false);

    // Quill 모듈 설정 (풍부한 툴바)
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                // 첫째 줄: 폰트, 사이즈, 헤더
                [{ 'font': ['default', 'nanumgothic', 'malgun', 'dotum', 'gulim', 'batang', 'arial', 'times', 'courier'] }],
                [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                // 둘째 줄: 기본 서식
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'script': 'sub' }, { 'script': 'super' }],

                // 셋째 줄: 색상
                [{ 'color': [] }, { 'background': [] }],

                // 넷째 줄: 정렬 (왼쪽, 가운데, 오른쪽, 양쪽)
                [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],

                // 다섯째 줄: 리스트
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],

                // 여섯째 줄: 미디어 및 기타
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],

                // 일곱째 줄: 기타
                [{ 'direction': 'rtl' }],
                ['clean']
            ],
        },
        clipboard: {
            matchVisual: false,
        }
    }), []);

    // Quill 포맷 설정
    const formats = [
        'font', 'size', 'header',
        'bold', 'italic', 'underline', 'strike',
        'script',
        'color', 'background',
        'align', 'indent',
        'list', 'bullet', 'check',
        'blockquote', 'code-block',
        'link', 'image', 'video',
        'direction'
    ];

    // 초기화: 빈 값일 때 템플릿 적용
    useEffect(() => {
        if (!value && onChange) {
            onChange(DEFAULT_TEMPLATE);
        }
    }, []);

    // 툴팁 추가
    useEffect(() => {
        const tooltips: Record<string, string> = {
            '.ql-bold': '굵게 (Ctrl+B)',
            '.ql-italic': '기울임 (Ctrl+I)',
            '.ql-underline': '밑줄 (Ctrl+U)',
            '.ql-strike': '취소선',
            '.ql-blockquote': '인용구',
            '.ql-code-block': '코드 블록',
            '.ql-link': '링크 삽입 (Ctrl+K)',
            '.ql-image': '이미지 삽입',
            '.ql-video': '동영상 삽입',
            '.ql-clean': '서식 제거',
            '.ql-list[value="ordered"]': '번호 목록',
            '.ql-list[value="bullet"]': '글머리 기호 목록',
            '.ql-list[value="check"]': '체크 목록',
            '.ql-indent[value="-1"]': '내어쓰기',
            '.ql-indent[value="+1"]': '들여쓰기',
            '.ql-script[value="sub"]': '아래 첨자',
            '.ql-script[value="super"]': '위 첨자',
            '.ql-direction': '텍스트 방향',
            '.ql-align[value=""]': '왼쪽 정렬',
            '.ql-align[value="center"]': '가운데 정렬',
            '.ql-align[value="right"]': '오른쪽 정렬',
            '.ql-align[value="justify"]': '양쪽 정렬',
            '.ql-color .ql-picker-label': '글자 색상 (텍스트 색상 변경)',
            '.ql-background .ql-picker-label': '배경 색상 (형광펜 효과)',
            '.ql-font .ql-picker-label': '글꼴 선택',
            '.ql-size .ql-picker-label': '글자 크기 선택',
            '.ql-header .ql-picker-label': '제목 스타일 선택',
        };

        // 약간의 지연 후 툴팁 적용
        const timer = setTimeout(() => {
            Object.entries(tooltips).forEach(([selector, title]) => {
                const buttons = document.querySelectorAll(`.rich-text-editor-wrapper ${selector}`);
                buttons.forEach(btn => {
                    btn.setAttribute('title', title);
                });
            });
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (content: string) => {
        onChange(content);
    };

    return (
        <div className="space-y-3">
            {/* Header - simpleMode일 경우 숨김 */}
            {!simpleMode && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        상세내용
                        <span className="text-xs font-normal text-red-400">필수</span>
                    </h3>
                    <button
                        type="button"
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                        <HelpCircle size={14} />
                        상세페이지 작성 가이드 보기
                    </button>
                </div>
            )}

            {/* Guide - simpleMode일 경우 숨김 */}
            {!simpleMode && showGuide && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm">
                    <h4 className="font-bold text-primary mb-2">작성 가이드</h4>
                    <ul className="space-y-1.5 text-white/70">
                        <li>• 구체적인 업소 소개와 특징을 작성하세요</li>
                        <li>• 급여 정보와 근무 시간을 명확히 안내하세요</li>
                        <li>• 우대 사항과 복리후생을 상세히 작성하세요</li>
                        <li>• 이미지를 추가하면 클릭률이 높아집니다</li>
                        <li>• 형광펜/강조 효과를 사용하면 눈에 띕니다</li>
                    </ul>
                </div>
            )}

            {/* Quill Editor */}
            <div className="rich-text-editor-wrapper">
                <style>{`
                    /* 폰트 정의 */
                    .ql-font-nanumgothic { font-family: 'Nanum Gothic', sans-serif; }
                    .ql-font-malgun { font-family: 'Malgun Gothic', sans-serif; }
                    .ql-font-dotum { font-family: 'Dotum', sans-serif; }
                    .ql-font-gulim { font-family: 'Gulim', sans-serif; }
                    .ql-font-batang { font-family: 'Batang', serif; }
                    .ql-font-arial { font-family: Arial, sans-serif; }
                    .ql-font-times { font-family: 'Times New Roman', serif; }
                    .ql-font-courier { font-family: 'Courier New', monospace; }

                    /* 폰트 드롭다운 라벨 */
                    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
                        content: '기본';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="nanumgothic"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="nanumgothic"]::before {
                        content: '나눔고딕';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="malgun"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="malgun"]::before {
                        content: '맑은고딕';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="dotum"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="dotum"]::before {
                        content: '돋움';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="gulim"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="gulim"]::before {
                        content: '굴림';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="batang"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="batang"]::before {
                        content: '바탕';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
                        content: 'Arial';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times"]::before {
                        content: 'Times';
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier"]::before,
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier"]::before {
                        content: 'Courier';
                    }

                    /* 사이즈 드롭다운 라벨 */
                    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
                        content: '16px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
                        content: '10px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
                        content: '12px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
                        content: '14px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
                        content: '18px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
                        content: '20px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
                        content: '24px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before {
                        content: '28px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
                        content: '32px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
                        content: '36px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before {
                        content: '48px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="72px"]::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="72px"]::before {
                        content: '72px' !important;
                    }

                    /* 헤더 라벨 */
                    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
                        content: '본문';
                    }
                    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
                        content: '제목 1';
                    }
                    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
                        content: '제목 2';
                    }
                    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
                        content: '제목 3';
                    }
                    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
                        content: '제목 4';
                    }
                    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
                        content: '제목 5';
                    }
                    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
                    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
                        content: '제목 6';
                    }

                    /* 툴바 스타일 */
                    .rich-text-editor-wrapper .ql-toolbar {
                        background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 12px 12px 0 0;
                        padding: 12px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-formats {
                        margin-right: 8px;
                        padding-right: 8px;
                        border-right: 1px solid rgba(255,255,255,0.1);
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-formats:last-child {
                        border-right: none;
                    }
                    
                    /* 모바일 반응형 툴바 */
                    @media (max-width: 640px) {
                        .rich-text-editor-wrapper .ql-toolbar {
                            padding: 8px;
                            gap: 2px;
                        }
                        .rich-text-editor-wrapper .ql-toolbar .ql-formats {
                            margin-right: 4px;
                            padding-right: 4px;
                        }
                        .rich-text-editor-wrapper .ql-toolbar button {
                            width: 28px;
                            height: 28px;
                        }
                        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label {
                            padding: 2px 4px;
                            font-size: 11px;
                        }
                        .rich-text-editor-wrapper .ql-toolbar .ql-picker {
                            font-size: 11px;
                        }
                        .rich-text-editor-wrapper .ql-container {
                            min-height: 300px;
                            font-size: 14px;
                        }
                        .rich-text-editor-wrapper .ql-editor {
                            min-height: 300px;
                            padding: 12px;
                        }
                    }
                    
                    .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
                        stroke: rgba(255, 255, 255, 0.7);
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-fill {
                        fill: rgba(255, 255, 255, 0.7);
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-picker {
                        color: rgba(255, 255, 255, 0.7);
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-picker-label {
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 6px;
                        padding: 4px 8px;
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-picker-options {
                        background: #1a1a2e;
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 8px;
                        padding: 8px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-picker-item {
                        padding: 4px 8px;
                        border-radius: 4px;
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-picker-item:hover {
                        background: rgba(255,255,255,0.1);
                    }
                    .rich-text-editor-wrapper .ql-toolbar button {
                        width: 32px;
                        height: 32px;
                        border-radius: 6px;
                        transition: all 0.2s;
                    }
                    .rich-text-editor-wrapper .ql-toolbar button:hover {
                        background: rgba(255,255,255,0.1);
                    }
                    .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
                    .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
                        stroke: #facc15;
                    }
                    .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
                    .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
                        fill: #facc15;
                    }
                    .rich-text-editor-wrapper .ql-toolbar button.ql-active {
                        background: rgba(250, 204, 21, 0.2);
                    }

                    /* 색상 버튼 스타일 개선 */
                    .rich-text-editor-wrapper .ql-toolbar .ql-color .ql-picker-label,
                    .rich-text-editor-wrapper .ql-toolbar .ql-background .ql-picker-label {
                        padding: 4px 6px;
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 6px;
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-color .ql-picker-label .ql-stroke {
                        stroke: #ef4444 !important;  /* 빨간색 - 글자색 */
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-color .ql-picker-label::after {
                        content: 'A';
                        position: absolute;
                        font-size: 10px;
                        font-weight: bold;
                        color: #ef4444;
                        bottom: 2px;
                        right: 6px;
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-background .ql-picker-label .ql-fill {
                        fill: #facc15 !important;  /* 노란색 - 형광펜 */
                    }
                    .rich-text-editor-wrapper .ql-toolbar .ql-background .ql-picker-label svg {
                        background: linear-gradient(135deg, #facc15 0%, #fbbf24 100%);
                        border-radius: 3px;
                    }
                    /* 색상 팔레트 스타일 */
                    .rich-text-editor-wrapper .ql-color .ql-picker-options,
                    .rich-text-editor-wrapper .ql-background .ql-picker-options {
                        width: 200px;
                        padding: 8px;
                    }
                    .rich-text-editor-wrapper .ql-color .ql-picker-item,
                    .rich-text-editor-wrapper .ql-background .ql-picker-item {
                        width: 20px;
                        height: 20px;
                        border-radius: 4px;
                        margin: 2px;
                    }

                    /* 에디터 컨테이너 */
                    .rich-text-editor-wrapper .ql-container {
                        background: rgba(0, 0, 0, 0.4);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-top: none;
                        border-radius: 0 0 12px 12px;
                        min-height: 450px;
                        font-size: 16px;
                        color: white;
                    }
                    .rich-text-editor-wrapper .ql-editor {
                        min-height: 450px;
                        padding: 20px;
                        line-height: 1.8;
                    }
                    .rich-text-editor-wrapper .ql-editor.ql-blank::before {
                        color: rgba(255, 255, 255, 0.3);
                        font-style: normal;
                    }
                    .rich-text-editor-wrapper .ql-editor p {
                        margin-bottom: 0.5em;
                    }
                    .rich-text-editor-wrapper .ql-editor strong {
                        color: #facc15;
                    }
                    .rich-text-editor-wrapper .ql-editor blockquote {
                        border-left: 4px solid #facc15;
                        padding-left: 16px;
                        margin: 16px 0;
                        color: rgba(255,255,255,0.8);
                        background: rgba(255,255,255,0.05);
                        padding: 12px 16px;
                        border-radius: 0 8px 8px 0;
                    }
                    .rich-text-editor-wrapper .ql-editor pre.ql-syntax {
                        background: rgba(0,0,0,0.6);
                        border-radius: 8px;
                        padding: 16px;
                        font-family: 'Courier New', monospace;
                        overflow-x: auto;
                    }
                    .rich-text-editor-wrapper .ql-editor img {
                        max-width: 100%;
                        border-radius: 8px;
                        margin: 8px 0;
                    }
                    .rich-text-editor-wrapper .ql-editor a {
                        color: #60a5fa;
                        text-decoration: underline;
                    }
                    .rich-text-editor-wrapper .ql-editor ul,
                    .rich-text-editor-wrapper .ql-editor ol {
                        padding-left: 24px;
                    }
                    .rich-text-editor-wrapper .ql-editor li {
                        margin-bottom: 4px;
                    }
                `}</style>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value || ''}
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                    placeholder="상세 내용을 입력하세요..."
                />
            </div>

            {/* 에디터 팁 */}
            <div className="flex items-center gap-4 text-xs text-white/40">
                <span>Ctrl+B: 굵게</span>
                <span>Ctrl+I: 기울임</span>
                <span>Ctrl+U: 밑줄</span>
                <span>Ctrl+K: 링크</span>
            </div>
        </div>
    );
};

export default RichTextEditor;
