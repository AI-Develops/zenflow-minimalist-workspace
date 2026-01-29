/**
 * ZenFlow Application Logic
 *
 * Architecture:
 * - Uses modular Class structure.
 * - Manages state in localStorage.
 * - Handles Audio Context and DOM manipulation.
 */

class ZenFlow {
  constructor() {
    // Configuration
    this.DEFAULT_TIME = 25 * 60; // 25 minutes in seconds
    this.audioFiles = {
      rain: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_87271b86a8.mp3",
      waves: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_34305886eb.mp3",
      forest: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_3232c416c1.mp3",
    };

    // State
    this.state = {
      task: null,
      timeLeft: this.DEFAULT_TIME,
      endTime: null,
      activeSound: null,
    };

    // DOM Elements
    this.elements = {
      inputView: document.getElementById("input-view"),
      timerView: document.getElementById("timer-view"),
      taskInput: document.getElementById("task-input"),
      taskDisplay: document.getElementById("current-task-display"),
      timerDisplay: document.getElementById("timer"),
      addTimeBtn: document.getElementById("btn-add-time"),
      resetBtn: document.getElementById("btn-reset"),
      soundBtns: document.querySelectorAll(".sound-btn"),
    };

    // Audio Object
    this.audioPlayer = new Audio();
    this.audioPlayer.loop = true;

    this.init();
  }

  init() {
    this.loadState();
    this.attachEventListeners();
    this.render();

    // If a task exists, ensure the timer loop is running
    if (this.state.task && this.state.endTime) {
      this.startTimerLoop();
    }
  }

  loadState() {
    const saved = localStorage.getItem("zenflow_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      this.state = { ...this.state, ...parsed };

      // Recalculate timeLeft based on stored endTime if page refreshed
      if (this.state.endTime) {
        const now = Date.now();
        const remaining = Math.ceil((this.state.endTime - now) / 1000);
        if (remaining > 0) {
          this.state.timeLeft = remaining;
        } else {
          // Timer expired while away
          this.state.timeLeft = 0;
          this.state.endTime = null;
        }
      }
    }
  }

  saveState() {
    localStorage.setItem("zenflow_state", JSON.stringify(this.state));
  }

  attachEventListeners() {
    // 1. Task Entry
    this.elements.taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.value.trim() !== "") {
        this.setTask(e.target.value.trim());
      }
    });

    // 2. Add Time (+5 min)
    this.elements.addTimeBtn.addEventListener("click", () => {
      this.addTime(5 * 60);
    });

    // 3. Reset Task
    this.elements.resetBtn.addEventListener("click", () => {
      this.resetTask();
    });

    // 4. Soundboard
    this.elements.soundBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const soundKey = btn.dataset.sound;
        this.toggleSound(soundKey, btn);
      });
    });
  }

  setTask(taskName) {
    this.state.task = taskName;
    this.state.timeLeft = this.DEFAULT_TIME;
    // Set absolute end timestamp for accuracy across reloads
    this.state.endTime = Date.now() + this.state.timeLeft * 1000;

    this.saveState();
    this.render();
    this.startTimerLoop();
  }

  resetTask() {
    this.state.task = null;
    this.state.endTime = null;
    this.state.timeLeft = this.DEFAULT_TIME;

    this.elements.taskInput.value = ""; // Clear input
    this.saveState();
    this.render();
  }

  addTime(seconds) {
    if (!this.state.endTime) return;

    this.state.endTime += seconds * 1000;
    this.state.timeLeft += seconds;
    this.saveState();
    this.updateTimerDisplay(); // Immediate feedback
  }

  startTimerLoop() {
    const tick = () => {
      if (!this.state.task) return; // Stop if reset

      const now = Date.now();
      const distance = this.state.endTime - now;

      if (distance < 0) {
        this.state.timeLeft = 0;
        this.state.endTime = null;
        this.saveState();
        this.updateTimerDisplay();
        // Optional: Play a chime here
        return;
      }

      this.state.timeLeft = Math.ceil(distance / 1000);
      this.updateTimerDisplay();

      // Use requestAnimationFrame for efficiency, throttle to every ~second isn't strictly necessary for visual smoothness here but good practice
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  toggleSound(key, btnElement) {
    // If clicking the active sound, stop it
    if (this.state.activeSound === key) {
      this.audioPlayer.pause();
      this.state.activeSound = null;
      this.renderAudioUI();
      return;
    }

    // Play new sound
    this.state.activeSound = key;
    this.audioPlayer.src = this.audioFiles[key];
    this.audioPlayer
      .play()
      .catch((e) => console.log("Audio autoplay restricted:", e));
    this.renderAudioUI();
  }

  renderAudioUI() {
    this.elements.soundBtns.forEach((btn) => {
      if (btn.dataset.sound === this.state.activeSound) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  updateTimerDisplay() {
    this.elements.timerDisplay.textContent = this.formatTime(this.state.timeLeft);
    document.title = `${this.formatTime(this.state.timeLeft)} - ${this.state.task}`;
  }

  render() {
    if (this.state.task) {
      // Show Timer View
      this.elements.inputView.classList.remove("active");
      this.elements.inputView.classList.add("hidden");
      this.elements.timerView.classList.remove("hidden");
      this.elements.timerView.classList.add("active");

      this.elements.taskDisplay.textContent = this.state.task;
      this.updateTimerDisplay();
    } else {
      // Show Input View
      this.elements.timerView.classList.remove("active");
      this.elements.timerView.classList.add("hidden");
      this.elements.inputView.classList.remove("hidden");
      this.elements.inputView.classList.add("active");
      this.elements.taskInput.focus();
      document.title = "ZenFlow";
    }

    this.renderAudioUI();
  }
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  new ZenFlow();
});
