import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, TrendingUp, DollarSign } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const InfluencerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ name: string, email: string, referralCode?: string, isVerified?: boolean } | null>(null);
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // const BASE_URL = "http://localhost:5000";
    const BASE_URL = "https://brpl.net/api";

    useEffect(() => {
        const token = localStorage.getItem("_auth_token");
        const role = localStorage.getItem("_user_role");

        if (!token || role !== 'influencer') {
            navigate('/coach-login');
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/auth/partner/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    localStorage.removeItem("_auth_token");
                    localStorage.removeItem("_user_role");
                    localStorage.removeItem("_user_id");
                    navigate('/coach-login');
                    return;
                }

                const data = await response.json();
                setUser({
                    name: data?.data?.name || 'Influencer',
                    email: data?.data?.email || '',
                    referralCode: data?.data?.referralCode,
                    isVerified: data?.data?.isVerified
                });

                // Fetch Stats
                const statsResponse = await fetch(`${BASE_URL}/auth/coach/my-players?limit=1`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const statsData = await statsResponse.json();
                if (statsData?.data?.pagination?.total !== undefined) {
                    setTotalReferrals(statsData.data.pagination.total);
                }
            } catch (e) {
                navigate('/coach-login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();



    }, [navigate]);

    const chartConfig = useMemo(
        (): ChartConfig => ({
            referrals: {
                label: 'Referrals',
                color: '#6d28d9'
            }
        }),
        []
    );

    const barData = useMemo(
        () => [
            { label: 'Referrals', referrals: totalReferrals },
            { label: 'Target', referrals: Math.max(totalReferrals, 50) }
        ],
        [totalReferrals]
    );

    const pieData = useMemo(() => {
        const target = Math.max(totalReferrals, 50);
        const remaining = Math.max(0, target - totalReferrals);
        return [
            { name: 'Referrals', value: totalReferrals, color: '#6d28d9' },
            { name: 'Remaining', value: remaining, color: '#c4b5fd' }
        ];
    }, [totalReferrals]);

    const handleLogout = () => {
        localStorage.removeItem("_auth_token");
        localStorage.removeItem("_user_role");
        localStorage.removeItem("_user_id");
        navigate('/coach-login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-purple-900 text-white p-6 hidden md:block">
                <div className="text-2xl font-bold mb-8">BRPL Partner</div>
                <nav className="space-y-4">
                    <a href="#" className="flex items-center gap-3 p-3 bg-white/10 rounded-lg text-white">
                        <Sparkles className="w-5 h-5" />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
                        <TrendingUp className="w-5 h-5" />
                        Campaigns
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
                        <DollarSign className="w-5 h-5" />
                        Earnings
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white p-4 shadow-sm flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Influencer Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </header>

                <main className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Total Referrals</h3>
                            <p className="text-3xl font-bold text-purple-700 mt-2">{isLoading ? '-' : totalReferrals}</p>
                            <div className="text-xs text-gray-400 mt-2">(Tracking not enabled yet)</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Account Status</h3>
                            <p className="text-2xl font-bold mt-2 text-purple-700">{user?.isVerified ? 'Verified' : 'Pending'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Referral Code</h3>
                            <p className="text-2xl font-mono font-bold mt-2 text-purple-700 tracking-widest">{user?.referralCode || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-900 to-[#1f1433] rounded-xl shadow-sm border border-white/10 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Referral Overview</h2>
                                    <div className="text-white/70 text-sm">Referrals vs Target</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white/70 text-xs">Total Referrals</div>
                                    <div className="text-2xl font-extrabold text-white">{isLoading ? '-' : totalReferrals}</div>
                                </div>
                            </div>

                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <BarChart data={barData} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="referralsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#c4b5fd" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.12)" />
                                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.85)' }} />
                                    <YAxis tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.7)' }} width={30} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }} />
                                    <Bar dataKey="referrals" name="Referrals" fill="url(#referralsGradient)" radius={[10, 10, 10, 10]} />
                                </BarChart>
                            </ChartContainer>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-purple-800">Referral Split</h2>
                                    <div className="text-gray-500 text-sm">Referrals vs Remaining-to-Target</div>
                                </div>
                            </div>

                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <PieChart margin={{ top: 10, bottom: 0 }}>
                                    <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(value: number, name: string) => [value, name]} />
                                    <Legend />
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        {pieData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4 text-purple-800">Recent Activity</h2>
                        <div className="text-gray-500 text-sm">No recent activity found.</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InfluencerDashboard;
