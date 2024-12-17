// Agregar al script que ya tienes para manejar el formulario de registro

document.getElementById('signUpForm').onsubmit = async function(event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correoReg').value;
    const password = document.getElementById('passwordReg').value;

    // Validación básica del formulario
    if (!nombre || !correo || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Crear el objeto con los datos a enviar
    const data = new FormData();
    data.append('action', 'register');
    data.append('nombre', nombre);
    data.append('correo', correo);
    data.append('password', password);

    // Enviar los datos al servidor usando fetch
    try {
        const response = await fetch('http://localhost/DesarrolloWebF/JS/server.php', {
            method: 'POST',
            body: data
        });
        
        const result = await response.json();

        if (result.success) {
            alert(result.message); // Registro exitoso
            closeModal(); // Cerrar el modal después del registro
        } else {
            alert(result.message); // Error si el correo ya existe
        }
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert("Hubo un error al intentar registrarte.");
    }
};
