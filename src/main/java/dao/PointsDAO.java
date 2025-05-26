package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Points;

public class PointsDAO {

	// Pointsリストを取得する
	public List<Points> getPointByQuizType(String quizScope) {
		List<Points> pointList = new ArrayList<>();
		
		// DatabaseInitializerを使用してデータベースに接続
        try (Connection conn = DatabaseInitializer.getConnection()) {
			
			// SELECT文を準備
			String sql = "SELECT * FROM schema1.POINTS WHERE MERIDIAN = ?";
			PreparedStatement pStmt = conn.prepareStatement(sql);
			pStmt.setString(1, quizScope);
			
			// SELECT文を実行し、結果表を取得
			ResultSet rs = pStmt.executeQuery();
			
			while (rs.next()) {
				// その範囲の経穴を表すpointsインスタンスを生成
				Points p = new Points(
				rs.getString("ID"),
				rs.getString("MERIDIAN"),
				rs.getString("FURIGANA"),
				rs.getString("NAME"),
				rs.getString("LOCATION"),
				rs.getString("SPECIFIC"),
				rs.getString("LEARN"),
				rs.getString("Q_LOCATION"),
				rs.getString("ANS_LOCATION"),
				rs.getString("Q_SPECIFIC"),
				rs.getString("ANS_SPECIFIC")
				);
				
				// PointListオブジェクトを作成し、リストに追加
				pointList.add(p);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return pointList;
	}

}
