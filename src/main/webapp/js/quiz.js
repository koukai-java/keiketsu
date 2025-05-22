/**
 * 
 */
document.addEventListener('DOMContentLoaded', function() {
    window.onload = () => {
        let timer;
        let quizIndex = 0;
        let score = 0;
        let incorrectQuizzes = [];
        let isTimeout = false;
        let isFirstQuiz = true;
        let quizzes = [];
        let allSpecific = [];

        // 文字列の正規化を行う関数（空白削除、ハイフン統一、小文字化）
        const normalize = (str) => {
            if (str === undefined || str === null) return '';
            return str.toString().trim().replace(/[－−–—]/g, '-').toLowerCase();
        };

        // 問題の初期化と選択
        if (quizType && quizType.startsWith("sp")) {
            const validSpecificPoints = allPoints.filter(p => p.specific && typeof p.specific === 'string' && p.specific.split(',').map(s => s.trim()).every(s => s !== ''));
            quizzes = validSpecificPoints.sort(() => 0.5 - Math.random()).slice(0, Math.max(10, validSpecificPoints.length));
            const specificSet = new Set();
            validSpecificPoints.forEach(p => p.specific.split(',').map(s => s.trim()).filter(s => s !== '').forEach(specificSet.add, specificSet));
            allSpecific = Array.from(specificSet);
            if (validSpecificPoints.length < 10) {
                console.warn(`specific が有効な問題候補が少ないため、${quizzes.length}問で開始します。`);
            }
        } else {
            quizzes = allPoints.sort(() => 0.5 - Math.random()).slice(0, 10);
        }
        console.log("クイズ一覧:", quizzes);
        console.log("quizType:", quizType);

		console.log("チェック用: quizIndex:", quizIndex);
		console.log("チェック用: quizzes.length:", quizzes.length);
		console.log("チェック用: quizzes[quizIndex]:", quizzes[quizIndex]);

		if (quizzes[quizIndex]) {
		    console.log("チェック用: name:", quizzes[quizIndex].name || "なし");
		    console.log("チェック用: q_specific:", quizzes[quizIndex].q_specific || "なし");
		}

		
        // クイズを開始する関数
        function startQuiz() {
            quizIndex = 0;
            score = 0;
            incorrectQuizzes = [];
            isTimeout = false;

            const quizArea = document.getElementById("quiz-area");
            if (!quizArea) {
                console.error("quiz-area要素が見つかりません");
                return;
            }
            quizArea.innerHTML = `
                <h2 class="text16">腧穴マスター</h2>
                <div id="question"></div>
                <div id="options" style="display: flex; flex-direction: column; align-items: center; width: 80%; margin: 0 auto;"></div>
                <div id="timer" style="margin-bottom: 10px;"></div>
                <div id="correct" style="margin-top: 10px;"></div>
                <div id="next-button-container" style="margin-top: 10px; width: 400px;"></div>
                <div id="overlay-feedback";"></div>
            `;
            isFirstQuiz = false;
            showQuestion();
            console.log("startQuiz() が実行されました");
        }

        // 問題を表示する関数
        function showQuestion() {
            console.log("showQuestion() が実行されました");
            const questionDiv = document.getElementById("question");
            const optionsDiv = document.getElementById("options");
            const correctElement = document.getElementById("correct");
            const nextButtonContainer = document.getElementById("next-button-container");
            nextButtonContainer.innerHTML = ""; // 次へボタンをクリア

            if (!questionDiv || !optionsDiv || !correctElement) {
                console.error("必要なDOM要素が見つかりません");
                return;
            }

            optionsDiv.innerHTML = "";
            correctElement.innerText = "";
            let questionText = `【第 ${quizIndex + 1} 問】`;
            let correctAnswer;

            if (qLevel === "intermediate") {
				console.log("intermediate モードに入りました");
                const inputField = document.createElement("input");
                inputField.type = "text";
                inputField.id = "answer-input";
                inputField.placeholder = "解答を入力してください";
                Object.assign(inputField.style, { width: "50%", padding: "10px", margin: "10px auto", display: "block", fontSize: "1.2em" });
                optionsDiv.appendChild(inputField);
				try {
				    console.log("チェック用: quizIndex typeof:", typeof quizIndex, "value:", quizIndex);
				    console.log("チェック用: quizzes.length:", quizzes.length);
				    console.log("チェック用: quizzes[quizIndex]:", quizzes[quizIndex]);
				} catch (e) {
				    console.error("ログ中に例外発生:", e);
				}

				console.log("quizIndex:", quizIndex);
				console.log("quizType:", quizType);
				console.log("quizzes[quizIndex]:", quizzes[quizIndex]);
				

                if (quizType && quizType.startsWith("lo")) {
                    questionText += `経穴名：<span class="math-inline">${quizzes[quizIndex].name}<br>位置：</span>${quizzes[quizIndex].q_location}`;
                    correctAnswer = quizzes[quizIndex].ans_location;
                } else if (quizType && quizType.startsWith("sp")) {
					console.log(quizzes[quizIndex].name);
					console.log(quizzes[quizIndex].q_specific);
					const name = quizzes[quizIndex].name || "名称なし";
					const qSpecific = quizzes[quizIndex].q_specific || "情報なし";
					const sanitizedSpecific = qSpecific.replace(/</g, "&lt;").replace(/>/g, "&gt;");
					questionText += "経穴名：<span class=\"math-inline\">" + quizzes[quizIndex].name + "<br>要穴：</span>" + quizzes[quizIndex].q_specific;
                    correctAnswer = quizzes[quizIndex].ans_specific;
                } else {
                    questionText += `経穴名：<span class="math-inline">${quizzes[quizIndex].name}<br>位置：</span>${quizzes[quizIndex].q_location}`;
                    correctAnswer = quizzes[quizIndex].ans_location;
                }
                questionDiv.innerHTML = questionText;
                showNextButton(true, correctAnswer);

            } else { // qLevel === "elementary"
                questionText += `経穴名： ${quizzes[quizIndex].name}`;
                questionDiv.innerHTML = questionText;
                let choices = [];

                if (quizType && quizType.startsWith("sp") && quizzes[quizIndex].specific && quizzes[quizIndex].specific.trim() !== '') {
                    const specificValues = quizzes[quizIndex].specific.split(',').map(s => s.trim()).filter(s => s !== '');
                    if (specificValues.length > 0) {
                        correctAnswer = specificValues[Math.floor(Math.random() * specificValues.length)];
                        const incorrectSpecificChoices = allSpecific.filter(s => s !== correctAnswer).sort(() => 0.5 - Math.random()).slice(0, 3);
                        choices = [...incorrectSpecificChoices, correctAnswer].sort(() => 0.5 - Math.random());
                    }
                } else {
                    correctAnswer = quizzes[quizIndex].location;
                    const incorrectChoices = Array.from(new Set(allPoints.map(p => p.location))).filter(loc => loc !== correctAnswer).sort(() => 0.5 - Math.random()).slice(0, 3);
                    choices = [...incorrectChoices, correctAnswer].sort(() => 0.5 - Math.random());
                }

                choices.forEach((opt, index) => {
                    const btn = document.createElement("button");
                    btn.classList.add('choice-button');
                    btn.innerText = `${index + 1}. ${opt}`;
                    btn.setAttribute("data-location", opt);
                    Object.assign(btn.style, { display: "block", margin: "10px auto", width: "70%", fontSize: "16px", textAlign: "left" });
                    btn.onclick = () => {
                        document.querySelectorAll('#options button').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                    };
                    optionsDiv.appendChild(btn);
                });
                showNextButton(false, correctAnswer);
            }
            startTimer(correctAnswer);
            console.log("showQuestion() が完了しました");
        }

        // タイマーを開始する関数
        function startTimer(correctAnswer) {
            let timeLeft = 60;
            const timerDiv = document.getElementById("timer");
            timerDiv.innerText = `残り時間：${timeLeft}秒`;
            clearInterval(timer);
            isTimeout = false;

            timer = setInterval(() => {
                timeLeft--;
                timerDiv.innerText = `残り時間：${timeLeft}秒`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isTimeout = true;
                    showAnswer(null, correctAnswer);
                }
            }, 1000);
        }

        // 回答をチェックする関数
        function checkAnswer(selected, correct) {
            const normalizedSelected = normalize(selected);
            const normalizedCorrect = normalize(correct);
            return normalizedSelected === normalizedCorrect;
        }

        // 回答を表示する関数
        function showAnswer(selected, correct) {
            const feedbackOverlay = document.getElementById("overlay-feedback");
            const correctElement = document.getElementById("correct");
            if (!feedbackOverlay || !correctElement) {
                console.error("overlay-feedbackまたはcorrect要素が見つかりません");
                return;
            }
            feedbackOverlay.style.display = "flex";
            let feedbackText = '';
            let correctMessage = '';
            let correctColor = '';

            if (selected === null || selected === undefined || selected === "") {
                feedbackText = '<div style="color: red; font-size: 160px;">×</div>';
                correctMessage = `未入力です！正解は： ${correct}`;
                correctColor = "red";
            } else if (normalize(selected) === normalize(correct)) {
                feedbackText = '<div style="color: green; font-size: 160px;">○</div>';
                correctMessage = "正解！";
                correctColor = "green";
                score++;
            } else {
                feedbackText = '<div style="color: red; font-size: 160px;">×</div>';
                correctMessage = `不正解！正解は： ${correct}`;
                correctColor = "red";
            }

            feedbackOverlay.innerHTML = feedbackText;
            correctElement.innerText = correctMessage;
            correctElement.style.color = correctColor;

            const buttons = document.querySelectorAll("#options button");
            buttons.forEach(btn => {
                if (btn.getAttribute("data-location") === correct) {
                    btn.style.backgroundColor = "lightgreen";
                }
                if (selected && btn.getAttribute("data-location") === selected && selected !== correct) {
                    btn.style.backgroundColor = "lightcoral";
                }
                btn.disabled = true;
            });

            setTimeout(() => {
                feedbackOverlay.style.display = "none";
            }, 1500);
        }

        // 次へボタンを表示する関数
        function showNextButton(isIntermediate, correctAnswerFromQuestion) {
            const nextButton = document.createElement("button");
            nextButton.id = "next-button";
            nextButton.innerText = "次へ";
            Object.assign(nextButton.style, { width: "300px", height: "50px", fontSize: "16px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" });
            nextButton.onclick = () => {
                clearInterval(timer);
                const currentQuiz = quizzes[quizIndex];
                let userAnswer;
                let selectedAnswer;
                let isCorrect = false;

                if (isIntermediate) {
                    userAnswer = document.getElementById("answer-input").value.trim();
                    isCorrect = checkAnswer(userAnswer, correctAnswerFromQuestion);
                    if (!isCorrect) {
                        incorrectQuizzes.push({ qLevel, name: currentQuiz.name, q_location: currentQuiz.q_location, q_specific: currentQuiz.q_specific, correctAnswer: correctAnswerFromQuestion, yourAnswer: userAnswer || "(未入力)" });
                    }
                    showAnswer(userAnswer, correctAnswerFromQuestion);
                } else {
                    const checkedAnswer = document.querySelector('#options button.selected');
                    selectedAnswer = checkedAnswer ? checkedAnswer.getAttribute("data-location") : null;
                    isCorrect = checkAnswer(selectedAnswer, correctAnswerFromQuestion);
                    if (!isCorrect) {
                        incorrectQuizzes.push({ qLevel, name: currentQuiz.name, location: currentQuiz.location, specific: currentQuiz.specific, correctAnswer: correctAnswerFromQuestion, yourAnswer: selectedAnswer || "(未回答)" });
                    }
                    showAnswer(selectedAnswer, correctAnswerFromQuestion);
                }

                quizIndex++;
                if (quizIndex < quizzes.length) {
                    setTimeout(showQuestion, 2000);
                } else {
                    setTimeout(showResult, 2000);
                }
            };
            document.getElementById("next-button-container").appendChild(nextButton);
        }

        // 結果を表示する関数
        function showResult() {
            console.log("showResult() が実行されました");
            const quizArea = document.getElementById("quiz-area");
            if (!quizArea) {
                console.error("quiz-area要素が見つかりません");
                return;
            }
            quizArea.innerHTML = "";
            quizArea.style.textAlign = "center";

            const scorePercentage = (score / quizzes.length) * 100;
            const resultContainer = document.createElement("div");
            resultContainer.style.width = "80%";
            resultContainer.style.margin = "0 auto";
            resultContainer.innerHTML = `
                <h2 class="text16">腧穴マスター</h2>
                <h3>結果</h3>
                <p>正解数：${score} / ${quizzes.length} (${scorePercentage.toFixed(1)}%)</p>
            `;

            if (incorrectQuizzes.length > 0) {
                const reviewHeader = document.createElement("h3");
                reviewHeader.textContent = "◀復習しましょう▶";
                reviewHeader.style.textAlign = "center";
                const reviewList = document.createElement("ul");
                reviewList.style.listStyleType = "decimal";
                reviewList.style.padding = "0";
                reviewList.style.width = "100%";

                incorrectQuizzes.forEach(item => {
                    const listItem = document.createElement("li");
                    Object.assign(listItem.style, { margin: "10px 0", padding: "10px", border: "0px solid #ddd", borderRadius: "5px", textAlign: "left" });
                    let userAnswerInfo = !item.yourAnswer ? "<span style='color: orange;'>(未回答)</span>" : item.yourAnswer === "timeout" ? "<span style='color: orange;'>(時間切れ)</span>" : item.yourAnswer;
                    let questionInfo = '';
                    if (item.qLevel === "intermediate") {
                        questionInfo = quizType && quizType.startsWith("sp") ? `問題：${item.q_specific || "未設定"}<br>　　　` : `問題：${item.q_location || "未設定"}<br>　　　`;
                    }
                    const correctAnswerLabel = `<span class="correct-answer-label">${item.correctAnswer || (item.location || item.specific || "未設定")}</span>`;
                    listItem.innerHTML = `<strong>${item.name}</strong>：${questionInfo}<span style="color:green;">　正解</span>：${correctAnswerLabel}<br>　　　<span style="color:red;">　回答</span>：${userAnswerInfo}<hr>`;
                    reviewList.appendChild(listItem);
                });
                resultContainer.appendChild(reviewHeader);
                resultContainer.appendChild(reviewList);
            } else {
                const congrats = document.createElement("p");
                congrats.innerHTML = `
                    <p>全問正解です！</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <img src="/keiketsu/images/stamp_dekimashita1.png" alt="よくできました！" style="max-width: 300px; height: auto;">
                    </div>
                `;
                resultContainer.appendChild(congrats);
            }

            quizArea.appendChild(resultContainer);

            const buttonContainer = document.createElement("div");
			buttonContainer.style.marginTop = "20px";

            const topButton = document.createElement("a");
            topButton.href = "WelcomeServlet";
            topButton.className = "button-primary top-button";
            topButton.textContent = "トップへ戻る";
            buttonContainer.appendChild(topButton);

            const retryButton = document.createElement("button");
            retryButton.className = "button-primary retry-button";
			retryButton.innerText = "もう一度挑戦する";
			retryButton.onclick = startQuiz;
			buttonContainer.appendChild(retryButton);

            resultContainer.appendChild(buttonContainer);
            quizArea.appendChild(resultContainer);
            console.log("最終的な quizArea の中身:", quizArea.innerHTML);
	        }

	        startQuiz();
	    };
	});
