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
    } 
}
?>
