// Define variables
let currentTry = 1; // Tracks the current attempt (row)
let currentLetter = 1; // Tracks the current letter position in the row
let boardArray = ["", "", "", "", "", ""]; // Stores user input for each row
let correctWord = ""; // Stores the randomly chosen word
let wordsArr = []; // Stores valid words for the game
let allowed = []; // Stores allowed words for validation
let rows = []; // References the DOM rows
let lettersCount = new Map(); // Tracks letter frequencies in the correct word
let reconfirmList = new Map(); // Helps resolve overused letters
let colorPriority = new Map(); // Priority for coloring
let scoreSystem = new Map(); // Score system mapping attempts to points
let map = new Map(); // Tracks used letters in the current attempt

let submitDelay = 200; // Minimum delay between submissions
let lastSubmit = 0; // Tracks the last submission timestamp

// Add event listener for physical keyboard
document.addEventListener("keydown", (event) => {
  keyPressed(event.key);
});

// Function to handle key presses
function keyPressed(key) {
  if (key === "Backspace") {
    handleBackspace();
  } else if (key === "Enter") {
    handleEnter();
  } else if (/^[a-zA-Z]$/.test(key)) {
    handleLetter(key.toUpperCase());
  }
}

function handleBackspace() {
  if (currentLetter > 1) {
    boardArray[currentTry - 1] = boardArray[currentTry - 1].slice(0, -1);
    currentLetter--;
    updateBoard(false);
  }
}

function handleEnter() {
  if (currentLetter > 5) {
    submitTry(boardArray[currentTry - 1]);
  } else {
    alert("Complete the row before pressing ENTER!");
  }
}

function handleLetter(letter) {
  if (currentLetter <= 5) {
    boardArray[currentTry - 1] += letter;
    currentLetter++;
    updateBoard(false);
  }
}

// Initialize the game
function startGame() {
  // Set up keyboard button IDs
  const keyboardKeys = document.getElementsByClassName("k-button");
  for (const key of keyboardKeys) {
    key.id = key.innerText;
  }

  // Initialize scoring and coloring systems
  scoreSystem.set("1", 6);
  scoreSystem.set("2", 5);
  scoreSystem.set("3", 4);
  scoreSystem.set("4", 3);
  scoreSystem.set("5", 2);
  scoreSystem.set("6", 1);

  colorPriority.set("#538d4e", 3); // Correct position
  colorPriority.set("#b59f3b", 2); // Wrong position
  colorPriority.set("#3a3a3c", 1); // Not in word
  colorPriority.set("", 0);

  rows = document.getElementsByClassName("wordle-row");

  // Load word lists
  fetch("allowed.txt")
    .then((response) => response.text())
    .then((text) => {
      allowed = text.split("\n").map((str) => str.trim());
    });

  fetch("library.txt")
    .then((response) => response.text())
    .then((data) => {
      wordsArr = data.split("\n").map((str) => str.trim());
      correctWord = wordsArr[Math.floor(Math.random() * wordsArr.length)];
      console.log("Correct word:", correctWord);

      // Count letter frequencies in the correct word
      for (const char of correctWord) {
        lettersCount.set(char, (lettersCount.get(char) || 0) + 1);
      }
    });
}

// Submit a user's attempt
function submitTry(word) {
  // Avoid spam submissions
  if (lastSubmit + submitDelay > Date.now()) return;
  lastSubmit = Date.now();

  if (!allowed.includes(word.toLowerCase()) && !wordsArr.includes(word.toLowerCase())) {
    alert("Word does not exist!");
    return;
  }

  updateBoard(true);

  setTimeout(() => {
    if (word.toLowerCase() === correctWord.toLowerCase()) {
      handleWin();
    } else if (currentTry === 6) {
      handleLoss();
    } else {
      currentLetter = 1;
      currentTry++;
    }
  }, 250);
}

// Handle a win
function handleWin() {
  const pointsWon = calculatePoints();
  alert(
    `Wordle Complete!\n+${pointsWon} points\nScore: ${localStorage.getItem(
      "wordle_score"
    )}\nStreak: ${localStorage.getItem("wordle_streak")}`
  );
  if (confirm("Play again?")) location.reload();
}

// Handle a loss
function handleLoss() {
  localStorage.setItem("wordle_streak", 0);
  localStorage.setItem(
    "wordle_score",
    Math.round(localStorage.getItem("wordle_score") / 2)
  );
  alert(
    `Wordle lost! Correct answer: ${correctWord}\nScore: ${localStorage.getItem(
      "wordle_score"
    )}\nStreak: ${localStorage.getItem("wordle_streak")}`
  );
  if (confirm("Play again?")) location.reload();
}

// Update the board with current progress
function updateBoard(trySubmitted) {
  const currentBoxes = rows[currentTry - 1].children;

  // Update box contents
  for (let i = 0; i < currentBoxes.length; i++) {
    currentBoxes[i].innerText = boardArray[currentTry - 1][i] || "";
    currentBoxes[i].style.border =
      i < currentLetter - 1 ? "2px solid rgb(140, 140, 140)" : "2px solid rgb(90, 90, 90)";
  }

  if (trySubmitted) applyColors(currentBoxes);
}

// Apply colors to boxes after submission
function applyColors(boxes) {
  map.clear();
  reconfirmList.clear();

  for (let i = 0; i < boxes.length; i++) {
    const color = getColorForBox(i);
    boxes[i].style.backgroundColor = color;
    boxes[i].style.border = `2px solid ${color}`;
  }

  handleExcessLetters(boxes);
}

// Determine the color for a box
function getColorForBox(index) {
  const char = boardArray[currentTry - 1][index].toLowerCase();

  if (char === correctWord[index]) {
    map.set(char, (map.get(char) || 0) + 1);
    return "#538d4e";
  } else if (correctWord.includes(char)) {
    map.set(char, (map.get(char) || 0) + 1);
    return map.get(char) <= lettersCount.get(char) ? "#b59f3b" : "#3a3a3c";
  } else {
    return "#3a3a3c";
  }
}

// Handle excess letters in reconfirmation
function handleExcessLetters(boxes) {
  reconfirmList.forEach((count, char) => {
    for (let i = 0; i < boxes.length; i++) {
      if (boardArray[currentTry - 1][i].toLowerCase() === char && count > 0) {
        boxes[i].style.backgroundColor = "#3a3a3c";
        boxes[i].style.border = "2px solid #3a3a3c";
        count--;
      }
    }
  });
}

// Calculate points based on streak and current try
function calculatePoints() {
  const currentPoints = scoreSystem.get(String(currentTry));
  const streak = localStorage.getItem("wordle_streak") || 0;
  localStorage.setItem("wordle_streak", parseInt(streak) + 1);
  const totalPoints = currentPoints * (parseInt(streak) + 1);
  localStorage.setItem(
    "wordle_score",
    (parseInt(localStorage.getItem("wordle_score")) || 0) + totalPoints
  );
  return totalPoints;
}

// Start the game
startGame();
