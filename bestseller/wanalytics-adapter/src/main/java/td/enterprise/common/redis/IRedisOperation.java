package td.enterprise.common.redis;

import java.util.Map;

import org.springframework.data.redis.connection.DataType;

public interface IRedisOperation {

    Long remove(String key);

    Long expire(String key, int seconds);

    Long persist(String key);

    boolean exists(String key);

    DataType type(String key);

    Long ttl(String key);

    /** String start... */
    boolean set(String key, String value);

    boolean set(String key, String value, int seconds);

    String get(String key);

    int getInt(String key);

    /** FTP */
    boolean getLock(String key, String value, int seconds);

    boolean unLock(String key);

    Long incr(String key, int seconds);

    Long decr(String key);

    Map<String, Integer> getJedisPoolStatus();

}
