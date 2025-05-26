package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Points;

public class PointsDAO {
	//private final String JDBC_URL = "jdbc:h2:tcp://localhost/~/Points";
	private final String JDBC_URL = "jdbc:h2:mem:testdb;" +
            "DB_CLOSE_DELAY=-1"; // ★重要: 最後の接続が閉じてもDBが閉じないようにする;
	private final String DB_USER = "sa";
	private final String DB_PASS = "1234";

	// static ブロックで初期化を一度だけ行う
    static {
        try {
            Class.forName("org.h2.Driver");
            // INITパラメータ付きのURLでConnectionを確立することで、初回ロード時にinit.sqlが実行される
            // このConnectionは初期化のためだけなので、すぐに閉じてもOK
            try (Connection conn = DriverManager.getConnection(
                "jdbc:h2:mem:testdb;INIT=RUNSCRIPT FROM 'classpath:/init.sql';DB_CLOSE_DELAY=-1",
                "sa", // DB_USER
                "1234"  // DB_PASS
            )) {
                // 初期化が完了。
            }
        } catch (ClassNotFoundException e) {
            System.err.println("JDBCドライバのロードに失敗しました: " + e.getMessage());
            // アプリケーションが起動できない致命的なエラーとしてスロー
            throw new ExceptionInInitializerError(e); 
        } catch (SQLException e) {
            System.err.println("データベースの初期化に失敗しました: " + e.getMessage());
            // データベース初期化に失敗した致命的なエラーとしてスロー
            throw new ExceptionInInitializerError(e); 
        }
    }

	// Pointsリストを取得する
	public List<Points> getPointByQuizType(String quizScope) {
		List<Points> pointList = new ArrayList<>();
		//JDBCドライバを読み込む
		try {
			Class.forName("org.h2.Driver");
		} catch (ClassNotFoundException e) {
			throw new IllegalStateException("JDBCドライバを読み込めませんでした");
		}
		// データベースへ接続
		try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {
			
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
