package td.enterprise.framework.plugin.changer.commons;

import td.enterprise.framework.plugin.changer.commons.atomic.ETLAtomicChanger;

/**
 * 
 * @author davy
 * 日期:		2013-6-3 11:50:48
 * 
 * The default character set is UTF-8.
 */


public class ETLChangerContainer extends java.util.concurrent.ConcurrentHashMap<String, ETLChangers> {
	public synchronized void addChanger(String dataType, ETLAtomicChanger atomicChanger) {
		if (containsKey(dataType)) {
			get(dataType).add(atomicChanger);
		} else {
			ETLChangers changers = new ETLChangers();
			changers.add(atomicChanger);
			put(dataType, changers);
		}
	}
}
