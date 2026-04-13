"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, Sparkles, User, Bot, Paperclip, Loader2, 
  MessageSquare, Plus, ChevronDown, Copy, Check, 
  MoreHorizontal, Pencil, Trash2, ArrowUpRight,
  Menu, X, Settings, Zap
} from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'Mais capaz' },
  { id: 'gpt-4o-mini', name: 'GPT-4o mini', desc: 'Rápido' },
  { id: 'claude-3-5', name: 'Claude 3.5', desc: 'Equilibrado' },
  { id: 'gemini-pro', name: 'Gemini Pro', desc: 'Multimodal' },
];

const DEFAULT_CONVERSATIONS = [
  { id: '1', title: 'Análise de código Python', date: 'Hoje', messages: [] },
  { id: '2', title: 'Revisão de arquitetura', date: 'Ontem', messages: [] },
  { id: '3', title: 'Dúvidas sobre React', date: '3 dias atrás', messages: [] },
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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      setMessages(activeConversation.messages);
    } else {
      setMessages([
        { id: 'welcome', role: 'assistant', content: 'Como posso ajudar você hoje?', model: selectedModel.id, timestamp: Date.now() }
      ]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (overrideText = null) => {
    const text = overrideText || input;
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setEditingMessageId(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userId: 'ivan_stein', model: selectedModel.id }),
      });
      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        model: data.module || selectedModel.id,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: 'Erro ao conectar. Tente novamente.',
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
      messages: []
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([{ id: 'welcome', role: 'assistant', content: 'Como posso ajudar você hoje?', model: selectedModel.id, timestamp: Date.now() }]);
    setSidebarOpen(false);
  };

  const handleEditMessage = (msgId, newContent) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: newContent } : m));
    setEditingMessageId(null);
  };

  const handleCopyMessage = (msgId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleRegenerate = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setMessages(prev => prev.filter(m => m.id !== lastUserMessage.id));
      await handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex h-screen bg-[#171717] text-white overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed md:relative z-50 h-full w-72 bg-[#202020] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4">
          <button 
            onClick={handleNewConversation}
            className="w-full flex items-center gap-3 bg-[#2A2A2A] hover:bg-[#2F2F2F] py-3 px-4 rounded-xl transition-colors text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Nova conversa
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="text-xs font-medium text-[#8E8E8E] px-4 py-2 uppercase">Recentes</div>
          <div className="space-y-1">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setActiveConversationId(conv.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  activeConversationId === conv.id 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'text-[#8E8E8E] hover:bg-[#2A2A2A] hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
                <MoreHorizontal className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#2F2F2F]">
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#2A2A2A] rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-[#10A37F] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Ivan</div>
              <div className="text-xs text-[#8E8E8E]">Pro</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#171717]">
        
        {/* Header */}
        <header className="h-14 border-b border-[#2F2F2F] flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold truncate max-w-[200px] md:max-w-none">
              {activeConversation?.title || 'Nova conversa'}
            </h1>
          </div>

          <div className="relative">
            <button 
              onClick={() => setModelMenuOpen(!modelMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2A2A2A] hover:bg-[#343434] rounded-lg transition-colors text-sm"
            >
              <Zap className="w-4 h-4 text-[#10A37F]" />
              <span className="hidden sm:inline">{selectedModel.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {modelMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#2A2A2A] rounded-xl shadow-lg border border-[#3F3F3F] overflow-hidden z-50">
                {MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model); setModelMenuOpen(false); }}
                    className={`w-full flex flex-col items-start px-4 py-3 hover:bg-[#343434] transition-colors ${selectedModel.id === model.id ? 'bg-[#343434]' : ''}`}
                  >
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-[#8E8E8E]">{model.desc}</span>
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[#5436DA]' : 'bg-[#10A37F]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'max-w-[85%]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {msg.role === 'user' ? 'Você' : msg.role === 'error' ? 'Erro' : 'ChatGPT'}
                    </span>
                    {msg.model && msg.role !== 'user' && (
                      <span className="text-xs text-[#8E8E8E]">{msg.model}</span>
                    )}
                  </div>

                  {editingMessageId === msg.id ? (
                    <div className="flex gap-2">
                      <textarea
                        defaultValue={msg.content}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleEditMessage(msg.id, e.target.value);
                          }
                          if (e.key === 'Escape') setEditingMessageId(null);
                        }}
                        className="flex-1 bg-[#2A2A2A] rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#10A37F]"
                        rows={3}
                      />
                      <button 
                        onClick={() => {
                          const textarea = document.querySelector('textarea');
                          handleEditMessage(msg.id, textarea.value);
                        }}
                        className="self-end px-3 py-2 bg-[#10A37F] text-white rounded-lg text-sm"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'error' ? 'text-red-400' : ''
                      }`}>
                        {msg.content}
                      </div>

                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 mt-2">
                          <button 
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1.5 hover:bg-[#2A2A2A] rounded transition-colors"
                            title="Copiar"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-4 h-4 text-[#10A37F]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => setEditingMessageId(msg.id)}
                            className="p-1.5 hover:bg-[#2A2A2A] rounded transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#10A37F] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#8E8E8E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#8E8E8E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#8E8E8E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:px-6 pb-6 md:pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-[#2A2A2A] rounded-xl border border-[#3F3F3F] focus-within:border-[#10A37F] transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Enviar mensagem..."
                rows={1}
                className="w-full bg-transparent text-white placeholder-[#8E8E8E] px-4 py-3 pr-12 resize-none focus:outline-none text-[15px]"
                style={{ maxHeight: '200px' }}
              />
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-[#10A37F] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            <p className="text-center text-xs text-[#8E8E8E] mt-3">
              O ChatGPT pode cometer erros. Verifique informações importantes.
            </p>
          </div>
        </div>
      </main>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
