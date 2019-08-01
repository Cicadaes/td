package td.enterprise.common.redis;

/**
 * FTP常量
 * @description 
 * @author sxk
 * @date 2017年10月16日
 */
public class RedisKey {

    /**
     * 文件锁 value
     */
    public static final String FTP_LOCK_VALUE            = "1";

    /**
     * 缓存一天 60*60*24    
     */
    public static final int    FTP_FILE_LOCK_EXPIRE_TIME = 259200;

}
