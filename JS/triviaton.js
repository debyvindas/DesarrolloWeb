// Preguntas de cultura general
let questions = []; // Arreglo para almacenar las preguntas obtenidas del servidor
let currentQuestionIndex = 0;
let streak = 0;
let rewards = ["Medalla de Bronce", "Medalla de Plata", "Medalla de Oro"];

function startGame() {
    streak = 0;
    currentQuestionIndex = 0;
    document.getElementById("streak").innerText = `Racha: ${streak}`;
    document.getElementById("reward").innerText = "";
    document.getElementById("Restart-btn").style.display = "block";
    document.getElementById("Restart-btn").style.justifySelf = "center";
    document.getElementById("start-btn").style.display = "none";

    fetchQuestions(); // Llama a la función para obtener las preguntas antes de iniciar
}

function fetchQuestions() {
    const data = new FormData();
    data.append('action', 'Triviaton'); // Acción para el servidor

    fetch('http://localhost/DesarrolloWebF/JS/server.php', {
        method: 'POST',
        body: data
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud al servidor');
            }
            return response.json();
        })
        .then(serverQuestions => {
            console.log('Preguntas obtenidas:', serverQuestions);

            if (!serverQuestions || serverQuestions.length === 0) {
                alert('No se encontraron preguntas disponibles.');
                return;
            }

            questions = serverQuestions; // Almacenar preguntas obtenidas
            console.log(questions);
            loadQuestion(); // Cargar la primera pregunta
        })
        .catch(error => {
            console.error('Error al cargar preguntas:', error);
        });
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0; // Reiniciar a la primera pregunta si se completan todas
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = ""; // Limpiar respuestas anteriores

    questionData.answers.forEach(answerObj => {
        const button = document.createElement("button");
        button.innerText = answerObj.text; // Mostrar el texto de la respuesta
        button.onclick = () => checkAnswer(answerObj.correct); // Verificar si la respuesta es correcta
        answersDiv.appendChild(button);
    });
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        streak++;
        currentQuestionIndex++;
        document.getElementById("streak").innerText = `Racha: ${streak}`;
        checkReward();
        loadQuestion();
    } else {
        alert("¡Respuesta incorrecta! Vuelves a empezar.");
        startGame();
    }
}

function checkReward() {
    let rewardText = "";
    if (streak >= 10 && streak < 20) {
        rewardText = rewards[0]; // Bronce
    } else if (streak >= 20 && streak < 30) {
        rewardText = rewards[1]; // Plata
    } else if (streak >= 30) {
        rewardText = rewards[2]; // Oro
    }
    document.getElementById("reward").innerText = rewardText ? `Premio: ${rewardText}` : "";
}
