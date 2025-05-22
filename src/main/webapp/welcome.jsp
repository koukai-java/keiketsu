<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="./css/style.css" />
    <meta charset="UTF-8">
    <title>腧穴マスター</title>
    <style>
		.custom-select {
			padding: 5px 15px;
			padding-right: 36px;
			font-size: 16px;
			border: 2px solid #86c5ff;
			border-radius: 5px;
			background-color: #f5fbff;
			color: #333;
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			background-image:
				url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path fill="%23333" d="M0 0l5 6 5-6z"/></svg>');
			background-repeat: no-repeat;
			background-position: right 10px center;
			background-size: 10px 6px;
		}
	</style>
</head>
<body>
<center>
<div class="ribbon9">
  <h3>Remember the Acupoints!</h3>
</div>
</center>

<div class="box17"  style="text-align:center">
	<h2 class="text16">腧穴マスター</h2>
	<p>問題レベルと範囲を選んで、「START」を押してください。</p>
<form action="QuizSelectServlet" method="post" style="width: 100%;  text-align: center;">
    <div>
            <label class="level-button elementary selected" value="elementary">
                <input type="radio" name="qLevel" value="elementary" style="display: none;" checked> 初級<span style="font-size: 0.8em;">（選択式）</span>
            </label>
            <label class="level-button intermediate" value="intermediate">
                <input type="radio" name="qLevel" value="intermediate" style="display: none;"> 中級<span style="font-size: 0.8em;">（入力式）</span>
            </label>
        </div>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; justify-content: center;">
		<div class="box26">
			<span class="box-title">腧穴位置</span>
				<div id="quiz-options" class="form-grid"></div>
		</div>
		<div class="box26">
			<span class="box-title">要穴</span>
			<div id="quiz-options-sp" class="form-grid"></div>
		</div>
		<div class="box26">
			<span class="box-title">国家試験</span>
			<div class="form-grid">
			    <div style="display: flex; justify-content: center; align-items: center; width: 100px; height: 30px;">
				  開催回：
				</div>
			    <div>
				   <select id="quizType" name="quizType" class="custom-select">
				   <option value="" selected disabled>選択</option>
				   <option value="ex-01">第1回</option>
				   <option value="ex-02">第2回</option>
				   <option value="ex-03">第3回</option>
				   </select>
				</div>
				<div class="full-width">──── 領域別 ────
				<div id="options-area" class="form-grid" style="text-align: left;"></div></div>
			</div>
		</div>
	</div>
		<div style="text-align: center;">
			<button type="submit">START</button>
		</div>
</form>
</div>
	<script src="./js/welcome.js"></script>
</body>
</html>
