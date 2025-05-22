package model;

import java.util.List;

import dao.PointsDAO;

public class LearnLogic {

	public List<Points> selectByScope(String quizScope) {
        PointsDAO dao = new PointsDAO();
        return dao.getPointByQuizType(quizScope);
	}
}
