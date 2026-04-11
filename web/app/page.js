'use client';

import { useState, useEffect, useRef } from 'react';
import styles from "./page.module.css";
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('anon');
  const messagesEndRef = useRef(null);

  // Carregar ou gerar ID do usuário
  useEffect(() => {
    let storedId = localStorage.getItem('aura_user_id');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('aura_user_id', storedId);
    }
    setUserId(storedId);
    loadHistory(storedId);
  }, []);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async (id) => {
    try {
      const response = await fetch(`/api/history?userId=${id}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const formatted = data.map(msg => ({
          role: msg.role,
          text: msg.content
        }));
        setMessages(formatted.length > 0 ? formatted : [
          { role: 'assistant', text: 'Olá! Eu sou a AURA. Como posso ajudar você hoje?' }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.error || 'Erro desconhecido na comunicação');
        error.debug = data.debug; // Anexar dados de debug ao erro
        throw error;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      let errorText = `Erro: ${error.message}`;
      
      // Adicionar informações de debug na tela se disponíveis
      if (error.debug) {
        const d = error.debug;
        errorText += `\n\n[DIAGNÓSTICO]`;
        errorText += `\n• Modelo: ${d.model}`;
        errorText += `\n• Chave no sistema: ${d.keyFound ? '✅ Encontrada' : '❌ NÃO ENCONTRADA'}`;
        if (d.envKeysFound?.length > 0) {
          errorText += `\n• Vars detectadas: ${d.envKeysFound.join(', ')}`;
        }
      }

      setMessages(prev => [...prev, { role: 'error', text: errorText }]);
      console.error('Chat Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Sparkles size={24} className={styles.icon} />
          <h1>AURA</h1>
        </div>
        <p>Assistente Universal Responsivo Autônomo</p>
      </header>

      <main className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={styles.avatar}>
                {msg.role === 'assistant' ? <Bot size={20} /> : 
                 msg.role === 'error' ? <Sparkles size={20} color="#ff4d4d" /> : 
                 <User size={20} />}
              </div>
              <div className={styles.bubble}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.avatar}><Bot size={20} /></div>
              <div className={styles.bubble}>...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? '...' : <Send size={20} />}
          </button>
        </form>
      </main>

      <footer className={styles.footer}>
        AURA Jarvis System • Memory Enabled • 2026
      </footer>
    </div>
  );
}
