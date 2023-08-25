// Set up variables and constants
let timerInterval;
let startTime;
let endTime;
let timeElapsed;
let correctCharacters;
let incorrectCharacters;
let currentQuoteIndex;
let typingStarted = false; //variable for Automatically time Started

// Array of quotes for the typing test
const quotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Your time is limited, don't waste it living someone else's life.",
];

// Get DOM elements
const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const speedElement = document.getElementById("speed");
const accuracyElement = document.getElementById("accuracy");
const progressElement = document.getElementById("progress");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const newQuoteButton = document.getElementById("newQuoteButton");
const themeToggle = document.getElementById("themeToggle");

// Event listeners
startButton.addEventListener("click", startTest);
resetButton.addEventListener("click", resetTest);
newQuoteButton.addEventListener("click", newQuote);
themeToggle.addEventListener("click", toggleDarkMode);

// Function to fetch a random quote from the Quotable API
async function fetchRandomQuote() {
  const response = await fetch("https://api.quotable.io/random");
  const data = await response.json();
  return data.content;
}

// Event listener for generating a new random quote
newQuoteButton.addEventListener("click", async function () {
  const randomQuote = await fetchRandomQuote();
  quoteElement.innerText = randomQuote;
});

// Start the typing test
function startTest() {
  if (!typingStarted) {
    typingStarted = true;
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
  }
}

// For Reset the typing test
function resetTest() {
  const confirmed = confirm(
    "Are you sure you want to start over? Your progress will be lost."
  );

  if (confirmed) {
    location.reload();
  }
  clearInterval(timerInterval);
  inputElement.value = "";
  inputElement.disabled = true;
  startButton.disabled = false;
  resetButton.disabled = true;
  newQuoteButton.disabled = false;
  quoteElement.innerText = "";
  timerElement.innerText = "00:00";
  speedElement.innerText = "0";
  accuracyElement.innerText = "0";
  progressElement.style.width = "0";
  progressElement.style.backgroundColor = "#333";
  // Add visual feedback here (e.g., change button background color)
  resetButton.style.backgroundColor = "#ccc";
  setTimeout(() => {
    resetButton.style.backgroundColor = "#333";
  }, 500); // Reset button color after 500ms
}

// Generate a new random quote
function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteElement.innerText = quotes[randomIndex];
}

// Update the timer
function updateTimer() {
  const currentTime = new Date().getTime();
  timeElapsed = (currentTime - startTime) / 1000;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = Math.floor(timeElapsed % 60);
  timerElement.innerText = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

// Format time values (e.g., 5 -> 05)
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Calculate and display the typing speed and accuracy
function calculateSpeedAccuracy() {
  const quote = quoteElement.innerText;
  const typedText = inputElement.value;
  const typedLength = typedText.length;
  const quoteLength = quote.length;
  const typedWords = typedText.trim().split(" ");
  const quoteWords = quote.trim().split(" ");
  const typedWordCount = typedWords.length;
  let correctWordCount = 0;

  for (let i = 0; i < typedWordCount; i++) {
    if (typedWords[i] === quoteWords[i]) {
      correctWordCount++;
    }
  }

  const speed = Math.round((60 * correctWordCount) / timeElapsed);
  const accuracy = Math.round((typedLength / quoteLength) * 100);

  speedElement.innerText = speed;
  accuracyElement.innerText = accuracy;
}

// Update the progress bar
function updateProgressBar() {
  const quote = quoteElement.innerText;
  const typedText = inputElement.value;
  const quoteLength = quote.length;
  const typedLength = typedText.length;
  const progressPercent = (typedLength / quoteLength) * 100;
  progressElement.style.width = `${progressPercent}%`;

  if (typedLength === quoteLength) {
    progressElement.style.backgroundColor = "green";
  } else {
    progressElement.style.backgroundColor = "#333";
  }
}

// Handle input events
inputElement.addEventListener("input", function () {
  if (!typingStarted) {
    startTest(); // Automatically start the timer when the user begins typing
  }

  calculateSpeedAccuracy();
  updateProgressBar();

  if (inputElement.value === quoteElement.innerText) {
    inputElement.disabled = true;
    clearInterval(timerInterval);
    endTime = new Date().getTime();
  }
});

// Toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
}
// Generate a random quote initially
newQuote();