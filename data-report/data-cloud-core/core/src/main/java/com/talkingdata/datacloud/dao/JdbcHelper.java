package com.talkingdata.datacloud.dao;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import com.talkingdata.datacloud.config.Configuration;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


/**
 * Created by henry on 14-12-12.
 */
public class JdbcHelper {
	private static Logger logger = Logger.getLogger(JdbcHelper.class);
	private static final String PARAM_HEAD = "dmp.jdbc.";
	private static final String PARAM_URL_FOOT = ".url";
	private static final String PARAM_USERNAME_FOOT = ".username";
	private static final String PARAM_PASSWORD_FOOT = ".password";

	private static Map<String, JdbcTemplate> jdbcMap = new HashMap<String, JdbcTemplate>();

	private static boolean isInit = false;

	private static void loadDataSource() {
		Configuration conf = Configuration.getInstance();
		
		Map<String, String> urls = conf.match(PARAM_HEAD + "+url"); // 匹配多个域的url
		Iterator<String> iterator = urls.keySet().iterator();
		while (iterator.hasNext()) {
			String key = iterator.next();
			try {
				String domain = key.substring(PARAM_HEAD.length(), key.indexOf(PARAM_URL_FOOT));
				if (domain != null && !domain.equals("")) {
					String username = conf.getConfig(PARAM_HEAD + domain + PARAM_USERNAME_FOOT);
					String password = conf.getConfig(PARAM_HEAD + domain + PARAM_PASSWORD_FOOT);
					if (username == null || password == null) {
						continue;
					}
					DataSource ds = makeDataSource(urls.get(key), username, password);
					jdbcMap.put(domain, new JdbcTemplate(ds));
				}
			} catch (Exception e) {
				logger.error("DataSource初始化失败", e);
				continue;
			}
		}
	}

	public static JdbcTemplate getJdbcTemplate(String domain) {
		if (!isInit && jdbcMap.size() == 0) {
			loadDataSource();// load data source configuration and make
								// jdbcTemplate
			isInit = true;
		}
		return jdbcMap.get(domain);
	}

	public static DataSource makeDataSource(String url, String username, String password) {
		BasicDataSource bds = new BasicDataSource();
		bds.setDriverClassName("com.mysql.jdbc.Driver");
		bds.setUrl(url);
		bds.setUsername(username);
		bds.setPassword(password);
		bds.setInitialSize(5);
		bds.setMaxActive(10);
		bds.setMaxIdle(5);
		bds.setMinIdle(2);
		bds.setTestOnBorrow(true);
		return bds;
	}
	
	public static void main(String[] args) {
		JdbcHelper.getJdbcTemplate("biz");
	}
}
