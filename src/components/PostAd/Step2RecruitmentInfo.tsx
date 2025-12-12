import React from 'react';
import { FileText, MapPin, Clock, Users, Briefcase, Tag, Phone, Image, Edit3, Palette, Check } from 'lucide-react';
import RichTextEditor from '../ui/RichTextEditor';

interface Step2Props {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onNext: () => void;
    onPrev: () => void;
    getDistrictsForCity: (city: string) => string[];
    highlightSettings?: { color: string; text: string; range?: { start: number; end: number } };
    setHighlightSettings?: React.Dispatch<React.SetStateAction<{ color: string; text: string; range?: { start: number; end: number } }>>;
}

// Section Card wrapper for consistent styling - refined for subtle cohesion
const SectionCard = ({
    icon: Icon,
    title,
    children,
    className = ""
}: {
    icon?: React.ElementType;
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`bg-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden ${className}`}>
        <div className="px-5 py-3 flex items-center gap-2.5">
            {Icon && <Icon size={16} className="text-primary/80" />}
            <h3 className="text-sm font-semibold text-white/90">{title}</h3>
        </div>
        <div className="px-5 pb-5 pt-1">
            {children}
        </div>
    </div>
);

// Toggle Button for selections - simplified for visual consistency
const ToggleButton = ({
    selected,
    onClick,
    children,
    size = 'md'
}: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md';
}) => {
    const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

    return (
        <button
            onClick={onClick}
            className={`${sizeClasses} rounded-lg font-medium transition-all border ${selected
                ? 'bg-primary/15 text-primary border-primary/40'
                : 'bg-black/20 text-white/50 border-white/[0.08] hover:bg-white/[0.06] hover:text-white/70'
                }`}
        >
            {children}
        </button>
    );
};

