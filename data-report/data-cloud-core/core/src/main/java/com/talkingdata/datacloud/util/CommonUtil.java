package com.talkingdata.datacloud.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import com.talkingdata.datacloud.config.Configuration;
import com.talkingdata.datacloud.constant.CommonConstants;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @description:
 * @version: 1.0
 * @modify: 2013-10-15 陈明华 add getUUID
 * @modify: 2013-10-17 陈明华 add getCommitBatchNum
 * @modify: 2013-10-18 陈明华 add getAttachmentFilePath
 * @Copyright: 公司版权拥有
 */
public class CommonUtil {

	// private static SecurityService securityService =
	// UmRmiServiceFactory.getSecurityService();

	public static final String separatorChar = "/";
	public static final String ROWKEY_INTERVAL_CHAR = "_";
	public static final String ROWKEY = "rowkey";
	public static final String ID = "id";

	/**
	 * @description 用于Format邮件
	 * @param content
	 * @param map
	 *            (Key将的内容将替换，参数content${}中与Key值相同)
	 * @return
	 */
	public static String transformContent(String content, Map<String, Object> map) {
		StringBuffer str = new StringBuffer();
		if (content != null && !content.equals("")) {
			String[] strs = StringUtils.split(content, "{$");
			boolean isFirst = true;
			for (String string : strs) {
				int index = StringUtils.indexOf(string, "}");
				if (isFirst) {
					str.append(string);
					isFirst = false;
				}
				if (index != -1) {
					String var = string.substring(0, index);
					str.append(map.get(var));
					String s = string.substring(index + 1);
					str.append(s);
				}
			}
		}
		return str.toString();
	}

	public static Object formatNumber(Double num) {
		if (num % 1.0 == 0) {
			return (num).intValue();
		} else {
			return num;
		}
	}

	public static Object formatNumber(BigDecimal bigDecimal) {
		if (bigDecimal.doubleValue() % 1.0 == 0) {
			return (bigDecimal).intValue();
		} else {
			return bigDecimal;
		}
	}

	public static boolean isEmpty(String s) {
		if (s == null || s.length() == 0)
			return true;
		return false;
	}

	/**
	 * 得到UUID
	 * 
	 * @return
	 */
	public static String getUUID() {
		return UUID.randomUUID().toString().replace("-", "").toUpperCase();
	}

	/**
	 * 得到dtafile 文件路径 每月生成一个目录yyyyMM 例如D:\webapps\datafile\201307\ 特别提示：生成的路径最后带有文件分割符
	 * 
	 * @return
	 */
	public static String getAttachmentFilePath() {
		String attachmentpath = Configuration.getInstance().getConfig("dmp.datafile.attachment.share");

		String dataFile = attachmentpath + separatorChar + DateFormatUtils.format(Calendar.getInstance(), "yyyyMM");

		File attachmentFileDir = new File(dataFile);

		if (!attachmentFileDir.exists()) {
			attachmentFileDir.mkdirs();
		}
		return dataFile + separatorChar;
	}

	/**
	 * 得到dtafile 文件路径 每月生成一个目录yyyyMM 例如D:\webapps\datafile\201307\ 特别提示：生成的路径最后带有文件分割符
	 * 
	 * @return
	 */
	public static String getLocalAttachmentFilePath() {
		String attachmentpath = Configuration.getInstance().getConfig("dmp.datafile.attachment");

		String dataFile = attachmentpath + separatorChar + DateFormatUtils.format(Calendar.getInstance(), "yyyyMM");

		File attachmentFileDir = new File(dataFile);

		if (!attachmentFileDir.exists()) {
			attachmentFileDir.mkdirs();
		}
		return dataFile + separatorChar;
	}

	/**
	 * 属性对拷
	 * 
	 * @param source
	 * @param dest
	 * @throws Exception
	 */
	public static void Copy(Object source, Object dest) throws Exception {
		// 获取属性
		BeanInfo sourceBean = Introspector.getBeanInfo(source.getClass(), Object.class);
		PropertyDescriptor[] sourceProperty = sourceBean.getPropertyDescriptors();

		BeanInfo destBean = Introspector.getBeanInfo(dest.getClass(), Object.class);
		PropertyDescriptor[] destProperty = destBean.getPropertyDescriptors();

		try {
			for (int i = 0; i < sourceProperty.length; i++) {
				for (int j = 0; j < destProperty.length; j++) {

					if (sourceProperty[i].getName().equals(destProperty[j].getName())) {
						// 调用source的getter方法和dest的setter方法
						destProperty[j].getWriteMethod().invoke(dest, sourceProperty[i].getReadMethod().invoke(source));
						break;
					}
				}
			}
		} catch (Exception e) {
			throw new Exception("属性复制失败:" + e.getMessage());
		}
	}

	/**
	 * @description 获取异常跟踪
	 */
	public static String getExceptionTrace(Throwable e) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PrintStream ps = new PrintStream(baos);
		e.printStackTrace(ps);
		return baos.toString();
	}

	/**
	 * 构建Hbase rowkey
	 * 
	 * @return
	 */
	public static String buildRowkey(Map<String, Object> map) throws Exception {
		String rowkey = null;
		if (map == null || map.keySet().size() == 0) {
			throw new Exception("无法生成rowkey，缺少rowkey或id项!");
		}

		if (map.containsKey(ROWKEY)) {
			rowkey = String.valueOf(map.get(ROWKEY));
		} else if (map.containsKey(ID)) {
			rowkey = String.valueOf(map.get(ID));
		} else {
			// 基于自定义参数自动生成rowkey
			for (Map.Entry<String, Object> entry : map.entrySet()) {
				if (rowkey == null) {
					rowkey = "" + entry.getValue();
				} else {
					rowkey += ROWKEY_INTERVAL_CHAR + entry.getValue();
				}
			}
		}
		if (rowkey == null) {
			throw new Exception("无法生成rowkey，缺少rowkey或id项!");
		}
		return rowkey;
	}

	/**
	 * 构建bitmap rowkey
	 * 
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public static String buildBitmapRowkey(Map<String, Object> map) throws Exception {
		String rowkey = buildRowkey(map);
		if (rowkey != null) {
			rowkey = StringUtils.rightPad(rowkey, CommonConstants.HBASE_ROWKEY_LENGTH, CommonConstants.HBASE_ROWKEY_MIN_PLACEHOLDER);
		}
		return rowkey;
	}

	public static Map<String, Object> transBean2Map(Object obj) throws Exception {

		if (obj == null) {
			return null;
		}
		Map<String, Object> map = new HashMap<String, Object>();
		BeanInfo beanInfo = Introspector.getBeanInfo(obj.getClass());
		PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
		for (PropertyDescriptor property : propertyDescriptors) {
			String key = property.getName();

			// 过滤class属性
			if (!key.equals("class")) {
				// 得到property对应的getter方法
				Method getter = property.getReadMethod();
				Object value = getter.invoke(obj);

				if(value != null && value.toString().length() > 0) {
					map.put(key, value.toString());
				}
				
			}

		}

		return map;

	}

	public static void main(String[] args) {
		System.out.println(File.separatorChar);
	}
}
