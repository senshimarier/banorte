// Función para obtener los valores cuando el usuario intenta iniciar sesión
function iniciarSesion() {
    // Obtener los valores de los campos
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    const errorMsg = document.getElementById('errorMsg');
    
    // Verificar si los campos están vacíos
    if (usuario === '' || password === '') {
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ¡Atención! Debes llenar todos los campos para continuar
        `;
        
        // Agregar clases de error a los campos vacíos
        const usuarioInput = document.getElementById('usuario');
        const passwordInput = document.getElementById('password');
        
        if (usuario === '') {
            usuarioInput.classList.add('error-field');
            setTimeout(() => usuarioInput.classList.remove('error-field'), 500);
        }
        if (password === '') {
            passwordInput.classList.add('error-field');
            setTimeout(() => passwordInput.classList.remove('error-field'), 500);
        }

        // Hacer vibrar el contenedor
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);

        return;
    }

    // Restaurar estados normales cuando se ingresen datos
    errorMsg.style.display = 'none';
    document.getElementById('usuario').classList.remove('error-field');
    document.getElementById('password').classList.remove('error-field');

    // Aquí puedes agregar la lógica de validación del login
    console.log('Usuario:', usuario);
    console.log('Contraseña:', password);

    // Cambiar el mensaje de error a mensaje de éxito
    errorMsg.style.display = 'block';
    errorMsg.style.color = '#28a745'; // Color verde para éxito
    errorMsg.textContent = '¡Datos guardados correctamente!';
    
    // Limpiar los campos después de guardar
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';

    // Volver al estilo original después de 3 segundos
    setTimeout(() => {
        errorMsg.style.display = 'none';
        errorMsg.style.color = ''; // Volver al color original
    }, 3000);

        // Redirigir al dashboard después de guardar correctamente
        setTimeout(() => {
            window.location.href = "../frontend/dashboard.html";
        }, 1000); // Espera 1 segundo para mostrar el mensaje de éxito
}

// Función para mostrar/ocultar la contraseña
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        // Cambiar el tipo de input entre password y texto
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar el ícono
        this.className = type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash';
    });
});
