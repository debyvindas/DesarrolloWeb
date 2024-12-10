<?php
try{
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/ruta/a/tu/archivo-de-errores.log');
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'dbConnection.php';

$request = $_SERVER['REQUEST_METHOD'];

if ($request == 'POST') {
    $action = $_POST['action'];

    if ($action == 'login') {
        $correo = $_POST['correo'];
        $password = $_POST['password'];

        $conn = conectar();

        $sql = "SELECT * FROM usuario WHERE Correo = ? AND Pass = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $correo, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso."]);
        } else {
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
        }

        $stmt->close();
        $conn->close();
    } elseif ($action == 'signup') {
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo'];
        $password = $_POST['password']; // Ajustado para tomar la variable correcta

        $conn = conectar();

        $sql = "SELECT * FROM Usuario WHERE Correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_decode($result);

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
        } else {
            // Necesitas recuperar el último ID y sumarle 1 manualmente
            $sql = "SELECT MAX(ID_Usuario) AS max_id FROM Usuario";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $idUser = $row['max_id'] + 1;

            // Inserción en la tabla Usuario
            $sql = "INSERT INTO Usuario (ID_Usuario, ID_Rol, Nombre, Correo, Partidas_Jugadas, Dif_1, Dif_2, Dif_3, Res_H, Pun_T, Pass) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);

            $idRol = 2;
            $partidasJugadas = 0;
            $dif1 = 0;
            $dif2 = 0;
            $dif3 = 0;
            $resH = 0;
            $punT = 0;

            $stmt->bind_param('iissiiiiiis', $idUser, $idRol, $nombre, $correo, $partidasJugadas, $dif1, $dif2, $dif3, $resH, $punT, $password);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Registro exitoso."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al insertar el usuario: " . $stmt->error]);
            }
        }

        $stmt->close();
        $conn->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
}
catch (Exception $e) {
    // Manejo de errores globales
    echo json_encode(["success" => false, "message" => "Error interno del servidor: " . $e->getMessage()]);
}
?>
