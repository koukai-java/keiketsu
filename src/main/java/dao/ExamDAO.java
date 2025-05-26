package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Exam;

public class ExamDAO {
	
	// SQL定数
    private static final String GET_EXAM_BY_TIME = "SELECT * FROM SCHEMA2.EXAM WHERE TIME = ?";
    private static final String GET_ALL_RANDOM = "SELECT * FROM SCHEMA2.EXAM";
    
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

		String sql = "SELECT * FROM SCHEMA2.EXAM WHERE " + flagColumn + " = ?";
		return executeQuery(sql, "1");
	}

	// 全ランダム取得
	public List<Exam> getAllRandom() {
		return executeQuery(GET_ALL_RANDOM);
	}

	// 共通実行ロジック（引数1つ）
	private List<Exam> executeQuery(String sql, String... params) {
		List<Exam> examList = new ArrayList<>();
		
		// DatabaseInitializerを使用してデータベースに接続
		try (Connection conn = DatabaseInitializer.getConnection();
			 PreparedStatement stmt = conn.prepareStatement(sql)) {

			// パラメータを設定
			for (int i = 0; i < params.length; i++) {
				stmt.setString(i + 1, params[i]);
			}

			// クエリを実行し、結果を処理
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
		} catch (SQLException e) {
			e.printStackTrace();
		}
	return examList;
	}
}

