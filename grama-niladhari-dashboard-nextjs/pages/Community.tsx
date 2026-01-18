import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle, XCircle, Clock, Megaphone, 
  Search, Filter, Plus, Info, 
  AlertCircle, DollarSign, Key, ArrowRight,
  ShieldAlert, X as LucideX
} from 'lucide-react';
import { PostType, PostStatus } from '../types';

interface ConfirmAction {
  postId: string;
  action: 'APPROVED' | 'DECLINED';
  title: string;
}

export const Community: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [posts, setPosts] = useState([
    {
      id: 'POST-001',
      authorName: 'Aruni Gamage',
      type: PostType.MISSING_ITEM,
      title: 'Lost Wallet near Temple Road',
      content: 'Brown leather wallet containing NIC and some cash. Please contact me if found.',
      createdAt: '10 mins ago',
      status: PostStatus.PENDING
    },
    {
      id: 'POST-002',
      authorName: 'Sunil Perera',
      type: PostType.RENTAL,
      title: '2-Bedroom House for Rent',
      content: 'Available from June. Fully tiled, with annex. Near the main road.',
      createdAt: '1 hour ago',
      status: PostStatus.PENDING
    },
    {
      id: 'POST-003',
      authorName: 'Nimal Silva',
      type: PostType.ANNOUNCEMENT,
      title: 'Blood Donation Camp',
      content: 'Organizing a blood donation camp at the Community Hall next Sunday.',
      createdAt: '3 hours ago',
      status: PostStatus.PENDING
    }
  ]);

  const initiateAction = (id: string, action: 'APPROVED' | 'DECLINED', title: string) => {
    setConfirmAction({ postId: id, action, title });
  };

  const executeAction = () => {
    if (!confirmAction) return;
    setPosts(prev => prev.filter(p => p.id !== confirmAction.postId));
    setConfirmAction(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative min-h-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Community Board</h1>
          <p className="text-zinc-500 mt-1">Audit and publish local information from village residents.</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
             <Clock size={16} className="text-amber-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">{posts.length} Pending Audit</span>
           </div>
           <Button onClick={() => setIsCreateOpen(true)} className="gap-2 rounded-2xl h-11 px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-zinc-200">
             <Plus size={16} /> New Submission
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
               {post.type === PostType.MISSING_ITEM ? <DollarSign size={120} /> : 
                post.type === PostType.RENTAL ? <Key size={120} /> : <Megaphone size={120} />}
            </div>

            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl transition-colors ${
                  post.type === PostType.MISSING_ITEM ? 'bg-red-50 text-red-600' :
                  post.type === PostType.RENTAL ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {post.type === PostType.MISSING_ITEM ? <AlertCircle size={24} /> : 
                   post.type === PostType.RENTAL ? <Key size={24} /> : <Megaphone size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-none mb-2">{post.title}</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                      {post.authorName}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-zinc-200" />
                    <p className="text-[10px] text-zinc-300 font-bold">
                      {post.createdAt}
                    </p>
                  </div>
                </div>
              </div>
              <span className="text-[8px] bg-zinc-900 text-white px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em] shadow-lg">
                {post.type.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-zinc-500 leading-relaxed mb-10 flex-1 font-medium">
              {post.content}
            </p>

            <div className="flex gap-3 pt-8 border-t border-zinc-50">
              <Button 
                onClick={() => initiateAction(post.id, 'APPROVED', post.title)}
                className="flex-1 bg-zinc-900 hover:bg-black text-[10px] font-black uppercase tracking-widest gap-2 h-12 rounded-2xl shadow-xl shadow-zinc-200"
              >
                <CheckCircle size={16} /> Finalize Approval
              </Button>
              <Button 
                onClick={() => initiateAction(post.id, 'DECLINED', post.title)}
                variant="outline" 
                className="px-6 border-zinc-200 text-[10px] font-black uppercase tracking-widest h-12 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
              >
                <XCircle size={16} />
              </Button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="lg:col-span-2 py-32 bg-zinc-50 border-4 border-dashed border-zinc-100 rounded-[48px] flex flex-col items-center justify-center text-center">
            <div className="p-10 bg-white rounded-[40px] text-zinc-100 mb-6 shadow-2xl scale-110">
              <Megaphone size={64} />
            </div>
            <h4 className="text-2xl font-black text-zinc-900 tracking-tight">Queue Depleted</h4>
            <p className="text-sm text-zinc-400 mt-2 font-medium">No community submissions currently require verification.</p>
          </div>
        )}
      </div>

      <section className="bg-zinc-900 text-white rounded-[40px] p-12 overflow-hidden relative shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl">
                <Info size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Content Integrity Policy</h3>
            </div>
            <p className="text-zinc-400 text-sm max-w-xl leading-loose font-medium">
              As the administrative authority, your approval serves as a seal of verification. Prioritize posts concerning safety, essential services, and local trade. Ensure no sensitive personal data is leaked in public rental or missing item advertisements.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Visibility</p>
                <p className="text-sm font-bold">2.4k Residents</p>
             </div>
             <div className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Latency</p>
                <p className="text-sm font-bold">Instant Pub</p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <Megaphone size={200} />
        </div>
      </section>

      {confirmAction && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setConfirmAction(null)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col border border-zinc-100">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 shadow-xl ${
              confirmAction.action === 'APPROVED' ? 'bg-zinc-900 text-white' : 'bg-red-50 text-red-600'
            }`}>
              <ShieldAlert size={28} />
            </div>
            
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter mb-3">
              Confirm {confirmAction.action === 'APPROVED' ? 'Publication' : 'Rejection'}
            </h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-10">
              Are you sure you want to <span className="font-black text-zinc-900 uppercase tracking-tighter">{confirmAction.action}</span> the notice titled <span className="italic font-bold text-zinc-800">"{confirmAction.title}"</span>? This action is logged in the divisional audit trail.
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={executeAction}
                className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl ${
                  confirmAction.action === 'APPROVED' ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Confirm {confirmAction.action === 'APPROVED' ? 'Finalize' : 'Decline'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setConfirmAction(null)}
                className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900"
              >
                Cancel Action
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <aside className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 p-12 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">Submit Notice</h2>
              <button onClick={() => setIsCreateOpen(false)} className="p-3 hover:bg-zinc-50 rounded-2xl border border-zinc-100">
                <LucideX size={24} />
              </button>
            </div>

            <form className="space-y-10 flex-1 overflow-y-auto pr-2 scrollbar-hide">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Information Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="p-4 rounded-2xl border-2 border-zinc-900 bg-zinc-900 text-white flex flex-col items-center gap-2 text-xs font-bold shadow-xl">
                    <DollarSign size={20} /> Missing Money
                  </button>
                  <button type="button" className="p-4 rounded-2xl border-2 border-zinc-100 hover:border-zinc-200 flex flex-col items-center gap-2 text-xs font-bold text-zinc-400 transition-all">
                    <Key size={20} /> House Rental
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Notice Title</label>
                <input placeholder="e.g. Missing wallet near the clinic" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Detailed Context</label>
                <textarea rows={5} placeholder="Provide specific details to help the community..." className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 resize-none" />
              </div>

              <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-3">
                <div className="flex items-center gap-3">
                  <Info size={16} className="text-zinc-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Submission Protocol</p>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">Your post will undergo administrative review by the Grama Niladhari before appearing on the public village board.</p>
              </div>

              <Button className="w-full h-16 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-zinc-200 mt-auto">
                Request Publication <ArrowRight size={16} className="ml-4" />
              </Button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};
