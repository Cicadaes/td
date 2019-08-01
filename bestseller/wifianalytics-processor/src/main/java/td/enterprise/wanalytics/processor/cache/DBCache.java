/**
 * 
 * @author davy
 * 日期:		2013-6-5 10:24:21
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.wanalytics.processor.cache;

import td.enterprise.wanalytics.common.QueryBean;
import td.enterprise.wanalytics.common.QueryResult;

public abstract class DBCache {
	public abstract QueryResult getSomeThings(QueryBean queryBean);

	public abstract void putSomeThings(QueryBean queryBean, QueryResult queryResult);
}
