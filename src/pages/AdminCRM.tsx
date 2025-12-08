import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

const pieData = [
    { name: 'VIP', value: 400 },
    { name: 'Special', value: 300 },
    { name: 'Premium', value: 300 },
    { name: 'General', value: 200 },
];

const COLORS = ['#D4AF37', '#FF007F', '#FFFFFF', '#CCCCCC'];

const revenueData = [
    { name: '1주', amount: 4000 },
    { name: '2주', amount: 3000 },
    { name: '3주', amount: 2000 },
    { name: '4주', amount: 2780 },
];

const AdminCRM: React.FC = () => {
    const [heatmapPoints, setHeatmapPoints] = React.useState<{ x: number, y: number, value: number }[]>([]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-white mb-8">관리자 대시보드</h1>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">총 회원수</span>
                        <Users className="text-blue-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">5,432</p>
                    <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        +125명 (오늘)
                    </span>
                </div>
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">월 매출</span>
                        <DollarSign className="text-primary" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">₩45.2M</p>
                    <span className="text-xs text-green-500 flex items-center gap-1 mt-2">
                        +12.5% (전월 대비)
                    </span>
                </div>
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">승인 대기 광고</span>
                        <Clock className="text-yellow-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">12</p>
                    <span className="text-xs text-text-muted mt-2">
                        평균 처리 시간: 1.2시간
                    </span>
                </div>
                <div className="bg-accent p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-text-muted">신고 접수</span>
                        <AlertTriangle className="text-red-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">3</p>
                    <span className="text-xs text-red-500 mt-2">
                        미처리 건수
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Main Charts Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ad Type Distribution */}
                        <div className="bg-accent p-6 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">광고 상품 분포</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-4 text-sm text-text-muted">
                                {pieData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                        <span>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-accent p-6 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">매출 현황</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="name" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="amount" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Heatmap */}
                    <div className="bg-accent p-6 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    광고 효율 히트맵 (Interactive Simulation)
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Live Demo</span>
                                </h3>
                                <p className="text-xs text-text-muted mt-1">
                                    아래 영역을 클릭하여 히트맵이 어떻게 생성되는지 확인해보세요.
                                </p>
                            </div>
                            <button
                                onClick={() => setHeatmapPoints([])}
                                className="text-xs text-text-muted hover:text-white underline"
                            >
                                초기화
                            </button>
                        </div>

                        <div
                            className="relative w-full aspect-[16/9] bg-[#111] rounded-lg border border-white/10 overflow-hidden p-4 cursor-crosshair select-none"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                setHeatmapPoints(prev => [...prev, { x, y, value: 1 }]);
                            }}
                        >
                            {/* Website Wireframe Background */}
                            <div className="w-full h-full flex flex-col gap-4 opacity-50 pointer-events-none">
                                <div className="h-12 w-full bg-white/5 rounded flex items-center px-4 justify-between">
                                    <div className="w-24 h-4 bg-white/10 rounded"></div>
                                    <div className="w-64 h-8 bg-white/10 rounded-full"></div>
                                    <div className="w-32 h-8 bg-white/10 rounded"></div>
                                </div>
                                <div className="h-48 w-full bg-white/5 rounded flex items-center justify-center">
                                    <div className="w-1/2 h-8 bg-white/10 rounded"></div>
                                </div>
                                <div className="grid grid-cols-4 gap-4 flex-1">
                                    {Array(8).fill(0).map((_, i) => (
                                        <div key={i} className="bg-white/5 rounded h-full relative overflow-hidden">
                                            <div className="w-full h-2/3 bg-white/5"></div>
                                            <div className="p-2 space-y-2">
                                                <div className="w-3/4 h-3 bg-white/10 rounded"></div>
                                                <div className="w-1/2 h-3 bg-white/10 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Heatmap Points Rendering */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {heatmapPoints.map((point, i) => (
                                    <div
                                        key={i}
                                        className="absolute rounded-full mix-blend-screen animate-pulse"
                                        style={{
                                            left: point.x - 40,
                                            top: point.y - 40,
                                            width: '80px',
                                            height: '80px',
                                            background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,255,0,0.4) 50%, rgba(0,0,0,0) 70%)',
                                            filter: 'blur(10px)',
                                            opacity: 0.7
                                        }}
                                    />
                                ))}
                                {heatmapPoints.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/80 backdrop-blur px-4 py-2 rounded-full text-sm text-white border border-white/10 animate-bounce">
                                            👆 화면을 클릭해보세요!
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded text-xs text-white border border-white/10 pointer-events-none">
                                클릭 수: {heatmapPoints.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Column: Activity & Tasks */}
                <div className="space-y-8">
                    {/* Pending Approvals */}
                    <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">승인 대기 목록</h3>
                            <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">12건</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-medium text-white">강남 룸살롱 신규 오픈</span>
                                        <span className="text-xs text-text-muted">10분 전</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">VIP</span>
                                        <span className="text-xs text-text-muted">김사장님</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-green-500/20 text-green-500 text-xs py-1.5 rounded hover:bg-green-500/30 flex items-center justify-center gap-1">
                                            <CheckCircle size={12} /> 승인
                                        </button>
                                        <button className="flex-1 bg-red-500/20 text-red-500 text-xs py-1.5 rounded hover:bg-red-500/30 flex items-center justify-center gap-1">
                                            <XCircle size={12} /> 반려
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 text-center border-t border-white/5">
                            <button className="text-xs text-text-muted hover:text-white">전체보기</button>
                        </div>
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="font-bold text-white">실시간 활동 로그</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { type: 'join', text: '신규 회원 가입 (user123)', time: '방금 전' },
                                { type: 'ad', text: '새로운 광고 등록 요청', time: '5분 전' },
                                { type: 'report', text: '게시글 신고 접수', time: '12분 전' },
                                { type: 'payment', text: 'VIP 상품 결제 완료', time: '25분 전' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${log.type === 'join' ? 'bg-blue-500' :
                                        log.type === 'ad' ? 'bg-yellow-500' :
                                            log.type === 'report' ? 'bg-red-500' : 'bg-green-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm text-white">{log.text}</p>
                                        <span className="text-xs text-text-muted">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reported Content */}
                    <div className="bg-accent rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">신고 관리</h3>
                            <AlertTriangle size={16} className="text-red-500" />
                        </div>
                        <div className="p-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare size={14} className="text-red-500" />
                                    <span className="text-sm font-bold text-red-500">부적절한 게시글</span>
                                </div>
                                <p className="text-xs text-white mb-2">"여기 가지마세요 사장님이..."</p>
                                <div className="flex justify-end gap-2">
                                    <button className="text-xs text-text-muted hover:text-white underline">상세보기</button>
                                    <button className="text-xs bg-red-500 text-white px-2 py-1 rounded">삭제</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCRM;
