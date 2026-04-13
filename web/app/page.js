"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, User, Bot, Loader2, 
  MessageSquare, Plus, ChevronDown, Copy, Check, 
  Menu, X, Zap, Database, Heart, Stethoscope, Brain, Settings2, Save, 
  LayoutDashboard, Activity, BookOpen, FileText, Footprints, PlaySquare, Share2,
  Code, Calculator, Calendar, PenTool, Upload, File, Trash2
} from 'lucide-react';

const MODELS = [
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', icon: Zap },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', icon: Brain },
];

const SPECIALIST_TEMPLATES = [
  { id: 'CODING', name: 'Sintaxe', description: 'Desenvolvimento de software, arquitetura e revisão de código.', icon: Code, instruction: 'Você é Sintaxe, o módulo de engenharia da AURA. Sua prioridade é código limpo, performance e segurança. Responda com precisão técnica e exemplos de código quando necessário.' },
  { id: 'FINANCE', name: 'Oracle', description: 'Gestão financeira, investimentos e análise de mercado.', icon: Calculator, instruction: 'Você é Oracle, o módulo financeiro da AURA. Sua prioridade é análise de dados, projeções de gastos e estratégias de investimento. Seja cauteloso e analítico.' },
  { id: 'HEALTH', name: 'Vital', description: 'Saúde, biohacking, sono e performance física.', icon: Heart, instruction: 'Você é Vital, o módulo de performance humana da AURA. Sua prioridade é otimização biológica, treinos, dieta e sono. Foco em evidências científicas e bem-estar.' },
  { id: 'PERSONAL', name: 'Lumen', description: 'Gestão de tempo, rotina e produtividade pessoal.', icon: Calendar, instruction: 'Você é Lumen, o módulo de logística pessoal da AURA. Sua prioridade é otimizar a rotina, gerenciar tarefas e garantir foco.' },
  { id: 'BOOKS', name: 'Bibliotecário', description: 'Análise e resumo de livros.', icon: BookOpen, instruction: 'Você é o Bibliotecário, especialista em análise de livros. Resume obras, identifica temas principais, personagens e filosofias. Seja analítico e profundidade.' },
  { id: 'ACADEMIC', name: 'Academia', description: 'Leitura e análise de artigos científicos.', icon: FileText, instruction: 'Você é Academia, especialista em papers científicos. Analise metodologias, resultados, conclusões. Traduza linguagem técnica para compreensão clara.' },
  { id: 'RUNNING', name: 'Corredor', description: 'Auxiliar para corrida de rua - treinos, nutrição, recuperação.', icon: Footprints, instruction: 'Você é o Corredor, especialista em corrida de rua. Ajude com planos de treino, nutrição para corredores, prevenção de lesões e recuperação.' },
  { id: 'YOUTUBE', name: 'YouTube', description: 'Transcreve e resume vídeos do YouTube.', icon: PlaySquare, instruction: 'Você é o módulo YouTube. Quando receber um link, extraia a transcrição e resuma os pontos principais. Formate de forma clara.' },
  { id: 'SOCIAL', name: 'Social', description: 'Cria notícias e posts para redes sociais.', icon: Share2, instruction: 'Você é Social, especialista em conteúdo para redes sociais. Crie posts atrativos, notícias engajantes. Formate com emojis adequado, CTAs e tags relevantes.' },
];

