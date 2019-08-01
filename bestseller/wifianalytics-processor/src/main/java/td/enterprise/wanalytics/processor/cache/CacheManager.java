
package td.enterprise.wanalytics.processor.cache;

public class CacheManager extends net.sf.ehcache.CacheManager {
	
	public CacheManager() {
		super(CacheManager.class.getClassLoader().getResource("datafilter-ehcache.xml"));
	}
}
