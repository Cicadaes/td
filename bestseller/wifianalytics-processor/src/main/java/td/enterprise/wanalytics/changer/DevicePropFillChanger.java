package td.enterprise.wanalytics.changer;

import java.util.Date;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.idmapping.IdMappingService;
import td.enterprise.wanalytics.idmapping.bean.OutputBean;
import td.enterprise.wanalytics.processor.utils.DateTimeUtil;
import td.enterprise.wanalytics.processor.utils.DiscardLogger;
import td.enterprise.wanalytics.processor.utils.FailLogger;
import td.enterprise.wanalytics.processor.utils.FrontUtils;
import td.enterprise.wanalytics.processor.utils.LineKeyConstants;

/**
 * 
 * bitmap,idmapping计算
 * @author yangtao
 */
public class DevicePropFillChanger extends SpringDictDaoChanger {

	private static IdMappingService idMappingService = IdMappingService.getIdMappingService();
	
	public Line _change(Line line) {
		if (null != line && needChange(line) && !line.discard) {
			try {
				String deviceMac = (String) line.get(LineKeyConstants.mac);
				String tenantid = (String) line.get(LineKeyConstants.tenantid);
				
				Long projectId = line.getLongValue(LineKeyConstants.projectid);

				//生成租户级别offset
				OutputBean deviceInfo = idMappingService.getDeviceIDMappingByMac(tenantid, deviceMac);// HttpUtil.getDeviceIDMappingByMac(restUrl,deviceMac,true,cacheKey);
				if (deviceInfo != null) {
					fillGlobalProp(line, deviceInfo);
				} else {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_FILL_NOT_FOUND);
					DiscardLogger.write(line);
				}

				long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
				String time= DateTimeUtil.formatLongDate(new Date(tsreceive));

				//生成项目级别offset
				OutputBean deviceProjectInfo = idMappingService.getDeviceIDMappingByProjectAndMac(tenantid, projectId + "", deviceMac,time);// HttpUtil.getDeviceIDMappingByProjectAndMac(restUrl, projectID, deviceMac, true, cacheKey);
				if (deviceProjectInfo != null) {
					fillProjectProp(line, deviceProjectInfo);
				} else {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_FILL_NOT_FOUND);
					DiscardLogger.write(line);
				}
				
				//生成店前客流offset
				// 计算店前客流按yyyy_MM_dd分表 tab后缀
				String tab = DateTimeUtil.getDateYmd(tsreceive);
				//生成租户级别offset
				OutputBean frontDeviceInfo = idMappingService.getDeviceIDMappingByMacFront(tenantid, deviceMac, tab);
				if (frontDeviceInfo != null) {
					fillFrontProp(line, frontDeviceInfo);
				} else {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_FILL_NOT_FOUND);
					DiscardLogger.write(line);
				}
			} catch (Exception e) {
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_VAlUE_SENSOR_FILL_NOT_FOUND);
				FailLogger.write(line);
				logger.error("DevicePropFillChanger error !", e);
			}
		}else if(null != line && FrontUtils.checkLineFront(line)){ 
			//如果是店前客流 生成tenant offset
			try{
				String deviceMac = (String) line.get(LineKeyConstants.mac);
				String tenantid = (String) line.get(LineKeyConstants.tenantid);
				// 计算店前客流按yyyy_MM_dd分表 tab后缀
				long tsreceive = Long.valueOf(String.valueOf(line.get(LineKeyConstants.tsreceive)));
				String tab = DateTimeUtil.getDateYmd(tsreceive);
				//生成租户级别offset
				OutputBean deviceInfo = idMappingService.getDeviceIDMappingByMacFront(tenantid, deviceMac, tab);
				if (deviceInfo != null) {
					fillFrontProp(line, deviceInfo);
				} else {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_SENSOR_FILL_NOT_FOUND);
					DiscardLogger.write(line);
				}
			}catch(Exception e){
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_VAlUE_SENSOR_FILL_NOT_FOUND);
				FailLogger.write(line);
				logger.error("2=====DevicePropFillChanger error !", e);
			}
		}
		return line;
	}
	
	protected boolean needChange(Line line) {
		return (Utils.isNotEmpty(line) && !line.discard && !line.getBoolValue(FAIL)) || FrontUtils.checkLineFront(line); 
	}

	public HandleStatus finish() {
		return HandleStatus.success;
	}

	/**
	 * 增加项目offset及新老客户标识
	 * @param line
	 * @param deviceInfo
	 */
	public void fillProjectProp(Line line, OutputBean deviceInfo) {
		long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
		line.put(LineKeyConstants.projectoffset, deviceInfo.getOffset());
		line.put(LineKeyConstants.projectnewflag, deviceInfo.isNew(tsreceive));
	}

	/**
	 * 增加租户单独的offset
	 * @param line
	 * @param deviceGlobalInfo
	 */
	public void fillGlobalProp(Line line, OutputBean deviceGlobalInfo) {
		long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
		line.put(LineKeyConstants.tenantoffset, deviceGlobalInfo.getOffset());
		line.put(LineKeyConstants.tenantnewflag, deviceGlobalInfo.isNew(tsreceive));
	}
	
	/**
	 * 增加店前的offset
	 * @param line
	 * @param deviceGlobalInfo
	 */
	public void fillFrontProp(Line line, OutputBean deviceGlobalInfo) {
		line.put(LineKeyConstants.frontoffset, deviceGlobalInfo.getOffset());
	}

}
