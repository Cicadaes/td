/**
 * 
 * @author davy
 * 日期:		2013-6-3 11:52:13
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.commons.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.Map;
import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.commons.ETLChangerContainer;
import td.enterprise.framework.plugin.changer.commons.ETLChangers;
import td.enterprise.framework.plugin.changer.commons.ListInMapChanger;
import td.enterprise.framework.plugin.changer.commons.atomic.ETLAtomicChanger;
import td.enterprise.framework.plugin.changer.commons.factory.ChangerFactory;
import td.enterprise.framework.plugin.changer.commons.utils.MapUtils;

import java.util.List;

public class ListInMapChangerImpl extends ListInMapChanger {
	private static final Logger logger = LoggerFactory.getLogger(ListInMapChangerImpl.class);
	private static final String changersNames = "changersnames.";
	private static final String changersOutputs = "changersoutputs.";

	@Override
	public void changerRegistration() {
		addChanger();
		logger.debug(Utils.toLog("changerContainer\t", StringUtils.ToString(changerContainer.hashCode())));
	}

	public void setChangerContainer(ETLChangerContainer changerContainer) {
		this.changerContainer = changerContainer;
	}

	public ETLChangerContainer getChangerContainer() {
		return changerContainer;
	}

	private void addChanger() {
		Map<String, Object> changersNamesMap = getChangersNamesMap();
		Map<String, Object> changersOutPutMap = getChangersOutPutMap();
		for (String dataType : changersNamesMap.keySet()) {
			List<ETLAtomicChanger> atomicChangers = ChangerFactory.produc(changersNamesMap.getStringValue(dataType), changersOutPutMap.getStringValue(dataType));
			changerContainer.put(dataType, new ETLChangers(atomicChangers));
		}
	}

	/**
	 * @return
	 */
	private Map<String, Object> getChangersOutPutMap() {
		Map<String, Object> changersOutPutMap = new Map<String, Object>(param);
		MapUtils.keyStartWith(changersOutPutMap, changersOutputs);
		MapUtils.removeKeyStart(changersOutPutMap, changersOutputs);
		return changersOutPutMap;
	}

	/**
	 * @return
	 */
	private Map<String, Object> getChangersNamesMap() {
		Map<String, Object> changersNamesMap = new Map<String, Object>(param);
		MapUtils.keyStartWith(changersNamesMap, changersNames);
		MapUtils.removeKeyStart(changersNamesMap, changersNames);
		return changersNamesMap;
	}

}
