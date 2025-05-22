package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import model.Exam;

public class ExamDAO {
	private final String JDBC_URL = "jdbc:h2:tcp://localhost/~/Points";
	private final String DB_USER = "sa";
	private final String DB_PASS = "1234";

	private static final String GET_EXAM_BY_TIME = "SELECT * FROM SCHEMA2.EXAM WHERE TIME = ?";
	private static final String GET_ALL_RANDOM = "SELECT * FROM SCHEMA2.EXAM ORDER BY RAND() LIMIT 10";

	// TIME に基づいて取得
	public List<Exam> getExamByTime(String time) {
		return executeQuery(GET_EXAM_BY_TIME, time);
	}

	// quizArea に基づいて取得
	public List<Exam> getExamByArea(String quizArea) {
		String flagColumn = switch (quizArea) {
			case "ml" -> "MERIDIAN";
			case "gu" -> "GUDU";
			case "me" -> "POINT";
			case "sp" -> "SPOINT";
			case "yo" -> "SIDEBY";
			case "ex" -> "EXMERI";
			case "an" -> "ANATOMY";
			case "cl" -> "CLINICAL";
			case "mo" -> "MODERN";
			case "ra" -> null; // 全ランダムは別処理
			default -> null;
		};

		if ("ra".equals(quizArea)) {
			return getAllRandom();
		}

		if (flagColumn == null) {
			return new ArrayList<>();
		}

		String sql = "SELECT * FROM SCHEMA2.EXAM WHERE " + flagColumn + " = '1'";
		return executeQuery(sql);
	}

	// 全ランダム取得
	public List<Exam> getAllRandom() {
		return executeQuery(GET_ALL_RANDOM);
	}

	// 共通実行ロジック（引数1つ）
	private List<Exam> executeQuery(String sql, String... params) {
		List<Exam> examList = new ArrayList<>();

		try {
			Class.forName("org.h2.Driver");
			try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
				 PreparedStatement stmt = conn.prepareStatement(sql)) {

				for (int i = 0; i < params.length; i++) {
					stmt.setString(i + 1, params[i]);
				}

				try (ResultSet rs = stmt.executeQuery()) {
					while (rs.next()) {
						examList.add(new Exam(
							rs.getString("TIME"),
							rs.getString("NUMBER"),
							rs.getString("SUBJECT"),
							rs.getString("QUESTION"),
							rs.getString("CHOICE1"),
							rs.getString("CHOICE2"),
							rs.getString("CHOICE3"),
							rs.getString("CHOICE4"),
							rs.getString("ANSWER")
						));
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return examList;
	}
}

