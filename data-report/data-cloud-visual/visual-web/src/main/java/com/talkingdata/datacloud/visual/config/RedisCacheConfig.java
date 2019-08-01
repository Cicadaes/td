package com.talkingdata.datacloud.visual.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import redis.clients.jedis.JedisPoolConfig;

import javax.inject.Inject;
import java.util.*;

@Configuration
public class RedisCacheConfig extends CachingConfigurerSupport {

    private static final String REDIS_DEFUALTEXPIRATION = "spring.redis.expiration.defaultExpiration";
    private static final String REDIS_DATAEXPIRATION = "spring.redis.expiration.dataExpiration";
    private static final String REDIS_SENTINEL_MASTER = "spring.redis.sentinel.master";
    private static final String REDIS_SENTINEL_NODES = "spring.redis.sentinel.nodes";
    private static final String REDIS_POOL_MAXIDLE = "spring.redis.pool.max-idle";
    private static final String REDIS_POOL_MINIDLE = "spring.redis.pool.min-idle";
    private static final String REDIS_POOL_MAXWAIT = "spring.redis.pool.max-wait";
    private static final String REDIS_POOL_MAXACTIVE = "spring.redis.pool.max-active";
    private static final String REDIS_POOL_TESTONBORROW = "spring.redis.pool.testOnBorrow";

    @Inject
    private Environment env;

    @Bean
    public JedisPoolConfig jedisPoolConfig() {
        JedisPoolConfig jedisPoolConfig=new JedisPoolConfig();
        jedisPoolConfig.setMaxIdle(env.getRequiredProperty(REDIS_POOL_MAXIDLE,Integer.class));
        jedisPoolConfig.setMinIdle(env.getRequiredProperty(REDIS_POOL_MINIDLE,Integer.class));
        jedisPoolConfig.setMaxWaitMillis(env.getRequiredProperty(REDIS_POOL_MAXWAIT,Integer.class));
        jedisPoolConfig.setTestOnBorrow(env.getRequiredProperty(REDIS_POOL_TESTONBORROW,Boolean.class));
        return jedisPoolConfig;
    }

    @Bean
    public JedisConnectionFactory redisConnectionFactory(JedisPoolConfig jedisPoolConfig) {
        String master=env.getRequiredProperty(REDIS_SENTINEL_MASTER);
        String sentinels=env.getRequiredProperty(REDIS_SENTINEL_NODES);
        Set<String> sentinelSet=new HashSet<>(Arrays.asList(sentinels.split(",")));
        RedisSentinelConfiguration redisSentinelConfiguration=new RedisSentinelConfiguration(master,sentinelSet);
        JedisConnectionFactory redisConnectionFactory = new JedisConnectionFactory(redisSentinelConfiguration);
        redisConnectionFactory.setPoolConfig(jedisPoolConfig);
        return redisConnectionFactory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new GenericJackson2JsonRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }

    @Bean
    public CacheManager cacheManager(@SuppressWarnings("rawtypes") RedisTemplate redisTemplate) {
        RedisCacheManager cacheManager = new RedisCacheManager(redisTemplate);
        cacheManager.setDefaultExpiration(env.getRequiredProperty(REDIS_DEFUALTEXPIRATION,Long.class));
        Map<String, Long> expires =new HashMap<>();
        expires.put("datareport_data",env.getRequiredProperty(REDIS_DATAEXPIRATION,Long.class));
        cacheManager.setExpires(expires);
        cacheManager.setUsePrefix(true);
        return cacheManager;
    }
}