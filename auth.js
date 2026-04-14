document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Simple interaction feedback
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('.btn-primary');
        const originalText = btn.querySelector('.btn-text').innerText;
        
        // Simulating loading state
        btn.disabled = true;
        btn.querySelector('.btn-text').innerText = 'AUTENTICANDO...';
        btn.style.opacity = '0.7';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Autenticação bem-sucedida:', data);
                // Armazena a sessão (Token Economy skill: gerenciamento eficiente)
                localStorage.setItem('jarvis_session', data.session);
                alert('Acesso concedido! Inicializando Command Center...');
                // window.location.href = '/dashboard.html';
            } else {
                alert(`Erro: ${data.detail || 'Falha na conexão'}`);
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Erro de conexão com o servidor Jarvis.');
        } finally {
            // Reset
            btn.disabled = false;
            btn.querySelector('.btn-text').innerText = originalText;
            btn.style.opacity = '1';
        }
    });

    // Console aesthetic message
    console.log('%c JARVIS SYSTEM INITIALIZED ', 'background: #0d6100; color: #8eff71; font-weight: bold; border-radius: 4px; padding: 2px 5px;');
});
