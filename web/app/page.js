'use client';

import { useState } from 'react';
import styles from "./page.module.css";
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Olá! Eu sou a AURA. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Desculpe, ocorreu um erro na comunicação.' }]);
      console.error(error);
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
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
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
        Deploy Pronto para Vercel • 2026
      </footer>
    </div>
  );
}
