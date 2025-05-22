package servlet;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import model.ChallengeLogic;
import model.Exam;

@WebServlet("/ChallengeServlet")
public class ChallengeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// qLevel, quizTypeの取得
        String qLevel = (String) request.getAttribute("qLevel");
		String quizType = (String) request.getAttribute("quizType");
		System.out.println("ChallengeServlet で受信した quizType: " + quizType);
        if (quizType == null) {
            quizType = request.getParameter("quizType"); // 念のためGET対応
        }

        String quizRange = null;
        String quizArea = null;
        List<Exam> examList = null;

        
        if (quizType != null && quizType.length() >= 2) {
            String suffix = quizType.substring(quizType.length() - 2);
            if (suffix.matches("0[1-9]|[1-9][0-9]")) { // "01" から "99" の形式かチェック
            	// 数字 (01〜99) の場合 → quizRange を使う
       	        quizRange = suffix;
                if (quizRange.startsWith("0")) {
                    quizRange = quizRange.substring(1); // 先頭の "0" を削除
                }
                System.out.println("ChallengeServlet で設定した quizRange: " + quizRange);
                ChallengeLogic logic = new ChallengeLogic();
                examList = logic.selectByRange(quizRange);
                
            } else if (suffix.equals("ra")) {
                System.out.println("全ランダムで取得します");
                ChallengeLogic logic = new ChallengeLogic();
                examList = logic.selectAllRandom();
            
            } else {
            	// 数字でない場合 → quizArea を使う
            	quizArea = suffix;
                System.out.println("ChallengeServlet で設定した quizArea: " + quizArea);
                ChallengeLogic logic = new ChallengeLogic();
                examList = logic.selectByArea(quizArea);
            }
        } else {
            System.err.println("quizType が null または長さが不足しています: " + quizType);
        }

     // BO:ChallengeLogicを使ってexamList取得
        ChallengeLogic logic = new ChallengeLogic();

        if (quizRange != null) {
            // 範囲指定（01〜99）の場合
            examList = logic.selectByRange(quizRange);
            System.out.println("ChallengeServlet で取得した examList（quizRange）のサイズ: " + (examList != null ? examList.size() : "null"));

        } else if (quizArea != null) {
            if ("ra".equals(quizArea)) {
                // 全ランダム
                examList = logic.selectAllRandom();
                System.out.println("ChallengeServlet で取得した examList（ランダム）のサイズ: " + (examList != null ? examList.size() : "null"));
            } else {
                // エリア指定（"ml"など）の場合
                examList = logic.selectByArea(quizArea);
                System.out.println("ChallengeServlet で取得した examList（quizArea）のサイズ: " + (examList != null ? examList.size() : "null"));
            }

        } else {
            System.err.println("quizRange も quizArea も null のため、examList を取得できませんでした。");
        }


        // quizTypeとpointListをリクエストスコープに保存してQuiz.jspへフォワード
        request.setAttribute("qLevel", qLevel);
        request.setAttribute("quizType", quizType);
        request.setAttribute("examList", examList);
        RequestDispatcher dispatcher = request.getRequestDispatcher("WEB-INF/jsp/Exam.jsp");
        dispatcher.forward(request, response);
	}
}
