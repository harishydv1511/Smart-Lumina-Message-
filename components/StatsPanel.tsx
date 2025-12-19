
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { AnalyzedMessage, MessageCategory } from '../types';

interface StatsPanelProps {
  messages: AnalyzedMessage[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ messages }) => {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(MessageCategory).forEach(cat => counts[cat] = 0);
    messages.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    // Create, filter, map, and sort in one chain to ensure we return a fresh, correctly ordered array.
    // Sorting inside useMemo avoids mutating the array during the render cycle.
    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      // Fix: Explicitly define property name to avoid invalid shorthand syntax with type assertion
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, [messages]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#a855f7', '#f97316', '#64748b'];

  const totalActions = useMemo(() => messages.length, [messages]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <h4 className="text-slate-800 font-bold mb-6 flex items-center gap-2 relative z-10">
          <i className="fas fa-chart-pie text-indigo-600"></i>
          Intelligence Overview
        </h4>
        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Analysed</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalActions}</p>
          </div>
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mb-1">Categories</p>
            <p className="text-2xl font-extrabold">{chartData.length}</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" hide />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-list-ul text-emerald-500"></i>
          Category Breakdown
        </h4>
        <div className="space-y-3">
          {chartData.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-400">
                {totalActions > 0 ? Math.round((item.value / totalActions) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence Tip */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <i className="fas fa-lightbulb"></i>
          </div>
          <h5 className="font-bold">NLP Tip</h5>
        </div>
        <p className="text-sm text-indigo-100 leading-relaxed mb-4">
          Lumina identifies complex entities like "₹850" or "Apollo Hospital" automatically using the Gemini NLP core.
        </p>
        <button className="w-full bg-white text-indigo-600 font-bold py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};
