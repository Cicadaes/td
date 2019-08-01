package td.enterprise.wanalytics.changer;


import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.bean.FilterMacBean;
import td.enterprise.wanalytics.processor.bean.FilterTypeEnum;
import td.enterprise.wanalytics.processor.bean.MacCompany;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.*;

import java.util.Date;

/**
 * 判断mac地址的前8位是否为移动设备，此白名单是人工过滤出来  丢弃
 *
 * 人工过滤出来非移动mac地址名单，不在这里的mac 进行通过
 */
public class MacCompanyFilterChanger extends SpringDictDaoChanger {

	//mac和公司对应表
	private Cache macCompanyCache = CacheFactory.getMacCompanyCache();

	public Line _change(Line line) {
		if (null != line && needChange(line)) {
			try {
				String sensorMac = (String) line.get(LineKeyConstants.apmac);
				String deviceMac = (String) line.get(LineKeyConstants.mac);

				//校验用户mac地址是否满足17位，不满足，直接丢弃
				//由于前面探针mac 地址补充了分号，判断用户mac 是否为17位即可
				if(StringUtils.isBlank(deviceMac) || deviceMac.trim().length() != 17){
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_MAC_LENGTH_FILTER);
					SensorPropFillChanger.setDiscardFrontUser(line);
					DiscardLogger.write(line);
				}

				if (!line.discard && StringUtils.isBlank(sensorMac) || isNotLegalMobileMacAdress(deviceMac)) {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_MOBILE_MAC_FILTER);
					SensorPropFillChanger.setDiscardFrontUser(line);
					DiscardLogger.write(line);

					String tenantId = line.getStringValue(LineKeyConstants.tenantid);
					Integer projectId = line.getIntValue(LineKeyConstants.projectid);
					String macAdress = deviceMac;
					macAdress = macAdress.toLowerCase().trim();
					String macPrefix = macAdress.substring(0, 8);
					Element element = macCompanyCache.get(macPrefix);
					if(null != element){
						MacCompany macCompany = (MacCompany)element.getObjectValue();
						if(null != macCompany && macCompany.getIs_moblile() == 2){
							Long tsrecive = line.getLongValue(LineKeyConstants.tsreceive);
							//添加到黑名单中
							FilterMacBean bean = new FilterMacBean();
							bean.setFilterType(FilterTypeEnum.MOBILE_MAC);
							bean.setTenantId(tenantId);
							bean.setProjectId(projectId);
							bean.setMac(deviceMac);
							bean.setCreateTime(DateTimeUtil.formatLongDate(new Date(tsrecive)));
							bean.setFilterReason("非移动设备mac,所属公司：" + macCompany.getCompany().replaceAll("'", "\\\\'"));
							FilterMacUtils.add(bean);
							//logger.info("非移动设备mac projectId=" + projectId + " mac=" + deviceMac + " 所属公司是：" + macCompany.getCompany());
						}
					}
				}
			} catch (Exception e) {
				logger.error("MacCompanyFilterChanger error !", e);
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_MOBILE_MAC);
				FailLogger.write(line);
			}
		}
		return line;
	}
	
	protected boolean needChange(Line line) {
		return (Utils.isNotEmpty(line) && !line.discard && !line.getBoolValue(FAIL)) || FrontUtils.checkLineFront(line); 
	}

	/**
	 * 判断是否为合法的移动mac地址
	 * @param macAdress
	 * @return
	 */
	public synchronized Boolean isNotLegalMobileMacAdress(String macAdress) {
		macAdress = macAdress.toLowerCase().trim();

		if (macAdress.length() != 17) {
			return false;
		}
		String macPrefix = macAdress.substring(0, 8);
		Element signElement = macCompanyCache.get(Constants.MAC_COMPANY_CACHE);
		if (Utils.isEmpty(signElement)) {
			CacheFactory.createMacCompanyCache(dao, macCompanyCache);
		}
		Element element = macCompanyCache.get(macPrefix);
		if(null != element){
			MacCompany macCompany = (MacCompany)element.getObjectValue();
			if(null != macCompany && macCompany.getIs_moblile() == 2 && macCompany.getMac().equals(macPrefix) ){ // mac 黑名单，mac 为2表示是非移动设备，需要过滤并添加到黑名单中
				return true;
			}
		}

		return false;
	}

	public HandleStatus finish() {
		return HandleStatus.success;
	}


}
