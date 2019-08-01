package td.enterprise.config;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisSentinelPool;
import td.enterprise.config.prop.RedisProps;

@Configuration
public class RedisClientConfig {

    @Autowired
    private RedisProps redisProps;

    @Bean
    public JedisSentinelPool jedisSentinelPool() {
        Set<String> sentinelHostAndPorts = new HashSet<>();
        String[] hosts = redisProps.getHost().split(",");
        for (String host : hosts) {
            sentinelHostAndPorts.add(host);
        }
        return new JedisSentinelPool(redisProps.getMaster(), sentinelHostAndPorts, genericObjectPoolConfig(), redisProps.getTimeout());
    }

    @Bean
    public GenericObjectPoolConfig genericObjectPoolConfig() {
        JedisPoolConfig jedisConfig = new JedisPoolConfig();
        jedisConfig.setMaxIdle(redisProps.getMaxIdle());
        jedisConfig.setMinIdle(redisProps.getMinIdle());
        jedisConfig.setMaxTotal(redisProps.getMaxTotal());
        return jedisConfig;
    }

}
