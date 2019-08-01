/**
 * 
 * @author davy
 * 日期:		2013-6-5 10:24:20
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.atomic.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

public abstract class SpringDaoChanger extends DataFilterAtomicChanger {
	
	private static ApplicationContext applicationContext;
	
	public static JdbcTemplate jdbcTemplate;
	
	static{
		reinit();
	}

	public static CacheDaoImpl dao;

	public synchronized  static void reinit(){
		if(null == dao  || jdbcTemplate == null || applicationContext == null){
			applicationContext = new ClassPathXmlApplicationContext("datafilter-spring-beans.xml");
			dao = (CacheDaoImpl) applicationContext.getBean("dao");
			jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
		}
	}

}
