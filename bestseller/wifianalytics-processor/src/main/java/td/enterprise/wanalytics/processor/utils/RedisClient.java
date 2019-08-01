package td.enterprise.wanalytics.processor.utils;

import net.sf.ehcache.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisSentinelPool;
import redis.clients.jedis.Pipeline;

import java.util.*;
import java.util.Map.Entry;

public class RedisClient {

	public static Logger logger = LoggerFactory.getLogger(RedisClient.class);

	private static String REDIS_SENTINELS_KEY = "redis.sentinels"; //redis 连接主机列表 key
	public static Map<String,String> paramsMap = new HashMap<String,String> ();
	public static String QUERY_REDIS_MAX_ACTIVE = "query_redis_max_active";
	public static String QUERY_REDIS_MAX_IDLE = "query_redis_max_idle";
	public static String QUERY_REDIS_AUTH = "query.redis.auth";
	public static int maxActive = 200;
	public static int maxIdle = 20;
	public static String  QUERY_REDIS_EXPIRED_SECONDS = "query.redis.expired.seconds";
	public static int  expiredSeconds = 5400;//元素在redis 中默认超时时间

	public static String  QUERY_REDIS_TIMEOUT_SECONDS = "query.redis.timeout.seconds";

	public static int  timeoutSeconds = 10;//查询超时时间

	public static int cacheSessionTimeoutSeconds = 50400;//在redis 超时时间14个小时

	public static String  PROJECT_ROOM_SESSION_EXIRED_SECONDS = "project.room.session.exired.seconds";

	public static String PROJECT_STAY_TIMEOUT_MINUTES = "project.stay.timeout.minutes"; //

	public static int projectSessionTimeoutSeconds = 30*60*1000;//项目默认session超时时间，默认30分钟

	public static int allMacSetTimeoutSeconds = 36 * 60 * 60 * 1000;//全部mac超时时间，默认36小时

	public static final String  PROJECT_MAX_DURATION = "project.max.duration"; //全局默认项目最大停留时长 单位是分钟

	public static String ALL_SENSOR_PREFIX = "all_";

	public static String ALL_SENSOR_KEY = ALL_SENSOR_PREFIX + "mac_key";

	public static String auth = ""; //redis 连接密码

	public static String REDIS_SENTINELS = "";

	private static JedisSentinelPool jedisSentinelPool;

	private static String REDIS_MASTER = "redis.master"; //redis 连接主机列表 key

	private static String MASTER_NAME = "mymaster";
	
	 //活跃客流放在redis中默认是5
    public  static final int DB_INDEX_ACTIVE_USER_CROWD = 5;
    
	static {
		ClassPathXmlApplicationContext consoleContext = new ClassPathXmlApplicationContext(new String[] { "console-applicationContext.xml"});
		JdbcTemplate jdbcTemplate = (JdbcTemplate)consoleContext.getBean("consoleJdbcTemplate");
		String sql = " select param_key , param_value from dmp_console.TD_PARAM where system_code = 'wreport'";
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		if(null != list){
			for(Map<String,Object> map : list){
				paramsMap.put(map.get("param_key") + "", map.get("param_value") + "");
			}
		}
		list.clear();
		list = null;
		REDIS_SENTINELS = paramsMap.get(REDIS_SENTINELS_KEY);
		maxActive = Integer.parseInt(paramsMap.get(QUERY_REDIS_MAX_ACTIVE));
		maxIdle = Integer.parseInt(paramsMap.get(QUERY_REDIS_MAX_IDLE));
		expiredSeconds = Integer.parseInt(paramsMap.get(QUERY_REDIS_EXPIRED_SECONDS));
		timeoutSeconds = Integer.parseInt(paramsMap.get(QUERY_REDIS_TIMEOUT_SECONDS));
		auth = paramsMap.get(QUERY_REDIS_AUTH);
		cacheSessionTimeoutSeconds = Integer.parseInt(paramsMap.get(PROJECT_ROOM_SESSION_EXIRED_SECONDS)); //在redis 超时时间
		projectSessionTimeoutSeconds = Integer.parseInt(paramsMap.get(PROJECT_STAY_TIMEOUT_MINUTES)) * 1000 * 60; //项目间隔多久 重新计算到访次数
		MASTER_NAME = paramsMap.get(REDIS_MASTER);
		logger.info("REDIS_SENTINELS=" + REDIS_SENTINELS + " maxActive=" + maxActive + " maxIdle=" + maxIdle + " expiredSeconds=" + expiredSeconds + " timeoutSeconds=" + timeoutSeconds + " MASTER_NAME=" + MASTER_NAME + " auth=" + auth);
		initialPool();
		consoleContext.close();

	}

