package servlet;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import model.LearnLogic;
import model.Points;

@WebServlet("/LearnServlet")
public class LearnServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// qLevel, quizTypeの取得
        String qLevel = (String) request.getAttribute("qLevel");
		String quizType = (String) request.getAttribute("quizType");
        if (quizType == null) {
            quizType = request.getParameter("quizType"); // 念のためGET対応
        }

        // quizTypeの末尾2文字を取り出して判定
        String suffix = quizType.substring(quizType.length() - 2).toUpperCase();

        // 経絡名のマッピング
        String quizScope = switch (suffix) {
            case "LU" -> "肺";
            case "GV" -> "督";
            case "CV" -> "任";
            default -> "";
        };

        // LearnLogicを使ってpointList取得
        LearnLogic logic = new LearnLogic();
        List<Points> pointList = logic.selectByScope(quizScope);

        // quizTypeとpointListをリクエストスコープに保存してQuiz.jspへフォワード
        request.setAttribute("qLevel", qLevel);
        request.setAttribute("quizType", quizType);
        request.setAttribute("pointList", pointList);
        RequestDispatcher dispatcher = request.getRequestDispatcher("WEB-INF/jsp/Quiz.jsp");
        dispatcher.forward(request, response);
	}
}
