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
let isStopped = false;
let firstInteractionDone = false;
let startTime;
let pausedTime = 0;

// Format time like 00:00
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Update Timer Display
function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
}

// Preload both sounds properly on first interaction
function preloadSounds() {
    // Try to play and immediately pause to unlock both
    Promise.all([
        whistleStartSound.play().then(() => {
            whistleStartSound.pause();
            whistleStartSound.currentTime = 0;
        }).catch(err => console.log('Start sound preload error', err)),

        whistleEndSound.play().then(() => {
            whistleEndSound.pause();
            whistleEndSound.currentTime = 0;
        }).catch(err => console.log('End sound preload error', err))
    ]).then(() => {
        console.log('Sounds preloaded.');
    });
}

// Start the Timer
function startTimer() {
    if (!firstInteractionDone) {
        preloadSounds();
        firstInteractionDone = true;
    }

    // Play start whistle
    whistleStartSound.play().catch((err) => {
        console.log('Start sound blocked:', err);
    });

    // If the timer is already running, do nothing
    if (timerInterval) return;

    // If the timer is paused, calculate how much time has passed
    if (!isPaused) {
        let minutes = parseInt(minutesInput.value) || 0;
        let seconds = parseInt(secondsInput.value) || 0;
        totalSeconds = (minutes * 60) + seconds;
        startTime = Date.now();
    } else {
        startTime = Date.now() - pausedTime * 1000;
    }

    updateDisplay();
    isPaused = false;
    isStopped = false;
    pauseButton.textContent = "Pause";
    stopButton.textContent = "Reset";

    timerInterval = setInterval(() => {
        if (!isPaused) {
            let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            let timeLeft = totalSeconds - elapsedSeconds;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;

                // Play end whistle
                whistleEndSound.play().catch((err) => {
                    console.log('End sound blocked:', err);
                });

                timerDisplay.textContent = "00:00";
            } else {
                timerDisplay.textContent = formatTime(timeLeft);
            }
        }
    }, 1000);
}

// Toggle Pause functionality
function togglePause() {
    if (!timerInterval) return;

    if (!isPaused) {
        // Pausing: calculate how much time has passed
        pausedTime = Math.floor((Date.now() - startTime) / 1000);
        clearInterval(timerInterval);
        timerInterval = null;
    } else {
        // Continue: restart the timer with the previous paused time
        startTimer();
    }

    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Continue" : "Pause";
}

// Stop and Reset functionality
function stopAndReset() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    pausedTime = 0;

    totalSeconds = 600;  // Reset to 10:00
    minutesInput.value = 10;
    secondsInput.value = 0;

    updateDisplay();
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', togglePause);
stopButton.addEventListener('click', stopAndReset);

// Initialize Display
updateDisplay();
