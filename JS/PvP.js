let currentQuestions = [];
let currentQuestionIndex = 0;
let currentPlayer = 1; // 1 = Jugador Uno, 2 = Jugador Dos
let playerOneScore = 0;
let playerTwoScore = 0;

const totalQuestions = 16;

// Variables globales para los elementos del DOM
let playerOnePanel, playerTwoPanel, questionElement, answersElement, startButton, restartButton, turnMessage;

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    playerOnePanel = document.getElementById('player-one-panel');
    playerTwoPanel = document.getElementById('player-two-panel');
    questionElement = document.getElementById('question');
    answersElement = document.getElementById('answers');
    startButton = document.getElementById('start-btn');
    restartButton = document.getElementById('Restart-btn');
    turnMessage = document.getElementById('turn-message'); // Mensaje de turno

    // Verificar si los elementos existen
    if (!playerOnePanel || !playerTwoPanel || !questionElement || !answersElement || !turnMessage) {
        console.error('Error: No se encontraron todos los elementos necesarios en el DOM.');
        return;
    }

    // Asignar eventos a botones
    startButton.onclick = startGame;
    restartButton.onclick = startGame;
});

function startGame() {
    // Reiniciar el juego
    currentQuestions = [];
    currentQuestionIndex = 0;
    currentPlayer = 1;
    playerOneScore = 0;
    playerTwoScore = 0;

    updatePlayerPanels();

    // Ocultar el botón de iniciar y mostrar el de reiniciar
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';

    // Solicitar preguntas al servidor
    const dato = new FormData();
    dato.append('action', 'PvP');
    fetch('http://localhost/DesarrolloWebF/JS/server.php', {
        method: 'POST',
        body: dato
    })
        .then(response => response.json())
        .then(data => {
            currentQuestions = data;
            console.log("Preguntas cargadas:", currentQuestions);
            if (currentQuestions.length === 0) {
                alert('No se encontraron preguntas.');
                return;
            }
            showQuestion();
        })
        .catch(error => {
            console.error('Error al cargar preguntas:', error);
            alert('Hubo un problema al iniciar el juego.');
        });
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    const questionData = currentQuestions[currentQuestionIndex];

    // Mostrar la pregunta actual
    questionElement.textContent = questionData.question;
    answersElement.innerHTML = ''; // Limpiar respuestas anteriores

    // Mostrar turno del jugador actual
    turnMessage.textContent = `Turno del Jugador ${currentPlayer}`;

    // Crear botones de respuestas
    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.className = 'answer-button';
        button.onclick = () => selectAnswer(answer.correct);
        answersElement.appendChild(button);
    });

    updatePlayerPanels();
}

function selectAnswer(isCorrect) {
    // Actualizar el puntaje del jugador actual
    if (isCorrect) {
        if (currentPlayer === 1) playerOneScore++;
        else playerTwoScore++;
    }

    // Mostrar retroalimentación
    const feedback = document.createElement('p');
    feedback.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto.';
    feedback.className = isCorrect ? 'correct' : 'incorrect';
    answersElement.appendChild(feedback);

    // Cambiar de jugador y avanzar a la siguiente pregunta
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentQuestionIndex++;

    setTimeout(showQuestion, 1000);
}

function updatePlayerPanels() {
    // Resaltar el panel del jugador actual
    playerOnePanel.classList.toggle('active', currentPlayer === 1);
    playerTwoPanel.classList.toggle('active', currentPlayer === 2);

    // Actualizar puntajes
    document.getElementById('player-one-streak').textContent = `Puntaje: ${playerOneScore}`;
    document.getElementById('player-two-streak').textContent = `Puntaje: ${playerTwoScore}`;
}

function endGame() {
    // Mostrar el mensaje de finalización y los puntajes finales
    questionElement.textContent = "¡Juego terminado!";
    answersElement.innerHTML = `
        <p>Puntaje Final:</p>
        <p>Jugador 1: ${playerOneScore}</p>
        <p>Jugador 2: ${playerTwoScore}</p>
    `;

    // Desactivar paneles
    playerOnePanel.classList.remove('active');
    playerTwoPanel.classList.remove('active');
}
