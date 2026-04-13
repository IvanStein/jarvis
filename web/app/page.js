"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, User, Bot, Paperclip, Loader2, 
  MessageSquare, Plus, ChevronDown, Copy, Check, 
  MoreHorizontal, Pencil, Trash2, ArrowUpRight,
  Menu, X, Settings, Zap, Database, Shield, DollarSign, Heart, Stethoscope
} from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', icon: Bot },
  { id: 'gemini-pro', name: 'Gemini Pro', icon: Zap },
];

const DEFAULT_CONVERSATIONS = [
  { id: '1', title: 'Análise de código', date: 'Hoje', messages: [], module: 'CODING' },
  { id: '2', title: 'Revisão de arquitetura', date: 'Ontem', messages: [], module: 'FINANCE' },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState(DEFAULT_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      setMessages(activeConversation.messages);
    } else {
      setMessages([{ 
        id: 'welcome', 
        role: 'assistant', 
        content: 'Saudações, Ivan. O sistema está operacional. Como posso auxiliá-lo hoje?', 
        module: 'JARVIS',
        timestamp: Date.now() 
      }]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

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
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'assistant', 
        content: data.response, 
        module: data.module || 'JARVIS',
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'error', 
        content: 'Falha crítica na rede.', 
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'Nova conversa',
      date: 'Agora',
      messages: [],
      module: 'JARVIS'
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([{ 
      id: 'welcome', 
      role: 'assistant', 
      content: 'Sistema inicializado. Aguardando comando.', 
      module: 'JARVIS',
      timestamp: Date.now() 
    }]);
    setSidebarOpen(false);
  };

  const handleCopyMessage = (msgId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getModuleIcon = (module) => {
    const icons = {
      'CODING': Zap,
      'FINANCE': DollarSign,
      'HEALTH': Heart,
      'MEDICAL': Stethoscope,
      'RAG': Database,
      'JARVIS': Sparkles,
    };
    const Icon = icons[module] || Bot;
    return <Icon className="w-3 h-3" />;
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-[#ededed] overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed md:relative z-50 h-full w-[280px] bg-[#131313] flex flex-col border-r border-[#27272a] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4">
          <button 
            onClick={handleNewConversation}
            className="w-full flex items-center gap-3 bg-[#10A37F] hover:brightness-110 py-3 px-4 rounded-xl transition-all text-white font-medium text-sm shadow-lg shadow-[#10A37F]/20"
          >
            <Plus className="w-5 h-5" />
            Nova conversa
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="text-[11px] font-medium text-[#71717a] px-4 py-2 uppercase tracking-wider">Recentes</div>
          <div className="space-y-1">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setActiveConversationId(conv.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left group ${
                  activeConversationId === conv.id 
                    ? 'bg-[#262626] text-white' 
                    : 'text-[#a1a1aa] hover:bg-[#1f1f22] hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0 opacity-60" />
                <span className="truncate flex-1">{conv.title}</span>
                <MoreHorizontal className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-60" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#27272a]">
          <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1f1f22] rounded-lg cursor-pointer transition-colors group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#10A37F] to-[#0d8a66] rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Ivan</div>
              <div className="text-xs text-[#71717a] truncate">Admin_Root</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#0e0e0e]">
        
        {/* Header */}
        <header className="h-14 border-b border-[#27272a] flex items-center justify-between px-4 md:px-6 shrink-0 bg-[#0e0e0e]/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-[#262626] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-[15px] font-semibold truncate max-w-[250px] md:max-w-none flex items-center gap-2">
              {activeConversation?.title || 'Nova conversa'}
              {activeConversation?.module && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#262626] text-[#10A37F]">
                  {activeConversation.module}
                </span>
              )}
            </h1>
          </div>

          <div className="relative">
            <button 
              onClick={() => setModelMenuOpen(!modelMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1f1f22] hover:bg-[#262626] rounded-lg transition-colors text-[13px] border border-[#27272a]"
            >
              <Sparkles className="w-4 h-4 text-[#10A37F]" />
              <span className="hidden sm:inline">{selectedModel.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
            </button>
            
            {modelMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#1f1f22] rounded-xl shadow-2xl border border-[#27272a] overflow-hidden z-50">
                {MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model); setModelMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#262626] transition-colors ${selectedModel.id === model.id ? 'bg-[#262626]' : ''}`}
                  >
                    <model.icon className="w-4 h-4 text-[#10A37F]" />
                    <span className="font-medium text-sm">{model.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-0">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-[#5436DA] to-[#4328b8]' 
                    : msg.role === 'error'
                    ? 'bg-red-500'
                    : 'bg-gradient-to-br from-[#10A37F] to-[#0d8a66]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : msg.role === 'error' ? (
                    <X className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'max-w-[85%]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13px] font-semibold">
                      {msg.role === 'user' ? 'Você' : msg.role === 'error' ? 'Erro' : 'JARVIS'}
                    </span>
                    {msg.module && msg.role !== 'user' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#10A37F]/20 text-[#10A37F] flex items-center gap-1">
                        {getModuleIcon(msg.module)}
                        {msg.module}
                      </span>
                    )}
                  </div>

                  <div className={`text-[15px] leading-[1.6] whitespace-pre-wrap ${
                    msg.role === 'error' ? 'text-red-400 font-medium' : ''
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 mt-2">
                      <button 
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                        title="Copiar"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-4 h-4 text-[#10A37F]" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#71717a]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10A37F] to-[#0d8a66] flex items-center justify-center shrink-0 shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1 py-2">
                  <div className="w-2 h-2 bg-[#10A37F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#10A37F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#10A37F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:px-6 pb-6 md:pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-[#1f1f22] rounded-xl border border-[#27272a] focus-within:border-[#10A37F] focus-within:ring-1 focus-within:ring-[#10A37F]/30 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Aguardando comando..."
                rows={1}
                className="w-full bg-transparent text-white placeholder-[#71717a] px-4 py-3 pr-14 resize-none focus:outline-none text-[15px] max-h-[200px]"
              />
              
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-[#10A37F] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-[#10A37F]/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-[#52525b] mt-3">
              AURA_OS v1.0 • Sistema Neural Ativo
            </p>
          </div>
        </div>
      </main>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
