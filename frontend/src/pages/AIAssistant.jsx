import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  Flame,
  Dumbbell,
  Heart,
  Scale
} from 'lucide-react';

const SUGGESTIONS = [
    "Why are soya chunks called the budget protein king?",
    "Should I eat whole eggs or only egg whites?",
    "How does Kollu (Horse Gram) boost fat loss & metabolism?",
    "Best high-protein South Indian breakfast under ₹20?",
    "Explain Good Fats (MUFA/PUFA) vs Saturated Fats"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Vanakkam & Welcome! I am your DHASA Nutrition AI Assistant. Ask me anything about Indian high-protein foods, budget meal planning, or Tamil nutrition wisdom!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const msg = textToSend || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.assistantChat(msg);
      setMessages(prev => [...prev, { sender: 'bot', text: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error connecting to assistant: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
          <Bot className="w-3.5 h-3.5" />
          <span>Intelligent Nutrition Education</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          DHASA Nutrition AI Assistant
        </h1>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                m.sender === 'user'
                  ? 'bg-slate-800 dark:bg-slate-700'
                  : 'bg-brand-500'
              }`}
            >
              {m.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-brand-500 text-white font-medium rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <span>AI Nutritionist thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about food nutrition, proteins, or fat facts..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}

