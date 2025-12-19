
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeMessage } from './services/geminiService';
import { AnalyzedMessage, MessageCategory, Entity } from './types';
import { CATEGORY_STYLES } from './constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

// Components
import { MessageCard } from './components/MessageCard';
import { StatsPanel } from './components/StatsPanel';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<AnalyzedMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<MessageCategory | 'All'>('All');
  const [error, setError] = useState<string | null>(null);

  // Initial demo data
  useEffect(() => {
    const demoData: AnalyzedMessage[] = [
      {
        id: '1',
        originalText: 'Your Amazon order #34567 will be delivered on 12 Oct at 5 PM.',
        category: MessageCategory.DELIVERY,
        entities: [
          { label: 'Order ID', value: '#34567' },
          { label: 'Date', value: '12 Oct' },
          { label: 'Time', value: '5 PM' },
          { label: 'Service', value: 'Amazon' }
        ],
        summary: 'Your package is arriving on October 12th.',
        timestamp: new Date()
      },
      {
        id: '2',
        originalText: 'Electricity bill of ₹1,450 is due on 20th Nov. Pay now to avoid late fees.',
        category: MessageCategory.BILL_PAYMENT,
        entities: [
          { label: 'Amount', value: '₹1,450' },
          { label: 'Due Date', value: '20th Nov' },
          { label: 'Service', value: 'Electricity' }
        ],
        summary: 'Power bill due soon.',
        timestamp: new Date()
      }
    ];
    setMessages(demoData);
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeMessage(inputText);
      const newMessage: AnalyzedMessage = {
        id: Date.now().toString(),
        originalText: inputText,
        category: analysis.category,
        entities: analysis.entities,
        summary: analysis.summary,
        timestamp: new Date(),
      };
      setMessages(prev => [newMessage, ...prev]);
      setInputText('');
    } catch (err) {
      setError('Failed to analyze message. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredMessages = messages.filter(m => selectedFilter === 'All' || m.category === selectedFilter);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar - Navigation & Quick Stats */}
      <aside className="lg:w-80 w-full bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen overflow-y-auto z-10 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Lumina AI</h1>
        </div>

        <div className="space-y-1 mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Organize</p>
          <button 
            onClick={() => setSelectedFilter('All')}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${selectedFilter === 'All' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fas fa-layer-group w-5"></i>
            All Messages
          </button>
          {Object.values(MessageCategory).map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${selectedFilter === cat ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="w-5 flex justify-center">{CATEGORY_STYLES[cat].icon}</span>
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <h4 className="font-semibold text-sm mb-1">Advanced Intelligence</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Gemini 3 Flash provides real-time entity extraction.</p>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-12 overflow-x-hidden">
        {/* Top Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Personal Intelligence</h2>
            <p className="text-slate-500 mt-1">Automatic NLP categorization for your daily communication.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                API Connected
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left: Input & Messages */}
          <div className="xl:col-span-2 space-y-8">
            {/* Input Box */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste a message here... (e.g. Flight to NYC at 3PM, Electricity bill of $40 due soon...)"
                className="w-full min-h-[120px] resize-none outline-none text-slate-700 bg-transparent placeholder:text-slate-300 text-lg"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2 text-slate-400">
                  <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><i className="fas fa-paperclip"></i></button>
                  <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><i className="fas fa-microphone"></i></button>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <><i className="fas fa-spinner fa-spin"></i> Analyzing...</>
                  ) : (
                    <><i className="fas fa-magic"></i> Extract Intel</>
                  )}
                </button>
              </div>
              {error && <p className="mt-3 text-red-500 text-sm font-medium"><i className="fas fa-exclamation-circle mr-1"></i> {error}</p>}
            </div>

            {/* Message List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedFilter} Messages ({filteredMessages.length})
                </h3>
              </div>
              {filteredMessages.length === 0 ? (
                <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <i className="fas fa-inbox text-2xl"></i>
                  </div>
                  <p className="text-slate-500 font-medium">No messages found in this category.</p>
                </div>
              ) : (
                filteredMessages.map(msg => (
                  <MessageCard key={msg.id} message={msg} />
                ))
              )}
            </div>
          </div>

          {/* Right: Stats & Insights */}
          <div className="space-y-8">
            <StatsPanel messages={messages} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
