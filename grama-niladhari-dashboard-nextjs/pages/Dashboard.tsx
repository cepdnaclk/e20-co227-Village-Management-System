
import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { Users, LandPlot, FileCheck, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api, DashboardStats, Request } from '../services/api';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, requestsData] = await Promise.all([
          api.getDashboardStats(),
          api.getRequests()
        ]);
        setStats(statsData);
        // Get recent pending requests
        const pendingRequests = requestsData
          .filter(r => r.requestType === 'CHARACTER_AND_RESIDENCE_CERTIFICATE')
          .slice(0, 3);
        setRequests(pendingRequests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-zinc-500 mt-1">Village administrative metrics and status updates.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Reports</Button>
          <Button>+ New Registration</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Villagers" 
          value={stats?.totalVillagers?.toLocaleString() || "0"} 
          trend="12" 
          icon={Users} 
        />
        <StatCard 
          label="Land Parcels" 
          value={stats?.totalLands?.toLocaleString() || "0"} 
          trend="3" 
          icon={LandPlot} 
        />
        <StatCard 
          label="Certificates Issued" 
          value={stats?.totalCertificates?.toLocaleString() || "0"} 
          trend="15" 
          icon={FileCheck} 
        />
        <StatCard 
          label="Unread Messages" 
          value={stats?.unreadMessages?.toLocaleString() || "0"} 
          icon={MessageSquare} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">Pending Requests</h3>
              <Button variant="ghost" size="sm" className="text-zinc-500">View all</Button>
            </div>
            <div className="divide-y divide-zinc-100">
              {requests.length === 0 ? (
                <div className="px-6 py-8 text-center text-zinc-400 text-sm">No pending requests</div>
              ) : (
                requests.map((req) => (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-medium text-zinc-600">
                      {req.person?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Person ID: {req.person}</p>
                      <p className="text-xs text-zinc-500">{req.requestType?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-400">
                      {new Date(req.time).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600">
                      Pending
                    </span>
                    <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                  </div>
                </div>
              )))}
            </div>
          </section>

          <section className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-900">Recent Complaints</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Illegal construction on boundary line</p>
                    <p className="text-xs text-zinc-500 mt-1">Reported by J. Fernando • 12/05/2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Noise complaint: Late night event</p>
                    <p className="text-xs text-zinc-500 mt-1">Reported by G. Wickramasinghe • 11/05/2024</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-zinc-900 text-zinc-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
            <p className="text-zinc-400 text-sm mb-6">You have 3 meetings scheduled for today.</p>
            <div className="space-y-4">
              <div className="border-l-2 border-zinc-700 pl-4 py-1">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">09:00 AM</p>
                <p className="text-sm font-medium">Divisional Secretariat Meeting</p>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4 py-1">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">11:30 AM</p>
                <p className="text-sm font-medium">Land Dispute Mediation</p>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4 py-1">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">02:00 PM</p>
                <p className="text-sm font-medium">Village Council Briefing</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white">
              Open Calendar
            </Button>
          </section>

          <section className="bg-white border border-zinc-200 rounded-xl p-6">
            <h3 className="font-semibold text-zinc-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Target Certificate Issuance</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Complaint Resolution Rate</span>
                  <span className="font-medium">62%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
