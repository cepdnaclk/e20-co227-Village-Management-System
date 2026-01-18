
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon: Icon }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
          {trend && (
            <p className="text-xs mt-2 text-zinc-400">
              <span className="text-emerald-600 font-medium">↑</span> {trend} from last month
            </p>
          )}
        </div>
        <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};
