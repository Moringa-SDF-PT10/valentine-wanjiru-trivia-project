
//DOM Elements
let startButton = document.getElementById('start-button');
let quizPage = document.getElementById('quiz-page');
let startPage = document.getElementById('start-page');

startPage.style.display = 'block';
quizPage.style.display = 'none';

let score = 0;
let currentQuestionIndex = 0;
let bodyData = [];
let feedbackElement = document.createElement('div');
feedbackElement.id = 'feedback';
let questionTimer;
let totalStartTime;
let totalEndTime;

// Function to reset quiz state
function resetQuizState() {
  score = 0;
  currentQuestionIndex = 0;
}
// Show start page
function showStartPage() {
  quizPage.style.display = 'none';
  startPage.style.display = 'block';
}

// Show quiz page
function showQuizPage() {
  quizPage.innerHTML = '';
  startPage.style.display = 'none';
  quizPage.style.display = 'block';
}
 // Function to shuffle an array
 function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
  }

// Selecting answers
function selectAnswer(e, selectedAnswer) {
e.preventDefault();
let correctAnswer = bodyData[currentQuestionIndex].correct_answer;
let modification = document.createElement('div');

// Clear feedback element
feedbackElement.innerText = '';

// Higlight selected answer
const selectedInput = e.target;
const selectedOption = selectedInput.closest('ol');

if (selectedOption) {
  selectedOption.classList.add('answer-selected');
}

if (selectedAnswer === correctAnswer) {
score++;
feedbackElement.innerText = 'Correct!';
feedbackElement.style.color = 'blue';
}
else {
modification.innerHTML = correctAnswer;
feedbackElement.innerText = `Incorrect! The correct answer is ${modification.innerText}`;
feedbackElement.style.color = 'rgb(241, 23, 7)';
}

// Disable all answer buttons for the current question
let answerButtons = document.querySelectorAll(
`input[name="question-${currentQuestionIndex}"]`
);
answerButtons.forEach((btn) => {
btn.disabled = true;
});

clearInterval(questionTimer);
console.log(bodyData);
// // Move to the next question after 2 seconds delay
setTimeout(() => {
currentQuestionIndex++;
if (currentQuestionIndex < bodyData.length) {
showQuestion();
feedbackElement.innerText = '';
}
else {
showResults();
feedbackElement.innerText = '';
}
}, 2000);
}

// Function to create and display a single question
function showQuestion() {
  quizPage.innerHTML = '';

  let timerDisplay = document.createElement('div')
  timerDisplay.id = 'countdown';
  quizPage.appendChild(timerDisplay);

  if (currentQuestionIndex >= bodyData.length) {
    showResults();
    return;
  }

  questionData = bodyData[currentQuestionIndex];

  let modification = document.createElement('div');

  // Create question element
  let questionElement = document.createElement('h3');
  modification.innerHTML = questionData.question;
  questionElement.textContent = `${currentQuestionIndex + 1}: ${modification.innerText}`
  quizPage.appendChild(questionElement);

  // Combine incorrect and correct answers into a single array
  let allAnswers = shuffleArray([
      ...questionData.incorrect_answers,
      questionData.correct_answer,
  ]);

  // Function to create answer elements

allAnswers.forEach((answer) => {
  let answerElement = document.createElement('ol');
  modification.innerHTML = answer;
  answerElement.textContent = modification.innerText;

  let answerButton = document.createElement('input');
  answerButton.type = 'radio';
  answerButton.name = `question-${currentQuestionIndex}`;
  answerButton.value = answer;
  answerButton.addEventListener('click', (e) => selectAnswer(e, answer));

  answerElement.prepend(answerButton);
  quizPage.appendChild(answerElement);
});
quizPage.appendChild(feedbackElement);
// Function to end quiz
let endQuiz = document.createElement('button');
endQuiz.textContent = "End Quiz";
quizPage.appendChild(endQuiz);
endQuiz.addEventListener('click', showResults);

startQuestionTimer();
};

function startQuestionTimer() {
  let timeLeft = 15;
  const timerDisplay = document.getElementById('countdown');
  timerDisplay.textContent = `You have: ${timeLeft}s left`;

  questionTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `You have: ${timeLeft}s left`;
    timerDisplay.style.color = "darkgreen";

    if (timeLeft <= 0) {
      let correctAnswer = bodyData[currentQuestionIndex].correct_answer;
      clearInterval(questionTimer);
      feedbackElement.innerText = `Time's up!.The correct answer is ${correctAnswer}`;
      feedbackElement.style.color = 'red';

      // Disable buttons to prevent answering after time's up
      let answerButtons = document.querySelectorAll(
        `input[name="question-${currentQuestionIndex}"]`
      );
      answerButtons.forEach((btn) => {
        btn.disabled = true;
      });

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < bodyData.length) {
          showQuestion();
          feedbackElement.innerText = '';
        } else {
          showResults();
        }
      }, 2000);
    }
  }, 1000);
}



// Function to display the results
function showResults() {
  totalEndTime = Date.now();
  const totalTimeInSeconds = Math.floor((totalEndTime - totalStartTime) / 1000);
  quizPage.innerHTML = '';

  // Create and display the score message
  let scoreMessage = document.createElement('h2');
  scoreMessage.textContent = `Your score is: ${score} out of ${bodyData.length}`;
  quizPage.appendChild(scoreMessage);

  let timeTaken = document.createElement('p');
  timeTaken.textContent = `You took ${totalTimeInSeconds} seconds!`;
  quizPage.appendChild(timeTaken);


  // Create and display the restart button
  let restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Quiz';
  restartButton.addEventListener('click', () => {
  // Reset score and question index
    resetQuizState();
    showStartPage();
    clearInterval(questionTimer);
  });
  quizPage.appendChild(restartButton);
}
function showError(message) {
  quizPage.innerHTML = '';

  const errorElement = document.createElement('div');
  errorElement.textContent = message;
  errorElement.id = 'error';

  quizPage.appendChild(errorElement);
}

startButton.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log("start-button:", startButton);
  resetQuizState();
  totalStartTime = Date.now();

  // Get values from the form
  const amount = document.getElementById('questions').value;
  const category = document.getElementById('category').value === "any" ? "" : document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value === "any" ? "" : document.getElementById('difficulty').value;
  const type = document.getElementById('type').value  === "any" ? "" : document.getElementById('type').value;


  // Fetching data
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`);
    const data = await response.json();
    console.log("fetched data:", data);
    bodyData = data.results;
    showQuizPage();

    if (!bodyData || bodyData.length ===0 ) {
      showError("No questions found for the selected options. Please try different settings.");

      const tryAgainButton = document.createElement('button');
      tryAgainButton.textContent = 'Try Again';
      tryAgainButton.addEventListener('click', showStartPage);
      quizPage.appendChild(tryAgainButton);

      return;
    }
    showQuestion();
 }
  catch(error) {
    console.error("Error fetching results:", error);
    showError("Oops! Something went wrong while loading the quiz. Please try again.");

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Again';
    tryAgainButton.addEventListener('click', showStartPage);
    quizPage.appendChild(tryAgainButton);

  }
  });

