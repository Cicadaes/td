/**
 * 
 * @author davy
 * 日期:		2013-7-5 11:10:17
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.commons.factory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.commons.atomic.ETLAtomicChanger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ChangerFactory {
	private static final String packageName = "td.framework.plugin.changer.atomic.impl.";
	private static final String delimiter = ",";
	private static final Logger logger = LoggerFactory.getLogger(ChangerFactory.class);

	public static List<ETLAtomicChanger> produc(String changerStr, String outputStr) {
		List<ETLAtomicChanger> dataFilterAtomicChangers = new ArrayList<ETLAtomicChanger>();
		try {
			if (Utils.isNotEmpty(changerStr)) {
				List<String> classNames = Arrays.asList(changerStr.split(delimiter));
				for (int i = 0; i < classNames.size(); i++) {
					logger.trace(Utils.toLog("准备创建", packageName, classNames.get(i), "实例"));
					ETLAtomicChanger atomicChanger = (ETLAtomicChanger) Class.forName(packageName + classNames.get(i)).newInstance();
					dataFilterAtomicChangers.add(atomicChanger);
				}
				if (Utils.isNotEmpty(outputStr)) {
					List<String> outputs = Arrays.asList(outputStr.split("#"));
					for (String outIndexStr : outputs) {
						String[] outs = outIndexStr.split(":");
						if (Utils.isNotEmpty(StringUtils.stringToInt(outs[0]), outs[1])) {
							int index = StringUtils.stringToInt(outs[0]) - 1;
							if (index < 0 || index >= dataFilterAtomicChangers.size()) {
								throw new Exception("outputString是" + outputStr + "下标和Changers的长度有冲突");
							}
							dataFilterAtomicChangers.get(index).setOutputNames(outs[1].split(","));
						} else {
							throw new Exception("outputString是" + outputStr);
						}
					}
				}
			}
			return dataFilterAtomicChangers;
		} catch (Exception e) {
			logger.error(Utils.toLog(e, "changer的配置有错"));
			return null;
		}
	}

	public static void main(String[] args) throws ClassNotFoundException {
		String changerStr = "SequencenumberChanger,PlatformIDChanger,DeveloperIDChanger,ProductTypeIDChanger,ProductIDChanger,AppversionChanger,PartnerChanger,ProductTimeChanger,ProductCompensateChanger,SessionStartTimeChanger,IsCrackedChanger,DeviceidChanger,MobileChanger,MobileReferenceChanger,OSChanger,LngChanger,LatChanger,MccChanger,MncChanger,CarrierChanger,PixelChanger,MccCountryChanger,IpChanger,ProvinceChanger,ProvinceIDChanger,ProvinceCountryChanger,CountryIDChanger,TimezoneChanger,IsConnectedChanger,ChannelChanger,M2G3GChanger,IsJailbrokenChanger,SessionIdChanger,SessionStartTimeFormatChanger,RectimeChanger,TDOffsetUserChanger,ProductGetOffsetUserChanger,ProductSetOffsetUserChanger,UseIntervalTimeChanger,UseIntervalLevelChanger,UseIntervalTimeTo0Changer,StringInterceptChanger";
		String outputStr = "38:newuser#42:launchuser";
		List<ETLAtomicChanger> das = produc(changerStr, outputStr);
		for (ETLAtomicChanger dataFilterAtomicChanger : das) {
			System.out.println(dataFilterAtomicChanger);
		}
		// Class<?> c = Class.forName(packageName + "SequencenumberChanger");
		// System.out.println(c);
	}
}
