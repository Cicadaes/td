/**
 * 
 * @author davy
 * 日期:		2013-6-4 10:15:50
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.metadata;

import td.enterprise.framework.commons.util.Utils;

import java.util.Arrays;
import java.util.List;

/**
 * The Class MetaData. The default character set is UTF-8
 * 
 * @author davy
 */
public class MetaData {

	/** The column name str. */
	private String columnNameStr;

	/** The meta data delimiter. */
	private String metaDataDelimiter;

	/** The raw datadelimiter. */
	private String rawDatadelimiter;

	/** The _null. */
	private String _null = "";

	/** The column names. */
	private List<String> columnNames;

	/**
	 * 中文： <br>
	 * 传入数据列的字符串，传入列的分隔符，传入数据本身的分隔符。 <br>
	 * 例如： <br>
	 * 文件内容 <br>
	 * 16169,1 <br>
	 * 第一列是productid,第二列是platformid。 <br>
	 * 那么列的字符串就是productid:platformid <br>
	 * 列的分隔符就是&quot;:&quot;（冒号）。 <br>
	 * 数据本身的分隔符为&quot;,&quot;（逗号）。 <br>
	 * English: <br>
	 * Incoming data string column, the incoming column delimiter delimiter incoming data itself. <br>
	 * For example: <br>
	 * file contents <br>
	 * 16169,1 <br>
	 * first column is the productid, the second column is platformid. <br>
	 * then the column is the string productid: platformid <br>
	 * column delimiter is ":" (colon). <br>
	 * data itself separator is "," (comma).
	 * 
	 * @param columnNameStr
	 *            the column name str
	 * @param metaDataDelimiter
	 *            the meta data delimiter
	 * @param rawDatadelimiter
	 *            the raw datadelimiter
	 * @throws IllegalArgumentException
	 */
	public MetaData(String columnNameStr, String metaDataDelimiter, String rawDatadelimiter) {
		super();
		this.columnNameStr = columnNameStr;
		this.metaDataDelimiter = metaDataDelimiter;
		this.rawDatadelimiter = rawDatadelimiter;
		if (Utils.isNotEmpty(columnNameStr, metaDataDelimiter))
			this.columnNames = Arrays.asList(columnNameStr.split(metaDataDelimiter));
		else
			throw new IllegalArgumentException("columnNameStr和metaDataDelimiter不能为空");
		checkMe();
	}

	/**
	 * 中文： <br>
	 * 传入数据列的字符串，传入列的分隔符，传入数据本身的分隔符，传入列的list。<br>
	 * 如果你传了列的字符串和列的分隔符，那么列的list可以传空，同理传了列的list，那么列的字符串和列的分隔符可以传空。<br>
	 * 如果你都传了以列的字符串和列的分隔符为主。 <br>
	 * 例如： <br>
	 * 文件内容 <br>
	 * 16169,1 <br>
	 * 第一列是productid,第二列是platformid。 <br>
	 * 那么列的字符串就是productid:platformid <br>
	 * 列的分隔符就是&quot;:&quot;（冒号）。 <br>
	 * 数据本身的分隔符为&quot;,&quot;（逗号）。 <br>
	 * 列的list第一个元素是&quot;productid&quot;，第二个元素是&quot;platformid&quot;。<br>
	 * English: <br>
	 * incoming data string column, the incoming column delimiter delimiter incoming data itself, the incoming column
	 * list. <br>
	 * If you pass a string of columns and column delimiters, then you can pass an empty column list, empathy pass the
	 * column list, then the row and column delimiter string can pass null. <br>
	 * If you have to pass a string columns and column delimiters based. <br>
	 * example: <br>
	 * file contents <br>
	 * 16169,1 <br>
	 * first column is the productid, the second column is platformid. <br>
	 * then the column is the string productid: platformid <br>
	 * column delimiter is ":" (colon). <br>
	 * data itself separator is "," (comma). <br>
	 * columns list the first element is "productid", the second element is "platformid". *
	 * 
	 * @param columnNameStr
	 *            the column name str
	 * @param metaDataDelimiter
	 *            the meta data delimiter
	 * @param rawDatadelimiter
	 *            the raw datadelimiter
	 * @param columnNames
	 *            the column names
	 * @throws IllegalArgumentException
	 */
	public MetaData(String columnNameStr, String metaDataDelimiter, String rawDatadelimiter, List<String> columnNames) {
		super();
		this.columnNameStr = columnNameStr;
		this.metaDataDelimiter = metaDataDelimiter;
		if (Utils.isNotEmpty(columnNameStr, metaDataDelimiter))
			this.columnNames = Arrays.asList(columnNameStr.split(metaDataDelimiter));
		else
			this.columnNames = columnNames;
		this.rawDatadelimiter = rawDatadelimiter;
		checkMe();
	}

