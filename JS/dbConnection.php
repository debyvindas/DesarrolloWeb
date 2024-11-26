<?php
function conectar() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "a_proyecto_final";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    return $conn;
}
?>
