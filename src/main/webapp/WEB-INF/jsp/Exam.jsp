
<%@  page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*, model.Exam, com.fasterxml.jackson.databind.ObjectMapper" %>

<%
    List<Exam> examList = (List<Exam>) request.getAttribute("examList");
    String qLevel = (String) request.getAttribute("qLevel");
    String quizType = (String) request.getAttribute("quizType");
    if (!quizType.matches(".*\\d{2}$")) {
        System.out.println("Exam.jsp にて quizArea 処理中: " + quizType);
    }
    
    if (examList == null || examList.size() == 0) {
        out.println("<h2>問題がありません。</h2>");
        return;
    }

    int availableSize = examList.size();
    int questionCount = Math.min(10, availableSize);
    
    if (examList.size() < 10) {
        out.println("<h2>十分な問題がないため " + examList.size() + " 問で実施します。</h2>");
    }

    Collections.shuffle(examList);
    List<Exam> subExamList = examList.subList(0, questionCount);
    
    // クイズデータ構造の生成
    List<Map<String, String>> quizData = new ArrayList<>();

    for (Exam exam : subExamList) {
        List<String> originalChoices = Arrays.asList(exam.getChoice1(), exam.getChoice2(), exam.getChoice3(), exam.getChoice4());
        List<String> choices = new ArrayList<>(originalChoices);
        // 正解の文字列
        int correctIndex = Integer.parseInt(exam.getAnswer()) - 1;
        String correctText = originalChoices.get(correctIndex);
        
        // 選択肢シャッフル
        List<String> shuffledChoices = new ArrayList<>(originalChoices);
        Collections.shuffle(shuffledChoices);

        Map<String, String> quiz = new HashMap<>();
        quiz.put("question", exam.getQuestion());
        quiz.put("choice1", shuffledChoices.get(0));
        quiz.put("choice2", shuffledChoices.get(1));
        quiz.put("choice3", shuffledChoices.get(2));
        quiz.put("choice4", shuffledChoices.get(3));
        quiz.put("answer", correctText); // シャッフル後の正解を送る

        quizData.add(quiz);
    }

    String json = new ObjectMapper().writeValueAsString(quizData);
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
	<script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"></script>
    <link rel="stylesheet" type="text/css" href="/keiketsu/css/style.css" />
    <title>腧穴マスター</title>
</head>
<body>
<center>
  <div class="ribbon9">
  <h3>Remember the Acupoints!</h3>
</div>
</center>

<div class="box17" id="quiz-area" style="text-align:center">
	<h2 class="text16">腧穴マスター</h2>
    <div id="question"></div>
    <div style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">
    <div id="options"></div>
    <div id="overlay-feedback"  style="display:none; justify-content:center; align-items:flex-start; padding-top: 20%; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.8); z-index:1000;"></div>
    <div id="correct" style="text-align: center; font-style: italic; color: #777; margin-top: 15px; margin-bottom: 15px;"></div>
    <div id="timer" style="font-size: 20px; margin-bottom: 10px;"></div>
    <div id="next-button-container" style="margin-top: 10px;"></div>
   </div>
 </div>
<script>
    // quiz データの埋め込み（JSONは文字列として安全に埋め込む）
    const quizzes = <%= json %>;
    console.log("Exam.jsp で初期化した quizzes:", quizzes);

    // クイズタイプとレベル
    const quizType = "<%= quizType != null ? quizType : "" %>";
    const qLevel = "<%= qLevel != null ? qLevel : "" %>";
    console.log("Exam.jsp の qLevel:", qLevel);
</script>

<!-- 外部JS -->
<script src="/keiketsu/js/exam.js"></script>
<script>
    startQuiz(); // クイズ開始
</script>
</body>

</html>