<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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

        $conn->close();
    } elseif ($action == 'signup') {
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo']; 
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Encriptar contraseña
    
        $conn = conectar();
    
        if ($conn->connect_error) { 
            echo json_encode(["success" => false, "message" => "Error en la conexión a la base de datos."]); 
            exit();
        }
    
        // Verificar si el correo ya existe
        $sql = "SELECT * FROM Usuario WHERE Correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $correo);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
        } else {
            // Inserción en la tabla Usuario
            $sql = "INSERT INTO Usuario (ID_Usuario, ID_Rol, Nombre, Correo, Partidas_Jugadas, Dif_1, Dif_2, Dif_3, Res_H, Pun_T, Pass) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
    
            // Valores predeterminados
            $idRol = 2; // Asignar un rol por defecto, según tu lógica
            $partidasJugadas = 0;
            $dif1 = 0;
            $dif2 = 0;
            $dif3 = 0;
            $resH = 0;
            $punT = 0;
    
            $stmt->bind_param('iissiiiiiis', $idRol, $nombre, $correo, $partidasJugadas, $dif1, $dif2, $dif3, $resH, $punT, $password);
    
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Registro exitoso."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al insertar el usuario: " . $stmt->error]);
            }
        }
    
        $stmt->close();
        $conn->close();
    }
}
?>
