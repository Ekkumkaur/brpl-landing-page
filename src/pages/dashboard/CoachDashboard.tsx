import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Award, Calendar, Search } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const CoachDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string, email: string, numberOfPlayers?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'players'>('dashboard');
  const [players, setPlayers] = useState<any[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [playersSearch, setPlayersSearch] = useState('');
  const [playersPage, setPlayersPage] = useState(1);
  const [playersPagination, setPlayersPagination] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);
  const playersLimit = 10;
  // const BASE_URL = "http://localhost:5000";
  const BASE_URL = "https://brpl.net/api";

  useEffect(() => {
    const token = localStorage.getItem("_auth_token");
    const role = localStorage.getItem("_user_role");

    if (!token || role !== 'coach') {
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
          name: data?.data?.name || 'Coach',
          email: data?.data?.email || '',
          numberOfPlayers: data?.data?.numberOfPlayers
        });
      } catch (e) {
        navigate('/coach-login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("_auth_token");
    const role = localStorage.getItem("_user_role");
    if (!token || role !== 'coach') return;
    if (activeView !== 'players') return;

    const fetchPlayers = async () => {
      setPlayersLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(playersPage),
          limit: String(playersLimit),
          search: playersSearch.trim()
        });

        const res = await fetch(`${BASE_URL}/auth/coach/my-players?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("_auth_token");
            localStorage.removeItem("_user_role");
            localStorage.removeItem("_user_id");
            navigate('/coach-login');
          }
          return;
        }

        const data = await res.json();
        setPlayers(data?.data?.items || []);
        setPlayersPagination(data?.data?.pagination || null);
      } catch (e) {
        console.error('Failed to fetch coach players', e);
      } finally {
        setPlayersLoading(false);
      }
    };

    fetchPlayers();
  }, [activeView, playersPage, playersSearch, navigate]);

  const totalPlayers = useMemo(() => {
    const raw = user?.numberOfPlayers;
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  }, [user?.numberOfPlayers]);

  const chartConfig = useMemo(
    (): ChartConfig => ({
      players: {
        label: 'Players',
        color: '#263574'
      }
    }),
    []
  );

  const chartData = useMemo(
    () => [
      { label: 'Registered', players: totalPlayers },
      { label: 'Target', players: Math.max(totalPlayers, 25) }
    ],
    [totalPlayers]
  );

  const pieData = useMemo(() => {
    const target = Math.max(totalPlayers, 25);
    const remaining = Math.max(0, target - totalPlayers);
    return [
      { name: 'Registered', value: totalPlayers, color: '#263574' },
      { name: 'Remaining', value: remaining, color: '#8aa3ff' }
    ];
  }, [totalPlayers]);

  const handleLogout = () => {
    localStorage.removeItem("_auth_token");
    localStorage.removeItem("_user_role");
    localStorage.removeItem("_user_id");
    navigate('/coach-login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#263574] text-white p-6 hidden md:block">
        <div className="text-2xl font-bold mb-8">BRPL Coach</div>
        <nav className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setPlayersPage(1);
              setPlayersSearch('');
              setActiveView('players');
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'players' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}
          >
            <Calendar className="w-5 h-5" />
            My Players
          </button>
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="w-full flex items-center gap-3 p-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Award className="w-5 h-5" />
            Tournaments
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Coach Dashboard</h1>
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
          {activeView === 'players' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#263574]">My Players</h2>
                  <div className="text-sm text-gray-500">Players registered using your referral code</div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={playersSearch}
                    onChange={(e) => {
                      setPlayersPage(1);
                      setPlayersSearch(e.target.value);
                    }}
                    placeholder="Search name, email or mobile"
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-72"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Paid</th>
                      <th className="p-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playersLoading && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td>
                      </tr>
                    )}

                    {!playersLoading && players.map((p: any) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50 text-sm">
                        <td className="p-4 font-medium text-gray-900">{`${p.fname || ''} ${p.lname || ''}`.trim() || 'Player'}</td>
                        <td className="p-4 text-gray-600">{p.email}</td>
                        <td className="p-4 text-gray-600">{p.mobile}</td>
                        <td className="p-4 text-gray-600">{p.playerRole || '-'}</td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${p.isPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {p.isPaid ? `Paid (${p.paymentAmount || 0})` : 'Free'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}

                    {!playersLoading && players.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">No players found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page <span className="font-medium text-gray-900">{playersPagination?.page || 1}</span> of{' '}
                  <span className="font-medium text-gray-900">{playersPagination?.pages || 1}</span>
                  <span className="ml-2">({playersPagination?.total || 0} players)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayersPage((p) => Math.max(1, p - 1))}
                    disabled={(playersPagination?.page || 1) <= 1 || playersLoading}
                    className="px-4 py-2 rounded-lg bg-[#263574] text-white disabled:opacity-60"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayersPage((p) => (playersPagination?.pages ? Math.min(playersPagination.pages, p + 1) : p + 1))}
                    disabled={!!playersPagination && (playersPagination.page >= playersPagination.pages) || playersLoading}
                    className="px-4 py-2 rounded-lg bg-[#263574] text-white disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium">Total Players</h3>
                  <p className="text-3xl font-bold text-[#263574] mt-2">{isLoading ? '-' : totalPlayers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium">Upcoming Matches</h3>
                  <p className="text-3xl font-bold text-[#263574] mt-2">3</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium">Performance Score</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">8.5</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#263574] to-[#111a33] rounded-xl shadow-sm border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Players Overview</h2>
                      <div className="text-white/70 text-sm">Registered vs Target</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/70 text-xs">Total Players</div>
                      <div className="text-2xl font-extrabold text-white">{isLoading ? '-' : totalPlayers}</div>
                    </div>
                  </div>

                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <BarChart data={chartData} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="playersGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8aa3ff" stopOpacity={1} />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.12)" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.8)' }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        width={30}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }} />
                      <Bar
                        dataKey="players"
                        name="Players"
                        fill="url(#playersGradient)"
                        radius={[10, 10, 10, 10]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#263574]">Player Split</h2>
                      <div className="text-gray-500 text-sm">Registered vs Remaining-to-Target</div>
                    </div>
                  </div>

                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <PieChart margin={{ top: 10, bottom: 0 }}>
                      <Tooltip
                        contentStyle={{ borderRadius: 12 }}
                        formatter={(value: number, name: string) => [value, name]}
                      />
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
                <h2 className="text-lg font-bold mb-4 text-[#263574]">Recent Activity</h2>
                <div className="text-gray-500 text-sm">No recent activity found.</div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoachDashboard;
