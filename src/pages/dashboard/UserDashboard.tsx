import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Trophy, Calendar, Target, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const performanceData = [
  { name: 'Match 1', runs: 45 },
  { name: 'Match 2', runs: 30 },
  { name: 'Match 3', runs: 78 },
  { name: 'Match 4', runs: 12 },
  { name: 'Match 5', runs: 56 },
];

const shotDistributionData = [
  { name: 'Cover Drive', value: 35 },
  { name: 'Pull Shot', value: 25 },
  { name: 'Cut Shot', value: 20 },
  { name: 'Defense', value: 20 },
];

const COLORS = ['#263574', '#0088FE', '#00C49F', '#FFBB28'];

const UserDashboard = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Runs Scored</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450</div>
              <p className="text-xs text-muted-foreground">+120 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Batting Average</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">37.5</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strike Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125.4</div>
              <p className="text-xs text-muted-foreground">+5.4% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Performance (Runs)</CardTitle>
              <CardDescription>Runs scored in the last 5 matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar dataKey="runs" fill="#263574" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Shot Distribution</CardTitle>
              <CardDescription>Analysis of scoring shots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex flex-col items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shotDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {shotDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Training Session - 10:00 AM', 'Practice Match - 2:00 PM', 'Team Meeting - 5:00 PM'].map((event, i) => (
                  <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#263574] mr-3" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{event}</p>
                      <p className="text-xs text-muted-foreground">Tomorrow</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto text-xs">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Batting Masterclass</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">4 sessions with video analysis.</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">₹1999</span>
                <Button className="bg-[#263574] hover:bg-[#1a237e] w-full ml-4">
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
