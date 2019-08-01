package com.talkingdata.datacloud.cache;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import com.talkingdata.datacloud.ApplicationContextManager;
import com.talkingdata.datacloud.constant.CommonConstants;
import com.talkingdata.datacloud.dao.JdbcHelper;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

/**
 * 系统参数缓存
 * 
 * @author tao.yang
 * @date 2015年7月22日
 */
public class ParamCacheManager {

	private static final ParamCacheManager instance = new ParamCacheManager();

	private static Log LOG = LogFactory.getLog(ParamCacheManager.class);

	private static final String commonCode = "DMP";

	/**
	 * 缓存Map
	 */
	private Map<String, Map<Object, Object>> cacheMap = new HashMap<String, Map<Object, Object>>();

	/**
	 * 配置
	 */
	// private ResourceBundle bundle;

	private Properties prop = new Properties();

	/**
	 * jdbc
	 */
	private JdbcTemplate jdbcTemplate;

	/**
	 * 请使用getSystemCode()来获取systemCode.
	 */
	private String systemCode = null;
	
	private Object SYSTEM_CODE_INIT_OBJECT = new Object();

	/**
	 * 私有构造函数
	 * 
	 * @throws IOException
	 * @throws FileNotFoundException
	 */
	private ParamCacheManager() {
		// bundle = ResourceBundle.getBundle("config");
		// DataSource ds =
		// JdbcHelper.makeDataSource(bundle.getString("dmp.jdbc.core.url"),
		// bundle.getString("dmp.jdbc.core.username"),
		// bundle.getString("dmp.jdbc.core.password"));
		try {
			if (null == LOG) {
				LOG = LogFactory.getLog(ParamCacheManager.class);
			}
			if (new File("/nfs/config/dmp/sysConfig.properties").exists()) {
				prop.load(new FileInputStream("/nfs/config/dmp/sysConfig.properties"));
			} else {
				prop.load(ParamCacheManager.class.getClassLoader().getResourceAsStream("config.properties"));
			}

			DataSource ds = JdbcHelper.makeDataSource(prop.getProperty("console.connection.url"), prop.getProperty("console.connection.username"),
					prop.getProperty("console.connection.password"));
			jdbcTemplate = new JdbcTemplate(ds);
		} catch (IOException e) {
			LOG.error(e);
		}

	}

	/**
	 * @return the instance
	 */
	public static ParamCacheManager getInstance() {
		return instance;
	}

	/**
	 * 获取缓存对象名称集合
	 * 
	 * @return
	 */
	public Set<String> getCacheNames() {
		return cacheMap.keySet();
	}

	/**
	 * 获取缓存数据
	 * 
	 * @param cacheName
	 * @return
	 */
	public Map<Object, Object> get(String cacheName) {
		if (cacheMap.get(cacheName) == null) {
			String tableName = prop.getProperty("table.param.name");
			String paramKey = prop.getProperty("table.param.col.paramkey");
			String paramValue = prop.getProperty("table.param.col.paramvalue");
			String sql = "select * from " + tableName + " where system_code='" + commonCode + "'";
			List<Map<String, Object>> resultList = jdbcTemplate.queryForList(sql);
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			for (Map<String, Object> el : resultList) {
				Object key = el.get(paramKey);
				Object value = el.get(paramValue);
				if(null == key || null == value){
					LOG.warn("[[Wrong config]] tableName: " + tableName + " key: " + key + " value: " + value);
				}else{
					paramMap.put(String.valueOf(el.get(paramKey)), String.valueOf(el.get(paramValue)));
				}
			}

			String systemCode = getSystemCode();
			if (null != systemCode) {
				sql = "select * from " + tableName + " where system_code='" + systemCode + "'";
				resultList = jdbcTemplate.queryForList(sql);
				paramMap = new HashMap<Object, Object>();
				for (Map<String, Object> el : resultList) {
					Object key = el.get(paramKey);
					Object value = el.get(paramValue);
					if(null == key || null == value){
						LOG.warn("[[Wrong config]] tableName: " + tableName + " key: " + key + " value: " + value);
					}else{
						paramMap.put(String.valueOf(el.get(paramKey)), String.valueOf(el.get(paramValue)));
					}
				}
			}

			cacheMap.put(cacheName, paramMap);
		}
		return cacheMap.get(cacheName);
	}

