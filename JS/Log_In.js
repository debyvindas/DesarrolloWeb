document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const correo = document.getElementById('correo');
    const password = document.getElementById('password');
    const modal = document.getElementById('FirstModal');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicButton = document.getElementById('musicButton');
    var SingModal = document.getElementById('signUpForm');
    var LogInModal = document.getElementById('loginForm');

    backgroundMusic.muted = false;
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            // Play the music
            backgroundMusic.play()
                .then(() => {
                    musicButton.textContent = "Pausar musica"; // Update button text
                    backgroundMusic.muted = false; // Ensure it's unmuted
                })
                .catch((error) => {
                    console.error("Error playing music: ", error);
                });
        } else {
            // Pause the music
            backgroundMusic.pause();
            musicButton.textContent = "Poner musica"; // Update button text
        }
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

    
});








    


