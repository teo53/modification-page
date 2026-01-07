import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, MapPin, Briefcase, Clock, Camera, ChevronDown,
  Phone, Calendar, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ResumeFormData {
  name: string;
  age: string;
  gender: string;
  phone: string;
  location: string;
  desiredJob: string[];
  experience: string;
  availableTime: string[];
  introduction: string;
  profileImage: string | null;
}

const jobCategories = [
  '라운지', '룸살롱', '텐프로', '하이퍼블릭', '노래방',
  '클럽', '바', '호프', '주점', '바텐더'
];

const timeOptions = [
  '평일 주간', '평일 야간', '주말 주간', '주말 야간',
  '야간 전문', '시간 협의'
];

const experienceOptions = [
  '신입', '6개월 미만', '6개월~1년', '1~2년', '2~3년', '3~5년', '5년 이상'
];

const locations = [
  '서울 강남구', '서울 서초구', '서울 송파구', '서울 마포구',
  '서울 용산구', '서울 성동구', '서울 광진구', '서울 중구', '기타'
];

const PostResumePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResumeFormData>({
    name: '',
    age: '',
    gender: '',
    phone: '',
    location: '',
    desiredJob: [],
    experience: '',
    availableTime: [],
    introduction: '',
    profileImage: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResumeFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleJobCategory = (job: string) => {
    setFormData(prev => ({
      ...prev,
      desiredJob: prev.desiredJob.includes(job)
        ? prev.desiredJob.filter(j => j !== job)
        : [...prev.desiredJob, job]
    }));
  };

  const toggleTimeOption = (time: string) => {
    setFormData(prev => ({
      ...prev,
      availableTime: prev.availableTime.includes(time)
        ? prev.availableTime.filter(t => t !== time)
        : [...prev.availableTime, time]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ResumeFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (!formData.age) newErrors.age = '나이를 선택해주세요';
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요';
    if (!formData.phone.trim()) newErrors.phone = '연락처를 입력해주세요';
    if (!formData.location) newErrors.location = '희망 지역을 선택해주세요';
    if (formData.desiredJob.length === 0) newErrors.desiredJob = '희망 업종을 선택해주세요';
    if (!formData.experience) newErrors.experience = '경력을 선택해주세요';
    if (formData.availableTime.length === 0) newErrors.availableTime = '가능 시간을 선택해주세요';
    if (!formData.introduction.trim()) newErrors.introduction = '자기소개를 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirect after success
    setTimeout(() => {
      navigate('/job-seekers');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">이력서 등록 완료!</h2>
          <p className="text-text-muted">구인업체에서 연락이 올 수 있습니다.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Info */}
      <div className="bg-primary/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <FileText size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-text-main">이력서 등록</h1>
            <p className="text-sm text-text-muted">유흥업소 전문 구직 플랫폼</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Profile Image */}
        <div className="flex justify-center">
          <button className="relative">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center border-2 border-dashed border-border">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={40} className="text-text-muted" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
          </button>
        </div>

        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="font-bold text-text-main flex items-center gap-2">
            <User size={18} className="text-primary" />
            기본 정보
          </h2>

          {/* Name */}
          <div>
            <label className="text-sm text-text-muted mb-1 block">이름 (닉네임 가능)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="예: 김**"
              className={`w-full h-12 px-4 rounded-lg bg-surface border text-sm ${errors.name ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-text-muted mb-1 block">나이</label>
              <div className="relative">
                <select
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`w-full h-12 px-4 rounded-lg bg-surface border text-sm appearance-none ${errors.age ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="">선택</option>
                  <option value="20대 초반">20대 초반</option>
                  <option value="20대 중반">20대 중반</option>
                  <option value="20대 후반">20대 후반</option>
                  <option value="30대 초반">30대 초반</option>
                  <option value="30대 중반">30대 중반</option>
                  <option value="30대 후반">30대 후반</option>
                  <option value="40대 이상">40대 이상</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-text-muted mb-1 block">성별</label>
              <div className="flex gap-2">
                {['여', '남'].map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 h-12 rounded-lg border text-sm font-medium transition-colors ${
                      formData.gender === g
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border text-text-main'
                    }`}
                  >
                    {g}성
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-text-muted mb-1 block">연락처</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="010-0000-0000"
                className={`w-full h-12 pl-10 pr-4 rounded-lg bg-surface border text-sm ${errors.phone ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h2 className="font-bold text-text-main flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            희망 근무 지역
          </h2>
          <div className="relative">
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full h-12 px-4 rounded-lg bg-surface border text-sm appearance-none ${errors.location ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="">지역 선택</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </section>

        {/* Desired Job */}
        <section className="space-y-4">
          <h2 className="font-bold text-text-main flex items-center gap-2">
            <Briefcase size={18} className="text-primary" />
            희망 업종 (복수 선택 가능)
          </h2>
          {errors.desiredJob && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.desiredJob}</p>}
          <div className="flex flex-wrap gap-2">
            {jobCategories.map(job => (
              <button
                key={job}
                onClick={() => toggleJobCategory(job)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.desiredJob.includes(job)
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted border border-border'
                }`}
              >
                {job}
              </button>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="font-bold text-text-main flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            경력
          </h2>
          <div className="flex flex-wrap gap-2">
            {experienceOptions.map(exp => (
              <button
                key={exp}
                onClick={() => setFormData({ ...formData, experience: exp })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.experience === exp
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted border border-border'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </section>

        {/* Available Time */}
        <section className="space-y-4">
          <h2 className="font-bold text-text-main flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            가능 시간 (복수 선택 가능)
          </h2>
          {errors.availableTime && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.availableTime}</p>}
          <div className="flex flex-wrap gap-2">
            {timeOptions.map(time => (
              <button
                key={time}
                onClick={() => toggleTimeOption(time)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.availableTime.includes(time)
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted border border-border'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="font-bold text-text-main flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            자기소개
          </h2>
          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            placeholder="자신의 경력, 강점, 성격 등을 자유롭게 작성해주세요.&#10;예) 고급 라운지 3년 경력입니다. 서비스 마인드 확실합니다."
            rows={5}
            className={`w-full p-4 rounded-lg bg-surface border text-sm resize-none ${errors.introduction ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          <p className="text-xs text-text-muted text-right">{formData.introduction.length}/500</p>
        </section>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-background border-t border-border">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? '등록 중...' : '이력서 등록하기'}
        </motion.button>
      </div>
    </div>
  );
};

export default PostResumePage;
