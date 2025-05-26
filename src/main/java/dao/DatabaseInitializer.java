package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * データベースの初期化を一度だけ行うユーティリティクラス
 */
public class DatabaseInitializer {
    private static volatile boolean initialized = false;
    private static final Object lock = new Object();
    
    // データベース接続情報
    public static final String JDBC_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1";
    public static final String DB_USER = "sa";
    public static final String DB_PASS = "1234";
    
    /**
     * データベースの初期化を行う（一度だけ実行される）
     */
    public static void initialize() {
        // double-checked locking パターンでスレッドセーフな初期化を保証
        if (!initialized) {
            synchronized (lock) {
                if (!initialized) {
                    try {
                        // JDBCドライバのロード
                        Class.forName("org.h2.Driver");
                        
                        // 初期化用の接続を確立（init.sqlを実行）
                        try (Connection conn = DriverManager.getConnection(
                            "jdbc:h2:mem:testdb;INIT=RUNSCRIPT FROM 'classpath:/init.sql';DB_CLOSE_DELAY=-1",
                            DB_USER,
                            DB_PASS
                        )) {
                            System.out.println("データベースの初期化が完了しました。");
                        }
                        
                        initialized = true;
                        
                    } catch (ClassNotFoundException e) {
                        System.err.println("JDBCドライバのロードに失敗しました: " + e.getMessage());
                        throw new ExceptionInInitializerError(e);
                    } catch (SQLException e) {
                        System.err.println("データベースの初期化に失敗しました: " + e.getMessage());
                        throw new ExceptionInInitializerError(e);
                    }
                }
            }
        }
    }
    
    /**
     * 通常の接続を取得する
     */
    public static Connection getConnection() throws SQLException {
        initialize(); // 初期化を保証
        return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
    }
}
