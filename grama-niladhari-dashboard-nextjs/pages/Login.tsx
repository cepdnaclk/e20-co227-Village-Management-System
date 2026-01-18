
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'GRAMA_NILADHARI' | 'VILLAGER') => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin('GRAMA_NILADHARI');
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-8 ring-zinc-50">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">VMS Sri Lanka</h1>
          <p className="text-sm text-zinc-500 font-medium">Divisional Administrative Access Portal</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Account Identity</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@govt.lk"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Passcode</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
            </div>

            <Button disabled={isLoading} className="w-full h-12 text-xs font-black uppercase tracking-[0.2em] gap-2">
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Sign into Registry <ArrowRight size={18} /></>
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-zinc-50">
            <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors w-full">
              Forgot Credentials?
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest leading-loose">
            Ministry of Home Affairs<br/>
            State Registry Support: +94 112 000 000
          </p>
        </div>
      </div>
    </div>
  );
};
