document.addEventListener('DOMContentLoaded', () => {
    const userEmailSpan = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check session
    const session = localStorage.getItem('jarvis_session');
    if (!session) {
        // No session? Go back to login
        // window.location.href = '/';
        console.warn('Sessão não encontrada.');
    } else {
        userEmailSpan.innerText = 'USUÁRIO_AUTORIZADO';
        userEmailSpan.classList.add('text-primary');
    }

    // Logout logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jarvis_session');
        alert('Sessão encerrada.');
        window.location.href = '/';
    });

    // Simple terminal input effect
    const input = document.getElementById('commandInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const chatDisplay = document.getElementById('chatDisplay');
            const userMsg = document.createElement('div');
            userMsg.className = 'message';
            userMsg.innerHTML = `<span class="label-xs text-variant">USER:</span><p class="body-md">${input.value}</p>`;
            chatDisplay.appendChild(userMsg);
            
            // Auto-scroll
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
            
            // Clear input
            input.value = '';

            // Dummy system reply
            setTimeout(() => {
                const systemMsg = document.createElement('div');
                systemMsg.className = 'message system';
                systemMsg.innerHTML = `<span class="label-xs text-primary">SYSTEM:</span><p class="body-md">Comando interpretado. Processando via Agente Agno...</p>`;
                chatDisplay.appendChild(systemMsg);
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
            }, 800);
        }
    });

    console.log('%c COMMAND CENTER ONLINE ', 'background: #0d6100; color: #8eff71; font-weight: bold; padding: 5px;');
});
