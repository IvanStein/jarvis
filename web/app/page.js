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
    <div className="flex h-screen bg-[#030303] text-zinc-200 font-sans font-light antialiased overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Ambient */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl z-20">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white tracking-wide text-lg">JARVIS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4">Workspace</p>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'chat' 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium text-sm">Terminal (Chat)</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Comando Central</span>
          </button>
        </nav>

        {/* Bottom Status */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <div>
               <p className="text-xs font-semibold text-white">Sistema Online</p>
               <p className="text-[10px] text-zinc-500">v4.0.0-alpha</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 w-full">
        
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/5 bg-[#050505]/90 backdrop-blur-md z-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">JARVIS</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`p-2 rounded-lg ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          </div>
        </header>

        {activeTab === 'chat' ? (
          <>
            {/* Top Bar for Chat */}
            <div className="hidden md:flex h-20 items-center px-8 border-b border-white/5 shrink-0 bg-[#050505]/30 backdrop-blur-sm">
              <div>
                <h1 className="text-xl font-medium text-white">Terminal AURA</h1>
                <p className="text-sm text-zinc-500">Interaja com os módulos especializados.</p>
              </div>
            </div>

            {/* Chat Feed */}
            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 scroll-smooth">
              <div className="max-w-3xl mx-auto space-y-10 pb-32">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-4 duration-500`} style={{animationDelay: `${idx * 20}ms`}}>
                    
                    {/* AVATAR */}
                    <div className="shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
                          <User className="w-5 h-5" />
                        </div>
                      ) : msg.role === 'system' ? (
                         <div className="w-10 h-10 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-md text-blue-400">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Name Plate */}
                      {msg.role !== 'system' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-zinc-400">
                            {msg.role === 'user' ? 'Você' : 'AURA IV'}
                          </span>
                          {msg.module && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/20">
                              {msg.module}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`text-[15px] leading-relaxed shadow-sm ${
                        msg.role === 'user' ? 'bg-zinc-800/80 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm border border-white/5' : 
                        msg.role === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-300 px-5 py-3.5 rounded-2xl' :
                        msg.role === 'system' ? 'text-zinc-500 italic text-sm' : 
                        'bg-transparent text-zinc-300 py-2' // AI response is flat for readability
                      }`}>
                        {msg.text}
                      </div>
                    </div>

                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 animate-in fade-in duration-300">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-zinc-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col justify-center gap-1.5">
                       <span className="text-xs font-semibold text-zinc-500">AURA IV COMPUTING</span>
                       <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Input Bar */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#030303] via-[#030303]/90 to-transparent pt-10 pb-6 px-4 md:px-8">
              <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl shadow-xl hover:border-white/20 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                  
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-4 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                  
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={isLearning ? "Indexando documento..." : "Envie uma mensagem..."}
                    className="flex-1 py-4 px-2 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-[15px]"
                  />
                  
                  <div className="p-2">
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="p-3 bg-white text-black hover:bg-zinc-200 disabled:bg-white/5 disabled:text-zinc-600 rounded-xl transition-all shadow-sm"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Dashboard Moderno */
          <main className="flex-1 overflow-y-auto w-full z-10 px-4 md:px-8 py-8 md:py-12">
            <div className="max-w-6xl mx-auto space-y-10">
              
              <div>
                 <h2 className="text-3xl tracking-tight font-semibold text-white">Comando Central</h2>
                 <p className="text-zinc-400 mt-2">Visão geral do sistema e configuração de agentes.</p>
              </div>

              {/* Stats - Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Cérebro Digital', value: dashboardData.totalKnowledge, desc: 'Fragmentos indexados', icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                  { label: 'Status da Rede', value: '100%', desc: 'Sistemas operacionais', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  { label: 'Identidade', value: 'Admin', desc: 'Sessão autorizada', icon: Settings2, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col p-6 bg-zinc-900/50 border border-white/5 rounded-3xl backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                       <div className={`p-3 rounded-2xl ${stat.bg} ${stat.border} border`}>
                         <stat.icon className={`w-6 h-6 ${stat.color}`} />
                       </div>
                       <span className="text-sm font-medium text-zinc-300">{stat.label}</span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-4xl font-semibold text-white tracking-tight">{stat.value}</h3>
                      <p className="text-sm text-zinc-500 mt-2">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specialists - Cards */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-medium text-white">Painel de Especialistas</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {((dashboardData.specialists && dashboardData.specialists.length > 0) ? dashboardData.specialists : [
                    { id: 'CODING', name: 'Software Engineer', icon: Zap, instruction: 'Otimização de código e arquitetura de sistemas avançados.' },
                    { id: 'FINANCE', name: 'Financial Analyst', icon: DollarSign, instruction: 'Análise de dados e projeções financeiras.' },
                    { id: 'HEALTH', name: 'Health Advisor', icon: Heart, instruction: 'Protocolos de saúde e bem-estar (experimental).' },
                    { id: 'PERSONAL', name: 'Personal Assistant', icon: Shield, instruction: 'Gestão de agenda e produtividade 10x.' },
                  ]).map((s, i) => (
                     <div key={i} className="flex flex-col p-6 bg-zinc-900 border border-white/5 rounded-3xl hover:border-white/10 hover:bg-zinc-800 transition-all group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-white/5 rounded-xl text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                          {(s.icon) ? <s.icon className="w-6 h-6"/> : <Bot className="w-6 h-6" />}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-zinc-600 uppercase border border-white/5 px-2 py-1 rounded bg-black/50">
                          {s.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-zinc-100 mb-2">{s.name}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                        {s.instruction}
                      </p>
                      <button className="w-full py-2.5 bg-white/5 hover:bg-white text-zinc-300 hover:text-black rounded-lg text-sm font-medium transition-colors">
                        Sintonizar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
