/**
 * 
 */
package td.enterprise.framework.commons.cache;

import java.util.concurrent.ConcurrentHashMap;

/**
 * @author davy 2014年8月27日 下午12:30:40
 */
public class CacheMonitor {
	public static final ConcurrentHashMap<String, ICacheStatus> cacheMap = new ConcurrentHashMap<String, ICacheStatus>();

}
