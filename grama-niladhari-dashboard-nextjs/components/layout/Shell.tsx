
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  Home, 
  FileCheck, 
  ClipboardList, 
  AlertCircle, 
  Calendar, 
  Video, 
  Mail, 
  ChevronRight,
  ChevronLeft,
  Search,
  Settings,
  LogOut,
  Megaphone,
  Globe
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { CommandPalette } from '../CommandPalette';

interface ShellProps {
  children: React.ReactNode;
  userRole: string;
  onLogout: () => void;
}

export const Shell: React.FC<ShellProps> = ({ children, userRole, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Virtual Village', icon: Globe, path: '/village-map' },
    { name: 'Persons', icon: Users, path: '/persons' },
    { name: 'Lands', icon: MapIcon, path: '/lands' },
    { name: 'Houses', icon: Home, path: '/houses' },
    { name: 'Certificates', icon: FileCheck, path: '/certificates' },
    { name: 'Community', icon: Megaphone, path: '/community' },
    { name: 'Requests', icon: ClipboardList, path: '/requests' },
    { name: 'Complaints', icon: AlertCircle, path: '/complaints' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Conferences', icon: Video, path: '/conferences' },
    { name: 'Messages', icon: Mail, path: '/messages' },
  ];

  return (
    <div className="flex h-screen bg-[#fafafa]">
      <CommandPalette />
      
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-zinc-900 tracking-tighter text-lg leading-none">VMS</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">Sri Lanka</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-zinc-50 text-zinc-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'bg-zinc-900 text-zinc-50 shadow-lg shadow-zinc-200' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-900'} />
                {!isCollapsed && <span className="text-sm font-semibold tracking-tight">{item.name}</span>}
                {isActive && <div className="absolute left-0 w-1 h-4 bg-zinc-50 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-50 space-y-1">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
            <Settings size={18} />
            {!isCollapsed && <span className="text-sm font-semibold tracking-tight">Settings</span>}
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-sm font-semibold tracking-tight">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                readOnly
                placeholder="Quick search..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none transition-all cursor-pointer group-hover:bg-zinc-100"
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] font-black text-zinc-400 bg-white">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] font-black text-zinc-400 bg-white">K</kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-900 tracking-tight">Mahinda Perera</p>
              <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">{userRole.replace('_', ' ')}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-inner">
               <Users size={20} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};
