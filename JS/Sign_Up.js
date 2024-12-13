document.addEventListener('DOMContentLoaded', function(){
    const signUpForm = document.getElementById('signUpForm');
    const modal = document.getElementById('FirstModal');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicButton = document.getElementById('musicButton');

    // Configurar botón de música
    backgroundMusic.muted = false;
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => {
                    musicButton.textContent = "Pausar música"; // Actualizar texto del botón
                    backgroundMusic.muted = false; // Asegurarse de que no esté en silencio
                })
                .catch((error) => {
                    console.error("Error al reproducir música: ", error);
                });
        } else {
            backgroundMusic.pause();
            musicButton.textContent = "Poner música"; // Actualizar texto del botón
        }
    });

    // Enviar el formulario de registro
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar que recargue la página

        const data = new FormData(signUpForm);
        data.append('action', 'signup');

        fetch('SignUp.php', {
            method: 'POST',
            body: data
        })
        .then(response => {
            console.log('Respuesta completa del servidor:', response);
            const contentType = response.headers.get('content-type');
            console.log('Tipo de contenido:', contentType);
            if (!response.ok || !contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no devolvió JSON.');
            }
            return response.json(); // Intentar convertir a JSON
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.success) {
                alert('¡Registro exitoso!');
                modal.style.display = 'none';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error al realizar el registro:', error)
        });
        
    });
});
