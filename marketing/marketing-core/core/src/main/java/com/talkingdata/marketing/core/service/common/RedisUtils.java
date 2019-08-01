package com.talkingdata.marketing.core.service.common;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/**
 * redis 访问类
 * @author xiaoming.kang
 * Created by tend on 2017/9/19.
 */
@Component
public class RedisUtils {

    @Autowired
    private StringRedisTemplate redis;

    /**
     * LPUSH
     *
     * @param key   the key
     * @param value the value
     * @return the long
     */
    public long leftpush(String key, String value) {
        ListOperations<String, String> opsForList = redis.opsForList();
        return opsForList.leftPush(key, value);
    }

    /**
     * Left push all long.
     *
     * @param key   the key
     * @param value the value
     * @return the long
     */
    public long leftPushAll(String key, List<String> value) {
        ListOperations<String, String> opsForList = redis.opsForList();
        return opsForList.leftPushAll(key, value);
    }

    /**
     * RPOP
     *
     * @param key the key
     * @return the string
     */
    public String rightPop(String key) {
        ListOperations<String, String> opsForList = redis.opsForList();
        return opsForList.rightPop(key);
    }

    /**
     * R size
     *
     * @param key the key
     * @return the long
     */
    public long size(String key) {
        ListOperations<String, String> opsForList = redis.opsForList();
        return opsForList.size(key);
    }

    /**
     * Expire at boolean.
     *
     * @param key  the key
     * @param date the date
     * @return the boolean
     */
    public Boolean expireAt(String key, Date date) {
        return redis.expireAt(key, date);
    }
}
