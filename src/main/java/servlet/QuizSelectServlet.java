package servlet;

import java.io.IOException;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/QuizSelectServlet")
public class QuizSelectServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// クイズタイプ取得（例: lo-lu, sp-li, ex-ra）
        String quizType = request.getParameter("quizType");
        String qLevel = request.getParameter("qLevel");
        System.out.println("QuizSelectServlet で受信した qLevel: " + qLevel);
        System.out.println("QuizSelectServlet で受信した quizType: " + quizType);

        // 入力チェック（null or 空）
        if (quizType == null || quizType.trim().isEmpty()) {
            request.setAttribute("error", "クイズの種類を選択してください。");
            RequestDispatcher dispatcher = request.getRequestDispatcher("/welcome.jsp");
            dispatcher.forward(request, response);
            return;
        }

        // quizTypeをリクエスト属性として次に渡す
        request.setAttribute("quizType", quizType);
        request.setAttribute("qLevel", qLevel);

        if (quizType != null && quizType.startsWith("ex")) {
            // Challengeservletにフォワード
            RequestDispatcher dispatcher = request.getRequestDispatcher("ChallengeServlet");
            dispatcher.forward(request, response);
        } else {
        	// LearnServletにフォワード（またはsendRedirect可）
        	RequestDispatcher dispatcher = request.getRequestDispatcher("LearnServlet");
        	dispatcher.forward(request, response);
        }
	}
}
