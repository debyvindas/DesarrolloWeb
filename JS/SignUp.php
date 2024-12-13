<?php
// Incluir el archivo de configuración para la conexión
include 'dbConnection.php';

// Verificar si los datos fueron enviados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del formulario
    $nombre = $_POST['Nombre'];
    $correo = $_POST['Correo'];
    $pass = $_POST['Pass'];
    $partidas_jugadas =  0;  // Si no se envía, asignamos 0 por defecto
    $pun_t =  0;  // Si no se envía, asignamos 0 por defecto
    $conn = conectar();
    // Establecer que el ID_Rol será siempre 1
    $id_rol = 1;

    // Encriptar la contraseña antes de almacenarla (muy importante para seguridad)
    $pass_hash = password_hash($pass, PASSWORD_DEFAULT);

    // Verificar que los datos no estén vacíos
    if (!empty($nombre) && !empty($correo) && !empty($pass)) {
        // Preparar la consulta SQL para insertar los datos
        $sql = "INSERT INTO Usuario (ID_Rol, Nombre, Correo, Pass, Partidas_Jugadas, Pun_T)
                VALUES ('$id_rol', '$nombre', '$correo', '$pass_hash', '$partidas_jugadas', '$pun_t')";

        echo $sql;
        // Ejecutar la consulta
        if ($conn->query($sql) === TRUE) {
            echo "Usuario registrado correctamente.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Por favor ingresa todos los datos obligatorios.";
    }

    // Cerrar la conexión
    $conn->close();
} else {
    echo "Método de solicitud no válido.";
}
?>


