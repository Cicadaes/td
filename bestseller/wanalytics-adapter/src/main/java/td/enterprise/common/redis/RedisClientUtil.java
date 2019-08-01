package td.enterprise.common.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import redis.clients.jedis.JedisSentinelPool;

/**
 * redis client util 
 * @description 
 * @author sxk
 * @date 2017年10月13日
 */
@Component
public class RedisClientUtil extends BaseRedis {

    @Autowired
    private JedisSentinelPool pool;

    @Override
    JedisSentinelPool getJedisPool() {
        return pool;
    }
}