package model;

import java.util.List;

import dao.ExamDAO;

public class ChallengeLogic {

	private ExamDAO examDAO = new ExamDAO(); 
	
	// 01〜99 の範囲で取得
		public List<Exam> selectByRange(String quizRange) {
	        return examDAO.getExamByTime(quizRange);
		}

		// "ml", "hr" など範囲外の2文字コードで取得
		public List<Exam> selectByArea(String quizArea) {
			return examDAO.getExamByArea(quizArea);
		}
		
		public List<Exam> selectAllRandom() {
		    return examDAO.getAllRandom();
		}

}
