package td.enterprise.wanalytics.changer;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.bean.FilterMacBean;
import td.enterprise.wanalytics.processor.bean.FilterTypeEnum;
import td.enterprise.wanalytics.processor.utils.*;

import java.util.Calendar;
import java.util.Date;

/**
 * 营业时间验证
 */
public class ValidTimeFilterChanger extends SpringDictDaoChanger {

	public Line _change(Line line) {
		if (null != line && needChange(line)) {
			try {
				String reciveTime = String.valueOf(line.get(LineKeyConstants.tsreceive));//(String) recordData.get(Keys.ES_WRITER_COLLECTOR_TIMESTAMP);
				if (!isValidTime(line, reciveTime)) {
					line.discard = true;
					line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VALUE_VALID_TIME);
					SensorPropFillChanger.setDiscardFrontUser(line);
					DiscardLogger.write(line);
				}
			} catch (Exception e) {
				logger.error("ValidTimeFilterChanger error !", e);
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_VALUE_VALID_TIME);
				SensorPropFillChanger.setDiscardFrontUser(line);
				FailLogger.write(line);
			}
		}
		return line;
	}

	public Boolean isValidTime(Line line, String reciveTime) throws Exception {
		String valideStartTime = (String) line.get(LineKeyConstants.openingtime);
		String valideEndTime = (String) line.get(LineKeyConstants.closingtime);
		if (StringUtils.isBlank(valideStartTime) || StringUtils.isBlank(valideEndTime) || StringUtils.isBlank(reciveTime)) {
			return true;
		} else {
			Calendar calendar = DateTimeUtil.toCalendar(reciveTime);
			String dateTime = DateTimeUtil.formatDateTime(calendar.getTime(), "yyyy-MM-dd HH:mm:ss");
			String time = dateTime.substring(11, 16);
			if (time.compareTo(valideStartTime) >= 0 && time.compareTo(valideEndTime) <= 0) {
				return true;
			} else {
			    //对营业时间外前后2个小时内的用户mac 添加到黑名单中
			    String filterOpeningTime = (String) line.get(LineKeyConstants.filterOpeningtime);
		        String filterClosingTime = (String) line.get(LineKeyConstants.filterClosingtime);
		        String tenantId = line.getStringValue(LineKeyConstants.tenantid);
                Integer projectId = line.getIntValue(LineKeyConstants.projectid);
                String mac = (String) line.get(LineKeyConstants.mac);
                
                boolean isFilterOpeningTime = (null != filterOpeningTime &&  time.compareTo(filterOpeningTime) < 0 && filterOpeningTime.compareTo("00:00") >= 0);
                boolean isFilterClosingTime = (null != filterClosingTime &&  time.compareTo(filterClosingTime) > 0 && time.compareTo("23:59") <= 0);
				Long tsrecive = line.getLongValue(LineKeyConstants.tsreceive);
		        //判断营业开始时间
			    if(isFilterOpeningTime || isFilterClosingTime ){
			        //logger.info("-------添加过滤黑名单mac 在营业时间范围外!" + mac  + "projectId=" + projectId + " 营业时间是： openingTime:"  + valideStartTime + " closingTime:" + valideEndTime + " 过滤营业时间(开始前2个小时)：00:00-" + filterOpeningTime + " 结束前2个小时: "  + filterClosingTime + "-23:59" + " 当前时间:" + time);
	                FilterMacBean bean = new FilterMacBean();
	                bean.setFilterType(FilterTypeEnum.OPENING_TIME);
	                bean.setTenantId(tenantId);
	                bean.setProjectId(projectId);
					bean.setCreateTime(DateTimeUtil.formatLongDate(new Date(tsrecive)));
	                bean.setMac(mac);
	                bean.setFilterReason("营业时间过滤: 出现时间是：" + dateTime);
	                FilterMacUtils.add(bean);
			    }
				return false;
			}
		}
	}
	
	protected boolean needChange(Line line) {
		return (Utils.isNotEmpty(line) && !line.discard && !line.getBoolValue(FAIL)) || FrontUtils.checkLineFront(line); 
	}

	public HandleStatus finish() {
		return HandleStatus.success;
	}

}
