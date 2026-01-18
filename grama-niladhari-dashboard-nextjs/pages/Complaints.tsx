
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { AlertCircle, Download, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { api, Complaint } from '../services/api';

export const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.getComplaints(0, 100, 'time', 'DESC');
        setComplaints(response.complains || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getComplaintStatus = (complaint: Complaint): string => {
    if (complaint.status === 'COMPLETED' || complaint.completeTime) return 'RESOLVED';
    if (complaint.status === 'IN_PROGRESS') return 'IN_PROGRESS';
    return 'PENDING';
  };

  const getSeverity = (complaint: Complaint): string => {
    // In a real app, severity would come from backend
    return 'MEDIUM';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Grievance Board</h1>
          <p className="text-zinc-500 mt-1">Direct community feedback and incident reporting system.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export CSV
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">File New Complaint</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <div key={status} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'PENDING' ? 'bg-red-500' : status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                {status.replace('_', ' ')}
              </h3>
              <span className="text-[10px] font-bold text-zinc-400">
                {complaints.filter(c => getComplaintStatus(c) === status).length} Issues
              </span>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Loading...</p>
                </div>
              ) : complaints.filter(c => getComplaintStatus(c) === status).length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-lg">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">Column Empty</p>
                </div>
              ) : (
                complaints.filter(c => getComplaintStatus(c) === status).map((comp) => {
                  const severity = getSeverity(comp);
                  return (
                    <div key={comp.id} className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">C-{comp.id}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${
                          severity === 'HIGH' ? 'bg-red-50 text-red-600' : severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-50 text-zinc-400'
                        }`}>
                          {severity}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{comp.complain}</h4>
                      <p className="text-xs text-zinc-500 mt-1">Reported by {comp.personName || comp.person}</p>
                      <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">{new Date(comp.time).toLocaleDateString()}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
      
      <section className="bg-white border border-zinc-200 rounded-xl p-8 flex items-center gap-8">
        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900">Safety & Compliance Policy</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
            All complaints are audited weekly by the Divisional Secretariat. Ensure all digital evidence is attached to the physical file maintained in the registry. 
            Anonymity is maintained for specific witness reports under administrative code SL-442.
          </p>
        </div>
      </section>
    </div>
  );
};