	/**
	 * 更新cacheName对应的缓存对象
	 * 
	 * @param cacheName
	 * @param value
	 */
	public void put(String cacheName, Map<Object, Object> value) {
		cacheMap.put(cacheName, value);
	}

	/**
	 * 删除cacheName对应的的缓存对象
	 * 
	 * @param cacheName
	 */
	public void remove(String cacheName) {
		LOG.warn("clean cache : [" + cacheName + "], cache size : " + (cacheMap.get(cacheName) != null ? cacheMap.get(cacheName).size() : null));
		cacheMap.remove(cacheName);
	}

	/**
	 * 清空全部缓存对象
	 */
	public void removeAll() {
		cacheMap.clear();
	}

	/**
	 * 获取缓存元素值
	 * 
	 * @param cacheName
	 * @param elementKey
	 * @return
	 */
	public Object getElementValue(String cacheName, Object elementKey) {
		Map<Object, Object> element = cacheMap.get(cacheName);
		if (element == null) {
			element = new HashMap<Object, Object>();
			cacheMap.put(cacheName, element);
		}
		Object elementValue = element.get(elementKey);
		if (elementValue == null) {
			elementValue = putElemen(cacheName, elementKey);
		}
		return elementValue;
	}

	/**
	 * 添加缓存内容
	 * 
	 * @param cacheName
	 * @param elementKey
	 * @return
	 */
	private Object putElemen(String cacheName, Object elementKey) {
		// 系统参数缓存
		if (CommonConstants.CACHE_PARAM.equals(cacheName)) {
			String tableName = prop.getProperty("table.param.name");
			String paramKey = prop.getProperty("table.param.col.paramkey");
			String paramValue = prop.getProperty("table.param.col.paramvalue");
			String sql = "select * from " + tableName + " where system_code='" + commonCode + "'";
			List<Map<String, Object>> resultList = jdbcTemplate.queryForList(sql);
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			for (Map<String, Object> el : resultList) {
				Object key = el.get(paramKey);
				Object value = el.get(paramValue);
				if(null == key || null == value){
					LOG.warn("[[Wrong config]] tableName: " + tableName + " key: " + key + " value: " + value);
				}else{
					paramMap.put(String.valueOf(el.get(paramKey)), String.valueOf(el.get(paramValue)));
				}
			}
			String systemCode = getSystemCode();
			if (null != systemCode) {
				sql = "select * from " + tableName + " where system_code='" + systemCode + "'";
				resultList = jdbcTemplate.queryForList(sql);
				paramMap = new HashMap<Object, Object>();

				for (Map<String, Object> el : resultList) {
					Object key = el.get(paramKey);
					Object value = el.get(paramValue);
					if(null == key || null == value){
						LOG.warn("[[Wrong config]] tableName: " + tableName + " key: " + key + " value: " + value);
					}else{
						paramMap.put(String.valueOf(el.get(paramKey)), String.valueOf(el.get(paramValue)));
					}
				}
			}
			cacheMap.put(cacheName, paramMap);
			LOG.debug("系统参数缓存加载完成!");
		}
		return cacheMap.get(cacheName).get(elementKey);
	}

	/**
	 * 更新缓存元素值
	 * 
	 * @param cacheName
	 * @param elementKey
	 * @param elementValue
	 */
	public void putElement(String cacheName, Object elementKey, Object elementValue) {
		if (cacheMap.get(cacheName) != null) {
			cacheMap.get(cacheName).put(elementKey, elementValue);
		}
	}

	/**
	 * 删除缓存元素
	 * 
	 * @param cacheName
	 */
	public void removeElement(String cacheName, Object elementKey) {
		if (cacheMap.get(cacheName) != null) {
			cacheMap.get(cacheName).remove(elementKey);
		}
	}
	private String getSystemCode() {
		if(null == systemCode){
			synchronized (SYSTEM_CODE_INIT_OBJECT) {
				if(null == systemCode){
					Properties sysConfig = null;
					try {
						sysConfig = (Properties) ApplicationContextManager.getBean("sysConfig");
					} catch (Exception e) {
						LOG.warn("sysConfig is not configured!");
					}
					if (null != sysConfig) {
						systemCode = sysConfig.getProperty("systemcode");
					}
					LOG.info("==============systemCode=========" + systemCode);
				}
			}
		}
		return systemCode;
	}
}
