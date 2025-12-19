
import React from 'react';
import { AnalyzedMessage } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface MessageCardProps {
  message: AnalyzedMessage;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const style = CATEGORY_STYLES[message.category];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.color} shadow-sm border`}>
              {style.icon}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${style.color} border mb-1 inline-block`}>
                {message.category}
              </span>
              <p className="text-xs text-slate-400 font-medium">
                {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }).format(message.timestamp)}
              </p>
            </div>
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors p-2"><i className="fas fa-ellipsis-v"></i></button>
        </div>

        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-4 italic border-l-4 border-slate-100 pl-4">
          "{message.originalText}"
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <i className="fas fa-microchip text-indigo-400"></i>
             Extracted Entities
           </h4>
           <div className="grid grid-cols-2 gap-3">
             {message.entities.map((entity, idx) => (
               <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">{entity.label}</p>
                 <p className="text-sm text-slate-800 font-semibold">{entity.value}</p>
               </div>
             ))}
           </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-indigo-600 font-medium text-sm">
          <i className="fas fa-bolt"></i>
          <span>Summary: {message.summary}</span>
        </div>
      </div>
    </div>
  );
};
