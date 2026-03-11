export function renderQuiz(mountId, questions) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function draw() {
    const q = questions[currentIndex];
    const progress = `${currentIndex + 1} / ${questions.length}`;

    mount.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-card__top">
          <span class="pill">שאלה ${progress}</span>
          <span class="pill pill--score">ניקוד: ${score}</span>
        </div>

        <h3 class="quiz-card__question">${q.question}</h3>

        <div class="quiz-answers">
          ${q.answers.map((answer, index) => `
            <button class="quiz-answer" data-index="${index}" ${answered ? "disabled" : ""}>
              ${answer}
            </button>
          `).join("")}
        </div>

        <div id="quizFeedback" class="quiz-feedback ${answered ? "is-visible" : ""}">
          ${answered ? `<p>${q.explanation}</p>` : ""}
        </div>

        <div class="quiz-actions">
          <button class="btn btn--primary" id="nextQuestionBtn" ${answered ? "" : "disabled"}>
            ${currentIndex === questions.length - 1 ? "סיום" : "לשאלה הבאה"}
          </button>
        </div>
      </div>
    `;

    mount.querySelectorAll(".quiz-answer").forEach(btn => {
      btn.addEventListener("click", () => handleAnswer(Number(btn.dataset.index)));
    });

    document.getElementById("nextQuestionBtn").addEventListener("click", handleNext);
  }

  function handleAnswer(selectedIndex) {
    if (answered) return;

    answered = true;
    const q = questions[currentIndex];
    const feedback = document.getElementById("quizFeedback");

    document.querySelectorAll(".quiz-answer").forEach((btn, index) => {
      btn.disabled = true;

      if (index === q.correctIndex) {
        btn.classList.add("is-correct");
      }

      if (index === selectedIndex && selectedIndex !== q.correctIndex) {
        btn.classList.add("is-wrong");
      }
    });

    if (selectedIndex === q.correctIndex) {
      score++;
      feedback.innerHTML = `<p><strong>נכון.</strong> ${q.explanation}</p>`;
    } else {
      feedback.innerHTML = `<p><strong>לא מדויק.</strong> ${q.explanation}</p>`;
    }

    feedback.classList.add("is-visible");
    document.getElementById("nextQuestionBtn").disabled = false;
    mount.querySelector(".pill--score").textContent = `ניקוד: ${score}`;
  }

  function handleNext() {
    if (!answered) return;

    if (currentIndex === questions.length - 1) {
      mount.innerHTML = `
        <div class="quiz-card quiz-card--done">
          <h3>סיימת את הקווייז 🎉</h3>
          <p>קיבלת <strong>${score}</strong> מתוך <strong>${questions.length}</strong>.</p>
          <button class="btn btn--primary" id="restartQuizBtn">נסה שוב</button>
        </div>
      `;

      document.getElementById("restartQuizBtn").addEventListener("click", () => {
        currentIndex = 0;
        score = 0;
        answered = false;
        draw();
      });

      return;
    }

    currentIndex++;
    answered = false;
    draw();
  }

  draw();
}