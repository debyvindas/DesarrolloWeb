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
        $password = $_POST['password'];

        $conn = conectar();

        if ($conn->connect_error) { 
            echo json_encode(["success" => false, "message" => "Error en la conexión a la base de datos."]); exit();
        }

        $sql = "SELECT * FROM usuario WHERE Correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $correo);
        
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
        } else {
            $sql = "INSERT INTO usuario VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('iissiiiiiis',1,0, $nombre, $correo, 0,0,0,0,0,0,$password);
            echo "Consulta para registro: " . $debug_sql;
            echo json_encode(["properties" => true, "message" => $sql]);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Registro exitoso."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al insertar el usuario."]);
            }
        }

        $conn->close();
    }
}
?>
