"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Paperclip, Loader2, LayoutDashboard, MessageSquare, Shield, Zap, Heart, DollarSign, Settings2, Database } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'dashboard'
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Saudações, Ivan. O sistema está operacional. Como posso auxiliá-lo hoje?', module: 'JARVIS' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [dashboardData, setDashboardData] = useState({ specialists: [], totalKnowledge: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setDashboardData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId: 'ivan_stein' }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response, module: data.module }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', text: 'Falha crítica na rede.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLearning(true);
    setMessages(prev => [...prev, { role: 'system', text: `Analisando: ${file.name}...` }]);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response, module: 'RAG' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'error', text: 'Falha no processamento do arquivo.' }]);
    } finally {
      setIsLearning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-slate-900/20 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              JARVIS <span className="text-blue-500">AURA IV</span>
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav className="flex bg-slate-800/40 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-bold">Protocolo Chat</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-bold">Comando Central</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online</span>
        </div>
      </header>

      {activeTab === 'chat' ? (
        <>
          {/* Chat Container */}
          <main className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`p-3 rounded-2xl shrink-0 shadow-2xl ${
                    msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 
                    msg.role === 'system' ? 'bg-amber-500/20' : 'bg-slate-800/80 border border-white/5'
                  }`}>
                    {msg.role === 'user' ? <User className="w-6 h-6" /> : 
                     msg.role === 'system' ? <Loader2 className="w-6 h-6 animate-spin text-amber-500" /> :
                     <Bot className="w-6 h-6 text-blue-400" />}
                  </div>
                  <div className={`max-w-[85%] rounded-[2rem] p-6 backdrop-blur-md shadow-2xl relative ${
                    msg.role === 'user' ? 'bg-blue-600/90 text-white rounded-tr-none' : 
                    msg.role === 'error' ? 'bg-red-900/20 border border-red-500/50 text-red-100' :
                    msg.role === 'system' ? 'bg-amber-500/5 border border-amber-500/20 text-amber-200 italic text-sm' :
                    'bg-slate-900/80 border border-white/10 text-slate-100 rounded-tl-none'
                  }`}>
                    {msg.module && (
                      <div className="absolute top-[-10px] left-8 px-3 py-0.5 bg-blue-500 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-xl">
                        {msg.module}
                      </div>
                    )}
                    <span className="leading-relaxed leading-7">{msg.text}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 ml-16">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>
          </main>

          {/* Chat Footer */}
          <footer className="p-8 bg-slate-950/50 backdrop-blur-2xl border-t border-white/5 z-50">
            <div className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative flex items-center group">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute left-4 p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                >
                  <Paperclip className="w-6 h-6" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isLearning ? "Sincronizando conhecimento..." : "Digite uma instrução para o sistema..."}
                  className="w-full pl-16 pr-6 py-5 bg-slate-900/50 border border-white/10 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-lg"
                />
              </div>
              <button
                onClick={sendMessage}
                className="p-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 group"
              >
                <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </footer>
        </>
      ) : (
        /* Dashboard Container */
        <main className="flex-1 overflow-y-auto p-12 z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl relative group hover:border-blue-500/30 transition-all">
                <div className="absolute top-8 right-8 p-3 bg-blue-500/10 rounded-2xl"><Database className="text-blue-400" /></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cérebro Digital</p>
                <h3 className="text-5xl font-black mt-2">{dashboardData.totalKnowledge}</h3>
                <p className="text-slate-500 text-sm mt-1">Fragmentos de Conhecimento RAG</p>
              </div>
              <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl relative group hover:border-emerald-500/30 transition-all">
                <div className="absolute top-8 right-8 p-3 bg-emerald-500/10 rounded-2xl"><Zap className="text-emerald-400" /></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Estado dos Módulos</p>
                <h3 className="text-5xl font-black mt-2">100%</h3>
                <p className="text-slate-500 text-sm mt-1">Eficiência de Resposta</p>
              </div>
              <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl relative group hover:border-purple-500/30 transition-all">
                <div className="absolute top-8 right-8 p-3 bg-purple-500/10 rounded-2xl"><Settings2 className="text-purple-400" /></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ivan Stein</p>
                <h3 className="text-5xl font-black mt-2 uppercase">Alpha</h3>
                <p className="text-slate-500 text-sm mt-1">Nível de Acesso do Usuário</p>
              </div>
            </div>

            {/* Specialist Cards */}
            <h2 className="text-3xl font-black text-white px-2">Especialistas Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.specialists.map((s, i) => (
                <div key={i} className="group relative bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 transition-all hover:-translate-y-2 overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-[50px] group-hover:bg-blue-600/20 transition-all"></div>
                  
                  <div className="p-4 bg-slate-800 rounded-[1.5rem] w-fit mb-6 ring-1 ring-white/10">
                    {s.id === 'CODING' && <Zap className="text-blue-400" />}
                    {s.id === 'FINANCE' && <DollarSign className="text-emerald-400" />}
                    {s.id === 'HEALTH' && <Heart className="text-rose-400" />}
                    {s.id === 'PERSONAL' && <Shield className="text-purple-400" />}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">{s.name}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{s.id}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
                    {s.instruction}
                  </p>

                  <button className="w-full py-4 bg-slate-800 hover:bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                    Calibrar Módulo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
