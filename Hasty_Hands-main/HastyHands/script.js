const typing_text = document.querySelector(".typing_text p");
const inputField = document.querySelector(".wrapper .input");
const time = document.querySelector(".time span b");
const mistakes = document.querySelector(".mistakes span b");
const wordsPerMinute = document.querySelector(".wpm span b");
const correctPerMinute = document.querySelector(".cpm span b");
const accuracy = document.querySelector(".accuracy span b");
const try_again = document.querySelector(".try_again");
const pause_resume = document.querySelector(".pause");
const timerSelection = document.querySelector(".timerSelect");
const themeSelect = document.querySelector(".theme");
const difficultySelect = document.querySelector(".difficulty");
let currentDifficulty = "easy";

// ATTRIBUTES
let currentIndex = 0;
let mistakeCount = 0;
let maxTime = null;
let timeCount = maxTime;
let timer;
let isTyping = false;
let isPaused = false;

inputField.disabled = true;

function escapeHTML(char) {
  if (char === "<") return "&lt;";
  if (char === ">") return "&gt;";
  if (char === "&") return "&amp;";
  return char;
}

function randomParagraph() {
  typing_text.innerHTML = "";
  let selectedParagraphs;
  if (currentDifficulty === "easy") {
    selectedParagraphs = easyParagraph;
  } else if (currentDifficulty === "medium") {
    selectedParagraphs = mediumParagraph;
  } else {
    selectedParagraphs = hardParagraph;
  }
  const index = Math.floor(Math.random() * selectedParagraphs.length);
  selectedParagraphs[index].split("").forEach((char) => {
    const safeChar = escapeHTML(char);
    const spanTag = `<span>${safeChar}</span>`;
    typing_text.innerHTML += spanTag;
  });
}


function resetTest() {
  clearInterval(timer);
  typing_text.innerHTML = "";
  currentIndex = 0;
  mistakeCount = 0;
  timeCount = maxTime;
  isTyping = false;
  isPaused = false;
  // Update UI
  time.innerText = timeCount;
  mistakes.innerText = 0;
  wordsPerMinute.innerText = 0;
  correctPerMinute.innerText = 0;
  accuracy.innerText = "0 %";
  inputField.value = "";
  randomParagraph();
  inputField.disabled = false;
  inputField.focus();
}

// Apply event listener for focus
document.addEventListener("keydown", () => inputField.focus());
typing_text.addEventListener("click", () => inputField.focus());

function userTimer() {
  if (timeCount > 0 && isPaused === false) {
    timeCount--;
    time.innerText = timeCount;
  } else if (timeCount <= 0) {
    clearInterval(timer);
  }
}


function userTyping() {
  if (isPaused) return;

  const characters = typing_text.querySelectorAll("span");
  const typedChar = inputField.value.split("")[currentIndex];

  if (timeCount > 0) {
    if (!isTyping) {
      isTyping = true;
      timer = setInterval(userTimer, 1000);
    }

    if (typedChar == null) {
      currentIndex--;
      if (
        currentIndex >= 0 &&
        characters[currentIndex].classList.contains("incorrect")
      ) {
        mistakeCount--;
      }
      if (currentIndex >= 0) {
        characters[currentIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (
        characters[currentIndex] &&
        characters[currentIndex].innerText === typedChar
      ) {
        characters[currentIndex].classList.add("correct");
      } else {
        mistakeCount++;
        if (characters[currentIndex]) {
          characters[currentIndex].classList.add("incorrect");
        }
      }
      currentIndex++;
    }

    characters.forEach((span) => span.classList.remove("current"));
    if (currentIndex < characters.length) {
      characters[currentIndex].classList.add("current");
    }

    const wpm = Math.round(
      ((currentIndex - mistakeCount) / 8 / (maxTime - timeCount)) * 60
    );
    const acc = Math.round(
      ((currentIndex - mistakeCount) / currentIndex) * 100
    );

    accuracy.innerHTML = `${isNaN(acc) || acc < 0 ? 0 : acc} %`;
    wordsPerMinute.innerHTML = isNaN(wpm) || wpm < 0 ? 0 : wpm;
    mistakes.innerText = mistakeCount;
    correctPerMinute.innerHTML = currentIndex - mistakeCount;

    // Add next paragraph if finished
    if (currentIndex === characters.length) {
      randomParagraph(); // Just add next one below
    }
  } else {
    clearInterval(timer);
  }
}

inputField.addEventListener("input", userTyping);
try_again.addEventListener("click", resetTest);

// RESET ON ENTER
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    try_again.click();
  }
});

// PAUSE OR RESUME
pause_resume.addEventListener("click", () => {
  isPaused = !isPaused;
  pause_resume.innerHTML = isPaused ? "Resume" : "Pause";
  pause_resume.style.backgroundColor = isPaused ? "#e67e22" : "#17a2b8";

  if (isPaused) {
    clearInterval(timer);
    inputField.disabled = true;
  } else {
    inputField.disabled = false;
    inputField.focus();
    if (isTyping && timeCount > 0) {
      clearInterval(timer);
      timer = setInterval(userTimer, 1000);
    }
  }
});

// THEME TOGGLE
themeSelect.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeSelect.value === "dark");
});

// TIMER SELECT
timerSelection.addEventListener("change", () => {
  maxTime = parseInt(timerSelection.value);
  resetTest();
});


difficultySelect.addEventListener("change", () => {
  currentDifficulty = difficultySelect.value;
  // if (currentDifficulty === "easy") {
  //   maxTime = 60;
  // } else if (currentDifficulty === "medium") {
  //   maxTime = 45;
  // } else if (currentDifficulty === "hard") {
  //   maxTime = 30;
  // }
  timerSelection.value = maxTime; 

  resetTest();
});
