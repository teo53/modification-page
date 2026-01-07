import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, Megaphone, Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationSetting {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    enabled: boolean;
}

const MyPageNotifications: React.FC = () => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'push',
            icon: <Bell size={22} />,
            title: '푸시 알림',
            description: '앱 푸시 알림을 받습니다',
            enabled: true
        },
        {
            id: 'message',
            icon: <MessageSquare size={22} />,
            title: '쪽지 알림',
            description: '새 쪽지가 오면 알림을 받습니다',
            enabled: true
        },
        {
            id: 'marketing',
            icon: <Megaphone size={22} />,
            title: '마케팅 알림',
            description: '이벤트 및 프로모션 정보를 받습니다',
            enabled: false
        },
        {
            id: 'email',
            icon: <Mail size={22} />,
            title: '이메일 알림',
            description: '중요 알림을 이메일로 받습니다',
            enabled: true
        }
    ]);

    const toggleSetting = (id: string) => {
        setSettings(prev =>
            prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    const handleSave = () => {
        // Save to localStorage
        const settingsMap = settings.reduce((acc, s) => {
            acc[s.id] = s.enabled;
            return acc;
        }, {} as Record<string, boolean>);
        localStorage.setItem('notification_settings', JSON.stringify(settingsMap));

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen pb-24 bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-text-main">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-text-main">알림 설정</h1>
            </div>

            <div className="p-4 space-y-3">
                {settings.map((setting) => (
                    <motion.div
                        key={setting.id}
                        whileTap={{ scale: 0.98 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-primary">{setting.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-medium text-text-main">{setting.title}</h3>
                                <p className="text-sm text-text-muted">{setting.description}</p>
                            </div>
                            <button
                                onClick={() => toggleSetting(setting.id)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${
                                    setting.enabled ? 'bg-primary' : 'bg-border'
                                }`}
                            >
                                <motion.div
                                    className="absolute top-1 w-5 h-5 bg-card rounded-full shadow"
                                    animate={{ left: setting.enabled ? '24px' : '4px' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </motion.div>
                ))}
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
        </div>
    );
};

export default MyPageNotifications;
