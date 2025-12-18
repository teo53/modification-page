
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Unlink,
    Palette, Highlighter, Minus, Type, HelpCircle, X, Upload, Check
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const DEFAULT_TEMPLATE = `<div style="font-size: 16px; line-height: 1.8;">
<p><strong>📍 업소 소개</strong></p>
<p style="color: #aaa; margin-left: 12px;">업소의 특징과 강점을 작성해주세요</p>
<p><br></p>

<p><strong>⏰ 근무 시스템</strong></p>
<p style="color: #aaa; margin-left: 12px;">출퇴근 시간, 근무 타임 등을 작성해주세요</p>
<p><br></p>

<p><strong>💰 급여 정보</strong></p>
<p style="color: #aaa; margin-left: 12px;">급여 체계, 정산 방식 등을 작성해주세요</p>
<p><br></p>

<p><strong>✨ 우대 사항</strong></p>
<p style="color: #aaa; margin-left: 12px;">우대하는 조건이나 경력을 작성해주세요</p>
<p><br></p>

<p><strong>🎁 편의사항 & 복리후생</strong></p>
<p style="color: #aaa; margin-left: 12px;">숙소 제공, 식사 지원 등 편의사항을 작성해주세요</p>
</div>`;

// Color presets for quick selection
const COLOR_PRESETS = [
    '#ffffff', '#facc15', '#f97316', '#ef4444', '#ec4899',
    '#a855f7', '#6366f1', '#3b82f6', '#22d3ee', '#22c55e'
];

const HIGHLIGHT_PRESETS = [
    '#facc15', '#fbbf24', '#f97316', '#ef4444', '#ec4899',
    '#a855f7', '#6366f1', '#3b82f6', '#22d3ee', '#22c55e'
];

