import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Truck, 
  Package, 
  DollarSign, 
  LogOut, 
  AlertTriangle, 
  UserPlus,
  Mail,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface DashboardStats {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    shippers: number;
    drivers: number;
  };
  loadStats: {
    totalLoads: number;
    activeLoads: number;
    completedLoads: number;
  };
  waitlistCount: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  verificationStatus: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  confirmed: boolean;
  source: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not authenticated or not admin
  if (!loading && (!user || user.role !== 'admin')) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadDashboardData();
      loadUsers();
      loadWaitlist();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users data');
    } finally {
      setDataLoading(false);
    }
  };

  const loadWaitlist = async () => {
    try {
      const response = await fetch('/api/admin/waitlist', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load waitlist');
      }

      const data = await response.json();
      setWaitlist(data.waitlist);
    } catch (error) {
      console.error('Error loading waitlist:', error);
      toast.error('Failed to load waitlist data');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      shipper: 'bg-blue-100 text-blue-800',
      driver: 'bg-orange-100 text-orange-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader
        userType="admin"
        userName={user?.name}
        onLogout={handleLogout}
      />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-300">Monitor and manage the DockDirect platform</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              <Mail className="h-4 w-4 mr-2" />
              Beta Waitlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Alert Section */}
            {dashboardData && dashboardData.userStats.pendingUsers > 0 && (
              <Card className="mb-8 border-amber-500/20 bg-amber-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <h3 className="font-semibold text-amber-200">Pending Verifications</h3>
                      <p className="text-sm text-amber-300">
                        {dashboardData.userStats.pendingUsers} users awaiting verification review
                      </p>
                    </div>
                    <Button size="sm" className="ml-auto bg-amber-600 hover:bg-amber-700">
                      Review Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Grid */}
            {dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardData.userStats.totalUsers}</div>
                    <p className="text-xs text-slate-400">
                      {dashboardData.userStats.shippers} shippers, {dashboardData.userStats.drivers} drivers
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-300">Active Loads</CardTitle>
                      <Package className="h-4 w-4 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardData.loadStats.activeLoads}</div>
                    <p className="text-xs text-slate-400">
                      {dashboardData.loadStats.totalLoads} total loads
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-300">Beta Waitlist</CardTitle>
                      <Mail className="h-4 w-4 text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardData.waitlistCount}</div>
                    <p className="text-xs text-slate-400">Early access signups</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-300">Completion Rate</CardTitle>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {dashboardData.loadStats.totalLoads > 0 
                        ? Math.round((dashboardData.loadStats.completedLoads / dashboardData.loadStats.totalLoads) * 100) 
                        : 0}%
                    </div>
                    <p className="text-xs text-slate-400">
                      {dashboardData.loadStats.completedLoads} completed loads
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Platform Health</CardTitle>
                <CardDescription className="text-slate-400">
                  System status and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-slate-200">API Status</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-slate-200">Database</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-slate-200">Authentication</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-400">
                  View and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Verification</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Last Login</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-slate-200 font-medium">{user.name}</div>
                              <div className="text-slate-400 text-sm">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getRoleBadge(user.role)}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {user.emailVerified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="text-slate-300 text-sm">
                                {user.verificationStatus}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 text-sm">
                            {user.lastLoginAt 
                              ? new Date(user.lastLoginAt).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td className="py-3 px-4 text-slate-300 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Beta Waitlist</CardTitle>
                <CardDescription className="text-slate-400">
                  Early access signups and confirmations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Source</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Signed Up</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitlist.map((entry) => (
                        <tr key={entry.id} className="border-b border-slate-700/50">
                          <td className="py-3 px-4 text-slate-200">{entry.email}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {entry.confirmed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="text-slate-300 text-sm">
                                {entry.confirmed ? 'Confirmed' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{entry.source || 'landing_page'}</td>
                          <td className="py-3 px-4 text-slate-300 text-sm">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;