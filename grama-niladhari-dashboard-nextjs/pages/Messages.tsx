
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Mail, Search, Inbox, Send, Archive, Star, Trash, MoreHorizontal, Reply, Forward } from 'lucide-react';
import { api, Message } from '../services/api';

export const Messages: React.FC = () => {
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // In a real app, this would come from auth context
  const currentUserId = 'GN001'; // Grama Niladhari ID

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [messagesData, count] = await Promise.all([
          api.getMessagesByReceiverId(currentUserId),
          api.getUnreadMessageCount(currentUserId)
        ]);
        setMessages(messagesData);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedMsg && !selectedMsg.isRead) {
      api.markMessageAsRead(selectedMsg.id);
      setMessages(prev => prev.map(m => m.id === selectedMsg.id ? { ...m, isRead: true } : m));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, [selectedMsg]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Administrative Mail</h1>
          <p className="text-zinc-500 mt-1">Official communication channel with divisional stakeholders.</p>
        </div>
        <Button className="gap-2">
          <Send size={16} /> Compose Message
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <aside className="w-64 flex flex-col gap-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-1">
            <button className="flex items-center justify-between px-3 py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold">
              <div className="flex items-center gap-3">
                <Inbox size={18} /> Inbox
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded">{unreadCount}</span>
              )}
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors">
              <Star size={18} /> Starred
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors">
              <Send size={18} /> Sent
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors">
              <Archive size={18} /> Archive
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors">
              <Trash size={18} /> Trash
            </button>
          </div>

          <div className="bg-zinc-900 text-white rounded-xl p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Storage</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span>1.4 GB / 5 GB</span>
                <span>28%</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[28%]" />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-100 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input placeholder="Search mail..." className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <Button variant="ghost" size="icon"><MoreHorizontal size={18}/></Button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
            {loading ? (
              <div className="p-6 text-center text-zinc-400">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-6 text-center text-zinc-400">No messages</div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-6 flex items-start gap-4 hover:bg-zinc-50 cursor-pointer transition-colors relative ${selectedMsg?.id === msg.id ? 'bg-zinc-50' : ''}`}
                >
                  {!msg.isRead && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold text-xs">
                    {msg.senderName?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm ${!msg.isRead ? 'font-black text-zinc-900' : 'font-medium text-zinc-700'}`}>{msg.senderName || 'Unknown'}</h3>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        {new Date(msg.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className={`text-xs mb-1 ${!msg.isRead ? 'font-bold text-zinc-900' : 'text-zinc-500'}`}>{msg.subject}</h4>
                    <p className="text-xs text-zinc-400 truncate leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedMsg && (
          <aside className="w-[500px] bg-white border border-zinc-200 rounded-xl p-8 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-12">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Trash size={16}/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Archive size={16}/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Star size={16}/></Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMsg(null)}><MoreHorizontal className="rotate-45" size={18}/></Button>
            </div>

            <div className="space-y-8 flex-1">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 leading-tight mb-6">{selectedMsg.subject}</h2>
                <div className="flex items-center gap-3 pb-8 border-b border-zinc-50">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    {selectedMsg.senderName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{selectedMsg.senderName || 'Unknown'}</p>
                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-tighter">
                      {new Date(selectedMsg.sentAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-zinc-600 leading-relaxed space-y-4">
                <p>{selectedMsg.content}</p>
              </div>
            </div>

            <div className="pt-8 flex gap-3">
              <Button variant="outline" className="flex-1 gap-2 text-xs font-bold uppercase tracking-widest"><Reply size={14}/> Reply</Button>
              <Button variant="outline" className="flex-1 gap-2 text-xs font-bold uppercase tracking-widest"><Forward size={14}/> Forward</Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