	private static synchronized void initialPool(){
		//池基本配置
		JedisPoolConfig poolConfig = new JedisPoolConfig();
		poolConfig.setMaxIdle(maxIdle);
		poolConfig.setMaxTotal(maxActive);
		poolConfig.setMaxWaitMillis(1000 * timeoutSeconds);
		poolConfig.setTestOnBorrow(false);
		try{
			Set<String> sentinels = new HashSet<String>();
			for(String sentinel : REDIS_SENTINELS.split(",")){
				sentinels.add(sentinel.trim());
			}
			jedisSentinelPool = new JedisSentinelPool(MASTER_NAME, sentinels,poolConfig);
		}catch(Exception e){
			logger.error("初始化访问Redis出错 ："+e.getMessage(),e);
		}
	}

	/**
	 * 失败后，连接从服务器
	 * @param key
	 * @param value
	 * @param seconds
	 */
	public static synchronized void  put(String key, String value, final int seconds, int dbIndex){
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			jedis.set(key, value);
			jedis.setex(key, seconds, value);
		}catch(Exception e){
			logger.error("=============== 往Redis插入数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
	}

	public static synchronized void  putNormal(String key, String value, final int seconds,int dbIndex){
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			jedis.setex(key,seconds,value);
		}catch(Exception e){
			logger.error("=============== 往Redis插入数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
	}

	public static synchronized void  putSadd(String key, Set<String> set, final int seconds, int dbIndex){
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			jedis.expire(key, seconds);
			jedis.sadd(key, set.toArray(new String[]{}));
		}catch(Exception e){
			logger.error("=============== 往Redis插入数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
	}

	public static synchronized void putSaddPipeline(Collection <Element> list, final int seconds, int dbIndex) {
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);

			Pipeline p = jedis.pipelined();
			long start = System.currentTimeMillis();
			for (Element element : list) {
				// // 拆分保存
				// String elementKey = element.getKey() + "";
				// String[] keyValue = elementKey.split("==");
				// if (elementKey != null && keyValue != null && keyValue.length >= 2) {
				//     String key = keyValue[0];
				//     String value = keyValue[1];
				//     p.expire(key, seconds);
				//     p.sadd(key, value);
				// }

				p.expire(element.getKey() + "", seconds);
				p.sadd(element.getKey() + "", ((Set <String>) element.getObjectValue()).toArray(new String[]{}));
			}
			p.sync();

			long end = System.currentTimeMillis();
			logger.info("dbsize:[" + jedis.dbSize() + "] .. ");
			logger.info("sadd with pipeline used [" + (end - start) / 1000 + "] seconds ..");

		} catch (Exception e) {
			logger.error("=============== 往Redis插入数据失败：" + e.getMessage(), e);
		} finally {
			jedis.close();
		}
	}

	public static synchronized String  get(String key, int dbIndex ){
		return getNormal(key,dbIndex);
	}

	public static synchronized String  getNormal(String key, int dbIndex){
		String ret = null;
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			ret = jedis.get(key);
		}catch(Exception e){
			logger.error("=============== 从Redis获取数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
		return ret;
	}

	public static synchronized void  put(Map<String,String> map, final int seconds, int dbIndex) throws Exception{
		putNormal(map, seconds, dbIndex);
	}

	private static synchronized void putNormal(Map<String,String> map, int seconds, int dbIndex) throws Exception{
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			Pipeline pipe = jedis.pipelined();
			for (Entry<String, String> entry : map.entrySet()) {
				pipe.set(entry.getKey().getBytes(), entry.getValue().getBytes());
				pipe.expire(entry.getKey().getBytes(), seconds);
			}
			pipe.sync();
			pipe.clear();
			pipe.close();
		}catch(Exception e){
			logger.error("=============== 往Redis插入数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
	}

	public static synchronized boolean exist(String key,int dbIndex ){
		return existNormal(key,dbIndex);
	}

	private static synchronized boolean existNormal(String key ,int dbIndex){
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			return jedis.exists(key);
		}catch(Exception e){
			logger.error("=============== 从Redis获取数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
		return false;
	}

	public static synchronized Set<String> keys(String pattern ,int dbIndex){
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			Set<String> set = jedis.keys(pattern);
			return set;
		}catch(Exception e){
			logger.error("=============== 从Redis获取数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
		return  new HashSet<String> ();
	}
	
	public static String hget(String key,String mac, int dbIndex){
	    String ret = null;
        try(Jedis jedis = jedisSentinelPool.getResource()){
            jedis.select(dbIndex);
            ret = jedis.hget(key, mac);
        }catch(Exception e){
            logger.error(String.format("hgetAll Error,key:%s", key),e);
        }
        return ret;
    }

}
