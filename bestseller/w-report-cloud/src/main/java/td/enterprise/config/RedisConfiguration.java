package td.enterprise.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.util.SerializationUtils;
import org.springframework.util.StringUtils;
import redis.clients.jedis.JedisPoolConfig;
import td.enterprise.common.constant.RedisCacheConstants;

import javax.inject.Inject;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Yan on 2017/3/24.
 */
@Configuration
@EnableRedisHttpSession
@EnableCaching
public class RedisConfiguration extends CachingConfigurerSupport {


    // private static String REDIS_HOST = "spring.redis.host";
    // private static String REDIS_PORT = "spring.redis.port";
    // private static String REDIS_INDEX = "spring.redis.index";
    private static String REDIS_EXPIRE = "spring.redis.expire";
    // private static String REDIS_PASSWORD = "spring.redis.password";
    // private static String REDIS_TIMEOUT = "spring.redis.timeout";
    private static String REDIS_MAX_ACTIVE = "spring.redis.pool.max-active";
    private static String REDIS_MAX_IDLE = "spring.redis.pool.max-idle";
    private static String REDIS_MAX_WAIT = "spring.redis.pool.max-wait";
    private static String SENTINEL_HOST = "spring.sentinel.host";
    private static String SENTINEL_MASTER = "spring.sentinel.master";

    @Inject
    private Environment env;

    @Bean
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                if (params.length == 0) {
                    return RedisCacheConstants.PRE_FIX + method.getName();
                }
                if (params.length == 1) {
                    Object param = params[0];
                    if (param != null && !param.getClass().isArray()) {
                        return RedisCacheConstants.PRE_FIX + method.getName() + "_" + param;
                    }
                }
                return RedisCacheConstants.PRE_FIX + method.getName() + " [" + StringUtils.arrayToCommaDelimitedString(params) + "]";
            }
        };
    }

    @Bean
    public CacheManager cacheManager(RedisTemplate redisTemplate) {
        RedisCacheManager redisCacheManager = new RedisCacheManager(redisTemplate);
        redisCacheManager.setDefaultExpiration(Long.parseLong(env.getRequiredProperty(REDIS_EXPIRE)));
        return redisCacheManager;
    }

    @Bean(name = "redisTemplate")
    public RedisTemplate <String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate <String, Object> redisTemplate = new RedisTemplate <>();
        redisTemplate.setConnectionFactory(factory);
        redisTemplate.setValueSerializer(new RedisSerializer <Object>() {
            @Override
            public byte[] serialize(Object object) throws SerializationException {
                if (object == null) {
                    return new byte[0];
                }
                if (!(object instanceof Serializable)) {
                    throw new IllegalArgumentException("RedisSerializer.serialize requires a Serializable payload "
                            + "but received an object of type [" + object.getClass().getName() + "]");
                }
                return SerializationUtils.serialize(object);
            }

            @Override
            public Object deserialize(byte[] bytes) throws SerializationException {
                if (bytes == null || bytes.length == 0) {
                    return null;
                }
                return SerializationUtils.deserialize(bytes);
            }
        });
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }


    @Bean(name = "redisStringTemplate")
    public RedisTemplate <String, Object> redisStringTemplate(RedisConnectionFactory factory) {
        RedisTemplate <String, Object> redisTemplate = new RedisTemplate <>();
        redisTemplate.setConnectionFactory(factory);
        RedisSerializer<String> stringRedisSerializer = new StringRedisSerializer();//Long类型不可以会出现异常信息;
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }



    @Bean
    public JedisConnectionFactory redisConnectionFactory() {
        JedisConnectionFactory redisConnectionFactory = new JedisConnectionFactory(redisSentinelConfiguration(), jedisPoolConfig());
        // Defaults
        // redisConnectionFactory.setHostName(env.getRequiredProperty(REDIS_HOST));
        // redisConnectionFactory.setPort(Integer.parseInt(env.getRequiredProperty(REDIS_PORT)));
        // redisConnectionFactory.setDatabase(Integer.parseInt(env.getRequiredProperty(REDIS_INDEX)));
        // redisConnectionFactory.setPassword(env.getRequiredProperty(REDIS_PASSWORD));
        // redisConnectionFactory.setTimeout(Integer.parseInt(env.getRequiredProperty(REDIS_TIMEOUT)));
        return redisConnectionFactory;
    }


    @Bean(name = "jedisPoolConfig")
    public JedisPoolConfig jedisPoolConfig() {
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxTotal(Integer.parseInt(env.getRequiredProperty(REDIS_MAX_ACTIVE)));
        jedisPoolConfig.setMaxIdle(Integer.parseInt(env.getRequiredProperty(REDIS_MAX_IDLE)));
        jedisPoolConfig.setMaxWaitMillis(Integer.parseInt(env.getRequiredProperty(REDIS_MAX_WAIT)));
        return jedisPoolConfig;
    }

    @Bean(name = "redisSentinelConfiguration")
    public RedisSentinelConfiguration redisSentinelConfiguration() {
        String master = env.getRequiredProperty(SENTINEL_MASTER);
        Set <String> sentinelHostAndPorts = new HashSet <>();
        sentinelHostAndPorts.add(env.getRequiredProperty(SENTINEL_HOST));
        RedisSentinelConfiguration redisSentinelConfiguration = new RedisSentinelConfiguration(master, sentinelHostAndPorts);
        return redisSentinelConfiguration;
    }
}
