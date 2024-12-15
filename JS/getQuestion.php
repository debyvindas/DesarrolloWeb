<?php
include 'dbConnection.php';

$conn = conectar();

$categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

$query = "
    SELECT p.ID_Pregunta, p.TXT AS question, r.ID_Respuesta, r.TXT AS answer, r.Correcta
    FROM Pregunta p
    INNER JOIN Respuestas r ON p.ID_Pregunta = r.ID_Pregunta
    WHERE p.ID_Categoria = $categoryId AND p.Activo = 1
";

$result = $conn->query($query);

$questions = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $questionId = $row['ID_Pregunta'];
        if (!isset($questions[$questionId])) {
            $questions[$questionId] = [
                'question' => $row['question'],
                'answers' => []
            ];
        }
        $questions[$questionId]['answers'][] = [
            'text' => $row['answer'],
            'correct' => $row['Correcta'] === 'yes'
        ];
    }
}

header('Content-Type: application/json');
echo json_encode(array_values($questions));
$conn->close();
?>

