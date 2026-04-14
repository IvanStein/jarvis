document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toggleAuth = document.getElementById('toggleAuth');
    const authTitle = document.querySelector('.headline-lg');
    const submitBtnText = document.querySelector('.btn-text');
    const toggleText = document.querySelector('.auth-toggle-text');
    
    let isLoginMode = true;

    // Toggle between Login and Signup
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            authTitle.innerText = 'Terminal';
            submitBtnText.innerText = 'INICIAR SESSÃO';
            toggleText.innerHTML = 'Não tem uma conta? <a href="#" id="toggleAuth" class="text-primary">Registrar</a>';
        } else {
            authTitle.innerText = 'Novo Cadastro';
            submitBtnText.innerText = 'CRIAR CONTA';
            toggleText.innerHTML = 'Já possui uma conta? <a href="#" id="toggleAuth" class="text-primary">Entrar</a>';
        }
        
        // Re-bind the event after innerHTML change
        document.getElementById('toggleAuth').addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuth.click();
        });
    });

    // Handle Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('.btn-primary');
        const originalText = submitBtnText.innerText;
        
        // Visual feedback
        btn.disabled = true;
        submitBtnText.innerText = isLoginMode ? 'AUTENTICANDO...' : 'PROCESSANDO...';
        btn.style.opacity = '0.7';

        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        const payload = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                if (isLoginMode) {
                    console.log('Login success:', data);
                    localStorage.setItem('jarvis_session', data.session);
                    localStorage.setItem('jarvis_email', document.getElementById('email').value);
                    alert('Acesso concedido! Inicializando Command Center...');
                    window.location.href = '/dashboard.html';
                } else {
                    alert('Cadastro realizado! Agora você pode entrar no sistema.');
                    // Switch back to login mode automatically
                    toggleAuth.click();
                }
            } else {
                alert(`Erro: ${data.detail || 'Falha na operação'}`);
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Erro de conexão com o servidor Jarvis.');
        } finally {
            btn.disabled = false;
            submitBtnText.innerText = originalText;
            btn.style.opacity = '1';
        }
    });

    console.log('%c JARVIS SYSTEM INITIALIZED ', 'background: #0d6100; color: #8eff71; font-weight: bold; padding: 2px 5px;');
});
