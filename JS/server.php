<?php
ini_set('display_errors', 1);  
error_reporting(E_ALL); 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include 'dbConnection.php';

$request = $_SERVER['REQUEST_METHOD'];
$conn = conectar();
if ($request == 'POST') {
    $action = $_POST['action'];

    if ($action == 'login') {
        $correo = $_POST['correo'];
        $password = $_POST['password'];

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
    } 
    elseif ($action == 'QuestionN') {
        $categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;
    
        $query = "
            SELECT c.Nombre AS category, p.ID_Pregunta, p.TXT AS question, r.ID_Respuesta, r.TXT AS answer, r.Correcta
            FROM Pregunta p
            INNER JOIN Respuestas r ON p.ID_Pregunta = r.ID_Pregunta
            INNER JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
            WHERE p.ID_Categoria = $categoryId AND p.Activo = 1
        ";
        $men = ["message" => $query, "status" => "success"];
        echo json_encode($men);
    
        $result = $conn->query($query);

        $questionsByCategory = [];
    
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $category = $row['category']; 
                $questionId = $row['ID_Pregunta'];
    
                
                if (!isset($questionsByCategory[$category])) {
                    $questionsByCategory[$category] = [];
                }
    
                
                if (!isset($questionsByCategory[$category][$questionId])) {
                    $questionsByCategory[$category][$questionId] = [
                        'question' => $row['question'],
                        'answers' => []
                    ];
                }
    
                
                $questionsByCategory[$category][$questionId]['answers'][] = [
                    'text' => $row['answer'],
                    'correct' => $row['Correcta'] === 'yes'
                ];
            }
        }
    
        // Reindexar las preguntas dentro de cada categoría
        foreach ($questionsByCategory as $category => &$questions) {
            $questions = array_values($questions); // Convertir a un array indexado
        }
        
    
        header('Content-Type: application/json');
        echo json_encode($questionsByCategory, JSON_PRETTY_PRINT); // Mostrar con formato JSON legible
        $conn->close();
    }
    
    
    elseif ($action == 'Category'){
        $sql = "SELECT ID_Categoria, Nombre FROM Categoria WHERE Activo = 1"; // Consulta de categorías
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();

        // Verificar si la consulta se realizó correctamente
        if ($result) {
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                $categories[] = [
                    'id' => $row['ID_Categoria'],  // Ajusta el nombre de las propiedades si es necesario
                    'name' => $row['Nombre']
                ];
            }
            echo json_encode($categories); // Enviar las categorías como JSON
        } else {
            echo json_encode(['error' => 'Error en la consulta']); // Si hubo un error
        }
    }
    elseif ($action == 'signup') {
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
            $idUser = isset($row['max_id']) ? $row['max_id'] + 1 : 1;

            // Inserción en la tabla Usuario
            $sql = "INSERT INTO Usuario (ID_Usuario, ID_Rol, Nombre, Correo, Partidas_Jugadas, Dif_1, Dif_2, Dif_3, Res_H, Pun_T, Pass) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            
            $idRol = 1;
            $partidasJugadas = 0;
            $punT = 0;

            $stmt->bind_param('iisssii', $idUser, $idRol, $nombre, $correo, $password, $partidasJugadas, $punT);

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
?>
