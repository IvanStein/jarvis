document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching Logic
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');

            // Toggle Nav
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Toggle Panes
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${targetTab}-tab`) {
                    pane.classList.add('active');
                }
            });

            // Initial load for users
            if (targetTab === 'users') loadUsers();
        });
    });

    // 2. User Management
    window.loadUsers = async () => {
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '<tr><td colspan="4">Carregando usuários...</td></tr>';

        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            tableBody.innerHTML = '';
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.email}</td>
                    <td><span class="role-badge">${user.role}</span></td>
                    <td>${user.access.map(a => `<span class="access-chip">${a}</span>`).join('')}</td>
                    <td>
                        <button class="btn-action-sm" onclick="promoteUser('${user.id}')">PROMOVER ADMIN</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            tableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar usuários.</td></tr>';
        }
    };

    window.promoteUser = async (userId) => {
        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    role: 'admin',
                    access: ['dashboard', 'users', 'settings']
                })
            });
            if (response.ok) {
                alert('Usuário promovido a ADMIN!');
                loadUsers();
            }
        } catch (error) {
            alert('Erro ao atualizar permissões.');
        }
    };

    // 3. Session & Dashboard Logic
    const userEmailSpan = document.getElementById('userEmail');
    const session = localStorage.getItem('jarvis_session');
    if (session) {
        userEmailSpan.innerText = 'AUTORIZADO: ' + (localStorage.getItem('jarvis_email') || 'DEV');
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('jarvis_session');
        window.location.href = '/';
    });

    // Terminal Input
    const input = document.getElementById('commandInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const chatDisplay = document.getElementById('chatDisplay');
            const msg = document.createElement('div');
            msg.className = 'message';
            msg.innerHTML = `<span class="label-xs text-variant">USER:</span><p class="body-md">${input.value}</p>`;
            chatDisplay.appendChild(msg);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
            input.value = '';
            
            setTimeout(() => {
                const sys = document.createElement('div');
                sys.className = 'message system';
                sys.innerHTML = `<span class="label-xs text-primary">SYSTEM:</span><p class="body-md">Comando interpretado.</p>`;
                chatDisplay.appendChild(sys);
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
            }, 500);
        }
    });

    console.log('%c COMMAND CENTER ONLINE ', 'background: #0d6100; color: #8eff71; font-weight: bold; padding: 5px;');
});
