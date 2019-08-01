/**
 * 
 * @author davy
 * 日期:		2013-6-5 10:24:22
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.wanalytics.common;

import java.io.Serializable;
import java.util.Arrays;

public class QueryBean implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public enum DBName {

		tenddata("estate");
		private String dbName;

		DBName(String dbName) {
			this.dbName = dbName;
		}

		public String getDBName() {
			return dbName;
		}
	}

	private String dbName;
	private String tableName;
	private String[] whereColumns;
	private Object[] whereValues;
	private String[] resultColumn;
	private String sortColumn;
	private boolean asc;

	// 将查询与新增字段分开，added by guoping.zhou@2015/9/25
	private String[] insertColumns;
	private Object[] insertValues;

	public String getDbName() {
		return dbName;
	}

	public String getTableName() {
		return tableName;
	}

	public String[] getWhereColumns() {
		return whereColumns;
	}

	public Object[] getWhereValues() {
		return whereValues;
	}

	public String[] getResultColumn() {
		return resultColumn;
	}

	public String getSortColumn() {
		return sortColumn;
	}

	public boolean isAsc() {
		return asc;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public void setWhereColumns(String[] whereColumns) {
		this.whereColumns = whereColumns;
	}

	public void setWhereColumns(String whereColumns) {
		this.whereColumns = new String[] { whereColumns };
	}

	public void setWhereValues(Object[] whereValues) {
		this.whereValues = whereValues;
	}

	public void setWhereValues(Object whereValues) {
		this.whereValues = new Object[] { whereValues };
	}

	public void setResultColumn(String[] resultColumn) {
		this.resultColumn = resultColumn;
	}

	public void setResultColumn(String resultColumn) {
		this.resultColumn = new String[] { resultColumn };
	}

	public void setSortColumn(String sortColumn) {
		this.sortColumn = sortColumn;
	}

	public void setAsc(boolean asc) {
		this.asc = asc;
	}

	@Override
	public int hashCode() {
		return this.toString().hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		QueryBean other = (QueryBean) obj;
		return other.toString().equals(this.toString());
	}

	@Override
	public String toString() {
		return "QueryBean [dbName=" + dbName + ", tableName=" + tableName + ", whereColumns=" + Arrays.toString(whereColumns) + ", whereValues="
		        + Arrays.toString(whereValues) + ", resultColumn=" + Arrays.toString(resultColumn) + ", sortColumn=" + sortColumn + ", asc=" + asc
		        + "]";
	}

	public String getKey() {
		return tableName + "_" + hashCode();
	}

	public String[] getInsertColumns() {
		if (insertColumns == null || insertColumns.length <= 0) {
			return whereColumns;
		}
		return insertColumns;
	}

	public void setInsertColumns(String[] insertColumns) {
		this.insertColumns = insertColumns;
	}

	public Object[] getInsertValues() {
		if (insertValues == null || insertValues.length <= 0) {
			return whereValues;
		}
		return insertValues;
	}

	public void setInsertValues(Object[] insertValues) {
		this.insertValues = insertValues;
	}

}
