import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Image as ImageIcon, Link as LinkIcon,
    Palette, Highlighter, Minus
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

interface ToolbarButtonProps {
    icon: LucideIcon;
    command: string;
    arg?: string;
    title?: string;
    onExecCommand: (command: string, value?: string) => void;
}

// Moved outside to prevent recreation on each render
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
    icon: Icon,
    command,
    arg,
    title,
    onExecCommand
}) => (
    <button
        type="button"
        title={title}
        onMouseDown={(e) => {
            e.preventDefault();
            onExecCommand(command, arg);
        }}
        className="p-1.5 rounded hover:bg-white/10 transition-colors text-text-muted"
    >
        <Icon size={16} />
    </button>
);

const DEFAULT_TEMPLATE = `
    <p>- 업소소개 :</p>
<p><br></p>
<p>- 시스템(근무타임) :</p>
<p><br></p>
<p>- 급여 :</p>
<p><br></p>
<p>- 우대사항(키워드) :</p>
<p><br></p>
<p>- 가게 장점 및 편의사항 :</p>
<p><br></p>
`;

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Initialize with template if empty
    useEffect(() => {
        if (!value && onChange) {
            onChange(DEFAULT_TEMPLATE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (value === '' && editorRef.current.innerHTML !== '') {
                editorRef.current.innerHTML = '';
            } else if (value !== '') {
                // Only update if significantly different to avoid cursor jumps
                // This is a simple check; for production, use a better diff or selection save/restore
                if (Math.abs(editorRef.current.innerHTML.length - value.length) > 5) {
                    editorRef.current.innerHTML = value;
                }
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = useCallback((command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }, []);

    return (
        <div className={`border rounded-lg overflow-hidden transition-colors bg-white text-black ${isFocused ? 'border-primary' : 'border-gray-300'}`}>
            {/* Toolbar */}
            <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
                <div className="flex items-center gap-1 mr-2">
                    <select
                        className="h-8 text-sm border border-gray-300 rounded px-1 bg-card"
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
                        className="h-8 text-sm border border-gray-300 rounded px-1 bg-card"
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

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <ToolbarButton icon={Bold} command="bold" title="Bold" onExecCommand={execCommand} />
                <ToolbarButton icon={Italic} command="italic" title="Italic" onExecCommand={execCommand} />
                <ToolbarButton icon={Underline} command="underline" title="Underline" onExecCommand={execCommand} />
                <ToolbarButton icon={Minus} command="strikeThrough" title="Strike" onExecCommand={execCommand} />

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" onExecCommand={execCommand} />
                <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" onExecCommand={execCommand} />
                <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" onExecCommand={execCommand} />
                <ToolbarButton icon={AlignJustify} command="justifyFull" title="Justify" onExecCommand={execCommand} />

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" onExecCommand={execCommand} />
                <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" onExecCommand={execCommand} />

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                    type="button"
                    title="Text Color"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const color = prompt('Enter color (hex or name)', '#000000');
                        if (color) execCommand('foreColor', color);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                >
                    <Palette size={16} />
                </button>
                <button
                    type="button"
                    title="Highlight Color"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const color = prompt('Enter background color (hex or name)', '#FFFF00');
                        if (color) execCommand('hiliteColor', color);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                >
                    <Highlighter size={16} />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button
                    type="button"
                    title="Insert Link"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const url = prompt('Enter URL');
                        if (url) execCommand('createLink', url);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                >
                    <LinkIcon size={16} />
                </button>
                <button
                    type="button"
                    title="Insert Image"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const url = prompt('Enter image URL');
                        if (url) execCommand('insertImage', url);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                >
                    <ImageIcon size={16} />
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="min-h-[400px] p-4 outline-none prose max-w-none text-black"
                dangerouslySetInnerHTML={{ __html: value }}
                style={{ lineHeight: '1.6' }}
            />
        </div>
    );
};

export default RichTextEditor;

