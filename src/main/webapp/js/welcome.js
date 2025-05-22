/**
 * 
 */
   document.addEventListener('DOMContentLoaded', function() {
   const levelButtons = document.querySelectorAll('.level-button');
   const qLevelInputs = document.querySelectorAll('input[name="qLevel"]');
   let selectedLevelInput = document.querySelector('input[name="qLevel"][value="elementary"]');
   const quizTypeInputs = document.querySelectorAll('input[name="quizType"]');
   const form = document.querySelector('form');

   // 初期状態で初級を選択
   if (selectedLevelInput) {
       const correspondingLabel = document.querySelector(`.level-button[value="${selectedLevelInput.value}"]`);
       if (correspondingLabel) {
           correspondingLabel.classList.add('selected');
       }
           selectedLevelInput.checked = true;
       }
   
   levelButtons.forEach(button => {
       button.addEventListener('click', function() {
		console.log("クリックされたボタンのvalue:", this.getAttribute('value'));
           qLevelInputs.forEach(input => input.checked = false);
           levelButtons.forEach(btn => btn.classList.remove('selected'));
           this.classList.add('selected');
           const correspondingInput = document.querySelector(`input[name="qLevel"][value="${this.getAttribute('value')}"]`);
		   console.log("対応するinput要素:", correspondingInput);
		   if (correspondingInput) {
               correspondingInput.checked = true;
               selectedLevelInput = correspondingInput;
			   console.log("選択されたqLevel:", correspondingInput.value);
			   selectedLevelInput = correspondingInput;

           } else {
			console.log("対応するinput要素が見つかりませんでした");
		   }
		   // ここに3のコードを追加
		      form.addEventListener('submit', function(event) {
		         const selectedQLevel = Array.from(qLevelInputs).find(input => input.checked);
		         console.log("フォーム送信直前のqLevel:", selectedQLevel ? selectedQLevel.value : "未選択");
		         // フォームの送信を妨げないために、preventDefaultは呼び出さない
		      });
           });
       });
   
    // === 腧穴位置のラジオボタンを動的に生成 ===
   const meridianLabels = [
       { value: "gv", label: "督脈" },
       { value: "cv", label: "任脈" },
       { value: "lu", label: "肺経" },
       { value: "li", label: "大腸経" },
       { value: "st", label: "胃経" },
       { value: "sp", label: "脾経" },
       { value: "he", label: "心経" },
       { value: "si", label: "小腸経" },
       { value: "bl", label: "膀胱経" },
       { value: "ki", label: "腎経" },
       { value: "pc", label: "心包経" },
       { value: "tw", label: "三焦経" },
       { value: "gb", label: "胆経" },
       { value: "lv", label: "肝経" },
       { value: "ex", label: "奇穴" },
       { value: "random", label: "ランダム" }
   ];

   const areaLabels = [
       { value: "ex-ml", label: "経絡" },
       { value: "ex-gu", label: "骨度" },
       { value: "ex-me", label: "経穴" },
       { value: "ex-sp", label: "要穴" },
       { value: "ex-yo", label: "横並び" },
       { value: "ex-ex", label: "奇穴" },
       { value: "ex-an", label: "解剖" },
       { value: "ex-cl", label: "臨床" },
       { value: "ex-mo", label: "現代" },
       { value: "ex-ra", label: "ランダム" },
     ];
    
   function renderRadioOptions(containerId, labelArray, nameAttr = "quizType", prefix = "") {
       const container = document.getElementById(containerId);
       container.innerHTML = "";
       labelArray.forEach(({ value, label }) => {
           const inputValue = prefix ? `${prefix}-${value}` : value;
           const labelEl = document.createElement("label");
           labelEl.innerHTML = `<input type="radio" name="${nameAttr}" value="${inputValue}"> ${label}`;
           container.appendChild(labelEl);
       });
   }

   renderRadioOptions("quiz-options", meridianLabels, "quizType", "lo");
   renderRadioOptions("quiz-options-sp", meridianLabels, "quizType", "sp");
   renderRadioOptions("options-area", areaLabels, "quizType");
   });

   function setupMutualExclusion() {
	console.log("setupMutualExclusion実行時のqLevel:", 
	    Array.from(document.querySelectorAll('input[name="qLevel"]'))
	        .find(input => input.checked)?.value || "未選択");
   // 相互排他処理のための要素取得
   const allRadios = document.querySelectorAll('#quiz-options input[type="radio"], #quiz-options-sp input[type="radio"], #options-area input[type="radio"]');
   const examSelect = document.getElementById('quizType');

   console.log('ラジオボタン数:', allRadios.length);
   console.log('セレクトボックス見つかった:', examSelect !== null);
   
   // ラジオボタンのイベント委任 - 親要素にイベントリスナーを設定
   document.querySelectorAll('#quiz-options, #quiz-options-sp, #options-area').forEach(container => {
     container.addEventListener('change', function(e) {
       if (e.target && e.target.type === 'radio') {
         console.log('ラジオボタン選択:', e.target.value);
               // セレクトボックスを無効化
               examSelect.selectedIndex = 0; // 選択をリセット
               console.log('セレクトボックス無効化完了');
			   // quiz-optionsなどのラジオボタンイベントリスナー内に追加
			   container.addEventListener('change', function(e) {
			       if (e.target && e.target.type === 'radio') {
			           console.log('ラジオボタン選択後のqLevel:', 
			               Array.from(document.querySelectorAll('input[name="qLevel"]'))
			                   .find(input => input.checked)?.value || "未選択");
			       }
			   });
           }
       });
   });

   // セレクトボックスが変更されたときの処理
   examSelect.addEventListener('change', function() {
   	console.log('セレクトボックス変更:', this.value);
       if (this.value !== '') {
           // すべてのラジオボタンを無効化
           allRadios.forEach(radio => {
               radio.checked = false; // 選択をリセット
           });
           console.log('全ラジオボタン無効化完了');
       }
   });
   }

   const startButton = document.querySelector('form button[type="submit"]');
   //const qLevelInputs = document.querySelectorAll('input[name="qLevel"]'); 
   startButton.addEventListener('click', function(event) {
	   const examSelect = document.getElementById('quizType');
       const isRadioSelected = Array.from(document.querySelectorAll('#quiz-options input[type="radio"], #quiz-options-sp input[type="radio"], #options-area input[type="radio"]')).some(radio => radio.checked);
       const isSelectSelected = examSelect.value !== '';
       
       if (!isRadioSelected && !isSelectSelected) {
           alert('問題範囲をいずれか一つ選択してください。');
           event.preventDefault(); // フォームの送信をキャンセル
           return;
       }
       // qLevel と quizType はフォームデータとして自動的に送信
	   const selectedQLevel = Array.from(document.querySelectorAll('input[name="qLevel"]')).find(input => input.checked);
	       console.log("フォーム送信時の qLevel:", selectedQLevel ? selectedQLevel.value : null);
	       console.log("フォーム送信時の quizType:", document.getElementById('quizType').value);
   });
   
   setTimeout(function() {
       setupMutualExclusion();
     }, 100);
   