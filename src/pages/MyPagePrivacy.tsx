import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Eye, EyeOff, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser, logout } from '../utils/auth';

const MyPagePrivacy: React.FC = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saved, setSaved] = useState(false);

    const [privacySettings, setPrivacySettings] = useState({
        profileVisible: true,
        activityVisible: false,
        searchHistory: true
    });

    const handleSave = () => {
        localStorage.setItem('privacy_settings', JSON.stringify(privacySettings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDeleteAccount = () => {
        if (!user) return;

        // Remove user from users list
        const users = JSON.parse(localStorage.getItem('lunaalba_users') || '[]');
        const filteredUsers = users.filter((u: any) => u.id !== user.id);
        localStorage.setItem('lunaalba_users', JSON.stringify(filteredUsers));

        // Remove password
        const passwords = JSON.parse(localStorage.getItem('lunaalba_passwords') || '{}');
        delete passwords[user.id];
        localStorage.setItem('lunaalba_passwords', JSON.stringify(passwords));

        // Logout and redirect
        logout();
        navigate('/');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen pb-24 bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-text-main">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-text-main">개인정보 관리</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Privacy Settings */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-text-muted px-1">공개 설정</h2>

                    <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-4">
                            <Eye size={22} className="text-primary" />
                            <div className="flex-1">
                                <h3 className="font-medium text-text-main">프로필 공개</h3>
                                <p className="text-sm text-text-muted">다른 사용자에게 프로필이 보입니다</p>
                            </div>
                            <button
                                onClick={() => setPrivacySettings({ ...privacySettings, profileVisible: !privacySettings.profileVisible })}
                                className={`w-12 h-7 rounded-full transition-colors relative ${
                                    privacySettings.profileVisible ? 'bg-primary' : 'bg-border'
                                }`}
                            >
                                <motion.div
                                    className="absolute top-1 w-5 h-5 bg-card rounded-full shadow"
                                    animate={{ left: privacySettings.profileVisible ? '24px' : '4px' }}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-4">
                            <Shield size={22} className="text-primary" />
                            <div className="flex-1">
                                <h3 className="font-medium text-text-main">활동 기록 공개</h3>
                                <p className="text-sm text-text-muted">최근 활동이 다른 사용자에게 보입니다</p>
                            </div>
                            <button
                                onClick={() => setPrivacySettings({ ...privacySettings, activityVisible: !privacySettings.activityVisible })}
                                className={`w-12 h-7 rounded-full transition-colors relative ${
                                    privacySettings.activityVisible ? 'bg-primary' : 'bg-border'
                                }`}
                            >
                                <motion.div
                                    className="absolute top-1 w-5 h-5 bg-card rounded-full shadow"
                                    animate={{ left: privacySettings.activityVisible ? '24px' : '4px' }}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-text-muted px-1">데이터 관리</h2>

                    <button
                        onClick={() => {
                            localStorage.removeItem('searchHistory');
                            alert('검색 기록이 삭제되었습니다.');
                        }}
                        className="w-full bg-card rounded-xl p-4 border border-border text-left"
                    >
                        <div className="flex items-center gap-4">
                            <Trash2 size={22} className="text-text-muted" />
                            <div className="flex-1">
                                <h3 className="font-medium text-text-main">검색 기록 삭제</h3>
                                <p className="text-sm text-text-muted">모든 검색 기록을 삭제합니다</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem('recentViews');
                            alert('최근 본 공고가 삭제되었습니다.');
                        }}
                        className="w-full bg-card rounded-xl p-4 border border-border text-left"
                    >
                        <div className="flex items-center gap-4">
                            <EyeOff size={22} className="text-text-muted" />
                            <div className="flex-1">
                                <h3 className="font-medium text-text-main">최근 본 공고 삭제</h3>
                                <p className="text-sm text-text-muted">최근 본 공고 목록을 삭제합니다</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-red-500 px-1">위험 구역</h2>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-left"
                    >
                        <div className="flex items-center gap-4">
                            <AlertTriangle size={22} className="text-red-500" />
                            <div className="flex-1">
                                <h3 className="font-medium text-red-500">계정 삭제</h3>
                                <p className="text-sm text-red-500/70">모든 데이터가 영구적으로 삭제됩니다</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-20 left-0 right-0 p-4 bg-card border-t border-border">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                    {saved ? (
                        <>
                            <CheckCircle size={20} />
                            저장되었습니다
                        </>
                    ) : (
                        '저장하기'
                    )}
                </motion.button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border shadow-xl"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-text-main mb-2">계정을 삭제하시겠습니까?</h2>
                            <p className="text-text-muted mb-6">
                                이 작업은 되돌릴 수 없습니다.<br />
                                모든 데이터가 영구적으로 삭제됩니다.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 rounded-xl bg-surface text-text-main font-medium border border-border"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MyPagePrivacy;
