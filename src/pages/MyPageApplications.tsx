import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { motion } from 'framer-motion';

const MyPageApplications: React.FC = () => {
    const navigate = useNavigate();

    // Mock applications data (in real app, this would come from backend)
    const applications: any[] = [];

    return (
        <div className="min-h-screen pb-24 bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-border p-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-text-main">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-text-main">지원 현황</h1>
            </div>

            {/* Stats Summary */}
            <div className="p-4 border-b border-border">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-4 text-center border border-border">
                        <Hourglass size={24} className="text-yellow-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-text-main">0</p>
                        <p className="text-xs text-text-muted">대기중</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-border">
                        <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-text-main">0</p>
                        <p className="text-xs text-text-muted">합격</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-border">
                        <XCircle size={24} className="text-red-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-text-main">0</p>
                        <p className="text-xs text-text-muted">불합격</p>
                    </div>
                </div>
            </div>

            {applications.length > 0 ? (
                <div className="divide-y divide-border">
                    {applications.map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4"
                        >
                            {/* Application item would go here */}
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
