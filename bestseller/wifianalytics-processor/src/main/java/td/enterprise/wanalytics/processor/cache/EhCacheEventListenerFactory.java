package td.enterprise.wanalytics.processor.cache;

import net.sf.ehcache.event.CacheEventListener;
import net.sf.ehcache.event.CacheEventListenerFactory;

import java.util.Properties;

public class EhCacheEventListenerFactory extends CacheEventListenerFactory{

	@Override
	public CacheEventListener createCacheEventListener(Properties properties) {
		return new EhCacheEventListener();
	}

}
