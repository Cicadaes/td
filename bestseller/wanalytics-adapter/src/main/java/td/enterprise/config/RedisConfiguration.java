package td.enterprise.config;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.SerializationUtils;

import redis.clients.jedis.JedisPoolConfig;
import td.enterprise.config.prop.RedisProps;

/**
 * Created by Yan on 2017/3/24.
 */
@Configuration
public class RedisConfiguration {

    @Autowired
    private RedisProps redisProps;

    @Bean(name = "redisTemplate")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(factory);
        redisTemplate.setValueSerializer(new RedisSerializer<Object>() {
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
    public RedisTemplate<String, Object> redisStringTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(factory);
        RedisSerializer<String> stringRedisSerializer = new StringRedisSerializer();//Long类型不可以会出现异常信息;
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

    @Bean
    public JedisConnectionFactory redisConnectionFactory() {
        JedisConnectionFactory redisConnectionFactory = new JedisConnectionFactory(redisSentinelConfiguration(), jedisPoolConfig());
        redisConnectionFactory.setTimeout(redisProps.getTimeout());
        return redisConnectionFactory;
    }

    @Bean
    public JedisPoolConfig jedisPoolConfig() {
        JedisPoolConfig jedisConfig = new JedisPoolConfig();
        jedisConfig.setMaxIdle(redisProps.getMaxIdle());
        jedisConfig.setMinIdle(redisProps.getMinIdle());
        jedisConfig.setMaxTotal(redisProps.getMaxTotal());
        return jedisConfig;
    }

    @Bean(name = "redisSentinelConfiguration")
    public RedisSentinelConfiguration redisSentinelConfiguration() {
        String master = redisProps.getMaster();
        Set<String> sentinelHostAndPorts = new HashSet<>();
        sentinelHostAndPorts.add(redisProps.getHost());
        RedisSentinelConfiguration redisSentinelConfiguration = new RedisSentinelConfiguration(master, sentinelHostAndPorts);
        return redisSentinelConfiguration;
    }
}
