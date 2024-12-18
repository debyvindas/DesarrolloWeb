let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const timerElement = document.getElementById('time-left');
const scoreSection = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');

function startGame(categoryId) {
    const data = new FormData();
    data.append('action', 'QuestionN'); // Acción del servidor
    data.append('category_id', categoryId); // ID de categoría que se pasará al servidor

    fetch('http://localhost/DesarrolloWebF/JS/server.php', {
        method: 'POST',
        body: data,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud al servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Preguntas recibidas:', data);

            // Comprobar si hay preguntas para esta categoría
            if (!data || Object.keys(data).length === 0) {
                alert(`No hay preguntas disponibles para la categoría seleccionada.`);
                return;
            }

            // Las preguntas se asignan a la categoría según su ID
            const categoryQuestions = Object.values(data).flat();
            if (categoryQuestions.length === 0) {
                alert('No hay preguntas disponibles para esta categoría.');
                return;
            }

            // Cargar las preguntas para la categoría seleccionada
            currentQuestions = categoryQuestions;
            currentQuestionIndex = 0;
            score = 0;

            // Cambiar de vista: ocultar selección de categoría y mostrar juego
            document.getElementById('category-selection').classList.add('hide');
            document.getElementById('game').classList.remove('hide');

            // Mostrar la primera pregunta
            showQuestion();
        })
        .catch(error => {
            console.error('Error al cargar preguntas:', error);
        });
}

function showQuestion() {
    resetTimer();

    const questionData = currentQuestions[currentQuestionIndex];
    questionElement.textContent = questionData.question;
    answersElement.innerHTML = '';

    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(button, answer.correct);  // Pasar el botón y la respuesta correcta
        answersElement.appendChild(button);
    });

    startTimer();
}

function selectAnswer(button, isCorrect) {
    clearInterval(timerInterval);

    // Resaltar la respuesta correcta o incorrecta
    if (isCorrect) {
        button.classList.add('correct');
        feedbackElement.textContent = '¡Correcto!';
    } else {
        button.classList.add('incorrect');
        feedbackElement.textContent = 'Incorrecto';
    }

    // Deshabilitar todos los botones después de seleccionar una respuesta
    const allButtons = answersElement.querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = true);

    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    document.getElementById('game').classList.add('hide');
    scoreSection.classList.remove('hide');
    finalScoreElement.textContent = score;
}

function startTimer() {
    let timeLeft = 10;
    timerElement.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            feedbackElement.textContent = 'Tiempo agotado';
            setTimeout(nextQuestion, 2000);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = 10;
    feedbackElement.textContent = '';
}
function restartGame() {
    // Ocultar la sección de puntuación
    scoreSection.classList.add('hide');
    
    // Mostrar nuevamente la sección de selección de categorías
    document.getElementById('category-selection').classList.remove('hide');

    // Limpiar el estado del juego
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;

    // Limpiar el contenido de las preguntas y la retroalimentación
    questionElement.textContent = '';
    answersElement.innerHTML = '';
    feedbackElement.textContent = '';
    timerElement.textContent = '10';
}

