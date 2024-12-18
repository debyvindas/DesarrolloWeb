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
    
        $sql = "SELECT Nombre, Correo, ID_Rol FROM usuario WHERE Correo = ? AND Pass = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $correo, $password);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                "success" => true,
                "nombre" => $user['Nombre'],
                "correo" => $user['Correo'],
                "rol" => $user['ID_Rol']
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
        }
        $conn->close();
    }
    elseif ($action == 'insertPregunta') {
        $pregunta = $_POST['pregunta'];
        $respuestaCorrecta = $_POST['respuestaCorrecta'];
        $respuestaIncorrecta1 = $_POST['respuestaIncorrecta1'];
        $respuestaIncorrecta2 = $_POST['respuestaIncorrecta2'];
        $respuestaIncorrecta3 = $_POST['respuestaIncorrecta3'];
        $categoriaId = $_POST['categoriaId'];
    
        // Obtener el último ID_Pregunta insertado (el ID más alto)
        $sqlUltimoIdPregunta = "SELECT MAX(ID_Pregunta) AS ultimo_id FROM Pregunta";
        $resultPregunta = $conn->query($sqlUltimoIdPregunta);
        $rowPregunta = $resultPregunta->fetch_assoc();
        $nuevoIdPregunta = $rowPregunta['ultimo_id'] + 1;  // Sumar 1 al último ID para el nuevo
    
        // Insertar la pregunta con el nuevo ID_Pregunta
        $sqlPregunta = "INSERT INTO Pregunta (ID_Pregunta, ID_Categoria, TXT, Dificultad, Puntuacion, Activo) 
                        VALUES (?, ?, ?, 1, 1, 1)";
        $stmt = $conn->prepare($sqlPregunta);
        $stmt->bind_param('iis', $nuevoIdPregunta, $categoriaId, $pregunta);
        $stmt->execute();
    
        // Obtener el último ID_Respuesta insertado (el ID más alto)
        $sqlUltimoIdRespuesta = "SELECT MAX(ID_Respuesta) AS ultimo_id FROM Respuestas";
        $resultRespuesta = $conn->query($sqlUltimoIdRespuesta);
        $rowRespuesta = $resultRespuesta->fetch_assoc();
        $nuevoIdRespuesta = $rowRespuesta['ultimo_id'] + 1;  // Sumar 1 al último ID para el nuevo
    
        // Insertar las respuestas con los nuevos ID_Respuesta
        $respuestas = [
            [$respuestaCorrecta, 'Si'],
            [$respuestaIncorrecta1, 'no'],
            [$respuestaIncorrecta2, 'no'],
            [$respuestaIncorrecta3, 'no']
        ];
    
        foreach ($respuestas as $respuesta) {
            $sqlRespuesta = "INSERT INTO Respuestas (ID_Respuesta, ID_Pregunta, TXT, Correcta) 
                             VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sqlRespuesta);
            $stmt->bind_param('iiss', $nuevoIdRespuesta, $nuevoIdPregunta, $respuesta[0], $respuesta[1]);
            $stmt->execute();
    
            // Incrementar el ID_Respuesta para la siguiente iteración
            $nuevoIdRespuesta++;
        }
    
        echo json_encode(["success" => true]);
    }
    
    
    elseif ($action == 'insertCategoria') {
        $categoria = $_POST['categoria'];

        $sql = "SELECT MAX(ID_Categoria) AS max_id FROM Categoria";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $newId = $row['max_id'] + 1;

        $sqlInsert = "INSERT INTO Categoria (ID_Categoria, Nombre, Activo) 
                      VALUES (?, ?, 1)";
        $stmt = $conn->prepare($sqlInsert);
        $stmt->bind_param('is', $newId, $categoria);
        $stmt->execute();

        echo json_encode(["success" => true]);
    }
    elseif ($action == 'cargarCategorias') {
        $estado = $_POST['estado'];  // Estado 1 para activas, 0 para inactivas
        $sql = "SELECT ID_Categoria AS id, Nombre AS name FROM Categoria WHERE Activo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $estado);
        $stmt->execute();
        $result = $stmt->get_result();
    
        $categorias = [];
        while ($row = $result->fetch_assoc()) {
            $categorias[] = $row;
        }
    
        echo json_encode($categorias);
    }
    
    elseif ($action == 'activarCategoria' || $action == 'desactivarCategoria') {
        $categoriaId = $_POST['categoriaId'];
        $estado = $action == 'activarCategoria' ? 1 : 0;
        $sql = "UPDATE Categoria SET Activo = ? WHERE ID_Categoria = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $estado, $categoriaId);
        $stmt->execute();
    
        echo json_encode(["success" => true]);
    }
    
    elseif ($action == 'QuestionN') {
        $categoryId = isset($_POST['category_id']) ? intval($_POST['category_id']) : 0;
    
        $query = "
            SELECT c.Nombre AS category, p.ID_Pregunta, p.TXT AS question, r.ID_Respuesta, r.TXT AS answer, r.Correcta
            FROM Pregunta p
            INNER JOIN Respuestas r ON p.ID_Pregunta = r.ID_Pregunta
            INNER JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
            WHERE p.ID_Categoria = $categoryId AND p.Activo = 1
        ";
        
    
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
                    'correct' => in_array(strtolower($row['Correcta']), ['si', 'yes']) 
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
    elseif ($action == 'Triviaton') {
        // Consulta para obtener todas las preguntas activas y sus respuestas
        $query = "
            SELECT p.ID_Pregunta, p.TXT AS question, r.ID_Respuesta, r.TXT AS answer, r.Correcta
            FROM Pregunta p
            LEFT JOIN Respuestas r ON p.ID_Pregunta = r.ID_Pregunta
            WHERE p.Activo = 1
        ";
    
        $result = $conn->query($query);
    
        $questions = []; // Arreglo para almacenar preguntas
    
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $questionId = $row['ID_Pregunta'];
    
                // Si la pregunta aún no está en el arreglo, agregarla
                if (!isset($questions[$questionId])) {
                    $questions[$questionId] = [
                        'question' => $row['question'],
                        'answers' => []
                    ];
                }
    
                // Agregar las respuestas a la pregunta correspondiente
                $questions[$questionId]['answers'][] = [
                    'text' => $row['answer'],
                    'correct' => in_array(strtolower($row['Correcta']), ['si', 'yes'])  // Acepta 'Si' y 'yes' (ignorando mayúsculas/minúsculas)
                ];
                
            }
        }
    
        // Asegurarse de que cada pregunta tenga 4 respuestas
        foreach ($questions as &$question) {
            // Si la pregunta tiene menos de 4 respuestas, agregar respuestas incorrectas vacías
            $missingAnswers = 4 - count($question['answers']);
            for ($i = 0; $i < $missingAnswers; $i++) {
                $question['answers'][] = [
                    'text' => '', // Respuesta vacía
                    'correct' => false // Respuesta incorrecta
                ];
            }
        }
    
        // Convertir las preguntas a un array indexado y barajarlas
        $questionsArray = array_values($questions);
        shuffle($questionsArray); // Barajar preguntas aleatoriamente
    
        // Respuesta en formato JSON
        header('Content-Type: application/json');
        echo json_encode($questionsArray, JSON_PRETTY_PRINT);
        $conn->close();
    }
    elseif ($action == 'PvP') {
        // Consulta para obtener todas las preguntas activas y sus respuestas
        $query = "
            SELECT p.ID_Pregunta, p.TXT AS question, r.ID_Respuesta, r.TXT AS answer, r.Correcta
            FROM Pregunta p
            LEFT JOIN Respuestas r ON p.ID_Pregunta = r.ID_Pregunta
            WHERE p.Activo = 1
        ";
    
        $result = $conn->query($query);
    
        $questions = []; // Arreglo para almacenar preguntas
    
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $questionId = $row['ID_Pregunta'];
    
                // Si la pregunta aún no está en el arreglo, agregarla
                if (!isset($questions[$questionId])) {
                    $questions[$questionId] = [
                        'question' => $row['question'],
                        'answers' => []
                    ];
                }
    
                // Agregar la respuesta a la pregunta correspondiente
                $questions[$questionId]['answers'][] = [
                    'text' => $row['answer'],
                    'correct' => in_array(strtolower($row['Correcta']), ['si', 'yes'])
                ];
                
            }
        }
    
        // Asegurarse de que cada pregunta tenga 4 respuestas
        foreach ($questions as &$question) {
            // Verificamos cuántas respuestas tiene la pregunta
            $missingAnswers = 4 - count($question['answers']);
            
            // Si faltan respuestas, agregamos respuestas vacías
            if ($missingAnswers > 0) {
                for ($i = 0; $i < $missingAnswers; $i++) {
                    $question['answers'][] = [
                        'text' => '', // Respuesta vacía
                        'correct' => false // Respuesta incorrecta
                    ];
                }
            }
        }
    
        // Convertir las preguntas a un array indexado
        $questionsArray = array_values($questions);
    
        // Barajar preguntas aleatoriamente
        shuffle($questionsArray); 
    
        // Para cada pregunta, barajamos las respuestas
        foreach ($questionsArray as &$question) {
            shuffle($question['answers']); // Barajar las respuestas de cada pregunta
        }
    
        // Respuesta en formato JSON
        header('Content-Type: application/json');
        echo json_encode($questionsArray, JSON_PRETTY_PRINT);
        $conn->close();
    }
        elseif ($action == 'getProfileData') {
        $correo = $_POST['correo1']?? '';
        if (empty($correo)) {
            echo json_encode(["success" => false, "message" => "El correo es requerido."]);
            exit;
        }
        $sql_check2 = "SELECT Nombre, Correo, ID_Rol FROM usuario WHERE Correo = ?";
        $stmt = $conn->prepare($sql_check2);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc(); 
            // Obtener los datos del usuario
            echo json_encode([
                "success" => true,
                "nombre" => $user['Nombre'],
                "correo" => $user['Correo'],
                "rol" => $user['ID_Rol']
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Usuario no encontrado."]);
        }

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
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] == 'register') {
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo'];
        $password = $_POST['password']; // Hashear la contraseña por seguridad
    
        // Verificar si el correo ya existe en la base de datos
        $sql_check = "SELECT * FROM Usuario WHERE Correo = ?";
        $stmt = $conn->prepare($sql_check);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Si el correo ya está registrado
            echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
            exit();
        }
    
        // Obtener el último ID de usuario y calcular el siguiente
        $sql_max_id = "SELECT MAX(ID_Usuario) AS max_id FROM Usuario";
        $result_max_id = $conn->query($sql_max_id);
        $row = $result_max_id->fetch_assoc();
        $next_id = $row['max_id'] + 1;
    
        // Insertar el nuevo usuario con el rol 2
        $sql_insert = "INSERT INTO Usuario (ID_Usuario, ID_Rol, Nombre, Correo, Pass) VALUES (?, 2, ?, ?, ?)";
        $stmt = $conn->prepare($sql_insert);
        $stmt->bind_param("isss", $next_id, $nombre, $correo, $password);
    
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Hubo un error al registrar al usuario."]);
        }
    }
    
 } else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>