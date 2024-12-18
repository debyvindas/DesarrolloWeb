document.addEventListener('DOMContentLoaded', function () {
    
    const correo = localStorage.getItem('correo');  // Recupera el correo desde el localStorage
    console.log(correo);
    if (!correo) {
        alert('No se encontró información del usuario. Por favor, inicia sesión.');
        window.location.href = "login.html";  // Redirigir al login si no hay correo
        return;
    }

    // Realiza la solicitud al servidor para obtener los datos del perfil
    fetch('http://localhost/DesarrolloWebF/JS/server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'getProfileData',
            correo1: correo
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                // Si la solicitud fue exitosa, muestra los datos en el perfil
                document.getElementById('user-name').textContent = `Nombre: ${data.nombre}`;
                document.getElementById('correo').textContent = `Correo: ${data.correo}`;
                document.getElementById('rol').textContent = `Rol: ${data.rol}`;
            } else {
                alert('Error al cargar el perfil.');
            }
        })
        .catch(error => console.error('Error al obtener datos del perfil:', error));
});

// Función para cambiar la foto de perfil
function changePhoto() {
    const fileInput = document.getElementById('photo-upload');
    const profilePhoto = document.getElementById('profile-photo');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhoto.src = e.target.result;  // Cambiar la imagen de perfil
        };
        reader.readAsDataURL(file);
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.clear();  // Limpiar los datos del usuario
    window.location.href = "index.html";  // Redirigir al login
}
