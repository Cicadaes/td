package td.enterprise.wanalytics.etl.util;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisSentinelPool;
import redis.clients.jedis.Pipeline;

import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
@Slf4j
public class RedisClient {

	public static Logger logger = LoggerFactory.getLogger(RedisClient.class);

    public static String REDIS_SENTINELS_KEY = "redis.sentinels"; //redis 连接主机列表 key
    public static String QUERY_REDIS_MAX_ACTIVE = "query_redis_max_active";
    public static String QUERY_REDIS_MAX_IDLE = "query_redis_max_idle";
    public static int maxActive = 200;
    public static int maxIdle = 20;
    public static String  QUERY_REDIS_EXPIRED_SECONDS = "query.redis.expired.seconds";
    public static int  expiredSeconds = 5400;//元素在redis 中默认超时时间

    public static String  QUERY_REDIS_TIMEOUT_SECONDS = "query.redis.timeout.seconds";
    public static int  timeoutSeconds = 10;//查询超时时间

    public static String auth = ""; //redis 连接密码

    public static String QUERY_REDIS_AUTH = "query.redis.auth";

    public static String REDIS_SENTINELS = "";

	private static JedisSentinelPool jedisSentinelPool;

	public static String REDIS_MASTER = "redis.master"; //redis 连接主机列表 key

	private static String MASTER_NAME = "mymaster";

	public static int  EXPIRE_SECONDS_ACTIVE_USER = 3600*24*2;//缓存两天
	
    static {
		REDIS_SENTINELS = HttpUtil.getParamFromConfigServer(REDIS_SENTINELS_KEY);
		maxActive = Integer.parseInt(HttpUtil.getParamFromConfigServer(QUERY_REDIS_MAX_ACTIVE));
		maxIdle = Integer.parseInt(HttpUtil.getParamFromConfigServer(QUERY_REDIS_MAX_IDLE));
		expiredSeconds = Integer.parseInt(HttpUtil.getParamFromConfigServer(QUERY_REDIS_EXPIRED_SECONDS));
		timeoutSeconds = Integer.parseInt(HttpUtil.getParamFromConfigServer(QUERY_REDIS_TIMEOUT_SECONDS));
		auth = HttpUtil.getParamFromConfigServer(QUERY_REDIS_AUTH);
		MASTER_NAME = HttpUtil.getParamFromConfigServer(REDIS_MASTER);
		logger.info("REDIS_SENTINELS=" + REDIS_SENTINELS + " maxActive=" + maxActive + " maxIdle=" + maxIdle + " expiredSeconds=" + expiredSeconds + " timeoutSeconds=" + timeoutSeconds + " MASTER_NAME=" + MASTER_NAME + " auth=" + auth);
		initialPool();
    }

    private static void initialPool(){
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
    public static synchronized void  put(String key, String value, final int seconds ){
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.set(key, value);
		}catch(Exception e){
			logger.error("=============== 往Redis插入数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
	}

    private static synchronized void  putNormal(String key, String value, final int seconds,int dbIndex ){
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

	public static synchronized void putSadd(String key, Set <String> set, final int seconds, int dbIndex) {
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			jedis.expire(key, seconds);
			jedis.sadd(key, set.toArray(new String[]{}));
		} catch (Exception e) {
			logger.error("=============== 往Redis插入数据失败：" + e.getMessage(), e);
		} finally {
			jedis.close();
		}
	}

    public static synchronized String  get(String key, int dbIndex ){
    		return getNormal(key,dbIndex);
    }
    public static synchronized String  getNormal(String key, int dbIndex ){
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

    public static synchronized Set<String> getSet(String key, int dbIndex ){
		Set <String> ret = null;
		Jedis jedis = jedisSentinelPool.getResource();
		try{
			jedis.select(dbIndex);
			ret = jedis.smembers(key);
		}catch(Exception e){
			logger.error("=============== 从Redis获取数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
		return ret;
    }

    public static synchronized void  put(Map<String,String> map, final int seconds,int dbIndex ) throws Exception{
		putNormal(map,seconds, dbIndex);
    }

    private static synchronized void putNormal(Map<String,String> map, int seconds,int dbIndex) throws Exception{
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

    public static synchronized  void flushDB(int dbIndex){
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			jedis.flushDB();
		} catch (Exception e) {
			logger.error("=============== 从Redis获取数据失败：" + e.getMessage(), e);
		} finally {
			jedis.close();
		}
	}

	public static synchronized void delete(String key, int dbIndex) {
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			jedis.del(key);
		} catch (Exception e) {
			logger.error("=============== 从Redis获取数据失败：" + e.getMessage(), e);
		} finally {
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

	public static synchronized void srem(String key, String member, int dbIndex) {
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			//SREM key member移除集合中的member元素。
			jedis.srem(key, member);
		} catch (Exception e) {
			logger.error("=============== 从Redis删除数据失败：" + e.getMessage(), e);
		} finally {
			jedis.close();
		}
	}

	public static synchronized void sismember(String key, String member, int dbIndex) {
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			//SISMEMBER key member判断member元素是否是集合key的成员。是（true），否则（false）
			jedis.sismember(key, member);
		} catch (Exception e) {
			logger.error("=============== 从Redis验证数据失败：" + e.getMessage(), e);
		} finally {
			jedis.close();
		}
	}


	public static synchronized Set<String> keys(String keyPre,int dbIndex) throws Exception{
		Jedis jedis = jedisSentinelPool.getResource();
		try {
			jedis.select(dbIndex);
			Set<String> keys = jedis.keys(keyPre);
			return keys;
		}catch(Exception e){
			logger.error("=============== 往Redis插入数据失败："+e.getMessage(),e);
		}finally {
			jedis.close();
		}
		return null;
	}

	 public static synchronized void putHashTable(String key, Map<String, String> map, int seconds, int dbIndex) throws Exception {
	        Jedis jedis = jedisSentinelPool.getResource();
	        try {
	            jedis.select(dbIndex);
	            Pipeline pipe = jedis.pipelined();
	            for (Entry<String, String> entry : map.entrySet()) {
	                pipe.hset(key.getBytes(), entry.getKey().getBytes(), entry.getValue().getBytes());
	            }
	            pipe.expire(key.getBytes(), seconds);
	            pipe.sync();
	            pipe.clear();
	            pipe.close();
	        } catch (Exception e) {
	            logger.error("=============== 往Redis插入HashTable数据失败：" + e.getMessage(), e);
	        } finally {
	            jedis.close();
	        }
	    }
	
    public static  void  main(String args[]){
    	long begin= System.currentTimeMillis();
    	boolean b = exist("0100387_1_4020",2);
    	log.info(b+"");
    	long end = System.currentTimeMillis();
    	log.info("-------Used Time =" + (end - begin));
    }
}
