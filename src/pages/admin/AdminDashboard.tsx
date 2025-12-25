import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Database, LogOut, Search, ShieldCheck, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<{ totalUsers: number; totalCoaches: number; totalInfluencers: number } | null>(null);
    const [activeTab, setActiveTab] = useState<'users' | 'coaches' | 'influencers'>('users');
    const [items, setItems] = useState<any[]>([]);
    const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingTable, setLoadingTable] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;
    // const BASE_URL = "http://localhost:5000";
    const BASE_URL = "https://brpl.net/api";

    useEffect(() => {
        const token = localStorage.getItem("_admin_token");
        if (!token) {
            navigate('/admin/landing/admin');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await fetch(`${BASE_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) navigate('/admin/landing/admin');
                    return;
                }

                const result = await response.json();
                setStats(result?.data?.stats || { totalUsers: 0, totalCoaches: 0, totalInfluencers: 0 });
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("_admin_token");
        if (!token) return;

        const fetchRecords = async () => {
            setLoadingTable(true);
            try {
                const query = new URLSearchParams({
                    type: activeTab,
                    page: String(page),
                    limit: String(limit),
                    search: search.trim()
                });

                const response = await fetch(`${BASE_URL}/admin/records?${query.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) navigate('/admin/landing/admin');
                    return;
                }

                const result = await response.json();
                setItems(result?.data?.items || []);
                setPagination(result?.data?.pagination || null);
            } catch (error) {
                console.error('Failed to fetch admin records', error);
            } finally {
                setLoadingTable(false);
            }
        };

        fetchRecords();
    }, [activeTab, page, search, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("_admin_token");
        navigate('/admin/landing/admin');
    };

    const TableRow = ({ item, type }: { item: any, type: string }) => (
        <tr className="border-b hover:bg-gray-50 text-sm">
            <td className="p-4 font-medium text-gray-900">{item.name || item.fname + ' ' + (item.lname || '')}</td>
            <td className="p-4 text-gray-600">{item.email}</td>
            <td className="p-4 text-gray-600">{item.mobile}</td>
            {type === 'user' && (
                <>
                    <td className="p-4 text-gray-600">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                            {item.playerRole || 'N/A'}
                        </span>
                    </td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                        {item.isPaid ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                {typeof item.paymentAmount === 'number' ? item.paymentAmount : (item.paymentAmount || 0)}
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">0</span>
                        )}
                    </td>
                </>
            )}
            <td className="p-4 text-gray-600 whitespace-nowrap">
                {type === 'coach' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {item.academyName} ({item.numberOfPlayers})
                    </span>
                )}
                {type === 'user' && (
                    <>
                        <span className={`px-2 py-1 rounded-full text-xs ${item.isPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.isPaid ? 'Paid' : 'Free'}
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs ml-2">Landing Page</span>
                    </>
                )}
                {item.referralCode && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs ml-2">
                        Ref: {item.referralCode}
                    </span>
                )}
            </td>
            <td className="p-4 text-gray-400 text-xs">
                {new Date(item.createdAt).toLocaleDateString()}
            </td>
        </tr>
    );

    const chartConfig = useMemo(
        (): ChartConfig => ({
            users: { label: 'Users', color: '#263574' },
            coaches: { label: 'Coaches', color: '#2563eb' },
            influencers: { label: 'Influencers', color: '#9333ea' }
        }),
        []
    );

    const overviewBar = useMemo(() => {
        const s = stats || { totalUsers: 0, totalCoaches: 0, totalInfluencers: 0 };
        return [
            { label: 'Users', value: s.totalUsers },
            { label: 'Coaches', value: s.totalCoaches },
            { label: 'Influencers', value: s.totalInfluencers }
        ];
    }, [stats]);

    const overviewPie = useMemo(() => {
        const s = stats || { totalUsers: 0, totalCoaches: 0, totalInfluencers: 0 };
        return [
            { name: 'Users', value: s.totalUsers, color: '#263574' },
            { name: 'Coaches', value: s.totalCoaches, color: '#2563eb' },
            { name: 'Influencers', value: s.totalInfluencers, color: '#9333ea' }
        ];
    }, [stats]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0b1220] to-black text-white flex">
            <aside className="hidden md:flex w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="p-6 w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600/40 to-[#263574]/40 border border-white/10 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="font-bold">BRPL Admin</div>
                            <div className="text-xs text-white/60">Control Center</div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10">
                            <BarChart3 className="h-4 w-4 text-white/80" />
                            <div className="text-sm">Dashboard</div>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70">
                            <Database className="h-4 w-4" />
                            <div className="text-sm">Records</div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1">
                <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1220]/70 backdrop-blur-xl">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden h-10 w-10 rounded-xl bg-gradient-to-br from-red-600/40 to-[#263574]/40 border border-white/10 flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-lg font-bold">Dashboard</div>
                                <div className="text-xs text-white/60">Live overview of registrations</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                    value={search}
                                    onChange={(e) => {
                                        setPage(1);
                                        setSearch(e.target.value);
                                    }}
                                    placeholder="Search name, email or mobile"
                                    className="pl-9 w-72 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 hidden md:block"
                                />
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="p-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="text-sm text-white/60 font-medium">Landing Page Players</div>
                            <div className="text-3xl font-extrabold mt-2">{stats?.totalUsers || 0}</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="text-sm text-white/60 font-medium">Registered Coaches</div>
                            <div className="text-3xl font-extrabold text-blue-200 mt-2">{stats?.totalCoaches || 0}</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="text-sm text-white/60 font-medium">Influencers</div>
                            <div className="text-3xl font-extrabold text-purple-200 mt-2">{stats?.totalInfluencers || 0}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-900">
                            <div className="font-bold text-[#263574] mb-4">Overview (Bar)</div>
                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <BarChart data={overviewBar} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="adminBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#263574" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#263574" stopOpacity={0.25} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} width={35} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" fill="url(#adminBar)" radius={[10, 10, 10, 10]} />
                                </BarChart>
                            </ChartContainer>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-900">
                            <div className="font-bold text-[#263574] mb-4">Distribution (Pie)</div>
                            <ChartContainer config={chartConfig} className="h-64 w-full">
                                <PieChart margin={{ top: 10, bottom: 0 }}>
                                    <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(value: number, name: string) => [value, name]} />
                                    <Legend />
                                    <Pie
                                        data={overviewPie}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        {overviewPie.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-gray-900">
                        <Tabs
                            value={activeTab}
                            onValueChange={(v) => {
                                setPage(1);
                                setActiveTab(v as any);
                            }}
                            className="w-full"
                        >
                            <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50/70">
                                <TabsList>
                                    <TabsTrigger value="users">Landing Page Players</TabsTrigger>
                                    <TabsTrigger value="coaches">Coaches</TabsTrigger>
                                    <TabsTrigger value="influencers">Influencers</TabsTrigger>
                                </TabsList>

                                <div className="flex gap-2 md:hidden">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={search}
                                            onChange={(e) => {
                                                setPage(1);
                                                setSearch(e.target.value);
                                            }}
                                            placeholder="Search records..."
                                            className="pl-9 h-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            {(['users', 'coaches', 'influencers'] as const).map((t) => (
                                <TabsContent key={t} value={t} className="m-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                                <tr>
                                                    <th className="p-4">Name</th>
                                                    <th className="p-4">Email</th>
                                                    <th className="p-4">Mobile</th>
                                                    {t === 'users' && <th className="p-4">Role</th>}
                                                    {t === 'users' && <th className="p-4">Paid Amount</th>}
                                                    <th className="p-4">Info</th>
                                                    <th className="p-4">Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadingTable && (
                                                    <tr>
                                                        <td colSpan={t === 'users' ? 7 : 5} className="p-8 text-center text-gray-500">Loading...</td>
                                                    </tr>
                                                )}

                                                {!loadingTable && items.map((item: any) => (
                                                    <TableRow
                                                        key={item._id}
                                                        item={item}
                                                        type={t === 'users' ? 'user' : t === 'coaches' ? 'coach' : 'influencer'}
                                                    />
                                                ))}

                                                {!loadingTable && items.length === 0 && (
                                                    <tr>
                                                        <td colSpan={t === 'users' ? 7 : 5} className="p-8 text-center text-gray-500">No records found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="p-4 border-t flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Page <span className="font-medium text-gray-900">{pagination?.page || 1}</span> of{' '}
                                            <span className="font-medium text-gray-900">{pagination?.pages || 1}</span>
                                            <span className="ml-2">({pagination?.total || 0} records)</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={(pagination?.page || 1) <= 1 || loadingTable}
                                                className="bg-[#263574] text-white hover:bg-[#1f2d5f]"
                                            >
                                                Prev
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => setPage((p) => (pagination?.pages ? Math.min(pagination.pages, p + 1) : p + 1))}
                                                disabled={!!pagination && (pagination.page >= pagination.pages) || loadingTable}
                                                className="bg-[#263574] text-white hover:bg-[#1f2d5f]"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
