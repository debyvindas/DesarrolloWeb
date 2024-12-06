document.addEventListener('DOMContentLoaded', function(){
    const Sign_Up = document.getElementById('signUpForm');
    const correo = document.getElementById('correoReg');
    const pass = document.getElementById('passwordReg');
    const nombre = document.getElementById('nombreReg');
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
    

    Sign_Up.addEventListener('submit',(event) =>{
        event.preventDefault();

        const data = new FormData(Sign_Up);
        data.append('actrion','signup');

        fetch('http://localhost/DesarrolloWeb/JS/server.php',{
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            if(data.properties){
                alert(message)
            }
            if(data.success){
                alert('Sign Up exisotso');
                modal.style.isplay = 'none';
            }
            else{
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al realizar el SignUp:', error));
    });

  
});