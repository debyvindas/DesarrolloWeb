document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const correo = document.getElementById('correo');
    const password = document.getElementById('password');
    const modal = document.getElementById('FirstModal');
    const toSignUpButton = document.getElementById('toSignUp');

    // Abrir el modal
    document.getElementById('openModal').addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Enviar el formulario de login
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar que recargue la página

        const data = new FormData(loginForm);
        data.append('action', 'login');

        // Enviar los datos al servidor con Fetch
        fetch('http://localhost/DesarrolloWeb/JS/server.php', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('¡Login exitoso!');
                modal.style.display = 'none'; // Cerrar modal
            } else {
                alert(data.message); // Mostrar error
            }
        })
        .catch(error => console.error('Error al realizar el login:', error));
    });

    // Cambiar al formulario de registro
    toSignUpButton.addEventListener('click', () => {
        document.querySelector('.modal-LogIn').style.display = 'none';
        document.querySelector('.modal-SignIn').style.display = 'block';
    });
});