	/**
	 * Check me.
	 */
	private void checkMe() {
		if (!Utils.isNotEmpty(rawDatadelimiter)) {
			throw new IllegalArgumentException("rawDatadelimiter不能为空");
		}
	}

	/**
	 * 中文： <br>
	 * 传入数据本身的分隔符，传入列的list。<br>
	 * 例如： <br>
	 * 文件内容 <br>
	 * 16169,1 <br>
	 * 第一列是productid,第二列是platformid。 <br>
	 * 数据本身的分隔符为&quot;,&quot;（逗号）。 <br>
	 * 列的list第一个元素是&quot;productid&quot;，第二个元素是&quot;platformid&quot;。<br>
	 * English: <br>
	 * incoming data delimiter itself, the incoming column list. <br>
	 * example: <br>
	 * file contents <br>
	 * 16169,1 <br>
	 * first column is the productid, the second column is platformid. <br>
	 * data itself separator is "," (comma). <br>
	 * columns list the first element is "productid", the second element is "platformid". *
	 * 
	 * @param rawDatadelimiter
	 *            the raw datadelimiter
	 * @param columnNames
	 *            the column names
	 */
	public MetaData(String rawDatadelimiter, List<String> columnNames) {
		super();
		this.rawDatadelimiter = rawDatadelimiter;
		this.columnNames = columnNames;
	}

	/**
	 * Gets the column name str.
	 * 
	 * @return the column name str
	 */
	public String getColumnNameStr() {
		return columnNameStr;
	}

	/**
	 * Gets the meta data delimiter.
	 * 
	 * @return the meta data delimiter
	 */
	public String getMetaDataDelimiter() {
		return metaDataDelimiter;
	}

	/**
	 * Gets the raw datadelimiter.
	 * 
	 * @return the raw datadelimiter
	 */
	public String getRawDatadelimiter() {
		return rawDatadelimiter;
	}

	/**
	 * Gets the column names.
	 * 
	 * @return the column names
	 */
	public List<String> getColumnNames() {
		return columnNames;
	}

	/**
	 * Gets the _null.
	 * 
	 * @return the _null
	 */
	public String get_null() {
		return _null;
	}

	/**
	 * 中文： <br>
	 * 设置原始数据中你对空的定义是什么<br>
	 * 例如： <br>
	 * 文件内容 <br>
	 * 16169,null <br>
	 * 第一列是productid,第二列是platformid。 <br>
	 * 如果你设置&quot;null&quot;为空，那么platformid就是null。<br>
	 * 文件内容 <br>
	 * 16169,empty <br>
	 * 第一列是productid,第二列是platformid。 <br>
	 * 如果你设置&quot;empty&quot;为空，那么platformid就是null。<br>
	 * English: <br>
	 * Your original data set empty What is the definition <br>
	 * example: <br>
	 * file contents <br>
	 * 16169, null <br>
	 * first column is the productid, the second column is platformid. <br>
	 * If you set "null" is empty, then the platformid is null. <br>
	 * file contents <br>
	 * 16169, empty <br>
	 * first column is the productid, the second column is platformid. <br>
	 * If you set the "empty" is empty, then the platformid is null. *
	 * 
	 * @param _null
	 *            the new _null
	 */
	public void set_null(String _null) {
		this._null = _null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "MetaData [columnNameStr=" + columnNameStr + ", metaDataDelimiter=" + metaDataDelimiter + ", rawDatadelimiter=" + rawDatadelimiter + ", _null=" + _null + ", columnNames=" + columnNames + "]";
	}

}
