import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle, XCircle, Hourglass, MapPin, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Application {
    id: string;
    adId: number;
    title: string;
    company: string;
    location: string;
    pay: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;
}

const APPLICATIONS_KEY = 'lunaalba_applications';

// Get applications from localStorage
const getApplications = (): Application[] => {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    return data ? JSON.parse(data) : [];
};

// Initialize with mock data if empty
const initializeApplications = () => {
    const existing = getApplications();
    if (existing.length === 0) {
        const mockApplications: Application[] = [
            {
                id: '1',
                adId: 1,
                title: '강남 하이퍼블릭 VIP 급구',
                company: '하이퍼블릭 강남점',
                location: '서울 강남구',
                pay: '시급 100,000원',
                status: 'pending',
                appliedAt: '2025.12.08'
            },
            {
                id: '2',
                adId: 5,
                title: '홍대 노래방 모집',
                company: '노래방 홍대점',
                location: '서울 마포구 홍대',
                pay: '시급 50,000원',
                status: 'accepted',
                appliedAt: '2025.12.05'
            },
            {
                id: '3',
                adId: 8,
                title: '논현 룸살롱 급구',
                company: '룸살롱 논현점',
                location: '서울 강남구 논현동',
                pay: '일급 500,000원',
                status: 'rejected',
                appliedAt: '2025.12.01'
            }
        ];
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(mockApplications));
        return mockApplications;
    }
    return existing;
};

const MyPageApplications: React.FC = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        setApplications(initializeApplications());
    }, []);

    const stats = {
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    };

    return (
        <div className="min-h-screen pb-24 bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-text-main">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-text-main">지원 현황</h1>
            </div>

            {/* Stats Summary */}
            <div className="p-4 border-b border-border">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card rounded-xl p-4 text-center border border-border">
                        <Hourglass size={24} className="text-yellow-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-text-main">{stats.pending}</p>
                        <p className="text-xs text-text-muted">대기중</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 text-center border border-border">
                        <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-text-main">{stats.accepted}</p>
                        <p className="text-xs text-text-muted">합격</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 text-center border border-border">
                        <XCircle size={24} className="text-red-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-text-main">{stats.rejected}</p>
                        <p className="text-xs text-text-muted">불합격</p>
                    </div>
                </div>
            </div>

            {applications.length > 0 ? (
                <div className="divide-y divide-border">
                    {applications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4"
                        >
                            <Link to={`/ad/${app.adId}`} className="block">
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        app.status === 'pending'
                                            ? 'bg-yellow-500/20 text-yellow-600'
                                            : app.status === 'accepted'
                                            ? 'bg-green-500/20 text-green-600'
                                            : 'bg-red-500/20 text-red-600'
                                    }`}>
                                        {app.status === 'pending' ? '대기중' : app.status === 'accepted' ? '합격' : '불합격'}
                                    </span>
                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                        <Clock size={12} />
                                        {app.appliedAt}
                                    </span>
                                </div>
                                <h3 className="font-bold text-text-main mb-1">{app.title}</h3>
                                <p className="text-sm text-text-muted mb-2">{app.company}</p>
                                <div className="flex items-center gap-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {app.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign size={12} />
                                        {app.pay}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-6">
                        <FileText size={40} className="text-text-muted" />
                    </div>
                    <h2 className="text-lg font-bold text-text-main mb-2">
                        지원 내역이 없습니다
                    </h2>
                    <p className="text-text-muted text-center mb-6">
                        마음에 드는 공고에 지원해보세요!
                    </p>
                    <Link
                        to="/search"
                        className="bg-primary text-white font-bold px-8 py-3 rounded-full"
                    >
                        공고 둘러보기
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyPageApplications;
