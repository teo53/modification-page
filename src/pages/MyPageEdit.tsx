import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Mail, Phone, Save, AlertCircle, CheckCircle,
  Camera, MapPin, Briefcase, Clock, Calendar, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';

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

const MyPageEdit: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'profile'>('basic');

  // Initialize form data from user (using initializer function)
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    nickname: user?.nickname || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    location: user?.location || '',
    desiredJob: user?.desiredJob || [] as string[],
    experience: user?.experience || '',
    availableTime: user?.availableTime || [] as string[],
    introduction: user?.introduction || '',
  }));

  // Navigation check only (no setState)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const toggleJobCategory = (job: string) => {
    setFormData(prev => ({
      ...prev,
      desiredJob: prev.desiredJob.includes(job)
        ? prev.desiredJob.filter((j: string) => j !== job)
        : [...prev.desiredJob, job]
    }));
  };

  const toggleTimeOption = (time: string) => {
    setFormData(prev => ({
      ...prev,
      availableTime: prev.availableTime.includes(time)
        ? prev.availableTime.filter((t: string) => t !== time)
        : [...prev.availableTime, time]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('lunaalba_current_user', JSON.stringify(updatedUser));

      interface StoredUser { id: string; [key: string]: unknown }
      const users: StoredUser[] = JSON.parse(localStorage.getItem('lunaalba_users') || '[]');
      const index = users.findIndex((u) => u.id === user?.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...formData };
        localStorage.setItem('lunaalba_users', JSON.stringify(users));
      }

      setSuccess('프로필이 저장되었습니다.');
      setLoading(false);

      setTimeout(() => {
        navigate('/mypage');
      }, 1500);
    }, 500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-text-main">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-text-main">프로필 수정</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === 'basic'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted'
          }`}
        >
          기본 정보
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === 'profile'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted'
          }`}
        >
          구직 프로필
        </button>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
              <CheckCircle size={18} />
              <span className="text-sm">{success}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {activeTab === 'basic' ? (
            <>
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <User size={40} className="text-primary" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-2">프로필 사진 변경</p>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">이름</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg py-3 pl-10 pr-4 text-text-main focus:border-primary outline-none"
                    placeholder="이름"
                  />
                </div>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">닉네임</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg py-3 px-4 text-text-main focus:border-primary outline-none"
                  placeholder="닉네임"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">연락처</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg py-3 pl-10 pr-4 text-text-main focus:border-primary outline-none"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">나이</label>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg py-3 px-4 text-text-main focus:border-primary outline-none appearance-none"
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">성별</label>
                  <div className="flex gap-2">
                    {['여', '남'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          formData.gender === g
                            ? 'bg-primary text-white border-primary'
                            : 'bg-card border-border text-text-main'
                        }`}
                      >
                        {g}성
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Job Profile Section */}
              <div className="bg-primary/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-primary" />
                  <div>
                    <p className="font-bold text-text-main">구직 프로필 설정</p>
                    <p className="text-xs text-text-muted">업소에서 내 프로필을 볼 수 있습니다</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
                  <MapPin size={16} className="text-primary" />
                  희망 근무 지역
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg py-3 px-4 text-text-main focus:border-primary outline-none appearance-none"
                >
                  <option value="">지역 선택</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Desired Job */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
                  <Briefcase size={16} className="text-primary" />
                  희망 업종 (복수 선택)
                </label>
                <div className="flex flex-wrap gap-2">
                  {jobCategories.map(job => (
                    <button
                      key={job}
                      type="button"
                      onClick={() => toggleJobCategory(job)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.desiredJob.includes(job)
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-muted border border-border'
                      }`}
                    >
                      {job}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
                  <Calendar size={16} className="text-primary" />
                  경력
                </label>
                <div className="flex flex-wrap gap-2">
                  {experienceOptions.map(exp => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setFormData({ ...formData, experience: exp })}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.experience === exp
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-muted border border-border'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
                  <Clock size={16} className="text-primary" />
                  가능 시간 (복수 선택)
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeOptions.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleTimeOption(time)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.availableTime.includes(time)
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-muted border border-border'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Introduction */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-main mb-2">
                  <FileText size={16} className="text-primary" />
                  자기소개
                </label>
                <textarea
                  value={formData.introduction}
                  onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  placeholder="자신의 경력, 강점, 성격 등을 자유롭게 작성해주세요."
                  rows={5}
                  className="w-full bg-card border border-border rounded-lg p-4 text-text-main focus:border-primary outline-none resize-none text-sm"
                />
                <p className="text-xs text-text-muted text-right mt-1">{formData.introduction.length}/500</p>
              </div>
            </>
          )}

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                저장하기
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default MyPageEdit;
