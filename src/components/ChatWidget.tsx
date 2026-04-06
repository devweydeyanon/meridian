'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! Welcome to Meridian Bank. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, session_id: sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        if (data.session_id) setSessionId(data.session_id);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 max-md:bottom-4 max-md:right-4 w-14 h-14 bg-navy-900 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer border-none hover:bg-navy-800 transition-all z-[90] group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cta-primary rounded-full text-[9px] font-bold flex items-center justify-center">1</span>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 max-md:bottom-0 max-md:right-0 max-md:left-0 max-md:top-0 w-[380px] max-md:w-full h-[520px] max-md:h-full bg-white rounded-xl max-md:rounded-none shadow-2xl border border-gray-200 flex flex-col z-[100] overflow-hidden">
          {/* Header */}
          <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold">Meridian Assistant</div>
                <div className="text-[10px] text-white/50 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="bg-transparent border-none text-white/60 cursor-pointer hover:text-white p-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-navy-900 text-white rounded-br-sm' : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 border border-gray-200 rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide bg-white">
              {['Check rates', 'Open account', 'Credit cards', 'Transfer help'].map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="px-3 py-1.5 text-[11px] font-medium text-accent-500 bg-accent-500/5 border border-accent-500/20 rounded-full cursor-pointer font-sans whitespace-nowrap hover:bg-accent-500/10 transition-all shrink-0">{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white flex gap-2 shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              className="flex-1 text-sm outline-none border border-gray-200 rounded-lg px-3.5 py-2.5 focus:border-navy-900 transition-all"
            />
            <button onClick={send} disabled={!input.trim() || loading} className="w-10 h-10 bg-navy-900 text-white rounded-lg flex items-center justify-center cursor-pointer border-none hover:bg-navy-800 disabled:opacity-40 transition-all shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
