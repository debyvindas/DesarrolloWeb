document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const modal = document.getElementById('FirstModal');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(loginForm);
        data.append('action', 'login');

        fetch('http://localhost/DesarrolloWebF/JS/server.php', {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('¡Login exitoso!');
                    modal.style.display = 'none';

                    // Guardar datos en localStorage
                    localStorage.setItem('nombre', data.nombre);
                    localStorage.setItem('correo', data.correo);
                    localStorage.setItem('rol', data.rol);

                    // Redirigir al menú principal
                    window.location.href = '../HTML/Index.html';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error al realizar el login:', error));
    });
});
