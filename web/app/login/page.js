'use client'

import React, { useState } from 'react'
import { login, signup } from './actions'
import './style.css'

export default function LoginPage({ searchParams }) {
  const [isLogin, setIsLogin] = useState(true)
  const error = searchParams?.error

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">AURA</h1>
        <p className="login-subtitle">
          {isLogin ? 'Bem-vindo de volta, Jarvis.' : 'Iniciando novo protocolo de acesso.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required placeholder="tony@stark.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>

          <button 
            formAction={isLogin ? login : signup} 
            className="login-button"
          >
            {isLogin ? 'Acessar Sistema' : 'Criar Conta'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#3a7bd5', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Não tem acesso? Registrar' : 'Já possui conta? Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
