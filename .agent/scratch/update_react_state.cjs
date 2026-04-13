const fs = require('fs');

let content = fs.readFileSync('web/app/page.js', 'utf8');

// 1. Add Trash2 icon
content = content.replace('Code, Calculator, Calendar, PenTool, Upload, File', 'Code, Calculator, Calendar, PenTool, Upload, File, Trash2');

// 2. Change DEFAULT_CONVERSATIONS
content = content.replace(
  /const DEFAULT_CONVERSATIONS = \[[\s\S]*?\];/,
  `const DEFAULT_CONVERSATIONS = [
  { id: '1', title: 'Análise de código', date: 'Hoje', messages: [{ id: 'welcome', role: 'assistant', content: 'Saudações, Ivan. O sistema está operacional.', module: 'CODING', timestamp: Date.now() }], module: 'CODING' },
];`
);

// 3. Remove [messages, setMessages] and derive messages
content = content.replace(
  /const \[messages, setMessages\] = useState\(\[\]\);/,
  ``
);

// Find "const activeConversation = conversations.find(c => c.id === activeConversationId);" and add messages derivation
content = content.replace(
  /const activeConversation = conversations\.find\(c => c\.id === activeConversationId\);/,
  `const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];`
);

// 4. Comment out both useEffects dealing with messages
content = content.replace(
  /useEffect\(\(\) => \{\s*if \(activeConversation && activeConversation\.messages\.length > 0\) \{[\s\S]*?\}\s*\}, \[activeConversationId, activeSpecialist\]\);/,
  `// messages now derived directly`
);

// 5. Add our helper function inside Home component, after the refs
content = content.replace(
  /const activeConversation = conversations\.find/,
  `const addMessageToActive = (convId, msg) => {
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

  const activeConversation = conversations.find`
);

// 6. Fix sendMessage
content = content.replace(
  /const sendMessage = async \(overrideText = null\) => \{[\s\S]*?const text = overrideText \|\| input;([\s\S]*?setIsLoading\(false\);\s*\n\s*\};)/,
  (match, inner) => {
    let newInner = inner.replace(/setMessages\(prev => \[\.\.\.prev, userMessage\]\);/, 'addMessageToActive(currentConvId, userMessage);');
    newInner = newInner.replace(/setMessages\(prev => \[\.\.\.prev, \{([^]*?)timestamp: Date\.now\(\)\s*\}\]\);/g, (m, payload) => {
      return `addMessageToActive(currentConvId, {\n${payload}\ntimestamp: Date.now()\n});`;
    });
    return `const sendMessage = async (overrideText = null) => {
    const text = overrideText || input;
    const currentConvId = activeConversationId;
    if (!currentConvId) return;
` + newInner;
  }
);

// 7. Fix handleFileUpload similarly
content = content.replace(
  /const handleFileUpload = async \(e\) => \{[\s\S]*?const file = e\.target\.files\?\.\[0\];([\s\S]*?\}\s*\};)/,
  (match, inner) => {
    let newInner = inner.replace(/setMessages\(prev => \[\.\.\.prev, \{([\s\S]*?)timestamp: Date\.now\(\)\s*\}\]\);/g, (m, payload) => {
      return `addMessageToActive(currentConvId, {\n${payload}\ntimestamp: Date.now()\n});`;
    });
    return `const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    const currentConvId = activeConversationId;
    if (!currentConvId) return;
` + newInner;
  }
);

// 8. Fix handleNewConversation
content = content.replace(
  /const handleNewConversation = \(\) => \{[\s\S]*?setSidebarOpen\(false\);\s*\};/,
  `const handleNewConversation = () => {
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
  };`
);

// 9. Now inject sidebar Nova Conversa button and Delete buttons
content = content.replace(
  /<div className="text-\[11px\] font-medium text-\[#71717a\] px-4 py-2 uppercase tracking-wider">Recentes<\/div>/,
  `<div className="flex items-center justify-between px-4 py-2">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Recentes</span>
            <button onClick={handleNewConversation} className="p-1 hover:bg-[#262626] rounded text-[#a1a1aa] hover:text-[#10A37F]" title="Nova Conversa">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>`
);

content = content.replace(
  /<span className="truncate flex-1">\{conv\.title\}<\/span>/,
  `<span className="truncate flex-1">{conv.title}</span>
                <button 
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3f3f46] rounded transition-all text-[#71717a] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>`
);

fs.writeFileSync('web/app/page.js', content, 'utf8');
console.log("Mutações completadas!");
