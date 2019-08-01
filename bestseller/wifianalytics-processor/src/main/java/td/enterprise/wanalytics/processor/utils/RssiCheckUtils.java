package td.enterprise.wanalytics.processor.utils;

import org.apache.commons.lang3.StringUtils;

public class RssiCheckUtils {

	/**
	 * 
	 * @param rssiValue  要求信号强度值
	 * @param rssiStr
	 * @return
	 */
	public static boolean checkRSSI(int rssiValue, String rssiStr) {
		if(rssiStr != null && rssiStr.indexOf(";") != -1){
			String values [] = rssiStr.split(";");
			boolean valid = false;
			for(String temp: values){
				if(StringUtils.isNotEmpty(temp)){
					Integer rssi = Integer.parseInt(temp);
					if(rssi >= rssiValue){
						valid = true;
						break;
					}
				}
			}
			if(!valid){
				return false;
			}
		}else{
			Integer rssi = Integer.parseInt(rssiStr);
			if(rssi < rssiValue){
				return false;
			}
		}
		return true;
	}

	public static Integer  getMaxRssi(String rssiStr) {
		if(rssiStr != null && rssiStr.indexOf(";") != -1){
			String values [] = rssiStr.split(";");
			Integer maxRssi = null;
			if(values != null && values.length > 0 && StringUtils.isNotBlank(values[0])){
                maxRssi = Integer.parseInt(values[0]);
			}
			for(String temp: values){
				if(StringUtils.isNotEmpty(temp)){
					Integer rssi = Integer.parseInt(temp);
					if(rssi >= maxRssi){
						maxRssi = rssi;
					}
				}
			}
			return maxRssi;
		}
		if(StringUtils.isNotBlank(rssiStr)){
			return Integer.parseInt(rssiStr);
		}
		return null;
	}

	public static void main(String args[]){
		String rssiStr = "-12;-45;-20";
		System.out.println(getMaxRssi(rssiStr));
	}
	
}
