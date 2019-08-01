package td.enterprise.wanalytics.changer;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.DiscardLogger;
import td.enterprise.wanalytics.processor.utils.FailLogger;
import td.enterprise.wanalytics.processor.utils.FrontUtils;
import td.enterprise.wanalytics.processor.utils.LineKeyConstants;
import td.enterprise.wanalytics.processor.utils.RedisClient;

/**
 * 判断设备的mac地址是否在案场黑名单中
 */
public class DeviceBlackListFilterChanger extends SpringDictDaoChanger {

//	private static final Logger logger = LoggerFactory.getLogger(DeviceBlackListFilterChanger.class);
//
//	private static final Logger failLogger = LoggerFactory.getLogger(Constant.ETL_PROCESS_RECORD_FLAG_FAIL);

    /* (non-Javadoc)
     * @see ETLAtomicChanger#_change(Line)
     */
    public Line _change(Line line) {
        if (null != line && needChange(line)) {
            try {
                String deviceMac = (String) line.get(LineKeyConstants.mac);
                String apMac = (String) line.get(LineKeyConstants.apmac);
                if (StringUtils.isBlank(deviceMac) || StringUtils.isBlank(apMac) || isBlackListMac(deviceMac, apMac, line)) {
                    line.discard = true;
                    line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_DEVICE_BLACK_LIST);
                    SensorPropFillChanger.setDiscardFrontUser(line);
                    DiscardLogger.write(line);
                }

                if (!line.discard && StringUtils.isNotBlank(deviceMac) && isSensorMac(deviceMac)) {
                    line.discard = true;
                    line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_SENSOR_MAC_FILTER);
                    SensorPropFillChanger.setDiscardFrontUser(line);
                    DiscardLogger.write(line);
                }
            } catch (Exception e) {
                logger.error("DeviceBlackListFilterChanger error !", e);
                line.fail = true;
                line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_DEVICE_BLACK_LIST);
                FailLogger.write(line);
            }
        }
        return line;
    }

    public static Boolean isBlackListMac(String macAdress, String apMac, Line line) {
        // 首先根据apmac获取项目和租户
        // Cache sensorCahce = CacheFactory.getSensorCache();
        // Element sensorElement = sensorCahce.get(apMac);
        // InstallInfo sensorInstallInfo = null;
        // if (Utils.isNotEmpty(sensorElement)) {
        //     sensorInstallInfo = (InstallInfo) sensorElement.getObjectValue();
        // } else {
        //     sensorElement = CacheFactory.createSensorCahce(dao, sensorCahce, apMac);
        //     if (Utils.isNotEmpty(sensorElement)) {
        //         sensorInstallInfo = (InstallInfo) sensorElement.getObjectValue();
        //     }
        // }
        // // 如果取不到项目信息,则认为不属于黑名单。其找到项目信息的异常由SensorPropFillChanger处理,这里不处理
        // if (sensorInstallInfo == null) {
        //     return false;
        // }
        // String tenantid = sensorInstallInfo.getTenantId();
        // Long projectId = sensorInstallInfo.getProjectId();

        String tenantId = line.getStringValue(LineKeyConstants.tenantid);
        long projectId = line.getLongValue(LineKeyConstants.projectid);

        macAdress = macAdress.toLowerCase().trim();

        String key = macAdress + "_" + tenantId + "_" + projectId;

        Cache blackListMacCache = CacheFactory.getBlackListMacCache();
        Element macElement = blackListMacCache.get(key);
        // 非黑名单MAC缓存
        Cache nonBlackListMacCache = CacheFactory.getNonBlackListMacCache();
        Element nonMacElement = nonBlackListMacCache.get(key);
        if (Utils.isNotEmpty(macElement)) {
            return true;
        } else if (Utils.isNotEmpty(nonMacElement)) {
        	return false;
        } else {
            boolean exist = RedisClient.exist(key,Constants.BLACK_LIST_MAC_DB_INDEX);
            //放置到ehcache中
            if (exist) {
                Element e = new Element(key, "1");
                blackListMacCache.put(e);
            } else {
            	Element e = new Element(key, "-1");
                nonBlackListMacCache.put(e);
            }
            return exist;
        }

//		Cache blockMacCahce = CacheFactory.getBlockCache();
//		Element element = blockMacCahce.get(macAdress + "-" + tenantid);// 黑名单的规则由mac地址-租户id构成
//		if (Utils.isEmpty(element)) {
//			element = CacheFactory.createBlockMacCahce(dao, blockMacCahce, macAdress,tenantid);
//			if (Utils.isNotEmpty(element)) {
//				return true; // 属于黑名单
//			}
//			return false;
//		} else {
//			return true; // 属于黑名单
//		}
    }

    public static boolean isSensorMac(String sensorMac) {
        Cache allSensorCache = CacheFactory.getAllSensorCache();
        Element sensorElement = allSensorCache.get(sensorMac);
        if (Utils.isNotEmpty(sensorElement)) {
            String value = (String) sensorElement.getObjectValue();
            if (value != null) {
                return true;
            }
        }/* else {
            sensorElement = CacheFactory.createAllSensorCache(dao, allSensorCache, sensorMac);
            if (null != sensorElement) {
                String value = (String) sensorElement.getObjectValue();
                if (value != null) {
                    return true;
                }
            }
        }*/
        // 探针缓存改为由定时任务刷新
        return false;
    }
    
    protected boolean needChange(Line line) {
		return (Utils.isNotEmpty(line) && !line.discard && !line.getBoolValue(FAIL)) || FrontUtils.checkLineFront(line); 
	}

    /* (non-Javadoc)
     * @see DataFilterAtomicChanger#finish()
     */
    public HandleStatus finish() {
        return HandleStatus.success;
    }
}