const DEFAULT_CONVERSATIONS = [
  { id: '1', title: 'Análise de código', date: 'Hoje', messages: [{ id: 'welcome', role: 'assistant', content: 'Saudações, Ivan. O sistema está operacional.', module: 'CODING', timestamp: Date.now() }], module: 'CODING' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState(DEFAULT_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState('1');
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [specialists, setSpecialists] = useState(SPECIALIST_TEMPLATES);
  const [activeSpecialist, setActiveSpecialist] = useState(null);
  const [editingSpecialist, setEditingSpecialist] = useState(null);
  const [specialistInstruction, setSpecialistInstruction] = useState('');
  const [dashboardData, setDashboardData] = useState({ specialists: [], totalKnowledge: 0, systemStatus: 'loading' });
  const [isTraining, setIsTraining] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newSpecialist, setNewSpecialist] = useState({ name: '', description: '', instruction: '' });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const addMessageToActive = (convId, msg) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        let newTitle = c.title;
        if ((newTitle === 'Nova conversa' || !newTitle) && msg.role === 'user') {
          newTitle = msg.content.substring(0, 20) + (msg.content.length > 20 ? '...' : '');
        }
        return { ...c, title: newTitle, messages: [...c.messages, msg] };
      }
      return c;
    }));
  };

  const handleDeleteConversation = (e, id) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeConversationId === id) {
        setActiveConversationId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    fetchHistory();
    if (activeTab === 'dashboard') {
      fetchDashboard();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/history?userId=ivan_stein&conversationId=${activeConversationId}`);
      if (res.ok) {
        const messages = await res.json();
        if (Array.isArray(messages)) {
          const mappedMessages = messages.map(m => ({
            id: Math.random().toString(),
            role: m.role,
            content: m.content,
            timestamp: Date.now(),
            module: m.role === 'assistant' ? 'Histórico' : null
          }));
          
          setConversations(prev => {
            const newConversations = [...prev];
            const index = newConversations.findIndex(c => c.id === activeConversationId);
            if (index !== -1) {
              newConversations[index] = {
                ...newConversations[index],
                messages: mappedMessages.length > 0 ? mappedMessages : newConversations[index].messages
              };
            }
            return newConversations;
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
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

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        console.error('Falha ao carregar dashboard:', res.status);
        setDashboardData({ specialists: [], totalKnowledge: 0, systemStatus: 'offline' });
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setDashboardData({ specialists: [], totalKnowledge: 0, systemStatus: 'error' });
    }
  };

  const sendMessage = async (overrideText = null) => {
    const text = (typeof overrideText === 'string') ? overrideText : input;
    const currentConvId = activeConversationId;
    if (!currentConvId || !text.trim() || isLoading) return;

    // Detectar links YouTube na mensagem
    const youtubeRegex = /(youtube\.com|youtu\.be)[^\s]*/gi;
    const hasYoutubeLink = youtubeRegex.test(text);

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    addMessageToActive(currentConvId, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          userId: 'ivan_stein',
          conversationId: activeConversationId
        }),
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Erro ${response.status}: Falha na API`);
        }
        
        addMessageToActive(currentConvId, { 
          id: (Date.now() + 1).toString(),
          role: 'assistant', 
          content: data.response, 
          module: data.module || activeSpecialist?.id || 'JARVIS',
          timestamp: Date.now()
        });
      } else {
        const errorText = await response.text();
        console.error('Resposta não-JSON recebida:', errorText.substring(0, 200));
        throw new Error(`Erro ${response.status}: O servidor retornou HTML em vez de JSON. Verifique se as rotas da API estão operacionais.`);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      addMessageToActive(currentConvId, { 
        id: (Date.now() + 1).toString(),
        role: 'error', 
        content: error.message || 'Falha crítica na rede.', 
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'Nova conversa',
      date: 'Agora',
      messages: [{ 
        id: 'welcome', 
        role: 'assistant', 
        content: 'Sistema inicializado. Aguardando comando.', 
        module: activeSpecialist?.id || 'JARVIS',
        timestamp: Date.now() 
      }],
      module: activeSpecialist?.id || 'JARVIS'
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setSidebarOpen(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    const currentConvId = activeConversationId;
    if (!currentConvId) return;

    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Apenas arquivos PDF são suportados');
      return;
    }

    setIsUploading(true);
    addMessageToActive(currentConvId, {

      id: Date.now().toString(),
      role: 'system',
      content: `📚 Processando "${file.name}"...`,
      
timestamp: Date.now()
});

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar PDF');
      }

      addMessageToActive(currentConvId, {

        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Arquivo processado com sucesso!',
        module: 'RAG',
        
timestamp: Date.now()
});
    } catch (error) {
      console.error('Erro no upload:', error);
      addMessageToActive(currentConvId, {

        id: (Date.now() + 1).toString(),
        role: 'error',
        content: error.message || 'Erro ao processar arquivo',
        
timestamp: Date.now()
});
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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

  const handleEditSpecialist = (specialist) => {
    setEditingSpecialist(specialist);
    setSpecialistInstruction(specialist.instruction);
  };

  const handleSaveSpecialist = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          specialistId: editingSpecialist.id, 
          instruction: specialistInstruction 
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao treinar');
      }

      setSpecialists(prev => prev.map(s => 
        s.id === editingSpecialist.id ? { ...s, instruction: specialistInstruction } : s
      ));
      
      setEditingSpecialist(null);
      setSpecialistInstruction('');
      alert(`✅ ${editingSpecialist.name} treinado com sucesso!`);
    } catch (error) {
      alert('Erro ao treinar especialista: ' + error.message);
    } finally {
      setIsTraining(false);
    }
  };

  const handleCreateSpecialist = () => {
    const id = newSpecialist.name.toUpperCase().replace(/\s+/g, '_');
    const newSpec = {
      id,
      name: newSpecialist.name,
      description: newSpecialist.description,
      icon: PenTool,
      instruction: newSpecialist.instruction || `Você é ${newSpecialist.name}, especialista em ${newSpecialist.description}. Ajude com precisão e expertise.`
    };
    setSpecialists(prev => [...prev, newSpec]);
    setShowCreateModal(false);
    setNewSpecialist({ name: '', description: '', instruction: '' });
  };

  const handleSelectTemplate = (template) => {
    setNewSpecialist({
      name: template.name,
      description: template.description,
      instruction: template.instruction
    });
  };

  const getModuleIcon = (module) => {
    const icons = {
      'CODING': Code,
      'FINANCE': Calculator,
      'HEALTH': Heart,
      'MEDICAL': Stethoscope,
      'PERSONAL': Calendar,
      'BOOKS': BookOpen,
      'ACADEMIC': FileText,
      'RUNNING': Footprints,
      'YOUTUBE': PlaySquare,
      'SOCIAL': Share2,
      'JARVIS': Sparkles,
    };
    const Icon = icons[module] || Bot;
    return <Icon className="w-3 h-3" />;
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-[#ededed] overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed md:relative z-50 h-full w-[280px] bg-[#131313] flex flex-col border-r border-[#27272a] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-white font-medium text-sm ${
              activeTab === 'chat' 
                ? 'bg-[#10A37F] shadow-lg shadow-[#10A37F]/20' 
                : 'bg-[#262626] hover:bg-[#2f2f2f] border border-[#27272a]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-white font-medium text-sm ${
              activeTab === 'dashboard' 
                ? 'bg-[#10A37F] shadow-lg shadow-[#10A37F]/20' 
                : 'bg-[#262626] hover:bg-[#2f2f2f] border border-[#27272a]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Recentes</span>
            <button onClick={handleNewConversation} className="p-1 hover:bg-[#262626] rounded text-[#a1a1aa] hover:text-[#10A37F]" title="Nova Conversa">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
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
                <button 
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3f3f46] rounded transition-all text-[#71717a] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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

      {/* --- MODAL CRIAR ESPECIALISTA --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-2xl bg-[#1f1f22] rounded-2xl border border-[#27272a] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#10A37F]" />
                Criar Novo Especialista
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-[#262626] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-[#a1a1aa] mb-4">Escolha um template ou crie do zero:</p>
              
              {/* Templates */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {SPECIALIST_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      newSpecialist.name === tpl.name 
                        ? 'border-[#10A37F] bg-[#10A37F]/10' 
                        : 'border-[#27272a] hover:border-[#3f3f46] bg-[#262626]'
                    }`}
                  >
                    <tpl.icon className="w-5 h-5 text-[#10A37F] mb-1" />
                    <div className="text-sm font-medium">{tpl.name}</div>
                    <div className="text-xs text-[#71717a] truncate">{tpl.description}</div>
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#71717a] block mb-1">Nome</label>
                  <input
                    type="text"
                    value={newSpecialist.name}
                    onChange={(e) => setNewSpecialist(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do especialista"
                    className="w-full bg-[#0e0e0e] border border-[#27272a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#10A37F]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#71717a] block mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newSpecialist.description}
                    onChange={(e) => setNewSpecialist(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="O que este especialista faz?"
                    className="w-full bg-[#0e0e0e] border border-[#27272a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#10A37F]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#71717a] block mb-1">Instruções</label>
                  <textarea
                    value={newSpecialist.instruction}
                    onChange={(e) => setNewSpecialist(prev => ({ ...prev, instruction: e.target.value }))}
                    placeholder="Instruções personalizadas..."
                    rows={4}
                    className="w-full bg-[#0e0e0e] border border-[#27272a] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#10A37F]"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 text-sm bg-[#262626] hover:bg-[#2f2f2f] rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreateSpecialist}
                  disabled={!newSpecialist.name}
                  className="flex-1 py-2.5 text-sm bg-[#10A37F] hover:brightness-110 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {activeTab === 'dashboard' ? 'Dashboard' : (activeConversation?.title || 'Nova conversa')}
              {activeSpecialist && activeTab !== 'dashboard' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#10A37F]/20 text-[#10A37F] flex items-center gap-1">
                  {getModuleIcon(activeSpecialist.id)}
                  {activeSpecialist.name}
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'chat' && (
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1f1f22] hover:bg-[#262626] rounded-lg transition-colors text-[13px] border border-[#27272a]"
              >
                <Brain className="w-4 h-4 text-[#10A37F]" />
                <span className="hidden sm:inline">Especialistas</span>
              </button>
            )}
            
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
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#262626] transition-colors"
                    >
                      <model.icon className="w-4 h-4 text-[#10A37F]" />
                      <span className="font-medium text-sm">{model.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          
          {/* --- DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <div className="p-6 max-w-5xl mx-auto">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#1f1f22] rounded-xl p-5 border border-[#27272a]">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#10A37F]" />
                    <span className="text-xs text-[#71717a] uppercase tracking-wider">Status</span>
                  </div>
                  <div className="text-2xl font-bold text-[#10A37F]">{dashboardData.systemStatus === 'online' ? 'Online' : 'Offline'}</div>
                </div>
                <div className="bg-[#1f1f22] rounded-xl p-5 border border-[#27272a]">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-[#10A37F]" />
                    <span className="text-xs text-[#71717a] uppercase tracking-wider">Especialistas</span>
                  </div>
                  <div className="text-2xl font-bold">{specialists.length}</div>
                </div>
                <div className="bg-[#1f1f22] rounded-xl p-5 border border-[#27272a]">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-[#10A37F]" />
                    <span className="text-xs text-[#71717a] uppercase tracking-wider">Documentos RAG</span>
                  </div>
                  <div className="text-2xl font-bold">{dashboardData.totalKnowledge}</div>
                </div>
              </div>

              {/* Header com botão criar */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#10A37F]" />
                  Meus Especialistas
                </h2>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10A37F] hover:brightness-110 text-white rounded-lg text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Criar Especialista
                </button>
              </div>
              
              {/* Especialistas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialists.map(spec => (
                  <div 
                    key={spec.id}
                    className="bg-[#1f1f22] rounded-xl border border-[#27272a] overflow-hidden"
                  >
                    <div className="p-4 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#262626] flex items-center justify-center shrink-0">
                        <spec.icon className="w-6 h-6 text-[#10A37F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{spec.name}</h3>
                          <span className="text-xs text-[#71717a] bg-[#262626] px-2 py-0.5 rounded">{spec.id}</span>
                        </div>
                        <p className="text-sm text-[#a1a1aa] mb-2">{spec.description}</p>
                        <button 
                          onClick={() => handleEditSpecialist(spec)}
                          className="text-xs text-[#10A37F] hover:underline flex items-center gap-1"
                        >
                          <Settings2 className="w-3 h-3" />
                          Editar / Treinar
                        </button>
                      </div>
                    </div>

                    {editingSpecialist?.id === spec.id && (
                      <div className="p-4 bg-[#0e0e0e] border-t border-[#27272a]">
                        <label className="text-xs text-[#71717a] mb-2 block">Instruções do especialista:</label>
                        <textarea
                          value={specialistInstruction}
                          onChange={(e) => setSpecialistInstruction(e.target.value)}
                          className="w-full bg-[#1f1f22] border border-[#27272a] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#10A37F]"
                          rows={6}
                        />
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => setEditingSpecialist(null)}
                            className="flex-1 py-2 text-sm bg-[#262626] hover:bg-[#2f2f2f] rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={handleSaveSpecialist}
                            disabled={isTraining}
                            className="flex-1 py-2 text-sm bg-[#10A37F] hover:brightness-110 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isTraining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Salvar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CHAT --- */}
          {activeTab === 'chat' && (
            <>
              <div className="px-4 py-6 md:px-0">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-[#5436DA] to-[#4328b8]' 
                          : msg.role === 'error'
                          ? 'bg-red-500'
                          : msg.role === 'system'
                          ? 'bg-[#262626] border border-[#27272a]'
                          : 'bg-gradient-to-br from-[#10A37F] to-[#0d8a66]'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : msg.role === 'error' ? (
                          <X className="w-4 h-4 text-white" />
                        ) : msg.role === 'system' ? (
                          <Loader2 className="w-4 h-4 text-[#71717a] animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

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

              {/* Input */}
              <div className="p-4 md:px-6 pb-6 md:pb-8">
                <div className="max-w-3xl mx-auto">
                  <div className="relative bg-[#1f1f22] rounded-xl border border-[#27272a] focus-within:border-[#10A37F] focus-within:ring-1 focus-within:ring-[#10A37F]/30 transition-all">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute left-2 bottom-2 p-2 text-[#71717a] hover:text-[#10A37F] hover:bg-[#262626] rounded-lg transition-all disabled:opacity-40"
                      title="Enviar PDF"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                    
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={activeSpecialist ? `Pergunte ao ${activeSpecialist.name}...` : "Aguardando comando..."}
                      rows={1}
                      className="w-full bg-transparent text-white placeholder-[#71717a] px-12 py-3 pr-14 resize-none focus:outline-none text-[15px] max-h-[200px]"
                    />
                    
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 bottom-2 p-2 bg-[#10A37F] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-[#10A37F]/20"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
