package td.enterprise.config.prop;

import lombok.Data;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 
 * 接收application.yml中的redisProps下面的属性
 * @description 
 * @author sxk
 * @date 2017年10月10日
 */
@Data
@Component
@ConfigurationProperties(prefix = "spring.redis.pool")
public class RedisProps {

    private int    maxTotal;
    private int    maxIdle;
    private int    minIdle;
    private int    timeout;

    @Value(value = "${spring.sentinel.host}")
    private String host;
    @Value(value = "${spring.sentinel.master}")
    private String master;

    /**
     * 文件锁redis key 前缀
     */
    private String ftpLockKey;
    /**
     * 文件夹统计数据
     */
    private String ftpDirectoryLockKey;
}