// Modal Component
const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-[#1a1a2e] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={20} className="text-white/60" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder: _placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState<'text' | 'highlight' | null>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

    // Save current selection
    const saveSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            setSavedSelection(selection.getRangeAt(0).cloneRange());
        }
    }, []);

    // Restore saved selection
    const restoreSelection = useCallback(() => {
        if (savedSelection && editorRef.current) {
            editorRef.current.focus();
            // Small delay to ensure focus is established
            setTimeout(() => {
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    try {
                        selection.addRange(savedSelection.cloneRange());
                    } catch (e) {
                        // Range may be invalid, ignore
                    }
                }
            }, 10);
        }
    }, [savedSelection]);

    // Initialize with template if empty
    useEffect(() => {
        if (!value && onChange) {
            onChange(DEFAULT_TEMPLATE);
        }
    }, []);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Check if editor is focused - if so, don't overwrite to preserve cursor
            const selection = window.getSelection();
            const isEditorFocused = document.activeElement === editorRef.current ||
                (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode));

            if (isEditorFocused) {
                // Editor is focused, skip innerHTML update to preserve cursor position
                return;
            }

            if (value === '' && editorRef.current.innerHTML !== '') {
                editorRef.current.innerHTML = '';
            } else if (value !== '') {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        if (!editorRef.current) return;

        // Ensure editor is focused before executing command
        editorRef.current.focus();

        // Use setTimeout to ensure selection is properly restored
        setTimeout(() => {
            try {
                document.execCommand(command, false, value);
                handleInput();
            } catch (e) {
                console.warn('execCommand failed:', e);
            }
        }, 0);
    };

    // Apply color/highlight with proper selection handling
    const applyColorCommand = (command: string, color: string) => {
        restoreSelection();
        setTimeout(() => {
            try {
                document.execCommand(command, false, color);
                handleInput();
            } catch (e) {
                console.warn('Color command failed:', e);
            }
            setShowColorPicker(null);
        }, 50);
    };

    // Handle link insertion
    const handleInsertLink = () => {
        restoreSelection();
        if (linkUrl) {
            const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
            if (linkText && (!savedSelection || savedSelection.collapsed)) {
                document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" style="color: #60a5fa; text-decoration: underline;">${linkText}</a>`);
            } else {
                document.execCommand('createLink', false, url);
            }
            handleInput();
        }
        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
    };

    // Handle image insertion
    const handleInsertImage = (src: string) => {
        restoreSelection();
        if (src) {
            document.execCommand('insertHTML', false,
                `<img src="${src}" alt="uploaded image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`
            );
            handleInput();
        }
        setShowImageModal(false);
        setImageUrl('');
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                handleInsertImage(base64);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };



    const ToolbarButton = ({
        icon: Icon,
        onClick,
        active = false,
        title
    }: {
        icon: any,
        onClick: () => void,
        active?: boolean,
        title?: string
    }) => (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${active ? 'text-primary bg-white/10' : 'text-white/60 hover:text-white'}`}
        >
            <Icon size={18} />
        </button>
    );

    const ToolbarDivider = () => <div className="w-px h-6 bg-white/10 mx-1" />;

    return (
        <div className="space-y-3">
            {/* Guide Toggle */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                    <HelpCircle size={16} />
                    <span>상세페이지 작성 가이드 {showGuide ? '접기' : '보기'}</span>
                </button>
            </div>

            {/* Writing Guide */}
            {showGuide && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-5 text-sm space-y-4 animate-fade-in">
                    <h4 className="font-bold text-primary flex items-center gap-2 text-base">
                        <Type size={18} />
                        상세페이지 업로드 가이드
                    </h4>

                    {/* Image Specs */}
                    <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <h5 className="font-semibold text-white flex items-center gap-2">
                            <ImageIcon size={14} className="text-primary" />
                            이미지 규격
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-white/70">
                            <div className="bg-black/40 rounded-lg p-3 border border-primary/30">
                                <div className="text-xs text-primary mb-1">📋 상세페이지 이미지</div>
                                <div className="text-white font-medium">400 x 2000px+</div>
                                <div className="text-xs text-white/40">세로형 (스크롤)</div>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">🖼️ 썸네일 이미지</div>
                                <div className="text-white font-medium">800 x 600px</div>
                                <div className="text-xs text-white/40">가로형 (목록용)</div>
                            </div>
                        </div>
                        <div className="flex gap-3 text-xs text-white/50 pt-2 border-t border-white/5">
                            <span>📁 지원: JPG, PNG, GIF</span>
                            <span>📦 최대: 5MB</span>
                            <span>💡 세로로 긴 형태 권장</span>
                        </div>
                    </div>

                    {/* Example Preview */}
                    <div className="bg-black/30 rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-3">🎨 상세페이지 예시</h5>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-48 bg-gradient-to-b from-purple-600/30 via-blue-500/30 to-cyan-400/30 rounded-lg border border-white/10 flex flex-col items-center justify-center text-center p-2">
                                    <span className="text-[8px] text-white/60 mb-1">업소명</span>
                                    <span className="text-[8px] text-white/60 mb-1">연락처</span>
                                    <span className="text-[8px] text-white/60 mb-1">소개</span>
                                    <span className="text-[8px] text-white/60 mb-1">시스템</span>
                                    <span className="text-[8px] text-white/60 mb-1">급여</span>
                                    <span className="text-[8px] text-white/60 mb-1">복리후생</span>
                                    <span className="text-[8px] text-white/60">연락처</span>
                                </div>
                                <div className="text-[10px] text-white/40 text-center mt-1">세로형</div>
                            </div>
                            <div className="flex-1 space-y-2 text-xs text-white/60">
                                <p className="text-white/80 font-medium">💡 상세페이지 제작 팁</p>
                                <p>• 세로로 긴 한 장 이미지</p>
                                <p>• 업소명 + 연락처를 상단에</p>
                                <p>• 중요 정보는 눈에 띄게</p>
                                <p>• 하단에 연락처 다시 표기</p>
                                <p className="text-primary/80 pt-2">📌 직접 제작하거나 디자인 의뢰!</p>
                            </div>
                        </div>
                    </div>

                    {/* Conversion Tips */}
                    <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <h5 className="font-semibold text-white flex items-center gap-2">
                            <span className="text-green-400">📈</span>
                            지원률 높이는 꿀팁
                        </h5>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                                <span className="text-lg">💰</span>
                                <div className="text-sm">
                                    <span className="text-green-400 font-medium">급여 명확히!</span>
                                    <span className="text-white/60"> "일급 50만원~" 보다 "일급 50~80만원, 당일 정산"이 2배 클릭률</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                                <span className="text-lg">🏠</span>
                                <div className="text-sm">
                                    <span className="text-cyan-400 font-medium">숙소 강조!</span>
                                    <span className="text-white/60"> 숙소 제공 광고는 지원율 +40% ↑ (사진 첨부 시 더 효과적)</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                                <span className="text-lg">📞</span>
                                <div className="text-sm">
                                    <span className="text-yellow-400 font-medium">연락처 3번 이상!</span>
                                    <span className="text-white/60"> 상단/중단/하단에 연락처 반복 → 이탈률 -30%</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                                <span className="text-lg">⏰</span>
                                <div className="text-sm">
                                    <span className="text-purple-400 font-medium">시간 유연성!</span>
                                    <span className="text-white/60"> "협의 가능", "파트타임 OK" 문구 추가 시 지원률 +25%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-xl font-bold text-primary">3초</div>
                            <div className="text-[10px] text-white/50">첫인상 결정 시간</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-xl font-bold text-green-400">+60%</div>
                            <div className="text-[10px] text-white/50">이미지 포함 시 클릭률</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-3">
                            <div className="text-xl font-bold text-cyan-400">TOP3</div>
                            <div className="text-[10px] text-white/50">급여/숙소/위치 중요도</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor Container */}
            <div className={`border rounded-xl overflow-hidden transition-all bg-black/40 ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-white/10'}`}>
                {/* Toolbar */}
                <div className="bg-black/60 border-b border-white/10 p-2 flex flex-wrap gap-0.5 items-center">
                    {/* Font Controls */}
                    <div className="flex items-center gap-1 mr-2">
                        <select
                            className="h-9 text-sm border border-white/10 rounded-lg px-2 bg-black/60 text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                            onChange={(e) => execCommand('fontName', e.target.value)}
                            defaultValue="sans-serif"
                        >
                            <option value="sans-serif">기본서체</option>
                            <option value="Arial">Arial</option>
                            <option value="Gulim">굴림</option>
                            <option value="Dotum">돋움</option>
                            <option value="Batang">바탕</option>
                        </select>
                        <select
                            className="h-9 text-sm border border-white/10 rounded-lg px-2 bg-black/60 text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                            onChange={(e) => execCommand('fontSize', e.target.value)}
                            defaultValue="3"
                        >
                            <option value="1">10px</option>
                            <option value="2">13px</option>
                            <option value="3">16px</option>
                            <option value="4">18px</option>
                            <option value="5">24px</option>
                            <option value="6">32px</option>
                            <option value="7">48px</option>
                        </select>
                    </div>

                    <ToolbarDivider />

                    {/* Text Formatting */}
                    <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="굵게 (Ctrl+B)" />
                    <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="기울임 (Ctrl+I)" />
                    <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} title="밑줄 (Ctrl+U)" />
                    <ToolbarButton icon={Minus} onClick={() => execCommand('strikeThrough')} title="취소선" />

                    <ToolbarDivider />

                    {/* Alignment */}
                    <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="왼쪽 정렬" />
                    <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="가운데 정렬" />
                    <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="오른쪽 정렬" />
                    <ToolbarButton icon={AlignJustify} onClick={() => execCommand('justifyFull')} title="양쪽 정렬" />

                    <ToolbarDivider />

                    {/* Lists */}
                    <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="글머리 기호" />
                    <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="번호 매기기" />

                    <ToolbarDivider />

                    {/* Colors */}
                    <div className="relative">
                        <ToolbarButton
                            icon={Palette}
                            onClick={() => {
                                saveSelection();
                                setShowColorPicker(showColorPicker === 'text' ? null : 'text');
                            }}
                            title="글자 색상"
                            active={showColorPicker === 'text'}
                        />
                        {showColorPicker === 'text' && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-10 flex gap-1 flex-wrap w-32">
                                {COLOR_PRESETS.map(color => (
                                    <button
                                        key={color}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            applyColorCommand('foreColor', color);
                                        }}
                                        className="w-5 h-5 rounded border border-white/20 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <ToolbarButton
                            icon={Highlighter}
                            onClick={() => {
                                saveSelection();
                                setShowColorPicker(showColorPicker === 'highlight' ? null : 'highlight');
                            }}
                            title="형광펜"
                            active={showColorPicker === 'highlight'}
                        />
                        {showColorPicker === 'highlight' && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-10 flex gap-1 flex-wrap w-32">
                                {HIGHLIGHT_PRESETS.map(color => (
                                    <button
                                        key={color}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            applyColorCommand('hiliteColor', color);
                                        }}
                                        className="w-5 h-5 rounded border border-white/20 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <ToolbarDivider />

                    {/* Link & Image */}
                    <ToolbarButton
                        icon={LinkIcon}
                        onClick={() => {
                            saveSelection();
                            const selection = window.getSelection();
                            setLinkText(selection?.toString() || '');
                            setShowLinkModal(true);
                        }}
                        title="링크 삽입"
                    />
                    <ToolbarButton
                        icon={Unlink}
                        onClick={() => execCommand('unlink')}
                        title="링크 제거"
                    />
                    <ToolbarButton
                        icon={ImageIcon}
                        onClick={() => {
                            saveSelection();
                            setShowImageModal(true);
                        }}
                        title="이미지 삽입"
                    />
                </div>

                {/* Editor Area */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="min-h-[400px] p-5 outline-none text-white"
                    dangerouslySetInnerHTML={{ __html: value }}
                    style={{
                        lineHeight: '1.8',
                        fontSize: '15px'
                    }}
                />
            </div>

            {/* Link Modal */}
            <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="링크 삽입">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/60 mb-2">링크 텍스트</label>
                        <input
                            type="text"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            placeholder="표시할 텍스트"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/60 mb-2">URL 주소</label>
                        <input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleInsertLink}
                        disabled={!linkUrl}
                        className="w-full py-3 bg-primary hover:bg-primary/80 disabled:bg-white/10 disabled:text-white/30 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        링크 삽입
                    </button>
                </div>
            </Modal>

            {/* Image Modal */}
            <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title="이미지 삽입">
                <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">파일 업로드</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 border-2 border-dashed border-white/20 hover:border-primary/50 rounded-xl flex flex-col items-center gap-2 transition-colors"
                        >
                            <Upload size={24} className="text-white/40" />
                            <span className="text-white/60 text-sm">클릭하여 이미지 선택</span>
                            <span className="text-white/30 text-xs">JPG, PNG, GIF 지원</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/30 text-xs">또는</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    {/* URL Input */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">이미지 URL</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => handleInsertImage(imageUrl)}
                        disabled={!imageUrl}
                        className="w-full py-3 bg-primary hover:bg-primary/80 disabled:bg-white/10 disabled:text-white/30 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        이미지 삽입
                    </button>
                </div>
            </Modal>

            {/* Hidden file input for image upload */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />
        </div >
    );
};

export default RichTextEditor;
