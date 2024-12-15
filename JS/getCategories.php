<?php
ini_set('display_errors', 1);  // Mostrar errores en pantalla
error_reporting(E_ALL);  // Reportar todos los errores

header('Content-Type: application/json'); // Indicar que el contenido es JSON

include 'dbConnection.php';  // Asegúrate de que la conexión se haga correctamente

$conn = conectar(); // Conexión a la base de datos

?>
