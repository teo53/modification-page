import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, MousePointer, Phone, TrendingUp } from 'lucide-react';

const data = [
    { name: '월', views: 4000, clicks: 2400, calls: 240 },
    { name: '화', views: 3000, clicks: 1398, calls: 210 },
    { name: '수', views: 2000, clicks: 9800, calls: 290 },
    { name: '목', views: 2780, clicks: 3908, calls: 200 },
    { name: '금', views: 1890, clicks: 4800, calls: 181 },
    { name: '토', views: 2390, clicks: 3800, calls: 250 },
    { name: '일', views: 3490, clicks: 4300, calls: 210 },
];

const AdvertiserCRM: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-text-main mb-8">광고주 대시보드</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">총 노출수</span>
                        <Eye className="text-primary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-text-main">12,345</p>
                    <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        <TrendingUp size={12} /> +12.5%
                    </span>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">클릭수</span>
                        <MousePointer className="text-secondary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-text-main">1,234</p>
                    <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        <TrendingUp size={12} /> +8.2%
                    </span>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">전화문의</span>
                        <Phone className="text-blue-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-text-main">89</p>
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-2">
                        <TrendingUp size={12} /> -2.1%
                    </span>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">CTR (클릭률)</span>
                        <TrendingUp className="text-purple-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-text-main">10.5%</p>
                    <span className="text-xs text-text-muted mt-2">업계 평균 대비 상위 5%</span>
                </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-text-main mb-6">주간 성과 추이</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E5E5' }}
                                    itemStyle={{ color: '#222' }}
                                />
                                <Line type="monotone" dataKey="views" stroke="#FF6B35" strokeWidth={2} />
                                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-text-main mb-6">전환율 분석</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E5E5' }}
                                    itemStyle={{ color: '#222' }}
                                />
                                <Bar dataKey="calls" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Active Ads Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-text-main">진행 중인 광고</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-muted">
                        <thead className="bg-surface text-text-main">
                            <tr>
                                <th className="p-4">광고 제목</th>
                                <th className="p-4">상품</th>
                                <th className="p-4">기간</th>
                                <th className="p-4">노출수</th>
                                <th className="p-4">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr>
                                <td className="p-4 font-medium text-text-main">강남 하이퍼블릭 VIP 모집</td>
                                <td className="p-4"><span className="text-primary">VIP 프리미엄</span></td>
                                <td className="p-4">2025.11.01 ~ 2025.11.30</td>
                                <td className="p-4">8,420</td>
                                <td className="p-4"><span className="bg-green-500/20 text-green-600 px-2 py-1 rounded text-xs">진행중</span></td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-text-main">주말 알바 급구합니다</td>
                                <td className="p-4"><span className="text-secondary">스페셜</span></td>
                                <td className="p-4">2025.11.10 ~ 2025.12.10</td>
                                <td className="p-4">3,210</td>
                                <td className="p-4"><span className="bg-green-500/20 text-green-600 px-2 py-1 rounded text-xs">진행중</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserCRM;
