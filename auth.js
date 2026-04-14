document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Simple interaction feedback
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('.btn-primary');
        const originalText = btn.querySelector('.btn-text').innerText;
        
        // Simulating loading state
        btn.disabled = true;
        btn.querySelector('.btn-text').innerText = 'AUTENTICANDO...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            console.log('Login attempt recorded:', {
                email: document.getElementById('email').value,
                timestamp: new Date().toISOString()
            });
            
            // For demo purposes, we just show a message or redirect
            alert('Acesso negado: Backend não vinculado neste estágio inicial.');
            
            // Reset
            btn.disabled = false;
            btn.querySelector('.btn-text').innerText = originalText;
            btn.style.opacity = '1';
        }, 1500);
    });

    // Console aesthetic message
    console.log('%c JARVIS SYSTEM INITIALIZED ', 'background: #0d6100; color: #8eff71; font-weight: bold; border-radius: 4px; padding: 2px 5px;');
});
