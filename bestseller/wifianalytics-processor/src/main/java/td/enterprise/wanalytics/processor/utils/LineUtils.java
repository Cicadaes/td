package td.enterprise.wanalytics.processor.utils;

import td.enterprise.framework.commons.plugin.line.Line;

import java.net.URLEncoder;


public class LineUtils {

	public static String getLogInfo(Line line){
		StringBuffer buffer = new StringBuffer();
		String separator = ",";
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.tenantid))).append(separator);
		buffer.append(line.getLongValue(LineKeyConstants.tsreceive)).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.apmac))).append(separator);
		buffer.append(line.getLongValue(LineKeyConstants.tssend)).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.rssi))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.mac))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.discard))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.failcode))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.projectid))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.sensorid))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.projecttype))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.projectname))).append(separator);
		buffer.append(convertNull(line.getStringValue(LineKeyConstants.tenantoffset))).append(separator);
		buffer.append(line.get(LineKeyConstants.projectnewflag) == null ? "" :line.get(LineKeyConstants.projectnewflag) ).append(separator);
		buffer.append(line.get(LineKeyConstants.sessionId)== null ? "" : line.get(LineKeyConstants.sessionId) ).append(separator);
		buffer.append(line.get(LineKeyConstants.sessionDuration) == null ? "" : line.get(LineKeyConstants.sessionDuration)).append(separator);
		buffer.append(formatErrorMsg(line.getStringValue(LineKeyConstants.discard))).append(separator);
		buffer.append(line.get(LineKeyConstants.isFrontUser) == null ? "N" : (line.getBoolValue(LineKeyConstants.isFrontUser) == true ? "Y" :  "N")).append(separator);
		buffer.append(line.getStringValue(LineKeyConstants.projectNum) == null ? "-1" : line.getStringValue(LineKeyConstants.projectNum)).append(separator);
		buffer.append(line.getStringValue(LineKeyConstants.activeSign) == null ? "-1" : line.getStringValue(LineKeyConstants.activeSign)).append(separator);
		buffer.append(line.getStringValue(LineKeyConstants.staySign) == null ? "-1" : line.getStringValue(LineKeyConstants.staySign)).append(separator);
		buffer.append(line.getStringValue(LineKeyConstants.visitInterval) == null ? "0" : line.getStringValue(LineKeyConstants.visitInterval));
		
		return buffer.toString();
	}

	/**
	 * 补全12位mac地址为带:的
	 *
	 * @return
	 */
	public static String paddingMac(String mac) {
		StringBuffer paddingMac = new StringBuffer();
		if (null != mac && mac.length() == 12) {
			for (int i = 0; i < 12; i = i + 2) {
				paddingMac.append(mac.substring(i, i + 2)).append(":");
			}
			paddingMac.delete(paddingMac.length() - 1, paddingMac.length());
			return paddingMac.toString();
		}
		return mac;
	}

	private static String convertNull(String str) {
		if (null == str)
			return "";
		return str;
	}

	public static String formatErrorMsg(String code){
		if(StringUtils.isEmpty(code)) {
			return "";
		}

		if("1".equals(code)){
			return "MAC非法";
		}else if("2".equals(code)){
			return "IDMapping失败";
		}else if("4".equals(code)){
			return "时间不在营业时间";
		}else if("5".equals(code)){
			return "MAC在黑名单";
		}else if("6".equals(code)){
			return "探针没找到";
		}else if("7".equals(code)){
			return "信号强度过滤";
		}else if("8".equals(code)){
			return "探针MAC地址过滤";
		}else if("9".equals(code)){
			return "访问时间过短过滤";
		}else if("10".equals(code)){
			return "MAC非移动设备MAC";
		}else if("11".equals(code)){
			return "MAC长度过滤";
		}else if("12".equals(code)){
			return "伪MAC过滤";
		}
		return code;
	}

	public static String getEncodeString(String str) {
		try {
			if (null != str) {
				return URLEncoder.encode(str, "UTF-8");
			}
			return "";
		} catch (Exception e) {
			return str;
		}
	}

}
