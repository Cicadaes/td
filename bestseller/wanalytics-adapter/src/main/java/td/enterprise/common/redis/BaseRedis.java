package td.enterprise.common.redis;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.redis.connection.DataType;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisSentinelPool;
import redis.clients.jedis.exceptions.JedisException;
import td.enterprise.common.util.LogUtils;

public abstract class BaseRedis implements IRedisOperation {
    /**
     * 永远不过期时间
     */
    public static final int    NEVER_EXPIRE         = -1;
    /**
     * 过期时间=1 天,单位秒
     */
    public static final int    EXPIRE_SECONDS_DAY   = 86400;
    /**
     * 过期时间=30 天,单位秒
     */
    public static final int    EXPIRE_SECONDS_MONTH = 2592000;
    /**
     * 过期时间=365 天,单位秒
     */
    public static final int    EXPIRE_SECONDS_YEAR  = 31536000;

    /**
     * 关闭渠道的标示
     */
    public static final String CLOSE_FLAG           = "quit";
    /**
     * 获取消息时的等待时间,单位秒
     */
    public static final int    BLOCK_TIME           = 30;

    abstract JedisSentinelPool getJedisPool();

    @Override
    public Long remove(String key) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return jedis.del(key);
        } catch (JedisException e) {
            errLog(e, "Redis remove key:%s, err:", key);
            return null;
        }
    }

    /**
     * 设置key的缓存时间
     * @param key
     * @param seconds
     * @return
     */
    @Override
    public Long expire(String key, int seconds) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return jedis.expire(key, seconds);
        } catch (JedisException e) {
            errLog(e, "Redis expire key:%s, err:", key);
            return null;
        }
    }

    /**
     * 持久化，即如果将key设置永不过期
     * @param key
     * @return
     */
    @Override
    public Long persist(String key) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return jedis.persist(key);
        } catch (JedisException e) {
            errLog(e, "Redis persist key:%s, err:", key);
            return null;
        }
    }

    /**
     * 判断key是否存在
     * @param key
     * @return
     */
    @Override
    public boolean exists(String key) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return jedis.exists(key);
        } catch (JedisException e) {
            errLog(e, "Redis exists key:%s, err:", key);
            return false;
        }
    }

    /**
     * 判断key的类型
     * @param key
     * @return
     */
    @Override
    public DataType type(String key) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return DataType.fromCode(jedis.type(key));
        } catch (JedisException | IllegalArgumentException e) {
            errLog(e, "Redis type key:%s, err:", key);
            return null;
        }
    }

    /**
     * 返回key的过期时间,-1:永不过期，-2:key不存在 
     * @param key
     * @return
     */
    @Override
    public Long ttl(String key) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return jedis.ttl(key);
        } catch (JedisException e) {
            errLog(e, "Redis ttl key:%s, err:", key);
            return null;
        }
    }

    /** String start... */
    /**
     * 设置key-value对，值类型为String ,默认过期时间30天
     * @param key
     * @param value
     * @return
     */
    @Override
    public boolean set(String key, String value) {
        return set(key, value, EXPIRE_SECONDS_DAY);
    }

    /**
     * 设置key-value对，值类型为String,过期时间单位秒
     * @param key
     * @param value
     * @return
     */
    @Override
    public boolean set(String key, String value, int seconds) {
        try (Jedis jedis = getJedisPool().getResource()) {
            if (seconds == NEVER_EXPIRE) {
                jedis.set(key, value);
            } else {
                jedis.setex(key, seconds, value);
            }
            return true;
        } catch (JedisException e) {
            errLog(e, "Redis set key:%s,value:%s, err:", key, value);
            return false;
        }
    }

    /**
     * 获取key的Value值，类型为String 
     * @param key
     * @return
     */
    @Override
    public String get(String key) {
        try (Jedis jedis = getJedisPool().getResource()) {
            return jedis.get(key);
        } catch (JedisException e) {
            errLog(e, "Redis get key:%s, err:", key);
            return null;
        }
    }

    @Override
    public int getInt(String key) {
        String value = get(key);
        return value == null ? 0 : Integer.parseInt(value);
    }

    @Override
    public boolean getLock(String key, String value, int seconds) {
        boolean lock = false;
        try (Jedis jedis = getJedisPool().getResource()) {
            lock = jedis.setnx(key, value) > 0L;
            if (lock && seconds != NEVER_EXPIRE) {
                jedis.expire(key, seconds);
            }
        } catch (JedisException je) {
            unLock(key);
            errLog(je, "Redis getLock key:%s, err:", key);
        }
        return lock;
    }

    @Override
    public boolean unLock(String key) {
        boolean isDel = false;
        try (Jedis jedis = getJedisPool().getResource()) {
            isDel = jedis.del(key) > 0L;
            LogUtils.log4Redis.info("unLock key:{}", key);
        } catch (JedisException je) {
            errLog(je, "Redis unLock key:%s, err:", key);
        }
        return isDel;
    }

    @Override
    public Long incr(String key, int seconds) {
        Long num = 0L;
        try (Jedis jedis = getJedisPool().getResource()) {
            num = jedis.incr(key);
            LogUtils.log4Redis.info("incr key:{},num:{}", key, num);
            if (seconds != NEVER_EXPIRE && num < 2L) {
                jedis.expire(key, seconds);
            }
        } catch (JedisException je) {
            decr(key);
            errLog(je, "Redis incr key:%s, err:", key);
        }
        return num;
    }

    @Override
    public Long decr(String key) {
        Long num = 0L;
        try (Jedis jedis = getJedisPool().getResource()) {
            num = jedis.decr(key);
        } catch (JedisException je) {
            errLog(je, "Redis decr key:%s, err:", key);
        }
        return num;
    }

    @Override
    public Map<String, Integer> getJedisPoolStatus() {
        Map<String, Integer> statusMap = new HashMap<String, Integer>(4);
        try (JedisSentinelPool pool = getJedisPool()) {
            statusMap.put("numActive", pool.getNumActive());
            statusMap.put("numIdle", pool.getNumIdle());
            statusMap.put("numWaiters", pool.getNumWaiters());
        } catch (JedisException je) {
            errLog(je, "Redis getJedisPoolStatus key:%s, err:", "getJedisPoolStatus");
        }
        return statusMap;
    }

    /**
     * @param e
     * @param format
     * @param args
     */
    private void errLog(Exception e, String format, Object... args) {
        LogUtils.log4Redis.error(String.format(format, args), e);
    }

}
