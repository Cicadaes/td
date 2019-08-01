/**
 * 
 * @author davy
 * 日期:		2013-6-4 10:15:50
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.util;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.metadata.MetaData;

import java.util.*;

/**
 * The Class LineUtils. The default character set is UTF-8
 * 
 * @author davy
 */
public class LineUtils extends Utils {

	/**
	 * 中文：<br>
	 * 根据原始数据和metaData创建一个新的Line。<br>
	 * 例如：<br>
	 * 原始数据是<br>
	 * 10650,1<br>
	 * metaData的列字符串是productid,platformid metaData的分隔符是&quot;,&quot;（逗号），原始数据的分隔符&quot;,&quot;（逗号）。<br>
	 * 调用的返回值Line是 {&quot;productid&quot;:10650,&quot;platformid。 <br>
	 * English: <br>
	 * According to the original data and metaData create a new Line. <br>
	 * For example: <br>
	 * raw data is <br>
	 * 10650,1 <br>
	 * metaData column string productid, platformid metaData separator is "," (comma), the raw data separator ",
	 * '(comma). <br>
	 * call return value Line is a {"productid": 10650, "platformid": 1}.
	 * 
	 * @param dataString
	 *            the data string
	 * @param metaData
	 *            the meta data
	 * @return the line
	 * @throws Exception
	 *             the exception
	 */
	public Line createNewLine(String dataString, MetaData metaData) throws Exception {
		List<String> dataValues = createDataValues(dataString, metaData, false);
		return createLine(dataValues, metaData);
	}

	/**
	 * 中文： <br>
	 * 和public Line createNewLine(String dataString, MetaData metaData) throws Exception一样。 <br>
	 * merger 的值为true，如果原始数据的列大于metaData的列数，那么原始数据超出的metaData的列将合并为一列。 <br>
	 * 例如： <br>
	 * 原始数据是 <br>
	 * 10650,1,oppo <br>
	 * metaData的列字符串是productid,platformid metaData的分隔符是&quot;,&quot;（逗号），原始数据的分隔符&quot;,&quot;（逗号）。<br>
	 * merger为true时 <br>
	 * 调用的返回值Line是 {&quot;productid&quot;:10650,&quot;platformid&quot;:&quot;1oppo&quot;}。<br>
	 * merger为false时<br>
	 * 会抛出Exception。<br>
	 * <br>
	 * English: <br>
	 * And public Line createNewLine (String dataString, MetaData metaData) throws Exception same. <br>
	 * merger Is true, if the original data column is greater than the number of columns metaData, then the original
	 * data exceeded metaData columns will be combined into one. <br>
	 * example: <br>
	 * raw data is <br>
	 * 10650,1, oppo <br>
	 * metaData column string productid, platformid metaData separator is "," (comma), raw data delimiter "," (comma). <br>
	 * merger is true <br>
	 * call return value Line is a {"productid": 10650, "platformid": "1oppo"}. <br>
	 * merger is false <br>
	 * throws Exception.
	 * 
	 * @param dataString
	 *            the data string
	 * @param metaData
	 *            the meta data
	 * @param merger
	 *            the merger
	 * @return the line
	 * @throws Exception
	 *             the exception
	 */
	public Line createNewLine(String dataString, MetaData metaData, boolean merger) throws Exception {
		List<String> dataValues = createDataValues(dataString, metaData, merger);
		return createLine(dataValues, metaData);
	}

	/**
	 * Creates the data values.
	 * 
	 * @param dataString
	 *            the data string
	 * @param metaData
	 *            the meta data
	 * @param merger
	 *            the merger
	 * @return the list
	 * @throws Exception
	 *             the exception
	 */
	private List<String> createDataValues(String dataString, MetaData metaData, boolean merger) throws Exception {
		List<String> values;
		if (Utils.isNotEmpty(dataString, metaData)) {
			List<String> tmpValues = Arrays.asList(dataString.split(metaData.getRawDatadelimiter()));
			if (!merger) {
				if (tmpValues.size() != metaData.getColumnNames().size()) {
					throw new Exception("数据格式不合法");
				} else {
					values = tmpValues;
				}
			} else {
				int columnSize = metaData.getColumnNames().size();
				if (tmpValues.size() < columnSize) {
					throw new Exception("数据格式不合法");
				} else {
					values = new ArrayList<String>();
					StringBuffer buffer = new StringBuffer();
					for (int i = 0; i < tmpValues.size(); i++) {
						if (i < columnSize - 1) {
							values.add(tmpValues.get(i));
						} else {
							buffer.append(tmpValues.get(i)).append(metaData.getRawDatadelimiter());
						}
					}
					if (buffer.length() > metaData.getRawDatadelimiter().length()) {
						values.add(buffer.substring(0, (buffer.length() - metaData.getRawDatadelimiter().length())));
					}
				}
			}
		} else {
			throw new Exception("metaData和dataString不能为空");
		}
		return values;
	}

	/**
	 * 中文： <br>
	 * 根据值的list和metaData直接构建一个line，用metaData中的列为key，list中的元素为value。<br>
	 * English: <br>
	 * Depending on the value of building a list and metaData direct line, as with the metaData the key, list the
	 * elements of value. 
	 * 
	 * @param dataValues
	 *            the data values
	 * @param metaData
	 *            the meta data
	 * @return the line
	 */
	public Line createLine(List<String> dataValues, MetaData metaData) {
		Map<String, Object> map = new HashMap<String, Object>();
		List<String> names = metaData.getColumnNames();
		String _null = metaData.get_null();
		for (int i = 0; i < names.size(); i++) {
			String dataValue = dataValues.get(i);
			if (dataValue != null && dataValue.equals(_null))
				dataValue = null;
			map.put(names.get(i), dataValue);
		}
		return new Line(map);
	}

	/**
	 * 中文： <br>
	 * 按照metaData的顺序输出line中的内容，如果为null，转换成metaData的_null属性的值。<br>
	 * English: <br>
	 * In accordance with the order of the output line metaData content, if null, the _null convert metaData value of
	 * the property.
	 * 
	 * @param line
	 *            the line
	 * @param metaData
	 *            the meta data
	 * @return the string
	 */
	public String toString(Line line, MetaData metaData) {
		StringBuffer buffer = new StringBuffer();
		String lineStr;
		List<String> columns = metaData.getColumnNames();
		String _null = metaData.get_null();
		for (String key : columns) {
			String dataValue = line.getStringValue(key);
			if (dataValue == null)
				dataValue = _null;
			buffer.append(dataValue).append(metaData.getRawDatadelimiter());
		}
		if (buffer.length() > metaData.getRawDatadelimiter().length()) {
			lineStr = buffer.substring(0, (buffer.length() - metaData.getRawDatadelimiter().length()));
		} else {
			lineStr = buffer.toString();
		}
		return lineStr;
	}

}
