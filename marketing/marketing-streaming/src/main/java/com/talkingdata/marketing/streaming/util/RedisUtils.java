package com.talkingdata.marketing.streaming.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * @author Created by tend on 2017/10/23.
 */
@Component
public class RedisUtils {

    @Autowired
    private StringRedisTemplate redisTemplate;

    public void set(String key, String value) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(key, value);
    }

    public String get(String key) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        return valueOperations.get(key);
    }

    public void setHash(String key, String hKey, String value) {
        HashOperations<String, Object, Object> hashOperations = redisTemplate.opsForHash();
        hashOperations.put(key, hKey, value);
    }

    public String getHash(String key, String hKey) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        return hashOperations.get(key, hKey);
    }

    public boolean expire(String key, Long seconds) {
        return redisTemplate.expire(key, seconds, TimeUnit.SECONDS);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    /**
     * Removes and returns first element in list stored at {@code key}.
     *
     * @param key must not be {@literal null}.
     * @return
     * @see <a href="http://redis.io/commands/lpop">Redis Documentation: LPOP</a>
     */
    public String leftPop(String key) {
        return redisTemplate.opsForList().leftPop(key);
    }

}
