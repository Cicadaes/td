/**
 * 
 * @author davy
 * 日期:		2013-6-3 11:52:24
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.atomic.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.wanalytics.common.InsertBean;
import td.enterprise.wanalytics.common.QueryBean;
import td.enterprise.wanalytics.common.QueryResult;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class BasicDaoImpl {
	
	private Logger logger = LoggerFactory.getLogger(BasicDaoImpl.class);

	protected JdbcTemplate jdbcTemplate;

	public QueryResult getSomeThings(final QueryBean queryBean) {
		String sql = "select ";
		List<Object[]> result = null;
		QueryResult qResult = null;
		if (Utils.isNotEmpty(queryBean.getResultColumn())) {
			for (String rcol : queryBean.getResultColumn()) {
				sql += rcol + " ,";
			}
			sql = sql.substring(0, sql.length() - 1);
		} else {
			sql += " * ";
		}
		sql += " from " + queryBean.getTableName();
		if (Utils.isNotEmpty(queryBean.getWhereColumns())) {
			sql += " where ";
			for (String col : queryBean.getWhereColumns()) {
				sql += col + " = ? and ";
			}
			sql = sql.substring(0, sql.length() - 4);
		}
		if (Utils.isNotEmpty(queryBean.getSortColumn())) {
			sql += " order by " + queryBean.getSortColumn();
			if (queryBean.isAsc())
				sql += " asc ";
			else
				sql += " desc ";
		}
		if (Utils.isNull(getJdbcTemplate(queryBean.getDbName()))) {
			logger.error(Utils.toLog("jdbcTemplate是空的", "sql是", sql));
			return null;
		}
		try {
			result = getJdbcTemplate(queryBean.getDbName()).query(sql, queryBean.getWhereValues(), new RowMapper<Object[]>() {
				@Override
				public Object[] mapRow(ResultSet rs, int rowNum) throws SQLException {
					if (Utils.isNotEmpty(queryBean.getResultColumn())) {
						Object[] oneResult = new Object[queryBean.getResultColumn().length];
						for (int i = 0; i < queryBean.getResultColumn().length; i++) {
							oneResult[i] = rs.getObject(queryBean.getResultColumn()[i]);
						}
						return oneResult;
					}
					return null;
				}
			});
			qResult = new QueryResult(result);
			//logger.debug(Utils.toLog("从数据库中根据\t", queryBean, "\t取出\t", qResult));
		} catch (Exception e) {
			logger.error(Utils.toLog(e, "查询是发生异常sql是", sql));
		}
		return qResult;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public JdbcTemplate getJdbcTemplate(String dbName) {
		return this.jdbcTemplate;
	}

	public boolean insertSomeThings(InsertBean insertBean) {
		String sql = "insert ignore into  " + insertBean.getTableName() + " ( ";
		if (Utils.isNotEmpty(insertBean.getInsertColumns())) {
			for (String rcol : insertBean.getInsertColumns()) {
				sql += rcol + " ,";
			}
			sql = sql.substring(0, sql.length() - 1) + " ) ";
		} else {
			logger.error(Utils.toLog("插入数据库时，需要插入的列为空", insertBean));
			return false;
		}
		if (insertBean.getInsertValues() != null && insertBean.getInsertValues().length > 0) {
			sql += " values ( ";
			for (int i = 0; i < insertBean.getInsertValues().length; i++) {
				sql += " ? , ";
			}
			sql = sql.substring(0, sql.length() - 2) + " ) ";
		}
		if (Utils.isNull(getJdbcTemplate(insertBean.getDbName()))) {
			logger.error(Utils.toLog("jdbcTemplate是空的", "sql是", sql));
			return false;
		}
		try {
			JdbcTemplate jdbc = getJdbcTemplate(insertBean.getDbName());
			int rows = jdbc.update(sql, insertBean.getInsertValues());
			boolean isSuccess = rows > 0;
			//logger.debug(Utils.toLog("插入数据库\t", isSuccess, "\tinsertBean\t", insertBean));
			return true;
		} catch (Exception e) {
			logger.error(Utils.toLog(e, "插入数据库发生异常sql是", sql, "\tinsertBean:", insertBean));
			return false;
		}
	}
}
