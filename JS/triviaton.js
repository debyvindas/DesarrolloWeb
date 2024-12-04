// Preguntas de cultura general
const questions = [
    {
      question: "¿Cuál es la capital de Francia?",
      answers: ["Berlín", "Londres", "París", "Madrid"],
      correct: "París"
    },
    {
      question: "¿Cuál es el planeta más grande del sistema solar?",
      answers: ["Júpiter", "Saturno", "Marte", "Tierra"],
      correct: "Júpiter"
    },
    {
      question: "¿Quién pintó la Mona Lisa?",
      answers: ["Leonardo di caprio", "Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci"],
      correct: "Leonardo da Vinci"
    },
    {
      question: "¿En qué año llegó el hombre a la Luna?",
      answers: ["1999", "1969", "1965", "1959"],
      correct: "1969"
    },
    {
      question: "¿Cuál es el océano más grande del mundo?",
      answers: ["Océano Pacífico", "Océano Atlántico", "Océano Índico", "Océano Ártico"],
      correct: "Océano Pacífico"
    },
    {
      question: "¿Quién escribió *Don Quijote de la Mancha*?",
      answers: ["Jorge Luis Borges", "Gabriel García Márquez", "Federico García Lorca", "Miguel de Cervantes"],
      correct: "Miguel de Cervantes"
    },
    {
      question: "¿Cuántos continentes hay en el mundo?",
      answers: ["2", "5", "6", "7"],
      correct: "7"
    },
    {
      question: "¿Cuál es el río más largo del mundo?",
      answers: ["Nilo", "Amazonas", "Yangtsé", "Mississippi"],
      correct: "Amazonas"
    },
    {
      question: "¿Cuál es el animal terrestre más rápido?",
      answers: ["Tigre", "León", "Guepardo", "Antílope"],
      correct: "Guepardo"
    },
    {
      question: "¿Qué gas es esencial para la respiración humana?",
      answers: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"],
      correct: "Oxígeno"
    },
    {
      question: "¿Cuál es el metal más ligero?",
      answers: ["Oro", "Aluminio", "Magnesio", "Litio"],
      correct: "Litio"
    },
    {
      question: "¿Quién fue el primer presidente de los Estados Unidos?",
      answers: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"],
      correct: "George Washington"
    },
    {
      question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
      answers: ["236", "208", "206", "210"],
      correct: "206"
    },
    {
      question: "¿Qué país tiene forma de bota?",
      answers: ["Costa Rica", "España", "Grecia", "Italia"],
      correct: "Italia"
    },
    {
      question: "¿Cuál es la capital de Japón?",
      answers: ["Tokio", "Osaka", "Kioto", "Nagoya"],
      correct: "Tokio"
    },
    {
      question: "¿Quién es el autor de *Cien años de soledad*?",
      answers: ["Carlos Fuentes", "Mario Vargas Llosa", "Julio Cortázar", "Gabriel García Márquez"],
      correct: "Gabriel García Márquez"
    },
    {
      question: "¿Cuál es el país más grande del mundo por área?",
      answers: ["Colombia", "Rusia", "China", "Estados Unidos"],
      correct: "Rusia"
    },
    {
      question: "¿En qué año comenzó la Segunda Guerra Mundial?",
      answers: ["1935", "1945", "1939", "1940"],
      correct: "1939"
    },
    {
      question: "¿Cuál es el idioma más hablado en el mundo?",
      answers: ["Inglés", "Mandarín", "Español", "Hindú"],
      correct: "Mandarín"
    },
    {
      question: "¿Qué tipo de animal es la ballena?",
      answers: ["Pez", "Mamífero", "Anfibio", "Reptil"],
      correct: "Mamífero"
    },
    {
      question: "¿Cuál es el desierto más grande del mundo?",
      answers: ["Gobi", "Saraha", "Kalahari", "Atacama"],
      correct: "Sahara"
    },
    {
      question: "¿Quién inventó la bombilla eléctrica?",
      answers: ["Benjamin Franklin", "Nikola Tesla", "Thomas Edison", "Alexander Graham Bell"],
      correct: "Thomas Edison"
    },
    {
      question: "¿Cuántos planetas hay en el sistema solar?",
      answers: ["5", "7", "9", "8"],
      correct: "8"
    },
    {
      question: "¿Qué país ganó el Mundial de Fútbol en 2018?",
      answers: ["Costa Rica", "Croacia", "Brasil", "Francia"],
      correct: "Francia"
    },
    {
      question: "¿Cuál es la montaña más alta del mundo?",
      answers: ["Everest", "K2", "Kangchenjunga", "Lhotse"],
      correct: "Everest"
    },
    {
      question: "¿Qué sustancia le da color a las plantas?",
      answers: ["Caroteno", "Hemoglobina", "Clorofila", "Antocianina"],
      correct: "Clorofila"
    },
    {
      question: "¿En qué continente se encuentra Egipto?",
      answers: ["Asia", "África", "Europa", "América"],
      correct: "África"
    },
    {
      question: "¿Qué elemento químico tiene el símbolo O?",
      answers: ["Oxígeno", "Oro", "Osmio", "Oganesón"],
      correct: "Oxígeno"
    },
];
    // Añade más preguntas hasta llegar a 25 o más

  
  let currentQuestionIndex = 0;
  let streak = 0;
  let rewards = ["Medalla de Bronce ", "Medalla de Plata", "Medalla de Oro"];
  
  function startGame() {
    streak = 0;
    currentQuestionIndex = 0;
    document.getElementById("streak").innerText = `Racha: ${streak}`;
    document.getElementById("reward").innerText = "";
    loadQuestion();
  }
  
  function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
      currentQuestionIndex = 0;  // Reiniciar a la primera pregunta si se completan todas
    }
  
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";  // Limpiar respuestas anteriores
  
    questionData.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.onclick = () => checkAnswer(answer);
      answersDiv.appendChild(button);
    });
  }
  
  function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correct;
    
    if (selectedAnswer === correctAnswer) {
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
      rewardText = rewards[0];  // Bronce
    } else if (streak >= 20 && streak < 30) {
      rewardText = rewards[1];  // Plata
    } else if (streak >= 30) {
      rewardText = rewards[2];  // Oro
    }
    document.getElementById("reward").innerText = rewardText ? `Premio: ${rewardText}` : "";
  }
  