const Step2RecruitmentInfo: React.FC<Step2Props> = ({
    formData,
    setFormData,
    onNext,
    onPrev,
    getDistrictsForCity,
    highlightSettings,
    setHighlightSettings
}) => {
    const updateFormData = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (key: string, item: string) => {
        const current = formData[key] || [];
        const updated = current.includes(item)
            ? current.filter((i: string) => i !== item)
            : [...current, item];
        updateFormData(key, updated);
    };

    const cities = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '경남', '경북', '전남', '전북', '충남', '충북', '제주'];

    const industries = [
        { id: 'bar', label: 'Bar / 호프' },
        { id: 'room', label: '룸살롱' },
        { id: 'club', label: '클럽 / 나이트' },
        { id: 'karaoke', label: '노래방' },
        { id: 'massage', label: '마사지 / 스파' },
        { id: 'casino', label: '카지노 / 홀덤' },
        { id: 'model', label: '모델 / 피팅' },
        { id: 'etc', label: '기타 알바' }
    ];

    const welfareItems = [
        '선불가능', '순번확실', '원룸제공', '만근비지원', '성형지원',
        '출퇴근지원', '식사제공', '팁별도', '인센티브', '홀복지원',
        '갯수보장', '지명우대', '초이스없음', '해외여행지원', '뒷방없음',
        '따당가능', '푸쉬가능', '밀방없음', '칼퇴보장', '텃세없음', '숙식제공'
    ];

    const keywords = [
        '신규업소', '초보가능', '경력우대', '주말알바', '투잡알바',
        '당일지급', '생리휴무', '장기근무', '타지역우대', '에이스우대'
    ];

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <FileText className="text-primary" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">모집 내용 입력</h2>
                    <p className="text-sm text-white/50 mt-1">채용 공고의 상세 정보를 입력해주세요</p>
                </div>
                <div className="ml-auto">
                    <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-primary/20 text-primary">
                        Step 2 / 3
                    </span>
                </div>
            </div>

            {/* Single Column Layout - Sequential Form */}
            <div className="space-y-4">
                {/* 공고 제목 */}
                <SectionCard icon={Edit3} title="공고 제목">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-4 text-lg font-bold text-white placeholder-white/30 focus:border-primary focus:outline-none transition-colors"
                        placeholder="눈에 띄는 제목을 입력해주세요"
                        maxLength={40}
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-white/40">매력적인 제목으로 지원자의 관심을 끌어보세요</span>
                        <span className="text-xs text-white/40">{formData.title?.length || 0}/40</span>
                    </div>
                </SectionCard>

                {/* 형광펜 효과 - Title Highlight */}
                {formData.title && setHighlightSettings && (
                    <SectionCard icon={Palette} title="형광펜 효과 (선택사항 +50,000원)">
                        <div className="space-y-4">
                            <p className="text-xs text-white/50">
                                제목에서 강조할 부분을 선택하고 색상을 클릭하세요
                            </p>

                            {/* Title Preview */}
                            <div className="bg-black/60 rounded-xl p-4 border border-white/10">
                                <div className="text-lg font-bold text-white select-text cursor-text"
                                    onMouseUp={() => {
                                        const selection = window.getSelection();
                                        if (selection && selection.toString().length > 0) {
                                            const text = selection.toString();
                                            const startIndex = formData.title.indexOf(text);
                                            if (startIndex !== -1) {
                                                setHighlightSettings(prev => ({
                                                    ...prev,
                                                    range: { start: startIndex, end: startIndex + text.length }
                                                }));
                                            }
                                        }
                                    }}
                                >
                                    {highlightSettings?.color && highlightSettings?.range ? (
                                        <>
                                            {formData.title.substring(0, highlightSettings.range.start)}
                                            <span className={`px-0.5 rounded ${highlightSettings.color === 'yellow' ? 'bg-yellow-400 text-black' :
                                                highlightSettings.color === 'pink' ? 'bg-pink-400 text-black' :
                                                    highlightSettings.color === 'green' ? 'bg-green-400 text-black' :
                                                        'bg-cyan-400 text-black'
                                                }`}>
                                                {formData.title.substring(highlightSettings.range.start, highlightSettings.range.end)}
                                            </span>
                                            {formData.title.substring(highlightSettings.range.end)}
                                        </>
                                    ) : (
                                        formData.title
                                    )}
                                </div>
                                {highlightSettings?.range && !highlightSettings?.color && (
                                    <p className="text-xs text-primary mt-2">
                                        "{formData.title.substring(highlightSettings.range.start, highlightSettings.range.end)}" 선택됨 - 아래에서 색상을 선택하세요
                                    </p>
                                )}
                            </div>

                            {/* Color Palette */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-white/50">색상:</span>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'yellow', color: 'bg-yellow-400' },
                                        { id: 'pink', color: 'bg-pink-400' },
                                        { id: 'green', color: 'bg-green-400' },
                                        { id: 'cyan', color: 'bg-cyan-400' },
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                const range = highlightSettings?.range || { start: 0, end: formData.title.length };
                                                setHighlightSettings({
                                                    color: item.id,
                                                    text: formData.title.substring(range.start, range.end),
                                                    range
                                                });
                                            }}
                                            className={`w-8 h-8 ${item.color} rounded-lg transition-all ${highlightSettings?.color === item.id
                                                ? 'ring-2 ring-white scale-110'
                                                : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            {highlightSettings?.color === item.id && (
                                                <Check size={16} className="text-black m-auto" />
                                            )}
                                        </button>
                                    ))}
                                    {highlightSettings?.color && (
                                        <button
                                            onClick={() => setHighlightSettings({ color: '', text: '' })}
                                            className="px-3 py-1 text-xs text-white/50 hover:text-white bg-white/10 rounded-lg"
                                        >
                                            해제
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                )}

                {/* 업직종 선택 */}

                <SectionCard icon={Briefcase} title="업직종 선택">
                    <div className="grid grid-cols-4 gap-2">
                        {industries.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => updateFormData('industry', { ...formData.industry, level2: item.id })}
                                className={`p-3 rounded-lg border transition-all text-sm font-medium ${formData.industry?.level2 === item.id
                                    ? 'bg-primary/15 border-primary text-primary'
                                    : 'bg-black/20 border-white/[0.08] text-white/60 hover:bg-white/[0.06]'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </SectionCard>

                {/* 급여 조건 */}
                <SectionCard icon={Briefcase} title="급여 조건">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'hourly', label: '시급' },
                                { id: 'daily', label: '일급' },
                                { id: 'monthly', label: '월급' },
                                { id: 'negotiable', label: '협의' }
                            ].map((type) => (
                                <ToggleButton
                                    key={type.id}
                                    selected={formData.salary?.type === type.id}
                                    onClick={() => updateFormData('salary', { ...formData.salary, type: type.id })}
                                >
                                    {type.label}
                                </ToggleButton>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.salary?.amount || ''}
                                onChange={(e) => updateFormData('salary', { ...formData.salary, amount: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pr-24 text-white font-bold focus:border-primary outline-none"
                                placeholder={formData.salary?.type === 'negotiable' ? '협의 내용 입력' : '금액을 입력하세요'}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                                {formData.salary?.type === 'hourly' && '원 / 시간'}
                                {formData.salary?.type === 'daily' && '원 / 일'}
                                {formData.salary?.type === 'monthly' && '원 / 월'}
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* 근무 조건 */}
                <SectionCard icon={Users} title="상세 모집 요강">
                    <div className="space-y-5">
                        {/* 나이 */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-white/60 w-16 shrink-0">나이</label>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="number"
                                    value={formData.ageLimit?.start || ''}
                                    onChange={(e) => updateFormData('ageLimit', { ...formData.ageLimit, start: +e.target.value })}
                                    className="w-16 bg-black/40 border border-white/10 rounded-lg p-2.5 text-center text-white focus:border-primary outline-none"
                                    placeholder="20"
                                />
                                <span className="text-white/40">~</span>
                                <input
                                    type="number"
                                    value={formData.ageLimit?.end || ''}
                                    onChange={(e) => updateFormData('ageLimit', { ...formData.ageLimit, end: +e.target.value })}
                                    className="w-16 bg-black/40 border border-white/10 rounded-lg p-2.5 text-center text-white focus:border-primary outline-none"
                                    placeholder="35"
                                    disabled={formData.ageLimit?.noLimit}
                                />
                                <span className="text-white/40 text-sm">세</span>
                                <label className="flex items-center gap-2 ml-auto cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.ageLimit?.noLimit || false}
                                        onChange={(e) => updateFormData('ageLimit', { ...formData.ageLimit, noLimit: e.target.checked })}
                                        className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary"
                                    />
                                    <span className="text-sm text-white/60">무관</span>
                                </label>
                            </div>
                        </div>

                        {/* 성별 */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-white/60 w-16 shrink-0">성별</label>
                            <div className="flex gap-2 flex-1">
                                {[
                                    { id: 'female', label: '여성' },
                                    { id: 'male', label: '남성' },
                                    { id: 'any', label: '무관' }
                                ].map((g) => (
                                    <ToggleButton
                                        key={g.id}
                                        selected={formData.gender === g.id}
                                        onClick={() => updateFormData('gender', g.id)}
                                    >
                                        {g.label}
                                    </ToggleButton>
                                ))}
                            </div>
                        </div>

                        {/* 경력 */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-white/60 w-16 shrink-0">경력</label>
                            <div className="flex gap-2 flex-1">
                                {[
                                    { id: 'novice', label: '초보' },
                                    { id: 'experienced', label: '경력' },
                                    { id: 'any', label: '무관' }
                                ].map((e) => (
                                    <ToggleButton
                                        key={e.id}
                                        selected={formData.experience === e.id}
                                        onClick={() => updateFormData('experience', e.id)}
                                    >
                                        {e.label}
                                    </ToggleButton>
                                ))}
                            </div>
                        </div>

                        {/* 모집인원 */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-white/60 w-16 shrink-0">인원</label>
                            <input
                                type="text"
                                value={formData.recruitNumber || ''}
                                onChange={(e) => updateFormData('recruitNumber', e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-primary outline-none"
                                placeholder="00명 (예: 5명, 00명)"
                            />
                        </div>

                        {/* 마감일 */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-white/60 w-16 shrink-0">마감일</label>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="date"
                                    value={formData.deadline?.date || ''}
                                    onChange={(e) => updateFormData('deadline', { ...formData.deadline, date: e.target.value })}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-primary outline-none"
                                    disabled={formData.deadline?.always}
                                />
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.deadline?.always || false}
                                        onChange={(e) => updateFormData('deadline', { ...formData.deadline, always: e.target.checked })}
                                        className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary"
                                    />
                                    <span className="text-sm text-white/60">상시모집</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* 근무 지역 */}
                <SectionCard icon={MapPin} title="근무 지역">
                    <div className="space-y-4">
                        {/* 시/도 선택 */}
                        <div>
                            <label className="text-xs text-white/50 mb-2 block">시/도 선택</label>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => updateFormData('location', { ...formData.location, city, district: '' })}
                                        className={`py-2.5 rounded-lg text-xs font-medium border transition-all ${formData.location?.city === city
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-black/30 border-white/10 text-white/60 hover:border-white/30'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 구/군 선택 */}
                        {formData.location?.city && (
                            <div className="animate-fade-in">
                                <label className="text-xs text-white/50 mb-2 block">
                                    구/군 선택 <span className="text-primary">({formData.location.city})</span>
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                                    {getDistrictsForCity(formData.location.city).map((district) => (
                                        <button
                                            key={district}
                                            onClick={() => updateFormData('location', { ...formData.location, district })}
                                            className={`py-2 rounded-lg text-xs border transition-all ${formData.location?.district === district
                                                ? 'bg-white text-black border-white'
                                                : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {district}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 상세 주소 */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <input
                                type="text"
                                value={formData.address?.roadAddress || ''}
                                onChange={(e) => updateFormData('address', { ...formData.address, roadAddress: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                placeholder="도로명 / 지번 주소"
                            />
                            <input
                                type="text"
                                value={formData.address?.detailAddress || ''}
                                onChange={(e) => updateFormData('address', { ...formData.address, detailAddress: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                placeholder="상세 위치 (건물명, 층수 등)"
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* 근무 시간 & 요일 */}
                <SectionCard icon={Clock} title="근무 시간">
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: 'day', label: '주간' },
                                { id: 'night', label: '야간' },
                                { id: 'full', label: '상주' },
                                { id: 'negotiable', label: '협의' }
                            ].map((time) => (
                                <button
                                    key={time.id}
                                    onClick={() => updateFormData('workHours', { ...formData.workHours, type: time.id })}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.workHours?.type === time.id
                                        ? 'bg-primary/15 border-primary text-primary'
                                        : 'bg-black/20 border-white/[0.08] text-white/60 hover:bg-white/[0.06]'
                                        }`}
                                >
                                    {time.label}
                                </button>
                            ))}
                        </div>

                        {/* 근무 요일 */}
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs text-white/50">근무 요일</label>
                                {/* Quick Select Buttons - More Visible */}
                                <div className="flex gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const weekdays = ['월', '화', '수', '목', '금'];
                                            const current = formData.workDays || [];
                                            const hasAll = weekdays.every(d => current.includes(d));
                                            if (hasAll) {
                                                updateFormData('workDays', current.filter((d: string) => !weekdays.includes(d)));
                                            } else {
                                                updateFormData('workDays', [...new Set([...current, ...weekdays])]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${['월', '화', '수', '목', '금'].every(d => formData.workDays?.includes(d))
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-primary/10 border-primary/50 text-primary hover:bg-primary/20'
                                            }`}
                                    >
                                        📅 평일
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const weekend = ['토', '일'];
                                            const current = formData.workDays || [];
                                            const hasAll = weekend.every(d => current.includes(d));
                                            if (hasAll) {
                                                updateFormData('workDays', current.filter((d: string) => !weekend.includes(d)));
                                            } else {
                                                updateFormData('workDays', [...new Set([...current, ...weekend])]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${['토', '일'].every(d => formData.workDays?.includes(d))
                                            ? 'bg-cyan-400 text-black border-cyan-400'
                                            : 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20'
                                            }`}
                                    >
                                        🌙 주말
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const allDays = ['월', '화', '수', '목', '금', '토', '일'];
                                            const current = formData.workDays || [];
                                            const hasAll = allDays.every(d => current.includes(d));
                                            if (hasAll) {
                                                updateFormData('workDays', current.filter((d: string) => !allDays.includes(d)));
                                            } else {
                                                updateFormData('workDays', [...new Set([...current, ...allDays])]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${['월', '화', '수', '목', '금', '토', '일'].every(d => formData.workDays?.includes(d))
                                            ? 'bg-green-400 text-black border-green-400'
                                            : 'bg-green-400/10 border-green-400/50 text-green-400 hover:bg-green-400/20'
                                            }`}
                                    >
                                        ✓ 전체
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['월', '화', '수', '목', '금', '토', '일', '협의'].map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleArrayItem('workDays', day)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${formData.workDays?.includes(day)
                                            ? 'bg-primary/20 text-primary border-primary/50'
                                            : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/10'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* 접수방법 & 제출서류 */}
                <SectionCard icon={Phone} title="접수 방법">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {['전화', '문자', '카톡', '이메일', '방문'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => toggleArrayItem('receptionMethods', item)}
                                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${formData.receptionMethods?.includes(item)
                                        ? 'bg-primary/15 text-primary border-primary/40'
                                        : 'bg-black/20 border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <div className="pt-3 border-t border-white/10">
                            <label className="text-xs text-white/50 mb-2 block">제출서류</label>
                            <div className="flex flex-wrap gap-2">
                                {['이력서', '자기소개서', '주민등록등본', '통장사본'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArrayItem('requiredDocuments', item)}
                                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${formData.requiredDocuments?.includes(item)
                                            ? 'bg-primary/15 text-primary border-primary/40'
                                            : 'bg-black/20 border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* 편의사항 */}
                <SectionCard icon={Tag} title="편의사항 (복리후생)">
                    <div className="flex flex-wrap gap-2">
                        {welfareItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => toggleArrayItem('welfare', item)}
                                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${formData.welfare?.includes(item)
                                    ? 'bg-primary/15 text-primary border-primary/40'
                                    : 'bg-black/20 border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </SectionCard>

                {/* 키워드 */}
                <SectionCard icon={Tag} title="키워드">
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleArrayItem('keywords', tag)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${formData.keywords?.includes(tag)
                                    ? 'bg-primary/15 text-primary border-primary/40'
                                    : 'bg-black/20 border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                                    }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </SectionCard>

                {/* 상세 이미지 */}
                <SectionCard icon={Image} title="상세 이미지">
                    <div className="grid grid-cols-5 gap-4">
                        {formData.images?.map((img: any, idx: number) => (
                            <div key={idx} className="aspect-square relative group">
                                <div className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${img.file
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-white/20 bg-white/5 hover:border-primary/30 hover:bg-primary/5'
                                    }`}>
                                    {img.file ? (
                                        <img
                                            src={URL.createObjectURL(img.file)}
                                            alt={`Upload ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-2">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                                                <span className="text-lg text-white/40">+</span>
                                            </div>
                                            <div className="text-[10px] text-white/40">이미지 {idx + 1}</div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const newImages = [...formData.images];
                                                newImages[idx] = { ...newImages[idx], file };
                                                updateFormData('images', newImages);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* 상세내용 */}
                <SectionCard icon={Edit3} title="상세내용">
                    <RichTextEditor
                        value={formData.description}
                        onChange={(val) => updateFormData('description', val)}
                        placeholder="업소 소개, 근무 시스템, 급여, 우대사항 등을 상세히 작성해주세요..."
                    />
                </SectionCard>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <button
                    onClick={onPrev}
                    className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                >
                    ← 이전 단계
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-black font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                    다음 단계 →
                </button>
            </div>
        </div >
    );
};

export default Step2RecruitmentInfo;
