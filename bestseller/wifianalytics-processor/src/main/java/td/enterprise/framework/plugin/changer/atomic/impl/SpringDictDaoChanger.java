/**
 * 
 * @author davy
 * 日期:		2013-6-5 10:24:20
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.atomic.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class SpringDictDaoChanger extends DataFilterAtomicChanger {

	public static final Logger logger = LoggerFactory.getLogger(SpringDictDaoChanger.class);

	protected static CacheDaoImpl dao;

	static {
		dao = SpringDaoChanger.dao;
	}

	public static CacheDaoImpl getDao() {
		return dao;
	}
}
