package td.enterprise.wanalytics.processor.utils;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

public class JDBC_Counter {
	
	private JDBC_Counter(){}

	public static JdbcTemplate jdbcTemplate;
	
	static {
		@SuppressWarnings("resource")
		ClassPathXmlApplicationContext consoleContext = new ClassPathXmlApplicationContext(new String[] { "computer-applicationContext.xml"});
		jdbcTemplate = (JdbcTemplate)consoleContext.getBean("counterJdbcTemplate");
	}

	public synchronized static int savecount(SqlMaker sqls){
		int update = 0;
		update = JDBC_Counter.jdbcTemplate.update(sqls.getwnsql());
		return update;
	}
}
