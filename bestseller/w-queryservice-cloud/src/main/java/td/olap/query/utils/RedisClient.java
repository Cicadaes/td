package td.olap.query.utils;

/**
 * Created by hadoop on 17/3/3.
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class RedisClient {
    private static Logger logger = LoggerFactory.getLogger(RedisClient.class);
    private static JedisSentinelPool jedisSentinelPool;//切片连接池
    private  static RedisClient client = null;

    public  static synchronized RedisClient getInstance(String redisHosts,String masterName){
        if(null == client ){
            client = new RedisClient();
            initialShardedPool(redisHosts,masterName);
        }
        return client;
    }

    private RedisClient(){

    }


    /**
     * 初始化切片池
     */
    private static void initialShardedPool(String redisHosts,String masterName ) {
        // 池基本配置
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(20);
        config.setMaxIdle(5);
        config.setMaxWaitMillis(1000l);
        config.setTestOnBorrow(false);

        try{
            Set<String> sentinels = new HashSet<String>();
            for(String sentinel : redisHosts.split(",")){
                sentinels.add(sentinel.trim());
            }
            jedisSentinelPool = new JedisSentinelPool(masterName, sentinels,config);
        }catch(Exception e){
            logger.error("初始化访问Redis出错 ："+e.getMessage(),e);
        }
    }

    public void close() {
        jedisSentinelPool.close();
        jedisSentinelPool.close();
    }

    public  void set(String key,String value){
        Jedis jedis = jedisSentinelPool.getResource();
        try{
            System.out.println("redisset:key="+key+",value="+value);
            System.out.println("jedisset:key="+key+",value="+value);
            jedis.set(key,value);
            System.out.println("setsuccess:key="+key+",value="+value);
        }catch(Exception e){
            logger.error("set redis exception",e);
        }finally {
            jedis.close();
        }
    }
    public  void set(byte[] key,byte[] value) throws Exception{
        Jedis jedis = jedisSentinelPool.getResource();
        try{
            logger.info("redissetb:key="+key+",value="+value);
            logger.info("jedissetb:key="+key+",value="+value);
            jedis.set(key,value);
            logger.info("setsuccessb:key="+key+",value="+value);
        }catch(Exception e){
            logger.error("set redis exception",e);
            throw e;
        }finally {
            jedis.close();
        }
    }

    public  String get(String key){
        String ret = null;
        Jedis jedis = jedisSentinelPool.getResource();
        try{
            ret =  jedis.get(key);
        }catch (Exception e){
            logger.error("get exception",e);
        }finally {
            jedis.close();
        }

        return ret;
    }
    public byte[] get(byte[] key){
        byte[] ret = null;
        Jedis jedis = jedisSentinelPool.getResource();
        try{
            ret =  jedis.get(key);
        }catch (Exception e){
            logger.error("get exception",e);
        }finally {
            jedis.close();
        }
        return ret;
    }

}
