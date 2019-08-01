package td.enterprise.wanalytics.processor.cache;

import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.event.CacheEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.utils.RedisClient;

public class EhCacheEventListener implements CacheEventListener {
	   
	   private static Logger logger = LoggerFactory.getLogger(EhCacheEventListener.class);
	
	   @Override  
	   public void notifyElementRemoved(Ehcache cache, Element element)
	         throws CacheException {
		   logger.debug("removed element key=" + element.getKey() + " value=" + element.getValue() );
	   }  
	   
	   @Override  
	   public void notifyElementPut(Ehcache cache, Element element)
	         throws CacheException {
		   logger.debug("put");
	   }  
	   
	   @Override
	   public void notifyElementUpdated(Ehcache cache, Element element)
	         throws CacheException {
		   logger.debug("notifyElementUpdated");
	   }
	   
	   @Override
	   public void notifyElementExpired(Ehcache cache, Element element) {
		   RedisClient.putNormal(element.getKey() + "", element.getValue() + "", RedisClient.cacheSessionTimeoutSeconds, Constants.PROJECT_FRONT_USER_DB_INDEX);
		   logger.debug("expired element key=" + element.getKey() + " value=" + element.getValue() );
	   }  
	   
	   @Override
	   public void notifyElementEvicted(Ehcache cache, Element element) {
		   RedisClient.putNormal(element.getKey() + "", element.getValue() + "", RedisClient.cacheSessionTimeoutSeconds, Constants.PROJECT_FRONT_USER_DB_INDEX);
		   logger.debug("Evicted element key=" + element.getKey() + " value=" + element.getValue() );
	   }  
	   
	   @Override  
	   public void notifyRemoveAll(Ehcache cache) {
		   logger.debug("removeAll");
	   }  
	   
	   @Override  
	   public void dispose() {
	   
	   }
	   
	   public Object clone() throws CloneNotSupportedException {
	      throw new CloneNotSupportedException();
	   }  
	   
	}  
