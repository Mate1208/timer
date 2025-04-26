const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const timerDisplay = document.getElementById('timerDisplay');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const whistleStartSound = document.getElementById('whistleStartSound');
const whistleEndSound = document.getElementById('whistleEndSound');

let timerInterval;
let totalSeconds = 600; // Default 10:00
let isPaused = false;
let firstInteractionDone = false;

// Populate minutes and seconds dropdowns
function populateDropdowns() {
    for (let i = 0; i <= 15; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        minutesInput.appendChild(option);
    }
    for (let i = 0; i <= 59; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        secondsInput.appendChild(option);
    }

    // Set default value to 10:00
    minutesInput.value = "10";
    secondsInput.value = "0";
}

// Format seconds into MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
}

// Preload sounds
function preloadSounds() {
    Promise.all([
        whistleStartSound.play().then(() => {
            whistleStartSound.pause();
            whistleStartSound.currentTime = 0;
        }).catch(err => console.log('Start sound preload error', err)),
        whistleEndSound.play().then(() => {
            whistleEndSound.pause();
            whistleEndSound.currentTime = 0;
        }).catch(err => console.log('End sound preload error', err))
    ]);
}

// Start the timer
function startTimer() {
    if (!firstInteractionDone) {
        preloadSounds();
        firstInteractionDone = true;
    }

    if (timerInterval) return;

    totalSeconds = (parseInt(minutesInput.value) || 0) * 60 + (parseInt(secondsInput.value) || 0);
    updateDisplay();

    whistleStartSound.play().catch(err => console.log('Start sound blocked', err));

    isPaused = false;
    pauseButton.textContent = "Pause";
    stopButton.textContent = "Reset";

    timerInterval = setInterval(() => {
        if (!isPaused) {
            totalSeconds--;
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                whistleEndSound.play().catch(err => console.log('End sound blocked', err));
                timerDisplay.textContent = "00:00";
            } else {
                updateDisplay();
            }
        }
    }, 1000);
}

// Pause or continue
function togglePause() {
    if (!timerInterval) return;
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Continue" : "Pause";
}

// Stop and reset
function stopAndReset() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    minutesInput.value = "10";
    secondsInput.value = "0";
    totalSeconds = 600;
    updateDisplay();
}

// Attach events
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', togglePause);
stopButton.addEventListener('click', stopAndReset);

// INIT (very important to call this!!)
populateDropdowns();
updateDisplay();