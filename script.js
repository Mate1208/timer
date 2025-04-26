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

// Populate dropdowns
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

    // Default 10:00
    minutesInput.value = 10;
    secondsInput.value = 0;
}

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

    if (timerInterval) return; // Already running

    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    totalSeconds = (minutes * 60) + seconds;
    updateDisplay();

    isPaused = false;
    isStopped = false;
    pauseButton.textContent = "Pause";
    stopButton.textContent = "Reset";

    timerInterval = setInterval(() => {
        if (!isPaused) {
            totalSeconds--;

            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;

                // Play end whistle
                whistleEndSound.play().catch((err) => {
                    console.log('End sound blocked:', err);
                });

                timerDisplay.textContent = "00:00";
            } else {
                updateDisplay();
            }
        }
    }, 1000);
}

function togglePause() {
    if (!timerInterval) return;

    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Continue" : "Pause";
}

function stopAndReset() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;

    totalSeconds = 600;  // Reset to 10:00
    minutesInput.value = 10;
    secondsInput.value = 0;

    updateDisplay();
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', togglePause);
stopButton.addEventListener('click', stopAndReset);

// Initialize
populateDropdowns();
updateDisplay();