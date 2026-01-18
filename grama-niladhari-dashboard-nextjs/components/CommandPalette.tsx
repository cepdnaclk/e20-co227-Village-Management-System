
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Users, 
  Map as MapIcon, 
  FileCheck, 
  Plus, 
  Command,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    { name: 'Register New Person', icon: Users, path: '/persons', category: 'Registry' },
    { name: 'Issue Certificate', icon: FileCheck, path: '/certificates', category: 'Services' },
    { name: 'Map New Boundary', icon: MapIcon, path: '/lands', category: 'Lands' },
    { name: 'Add Household', icon: Plus, path: '/houses', category: 'Registry' },
  ].filter(action => action.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
          <Search className="text-zinc-400" size={20} />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none text-base focus:outline-none placeholder:text-zinc-400"
          />
          <div className="px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] font-bold text-zinc-400">ESC</div>
        </div>

        <div className="max-h-[320px] overflow-y-auto p-2">
          {actions.length > 0 ? (
            <div className="space-y-4">
              <div className="px-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Quick Actions</p>
              </div>
              <div className="space-y-1">
                {actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(action.path);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 group transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        <action.icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{action.name}</span>
                    </div>
                    <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Command size={32} className="mx-auto text-zinc-200 mb-2" />
              <p className="text-sm text-zinc-400">No results for "{search}"</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 text-[8px] font-bold bg-white">↑↓</kbd>
              <span className="text-[10px] text-zinc-400">to navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 text-[8px] font-bold bg-white">ENTER</kbd>
              <span className="text-[10px] text-zinc-400">to select</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
