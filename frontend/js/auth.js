document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // Simulación de login (hardcodeado: admin/admin, user/user)
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('role', 'admin');
                window.location.href = 'dashboard.html';
            } else if (username === 'user' && password === 'user') {
                localStorage.setItem('role', 'user');
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('errorMsg').textContent = 'Credenciales incorrectas';
            }
        });
    }
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('role');
            window.location.href = 'index.html';
        });
    }
    // Modo oscuro
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
        });
    }
    // Restringir navegación según rol
    const role = localStorage.getItem('role');
    if (role === 'user') {
        // Ocultar opciones avanzadas para users
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (!link.href.includes('consultar') && !link.href.includes('analizar')) {
                link.style.display = 'none';
            }
        });
    }
});