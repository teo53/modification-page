import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Phone, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';

const MyPageEdit: React.FC = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        phone: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setFormData({
            name: user.name || '',
            nickname: user.nickname || '',
            phone: user.phone || ''
        });
    }, [user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate save
        setTimeout(() => {
            // Update localStorage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('lunaalba_current_user', JSON.stringify(updatedUser));

            // Update users list
            const users = JSON.parse(localStorage.getItem('lunaalba_users') || '[]');
            const index = users.findIndex((u: any) => u.id === user?.id);
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

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4">
                            <User size={40} className="text-primary" />
                        </div>
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
                        <p className="text-xs text-text-muted mt-1">이메일은 변경할 수 없습니다.</p>
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
