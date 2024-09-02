const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const transcript = document.getElementById("transcript");

let recognition;

function initializeRecognition() {
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    setupEventHandlers();
  } else {
    handleUnsupportedBrowser();
  }
}

function setupEventHandlers() {
  recognition.onresult = (event) => {
    for (const result of event.results) {
      for (const alternative of result) {
        transcript.textContent = alternative.transcript + " ";
      }
    }
  };

  recognition.onend = () => {
    toggleButtons(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  startBtn.addEventListener("click", () => {
    startRecognition();
  });

  stopBtn.addEventListener("click", () => {
    stopRecognition();
  });
}

function toggleButtons(isRecognitionActive) {
  startBtn.disabled = isRecognitionActive;
  stopBtn.disabled = !isRecognitionActive;
}

function startRecognition() {
  recognition.start();
  toggleButtons(true);
}

function stopRecognition() {
  recognition.stop();
  toggleButtons(false);
}

function handleUnsupportedBrowser() {
  transcript.textContent =
    "Speech Recognition is not supported in this browser.";
  startBtn.disabled = true;
  stopBtn.disabled = true;
}

function checkMicrophonePermissions() {
  navigator.permissions
    .query({ name: "microphone" })
    .then((permissionStatus) => {
      if (permissionStatus.state === "denied") {
        handlePermissionDenied();
      }
    })
    .catch((error) => {
      console.error("Error checking microphone permissions:", error);
      startBtn.disabled = false;
      stopBtn.disabled = true;
    });
}

function handlePermissionDenied() {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  transcript.textContent =
    "Microphone permission denied. Cannot start recognition.";
}

initializeRecognition();
checkMicrophonePermissions();
