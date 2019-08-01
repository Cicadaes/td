package td.enterprise.wanalytics.common;

import td.enterprise.wanalytics.processor.utils.Utils;

import java.io.Serializable;
import java.util.Arrays;

public class InsertBean implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6010965118363362150L;

	private String dbName;
	private String tableName;
	private String[] insertColumns;
	private Object[] insertValues;

	public String getDbName() {
		return dbName;
	}

	public String getTableName() {
		return tableName;
	}

	public String[] getInsertColumns() {
		return insertColumns;
	}

	public Object[] getInsertValues() {
		return insertValues;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public void setInsertColumns(String[] insertColumns) {
		this.insertColumns = insertColumns;
	}

	public void setInsertValues(Object[] insertValues) {
		this.insertValues = insertValues;
	}

	public InsertBean() {
		super();
	}

	public InsertBean(QueryBean queryBean) {
		if (Utils.isNotEmpty(queryBean)) {
			this.tableName = queryBean.getTableName();
			this.dbName = queryBean.getDbName();
			this.insertColumns = queryBean.getInsertColumns();
			this.insertValues = queryBean.getInsertValues();
		} else {
			throw new IllegalArgumentException("queryBean不能为空");
		}
	}

	@Override
	public String toString() {
		return "InsertBean [dbName=" + dbName + ", tableName=" + tableName + ", insertColumns=" + Arrays.toString(insertColumns) + ", insertValues="
		        + Arrays.toString(insertValues) + "]";
	}

}
