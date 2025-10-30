let questions = [];
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = 0;
fetch("db.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    startQuiz();
  })
  .catch((error) => {
    questionElement.innerHTML = "Failed to load questions 😢";
    console.error("Error loading JSON:", error);
  });
  
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}
// 🔹 Hàm tráo thứ tự (Fisher–Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  const questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

  // 🔹 Tráo thứ tự câu trả lời trước khi hiển thị
  const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

  shuffledAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";
  if (correct) {
    score++;
  }
  Array.from(answerButtons.children).forEach((button) => {
    button.disabled = true;
    setStatusClass(button, button.dataset.correct === "true");
  });
  nextButton.style.display = "block";
   setTimeout(() => {
    handleNextButtonClick();
  }, 3000);
}

function showScore() {
  resetState();
  questionElement.innerHTML = `Quiz over! You scored ${score}`;
  nextButton.innerHTML = "Play again";
  nextButton.style.display = "block";

  // nextButton.removeEventListener('click', handleNextButtonClick);
}

function handleNextButtonClick() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButtonClick();
  } else {
    startQuiz();
  }
});

function setStatusClass(element, correct) {
  if (correct) {
    element.style.backgroundColor = "#4caf50";
  } else {
    element.style.backgroundColor = "#f44336";
  }
}

startQuiz();
