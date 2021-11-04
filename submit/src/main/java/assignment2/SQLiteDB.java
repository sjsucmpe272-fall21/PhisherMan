package assignment2;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SQLiteDB {
    private Connection conn;
    private Logger logger = LoggerFactory.getLogger(Consumer.class.getName());


    public SQLiteDB() {
        try {
            Class.forName("org.sqlite.JDBC");
        }
        catch (ClassNotFoundException e) {
            this.logger.error(e.getMessage());
        }
        String url = "jdbc:sqlite:assignment2.sqlite";
        try {
            this.conn = DriverManager.getConnection(url);

            this.conn.createStatement()
                .execute("CREATE TABLE IF NOT EXISTS assignment2(key VARCHAR(255), value VARCHAR(255)) ");
        }
        catch (SQLException e) {
            this.logger.error(e.getMessage());
        }
    }

    public void insertKeyValue(String key, String value) {
        try {
            PreparedStatement pstmt = conn.prepareStatement("INSERT INTO assignment2 VALUES(?,?)");
            pstmt.setString(1, key);
            pstmt.setString(2, value);
            pstmt.executeUpdate();
        }
        catch (SQLException e) {
            this.logger.error(e.getMessage());
        }
    }
}
