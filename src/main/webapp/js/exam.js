/**
 * 
 */

let quizIndex = 0;
let score = 0;
let selectedText = null;
let incorrectQuizzes = [];
let timer;
let timeLeft = 60;

// クイズ開始
function startQuiz() {
    quizIndex = 0;
    score = 0;
    incorrectQuizzes = [];
    showQuestion();
}

// タイマー開始
function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById("timer");
    timerEl.innerText = `残り時間: ${timeLeft}秒`;
}

// タイムアウト時の処理
function handleTimeout() {
    const currentQuiz = quizzes[quizIndex];
    const correctAnswer = currentQuiz.answer;

    incorrectQuizzes.push({
        question: currentQuiz.question,
        correctAnswer: correctAnswer,
        yourAnswer: "時間切れ"
    });

    showFeedback(false, correctAnswer, true);
    showNextButton();
}

// クイズ表示
function showQuestion() {
    const currentQuiz = quizzes[quizIndex];
    const optionsDiv = document.getElementById("options");
	const questionElement = document.getElementById("question");
    optionsDiv.innerHTML = "";
    document.getElementById("next-button-container").innerHTML = "";
	questionElement.innerHTML = `<h4>第${quizIndex + 1}問</h4><p>${currentQuiz.question}</p>`;
	
    startTimer(); // タイマー開始

    const choices = [
        currentQuiz.choice1,
        currentQuiz.choice2,
        currentQuiz.choice3,
        currentQuiz.choice4
    ];

    choices.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("choice-button");
        btn.innerText = `${index + 1}. ${opt}`;
        btn.setAttribute("data-index", index + 1);
        btn.setAttribute("data-text", opt);

        btn.onclick = () => {
            clearInterval(timer);
            document.querySelectorAll('.choice-button').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            const selectedText = btn.getAttribute("data-text");
            const correctAnswer = currentQuiz.answer;

            const isCorrect = checkAnswer(selectedText, correctAnswer);
            saveResult(isCorrect, selectedText, correctAnswer, currentQuiz);
            showFeedback(isCorrect, correctAnswer, selectedText);
            showNextButton();
        };

        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selectedText, correctAnswer) {
    return selectedText === correctAnswer;
}

function saveResult(isCorrect, selectedText, correctAnswer, currentQuiz) {
    if (!isCorrect) {
        incorrectQuizzes.push({
            question: currentQuiz.question,
            correctAnswer: correctAnswer,
            yourAnswer: selectedText ?? "未回答"
        });
    }
    if (isCorrect) score++;
}

// フィードバック表示
function showFeedback(isCorrect, correctAnswer, selectedText, isTimeout = false) {
    const feedbackOverlay = document.getElementById("overlay-feedback");
    feedbackOverlay.style.display = "flex";

    if (isCorrect) {
        feedbackOverlay.innerHTML = '<div style="color: green; font-size: 160px;">○</div>';
        document.getElementById("correct").innerText = "正解！";
        document.getElementById("correct").style.color = "green";
    } else {
		const buttons = document.querySelectorAll("#options button");
        if (buttons.length > 0) {
            buttons.forEach(btn => {
				const text = btn.innerText.replace(/^\d+\.\s*/, "").trim();
				console.log("ボタンのテキスト:", text);
		        console.log("正解:", correctAnswer);
		        console.log("選択:", selectedText);
                if (text === correctAnswer) {
                    btn.style.backgroundColor = "lightgreen";
                } else if (text === selectedText) {
                    btn.style.backgroundColor = "lightcoral";
                } else {
					btn.style.backgroundColor = "";
				} 
                btn.disabled = true;
            });
        }
		
		feedbackOverlay.innerHTML = '<div style="color: red; font-size: 160px;">×</div>';
        document.getElementById("correct").innerText = isTimeout
            ? `時間切れ！正解は：${correctAnswer}`
            : `不正解！正解は：${correctAnswer}`;
        document.getElementById("correct").style.color = "red";
    }

    setTimeout(() => {
        feedbackOverlay.style.display = "none";
    }, 1500);
}

function showNextButton() {
    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.innerText = "次へ";

    nextButton.onclick = () => {
		// フィードバックオーバーレイを非表示にしてから次の問題に進む
		const feedbackOverlay = document.getElementById("overlay-feedback");
		if (feedbackOverlay) {
		    feedbackOverlay.style.display = "none";  // 非表示
			feedbackOverlay.innerHTML = "";          // 中身を空にする
		}
		
		const correctEl = document.getElementById("correct");
		    if (correctEl) {
		        correctEl.innerText = "";
		        correctEl.style.color = "";
		    }
		
        quizIndex++;
        if (quizIndex < quizzes.length) {
            showQuestion();
        } else {
            showResult();
        }
    };

    document.getElementById("next-button-container").appendChild(nextButton);
}

// 結果表示＆バッジ
function showResult() {
    document.getElementById("question").innerText = `あなたのスコア：${score} / ${quizzes.length}`;
    document.getElementById("options").innerHTML = "";
    document.getElementById("next-button-container").innerHTML = "";
    document.getElementById("timer").innerText = "";

    const badge = getBadge(score, quizzes.length);
    const resultEl = document.createElement("div");
    resultEl.innerHTML = `<h3>🏅 あなたのバッジ: ${badge}</h3>`;
    document.getElementById("options").appendChild(resultEl);

    if (incorrectQuizzes.length > 0) {
        const review = document.createElement("div");
        review.innerHTML = "<h3>◀復習しましょう▶</h3>";

		// リストをまとめるラッパー（左寄せ）
		const listWrapper = document.createElement("div");
		listWrapper.classList.add("result-list");
			
		incorrectQuizzes.forEach(item => {
            const qDiv = document.createElement("div");
		    qDiv.innerHTML = `
                <p><strong>Q:</strong> ${item.question}</p>
                <p><span style="color:green;">　正解:</span> ${item.correctAnswer}</p>
				<p><span style="color:red;">　回答:</span> ${item.yourAnswer}</p>
                <hr/>
            `;
            listWrapper.appendChild(qDiv);
        });
		review.appendChild(listWrapper);
        document.getElementById("options").appendChild(review);
    }
	
	    // トップへ戻るボタン
	    const topButton = document.createElement("button");
		topButton.className = "button-primary top-button";
	    topButton.innerText = "トップへ戻る";
	    topButton.onclick = () => {
	        window.location.href = "WelcomeServlet";
	    };
	    const quizArea = document.getElementById("quiz-area");
		quizArea.appendChild(topButton);

	    // 再挑戦ボタン
	    const retryButton = document.createElement("button");
		retryButton.className = "button-primary retry-button";
	    retryButton.innerText = "もう一度挑戦する";
	    retryButton.onclick = () => {
	        location.reload();  // 現在のページを再読み込みして再スタート
	    };
	    quizArea.appendChild(retryButton);
}

// バッジ報酬判定
function getBadge(score, total) {
    if (score === total) return "🥇 Gold";
    if (score >= 8) return "🥈 Silver";
    if (score >= 5) return "🥉 Bronze";
    return "🔰 Beginner";
}

