package td.enterprise.framework.plugin.changer.commons;
/**
 * 
 * @author davy
 * 日期:		2013-6-3 11:50:48
 * 
 * The default character set is UTF-8.
 */


import td.enterprise.framework.plugin.changer.commons.atomic.ETLAtomicChanger;

import java.util.ArrayList;
import java.util.Collection;

public class ETLChangers extends ArrayList<ETLAtomicChanger> {

	public ETLChangers(Collection<? extends ETLAtomicChanger> c) {
		super(c);
	}

	public ETLChangers() {
		super();
	}

}
