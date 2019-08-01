package td.enterprise.wanalytics.changer;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.apache.commons.lang3.StringUtils;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.bean.InstallInfo;
import td.enterprise.wanalytics.processor.bean.Project;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.DiscardLogger;
import td.enterprise.wanalytics.processor.utils.FailLogger;
import td.enterprise.wanalytics.processor.utils.LineKeyConstants;
import td.enterprise.wanalytics.processor.utils.RssiCheckUtils;

/**
 *
 */
public class SensorPropFillChanger extends SpringDictDaoChanger {
	/**
	 * 项目
	 */
	private Cache projectCache = CacheFactory.getProjectCache();

	/**
	 * 传感器
	 */
	private Cache sensorCache = CacheFactory.getSensorCache();

	/* (non-Javadoc)
	 * @see ETLAtomicChanger#_change(Line)
	 */
	public Line _change(Line line) {
		if (null != line && needChange(line)) {
			try {
				String apmac = (String) line.get(LineKeyConstants.apmac); // apmac即传感器mac地址
				if (null != apmac && !"".equals(apmac)) {
					fill(apmac, line);
				} else {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
					FailLogger.write(line);
				}
			} catch (Exception e) {
				logger.error("SensorPropFillChanger error !", e);
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_SENSOR_PROP_FILL);
				FailLogger.write(line);
			}
		}
		return line;
	}

	public HandleStatus finish() {
		return HandleStatus.success;
	}

	public void fill(String sensorMac, Line line) {
		Element sensorElement = sensorCache.get(sensorMac);
		InstallInfo sensorInstallInfo = null;
		if (Utils.isNotEmpty(sensorElement)) {
			sensorInstallInfo = (InstallInfo) sensorElement.getObjectValue();
		} else {
			sensorElement = CacheFactory.createSensorCahce(dao, sensorCache, sensorMac);
			if (Utils.isNotEmpty(sensorElement)){
				sensorInstallInfo = (InstallInfo) sensorElement.getObjectValue();
			}
		}
		if (sensorInstallInfo == null) {
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			//将未部署的sensor的apmac同步到数据库
			//SensorInstallSync.addSensorMac(sensorMac);
			DiscardLogger.write(line);
			return;
		}
		if(null != sensorInstallInfo &&  StringUtils.isEmpty(sensorInstallInfo.getTenantId()) ){
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			DiscardLogger.write(line);
			return;
		}
		if( sensorInstallInfo.getStatus() == null  || Constants.VALID != sensorInstallInfo.getStatus()  ){
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			DiscardLogger.write(line);
			return ;
		}

		if( sensorInstallInfo.getProjectId() == null ){
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			DiscardLogger.write(line);
			return;
		}

		if(null != sensorInstallInfo) {
			line.put(LineKeyConstants.projectid,  sensorInstallInfo.getProjectId());
			line.put(LineKeyConstants.tenantid, sensorInstallInfo.getTenantId());
			line.put(LineKeyConstants.sensorid, sensorInstallInfo.getRelatedId());
			line.put(LineKeyConstants.projectplaceid, sensorInstallInfo.getProjectPlaceId());
		}

		if ( null == sensorInstallInfo.getRelatedAttribute() ) {
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			DiscardLogger.write(line);
			return;
		}

		if (StringUtils.isEmpty(sensorInstallInfo.getProjectId() + "") ) {
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			DiscardLogger.write(line);
			return;
		}
		String rssiStr= line.getStringValue(LineKeyConstants.rssi);
		//信号强度如果是空，过滤掉
		if( StringUtils.isEmpty(rssiStr) ){
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_RSSI_FILTER);
			DiscardLogger.write(line);
			return;
		}
		Element projectElement = projectCache.get(sensorInstallInfo.getProjectId());
		Project project = null;
		if (Utils.isNotEmpty(projectElement)) {
			project = (Project) projectElement.getObjectValue();
		} else {
			projectElement = CacheFactory.createProjectCache(dao, projectCache, sensorInstallInfo.getProjectId());
			if (Utils.isNotEmpty(projectElement)){
				project = (Project) projectElement.getObjectValue();
			}
		}
		if (project == null ) {
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			DiscardLogger.write(line);
			return;
		}
		if(project.getStatus() == null  || Constants.VALID != project.getStatus() ){
			line.discard = true;
			line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_NOT_FOUND);
			//将未部署的sensor的apmac同步到数据库
			//SensorInstallSync.addSensorMac(sensorMac);
			DiscardLogger.write(line);
			return;
		}
		
		//是否是店前客流
		boolean isFrontUser = false;
		Integer rssiValue  = null;
		Integer frontRSSIValue = null;
		if(null != sensorInstallInfo){
			//信号强度过滤
			rssiValue = sensorInstallInfo.getRssi();
			frontRSSIValue = sensorInstallInfo.getFrontRSSI();
			//店前客流是 >= 店前客流阈值（原逻辑：店前客流是小于入店客流，>= 店前客流阈值）
			if(null != rssiValue  && frontRSSIValue != null && null != project){
//				boolean lessThanEnter = !RssiCheckUtils.checkRSSI(rssiValue, rssiStr);
				boolean bigThanFront = RssiCheckUtils.checkRSSI(frontRSSIValue, rssiStr);
//				isFrontUser = (lessThanEnter && bigThanFront);
				isFrontUser = bigThanFront;
			}
			if(null != rssiValue){
				boolean valid = RssiCheckUtils.checkRSSI(rssiValue, rssiStr);
				if(!valid  && !line.discard){
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_RSSI_FILTER);
					line.put(LineKeyConstants.isFrontUser, isFrontUser);
					DiscardLogger.write(line);
				}
			}
		}
		if(null != project ){
			line.put(LineKeyConstants.isFrontUser, isFrontUser);
			line.put(LineKeyConstants.projecttype, project.getProjectType());
			line.put(LineKeyConstants.openingtime, project.getOpeningTime());
			line.put(LineKeyConstants.closingtime, project.getClosingTime());
			line.put(LineKeyConstants.projectname, project.getProjectName());
			line.put(LineKeyConstants.maxDuration, project.getMaxDuration());
			line.put(LineKeyConstants.visitMinutes, project.getVisitMinutes());
			line.put(LineKeyConstants.stayMinutes, project.getStayMinutes());
			line.put(LineKeyConstants.filterOpeningtime, project.getFilterOpeningTime());
			line.put(LineKeyConstants.filterClosingtime, project.getFilterClosingTime());
			line.put(LineKeyConstants.sessionTimeoutSeconds,project.getSessionTimeoutSeconds());
			line.put(LineKeyConstants.projectNum, project.getProjectNum());
		}
	}
	
	/**
	* <p>Description: discard时设置店前客流N</p>
	* @param line
	 */
	public static void setDiscardFrontUser(Line line) {
		line.put(LineKeyConstants.isFrontUser, false);
	}

}
