import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Briefcase, Clock, DollarSign, FileText, CheckCircle, AlertCircle, MessageCircle, Send } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

// 지역 옵션
const regions = [
    '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종',
    '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

// 희망 업종
const jobTypes = [
    '룸살롱', '클럽', '노래방', '바(Bar)', '텐카페', '쩜오/하이쩜오', '비즈니스클럽', '기타'
];

// 근무 시간대
const workTimes = [
    '오전 (06:00-12:00)', '오후 (12:00-18:00)', '저녁 (18:00-24:00)', '새벽 (24:00-06:00)', '시간협의'
];

// 토글 버튼 컴포넌트 (체크박스 대체)
const ToggleButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
}> = ({ isActive, onClick, label }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive
                    ? 'bg-primary/20 border-2 border-primary text-primary'
                    : 'bg-black/40 border border-white/10 text-text-muted hover:border-white/30'
                }
            `}
        >
            <span>{label}</span>
            <div className={`
                w-12 h-6 rounded-full relative transition-colors duration-200
                ${isActive ? 'bg-primary' : 'bg-white/20'}
            `}>
                <div className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200
                    ${isActive ? 'left-7' : 'left-1'}
                `} />
            </div>
        </button>
    );
};

const JobSeekerPage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const [formData, setFormData] = useState({
        // 기본 정보
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        age: '',
        gender: '' as 'female' | 'male' | '',

        // 희망 조건
        preferredRegions: [] as string[],
        preferredJobTypes: [] as string[],
        preferredWorkTime: '',
        preferredSalary: '',

        // 자기소개
        introduction: '',
        experience: '',
        specialSkills: '',

        // 추가 옵션
        hasCareer: false,
        canNightWork: true,
        canWeekendWork: true,
        needsAccommodation: false,

        // 연락 수단 (다양화)
        contactPhone: currentUser?.phone || '',
        contactKakao: '',
        contactLine: '',
        contactTelegram: '',
        contactWechat: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // 로그인 체크
    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto text-center">
                    <AlertCircle size={64} className="mx-auto mb-6 text-yellow-400" />
                    <h1 className="text-2xl font-bold text-white mb-4">로그인이 필요합니다</h1>
                    <p className="text-text-muted mb-6">
                        구직글을 등록하려면 먼저 로그인해주세요.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleOption = (field: 'hasCareer' | 'canNightWork' | 'canWeekendWork' | 'needsAccommodation') => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const toggleArrayItem = (field: 'preferredRegions' | 'preferredJobTypes', item: string) => {
        setFormData(prev => {
            const arr = prev[field];
            if (arr.includes(item)) {
                return { ...prev, [field]: arr.filter(i => i !== item) };
            } else {
                return { ...prev, [field]: [...arr, item] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: 실제 API 연동
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 로컬스토리지에 임시 저장
        const jobPosts = JSON.parse(localStorage.getItem('lunaalba_job_posts') || '[]');
        const newPost = {
            id: Date.now(),
            ...formData,
            userId: currentUser.id,
            userEmail: currentUser.email,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        jobPosts.push(newPost);
        localStorage.setItem('lunaalba_job_posts', JSON.stringify(jobPosts));

        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto text-center">
                    <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
                    <h1 className="text-2xl font-bold text-white mb-4">구직글이 등록되었습니다!</h1>
                    <p className="text-text-muted mb-6">
                        광고주가 회원님의 구직글을 확인하고 연락할 수 있습니다.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors"
                        >
                            홈으로
                        </button>
                        <button
                            onClick={() => { setIsSuccess(false); setFormData(prev => ({ ...prev })); }}
                            className="bg-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            새 구직글 작성
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <nav className="text-sm text-text-muted mb-2">
                    <span>홈</span> &gt; <span className="text-white">구직글 등록</span>
                </nav>
                <h1 className="text-3xl font-bold text-white mb-2">구직글 등록</h1>
                <p className="text-text-muted">나의 스펙을 입력하고 광고주에게 어필하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
                {/* 기본 정보 */}
                <section className="bg-accent/30 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        기본 정보
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-text-muted mb-2">이름 (닉네임)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="공개될 이름을 입력하세요"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">연락처</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="010-0000-0000"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">나이</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="만 나이"
                                min="19"
                                max="60"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">성별</label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-colors ${formData.gender === 'female'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-white/30'
                                        }`}
                                >
                                    여성
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-colors ${formData.gender === 'male'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-white/30'
                                        }`}
                                >
                                    남성
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 희망 조건 */}
                <section className="bg-accent/30 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Briefcase size={20} className="text-primary" />
                        희망 조건
                    </h2>

                    {/* 희망 지역 */}
                    <div className="mb-6">
                        <label className="block text-sm text-text-muted mb-3 flex items-center gap-2">
                            <MapPin size={14} />
                            희망 지역 (복수 선택 가능)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {regions.map(region => (
                                <button
                                    key={region}
                                    type="button"
                                    onClick={() => toggleArrayItem('preferredRegions', region)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.preferredRegions.includes(region)
                                        ? 'bg-primary text-black'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-primary'
                                        }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 희망 업종 */}
                    <div className="mb-6">
                        <label className="block text-sm text-text-muted mb-3 flex items-center gap-2">
                            <Briefcase size={14} />
                            희망 업종 (복수 선택 가능)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {jobTypes.map(job => (
                                <button
                                    key={job}
                                    type="button"
                                    onClick={() => toggleArrayItem('preferredJobTypes', job)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.preferredJobTypes.includes(job)
                                        ? 'bg-primary text-black'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-primary'
                                        }`}
                                >
                                    {job}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 희망 시간대 */}
                    <div className="mb-6">
                        <label className="block text-sm text-text-muted mb-3 flex items-center gap-2">
                            <Clock size={14} />
                            희망 근무 시간대
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {workTimes.map(time => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, preferredWorkTime: time }))}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.preferredWorkTime === time
                                        ? 'bg-primary text-black'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-primary'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 희망 급여 */}
                    <div>
                        <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                            <DollarSign size={14} />
                            희망 급여 (일급)
                        </label>
                        <input
                            type="text"
                            name="preferredSalary"
                            value={formData.preferredSalary}
                            onChange={handleInputChange}
                            placeholder="예: 50만원 이상"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </section>

                {/* 자기소개 */}
                <section className="bg-accent/30 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-primary" />
                        자기소개
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-muted mb-2">자기소개</label>
                            <textarea
                                name="introduction"
                                value={formData.introduction}
                                onChange={handleInputChange}
                                placeholder="간단한 자기소개를 작성해주세요."
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">경력 사항</label>
                            <textarea
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="관련 경력이 있다면 작성해주세요. (선택)"
                                rows={3}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-muted mb-2">특기/장점</label>
                            <input
                                type="text"
                                name="specialSkills"
                                value={formData.specialSkills}
                                onChange={handleInputChange}
                                placeholder="예: 친화력, 외국어 가능, 운전 가능 등"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </section>

                {/* 추가 옵션 - 토글 버튼 스타일 */}
                <section className="bg-accent/30 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4">추가 옵션</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        <ToggleButton
                            isActive={formData.hasCareer}
                            onClick={() => toggleOption('hasCareer')}
                            label="관련 경력 있음"
                        />
                        <ToggleButton
                            isActive={formData.canNightWork}
                            onClick={() => toggleOption('canNightWork')}
                            label="야간 근무 가능"
                        />
                        <ToggleButton
                            isActive={formData.canWeekendWork}
                            onClick={() => toggleOption('canWeekendWork')}
                            label="주말 근무 가능"
                        />
                        <ToggleButton
                            isActive={formData.needsAccommodation}
                            onClick={() => toggleOption('needsAccommodation')}
                            label="숙소 필요"
                        />
                    </div>
                </section>

                {/* 연락 수단 - 광고주 스타일로 다양화 */}
                <section className="bg-accent/30 rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Phone size={20} className="text-primary" />
                        연락 수단
                    </h2>
                    <p className="text-sm text-text-muted mb-4">
                        연락 가능한 수단을 모두 입력해주세요. 최소 1개 이상 필수입니다.
                    </p>

                    <div className="space-y-4">
                        {/* 전화번호 */}
                        <div>
                            <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                <Phone size={14} />
                                전화번호
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                placeholder="010-0000-0000"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* 카카오톡 */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                    <MessageCircle size={14} className="text-yellow-400" />
                                    카카오톡 ID
                                </label>
                                <input
                                    type="text"
                                    name="contactKakao"
                                    value={formData.contactKakao}
                                    onChange={handleInputChange}
                                    placeholder="카카오톡 ID"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* 라인 */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                    <MessageCircle size={14} className="text-green-400" />
                                    라인 ID
                                </label>
                                <input
                                    type="text"
                                    name="contactLine"
                                    value={formData.contactLine}
                                    onChange={handleInputChange}
                                    placeholder="LINE ID"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* 텔레그램 */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                    <Send size={14} className="text-blue-400" />
                                    텔레그램 ID
                                </label>
                                <input
                                    type="text"
                                    name="contactTelegram"
                                    value={formData.contactTelegram}
                                    onChange={handleInputChange}
                                    placeholder="@username"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* 위챗 */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                    <MessageCircle size={14} className="text-green-500" />
                                    위챗 ID
                                </label>
                                <input
                                    type="text"
                                    name="contactWechat"
                                    value={formData.contactWechat}
                                    onChange={handleInputChange}
                                    placeholder="WeChat ID"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 제출 버튼 */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent/80 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '등록 중...' : '구직글 등록하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobSeekerPage;
