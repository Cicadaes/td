package td.enterprise.wanalytics.processor.cache.impl;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.wanalytics.common.QueryBean;
import td.enterprise.wanalytics.common.QueryResult;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.cache.DBCache;
import td.enterprise.wanalytics.processor.utils.Utils;

import java.util.ArrayList;
import java.util.List;

/**
 * @author yangtao
 */
public class DBEhcache extends DBCache {
	
	/**
	 * 日志
	 */
	public static final Logger logger = LoggerFactory.getLogger(DBEhcache.class);
	
	/**
	 * 缓存类
	 */
	private static final Cache cache = CacheFactory.getProjectCache();
	

	/* (non-Javadoc)
	 * @see td.enterprise.dmp.wanalytics.processor.cache.DBCache#getSomeThings(td.enterprise.dmp.wanalytics.processor.common.model.QueryBean)
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
    public QueryResult getSomeThings(QueryBean queryBean) {
		QueryResult qr = null;
		if (Utils.isNotEmpty(queryBean)) {
			Element e = cache.get(queryBean.getKey());
			if (Utils.isNotEmpty(e)) {
				List tmp = new ArrayList<Object[]>();
				tmp.add(e.getValue());
				qr = new QueryResult(tmp);
			}
		}
		return qr;
	}

	/* (non-Javadoc)
	 * @see td.enterprise.dmp.wanalytics.processor.cache.DBCache#putSomeThings(td.enterprise.dmp.wanalytics.processor.common.model.QueryBean, td.enterprise.dmp.wanalytics.processor.common.model.QueryResult)
	 */
	public void putSomeThings(QueryBean queryBean, QueryResult queryResult) {
		Object[] obj = queryResult.get(0);
		Element element = new Element(queryBean.getKey(), obj);
		cache.put(element);
	}

}
