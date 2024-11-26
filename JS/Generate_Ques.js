
const questions = {
    ciencias: [
        {
            question: "¿Cuál es el elemento químico más abundante en la Tierra?",
            answers: [
                { text: "Oxígeno", correct: true },
                { text: "Carbono", correct: false },
                { text: "Hidrógeno", correct: false },
                { text: "Nitrógeno", correct: false }
            ]
        },
        {
            question: "¿Qué animal es conocido por su capacidad de regenerar partes de su cuerpo?",
            answers: [
                { text: "Estrella de mar", correct: true },
                { text: "Tiburón", correct: false },
                { text: "Perro", correct: false },
                { text: "Gato", correct: false }
            ]
        }
    ],
    historia: [
        {
            question: "¿En qué año se descubrió América?",
            answers: [
                { text: "1492", correct: true },
                { text: "1500", correct: false },
                { text: "1453", correct: false },
                { text: "1600", correct: false }
            ]
        },
        {
            question: "¿Quién fue el primer presidente de los Estados Unidos?",
            answers: [
                { text: "George Washington", correct: true },
                { text: "Abraham Lincoln", correct: false },
                { text: "Thomas Jefferson", correct: false },
                { text: "John Adams", correct: false }
            ]
        }
    ]
};

let currentCategory = '';
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;
let canAnswer = true; // Variable para controlar si se puede responder

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const timerElement = document.getElementById('time-left');
const scoreSection = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');

function startGame(category) {
    currentCategory = category;
    document.getElementById('category-selection').classList.add('hide');
    document.getElementById('game').classList.remove('hide');
    currentQuestionIndex = 0;
    score = 0;
    canAnswer = true;
    showQuestion(questions[currentCategory][currentQuestionIndex]);
}

function showQuestion(question) {
    resetTimer();
    feedbackElement.textContent = ''; // Limpiar feedback
    questionElement.textContent = question.question;
    answersElement.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answersElement.appendChild(button);
    });
    canAnswer = true; // Permitir que se pueda responder nuevamente
    startTimer();
}

function selectAnswer(answer) {
    if (!canAnswer) return; // Evitar que se puedan seleccionar respuestas después del tiempo o si ya se seleccionó una
    clearInterval(timerInterval); // Detener temporizador cuando se selecciona una respuesta
    canAnswer = false; // Evitar que se seleccione otra respuesta
    if (answer.correct) {
        score++;
        feedbackElement.textContent = '¡Correcto!';
        feedbackElement.classList.add('correct');
        feedbackElement.classList.remove('incorrect');
    } else {
        feedbackElement.textContent = 'Incorrecto';
        feedbackElement.classList.add('incorrect');
        feedbackElement.classList.remove('correct');
    }
    setTimeout(nextQuestion, 2000); // Esperar 2 segundos antes de cargar la siguiente pregunta
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[currentCategory].length) {
        showQuestion(questions[currentCategory][currentQuestionIndex]);
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
    timeLeft = 10;
    timerElement.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            feedbackElement.textContent = 'Tiempo agotado';
            feedbackElement.classList.add('incorrect');
            canAnswer = false; // Evitar que se pueda seleccionar respuesta después del tiempo
            setTimeout(nextQuestion, 2000);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = '10'; // Restablecer el temporizador a 10 segundos
    feedbackElement.textContent = ''; // Limpiar el feedback al cambiar la pregunta
    feedbackElement.classList.remove('correct', 'incorrect');
}

function restartGame() {
    // Reiniciar el juego y volver a la página inicial
    scoreSection.classList.add('hide');
    document.getElementById('category-selection').classList.remove('hide');
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 10;
}