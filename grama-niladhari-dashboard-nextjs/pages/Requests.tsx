import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { 
  ClipboardList, Clock, CheckCircle2, XCircle, 
  MoreHorizontal, User, LayoutGrid, List,
  MoveHorizontal, AlertCircle, FileText,
  Filter, Search, ArrowRight
} from 'lucide-react';
import { api, Request } from '../services/api';

export const Requests: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await api.getRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getRequestStatus = (request: Request): string => {
    // Map request types to status - in real app, status would come from backend
    return 'PENDING'; // Default status
  };

  const formatRequestType = (type: string): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-zinc-50 text-zinc-500 border-zinc-100';
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch(prio) {
      case 'HIGH': return 'bg-red-50 text-red-600';
      case 'MEDIUM': return 'bg-zinc-100 text-zinc-900';
      case 'LOW': return 'bg-zinc-50 text-zinc-400';
      default: return '';
    }
  };

  const KanbanColumn = ({ status, label }: { status: string, label: string }) => (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'PENDING' ? 'bg-amber-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
          {label}
        </h3>
        <span className="text-[10px] font-black text-zinc-300 bg-zinc-50 px-2 py-0.5 rounded-full">
          {requests.filter(r => getRequestStatus(r) === status).length}
        </span>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide min-h-[500px]">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Loading...</p>
          </div>
        ) : requests.filter(r => getRequestStatus(r) === status).length === 0 ? (
          <div className="h-40 border-2 border-dashed border-zinc-100 rounded-[32px] flex items-center justify-center">
             <p className="text-[10px] font-black uppercase text-zinc-200 tracking-widest">Queue Empty</p>
          </div>
        ) : (
          requests.filter(r => getRequestStatus(r) === status).map((req) => (
            <div key={req.id} className="bg-white border border-zinc-200 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all cursor-grab active:cursor-grabbing group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-zinc-100 text-zinc-600">
                  {formatRequestType(req.requestType)}
                </span>
                <button className="text-zinc-200 group-hover:text-zinc-400"><MoreHorizontal size={16} /></button>
              </div>
              
              <h4 className="text-sm font-black text-zinc-900 mb-1">{formatRequestType(req.requestType)}</h4>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">REQ-{req.id}</span>
                <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                <span className="text-[10px] text-zinc-300 font-bold">
                  {new Date(req.time).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                    <User size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-700">Person ID: {req.person}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-zinc-50 hover:bg-zinc-900 hover:text-white transition-all">
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Workflow Orchestration</h1>
          <p className="text-zinc-500 text-sm font-medium">Status-driven pipeline for divisional administrative services.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-1.5 flex gap-1 shadow-sm ring-1 ring-black/5">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400 hover:bg-zinc-50'}`}
            >
              <LayoutGrid size={14} /> Board
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400 hover:bg-zinc-50'}`}
            >
              <List size={14} /> Index
            </button>
          </div>
          <Button className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-zinc-200">
            Export Manifest
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex-1 flex gap-8 min-h-0">
          <KanbanColumn status="PENDING" label="Awaiting Audit" />
          <div className="w-px h-full bg-zinc-100" />
          <KanbanColumn status="IN_PROGRESS" label="Administrative Processing" />
          <div className="w-px h-full bg-zinc-100" />
          <KanbanColumn status="COMPLETED" label="SLA Finalized" />
        </div>
      ) : (
        <div className="flex-1 bg-white border border-zinc-200 rounded-[40px] overflow-hidden flex flex-col shadow-sm animate-in zoom-in-95 duration-500">
          <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
            <div className="relative max-w-sm w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
              <input placeholder="Filter by Request ID or Applicant..." className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all" />
            </div>
            <div className="flex gap-2">
               {['ALL', 'PENDING', 'URGENT'].map(f => (
                 <button key={f} className="px-5 py-2.5 rounded-xl border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all">{f}</button>
               ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 sticky top-0 z-10 backdrop-blur-md">
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100">Reference</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100">Applicant Identity</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100">Service Class</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 text-center">Protocol Status</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-6 text-center text-zinc-400">Loading...</td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-6 text-center text-zinc-400">No requests found</td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-zinc-900">REQ-{req.id}</span>
                          <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">
                            {new Date(req.time).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                            <User size={18} />
                          </div>
                          <span className="text-sm font-black text-zinc-700">{req.person}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-800">{formatRequestType(req.requestType)}</span>
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Regulatory Standard</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-[0.2em] shadow-sm inline-block ${getStatusColor(getRequestStatus(req))}`}>
                          {getRequestStatus(req)}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all">
                          <ArrowRight size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SLA Metrics Bar */}
      <section className="bg-zinc-900 text-white rounded-[40px] p-10 overflow-hidden relative shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <Clock size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Avg Resolution</span>
             </div>
             <p className="text-4xl font-black tracking-tighter">1.4 <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest ml-1">Days</span></p>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <CheckCircle2 size={16} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">SLA Success</span>
             </div>
             <p className="text-4xl font-black tracking-tighter">98.2%</p>
          </div>
          <div className="col-span-2 bg-white/5 border border-white/5 p-6 rounded-[32px] backdrop-blur-md flex items-center justify-between">
             <div className="space-y-1">
               <h4 className="text-sm font-black tracking-tight">System Health & Compliance</h4>
               <p className="text-[10px] text-zinc-400 font-medium">Divisional audit trail is active and verified.</p>
             </div>
             <Button variant="outline" className="h-10 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border-white/10 text-white hover:bg-white hover:text-zinc-900">
               Audit Logs
             </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
          <ClipboardList size={200} />
        </div>
      </section>
    </div>
  );
};
