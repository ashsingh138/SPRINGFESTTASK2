const apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timerInterval;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.results.map((questionData, index) => ({
            question: questionData.question,
            options: [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5),
            answer: questionData.correct_answer
        }));
        startQuiz();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function startQuiz() {
    document.getElementById('start-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('end-container').style.display = 'none';
    document.getElementById('score').innerText = `Score: ${score}`;
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    timer = 10;
    document.getElementById('timer').innerText = `Time: ${timer}`;
    timerInterval = setInterval(updateTimer, 1000);

    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerHTML = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerHTML = option;
        button.onclick = () => handleAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function updateTimer() {
    timer--;
    document.getElementById('timer').innerText = `Time: ${timer}`;
    if (timer === 0) {
        nextQuestion();
    }
}

function handleAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
        score++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        document.getElementById('feedback').innerText = `Incorrect! The correct answer is: ${currentQuestion.answer}`;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    document.getElementById('feedback').innerText = '';
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('end-container').style.display = 'block';
    document.getElementById('final-score').innerText = `Your final score is ${score} out of ${questions.length}`;
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('end-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';
    fetchQuestions();
}

document.getElementById('start-btn').addEventListener('click', fetchQuestions);
