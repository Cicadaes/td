/**
 * 
 * @author davy
 * 日期:		2013-6-5 10:24:18
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.atomic.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.wanalytics.common.QueryBean;
import td.enterprise.wanalytics.common.QueryResult;
import td.enterprise.wanalytics.processor.cache.DBCache;

public class CacheDaoImpl extends BasicDaoImpl {
	private Logger logger = LoggerFactory.getLogger(CacheDaoImpl.class);
	private DBCache dbCache;

	public DBCache getDbCache() {
		return dbCache;
	}

	public void setDbCache(DBCache dbCache) {
		this.dbCache = dbCache;
	}

	@Override
	public QueryResult getSomeThings(QueryBean queryBean) {
		QueryResult queryResult = null;
		try {
			queryResult = dbCache.getSomeThings(queryBean);
			if (Utils.isEmpty(queryResult)) {
				queryResult = super.getSomeThings(queryBean);
				if (Utils.isNotEmpty(queryResult)) {
					dbCache.putSomeThings(queryBean, queryResult);
				}
			}
		} catch (Exception e) {
			logger.error("异常了：",e);
		}
		return queryResult;
	}

}
