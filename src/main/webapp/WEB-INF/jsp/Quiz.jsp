<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*, model.Points" %>
<%
    List<Points> pointList = (List<Points>) request.getAttribute("pointList");
    String qLevel = (String) request.getAttribute("qLevel");
    String quizType = (String) request.getAttribute("quizType");
    
    if (pointList == null || pointList.size() < 10) {
        out.println("<h2>問題がありません。</h2>");
        return;
    }
    
    Collections.shuffle(pointList);
    List<Points> quizList = pointList.subList(0, 10);

    Set<String> locationSet = new HashSet<>();
    Set<String> specificSet = new HashSet<>(); // specific の選択肢を格納する Set
    for (Points p : pointList) {
        locationSet.add(p.getLocation());
        String specificValue = p.getSpecific();

        if (specificValue != null && !specificValue.isEmpty()) {
            // specific の値を何らかの区切り文字で分割して選択肢候補とする
            String[] specificCandidates = specificValue.split(","); // 例：カンマ区切り
            for (String candidate : specificCandidates) {
                String trimmedCandidate = candidate.trim();
                if (!trimmedCandidate.isEmpty()) {
                    specificSet.add(trimmedCandidate);
                }
            }
        }
    }
    List<String> allLocations = new ArrayList<>(locationSet);
    List<String> allSpecific = new ArrayList<>(specificSet);
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
    <div id="overlay-feedback"></div>
    <div id="correct" style="text-align: center; font-style: italic; color: #777; margin-top: 15px; margin-bottom: 15px;"></div>
    <div id="timer" style="margin-bottom: 10px;"></div>
    <div id="next-button-container" style="margin-top: 10px;"></div>
   </div>
 </div>
 <script>
    const allPoints = <%= new org.json.JSONArray(pointList).toString() %>;
    const quizType = "<%= quizType %>";
    const qLevel = "<%= request.getAttribute("qLevel") %>";
    console.log("Quiz.jsp の qLevel:", qLevel);
	console.log("Quiz.jsp の quizType:", quizType);
	console.log("Quiz.jsp の allPoints:", allPoints);


</script>
	<script src="/keiketsu/js/quiz.js"></script>
    </body>
</html>
