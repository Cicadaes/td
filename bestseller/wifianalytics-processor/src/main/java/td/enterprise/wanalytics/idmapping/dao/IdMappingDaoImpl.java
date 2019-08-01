package td.enterprise.wanalytics.idmapping.dao;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import td.enterprise.framework.commons.error.DomainException;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.wanalytics.idmapping.bean.InputBean;
import td.enterprise.wanalytics.idmapping.bean.OutputBean;
import td.enterprise.wanalytics.idmapping.utils.InputBeanUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class IdMappingDaoImpl implements IdMappingDao {
	
	private JdbcTemplate jdbcTemplate;

	private static final Logger logger = LoggerFactory.getLogger(IdMappingDaoImpl.class);
	
	public boolean insert(InputBean inputBean) throws DomainException,DuplicateKeyException {
		if (InputBeanUtils.check(inputBean)) {
			String sql = makeInsertSql(inputBean);
			try {
				jdbcTemplate.execute(sql);
				return true;
			} catch (DuplicateKeyException e) {
				throw e;
			} catch (Exception e) {
				logger.warn(Utils.toLog(sql, e));
				return false;
			}
		} else {
			return false;
		}
	}

	private String makeInsertSql(String key, String value,String time) {
		String sql = "insert ignore into `";
		String tableName = key;
		sql += tableName;
		String valueSql = StringUtils.isNotBlank(time) ? "` ( value, time ) values ( '" + value + "','"+ time +"' )" : "` ( value ) values ( '" + value + "' )" ; 
		sql += valueSql;
		return sql;
	}
	
	private String makeInsertSql(InputBean inputBean){
		if(inputBean.getExtInfo()!=null){
			String sql = "insert ignore into `";
			String tableName = inputBean.getKey();
			sql += tableName;
			sql += "` ( %s ) values ( %s )";

			Map<String, String> kvs =  inputBean.getExtInfo().toMap();
			Iterator<String> it = kvs.keySet().iterator();
			StringBuffer fields = new StringBuffer("value,"),values = new StringBuffer("'").append(inputBean.getValue()).append("',");

			//for new tenant
			fields.append("tenantid").append(",");
			values.append("'").append(inputBean.getTenantid()).append("',");

			fields.append("offset").append(",");
			values.append("'").append(inputBean.getOffset()).append("',");

			while(it.hasNext()){
				String field = it.next();
				String value =  kvs.get(field);
				fields.append(field).append(",");
				values.append("'").append(value).append("',");
			}
			String rst = String.format(sql, fields.substring(0, fields.length()-1),values.toString().substring(0, values.length()-1));
			return rst;
		}else{
			return makeInsertSql(inputBean.getKey(), inputBean.getValue(),inputBean.getTime());
		}
	}
	
	
	public OutputBean query(final InputBean inputBean) throws DomainException {
		if (InputBeanUtils.check(inputBean)) {
			String sql = makeQuerySql(inputBean.getKey(), inputBean.getValue());
//			String sql = makeQueryWithTenantSql(inputBean.getKey(), inputBean.getValue(),inputBean.getTenantid());
			List<OutputBean> outputBeans = null;
			try {
				outputBeans = jdbcTemplate.query(sql, new RowMapper<OutputBean>() {
					
					public OutputBean mapRow(ResultSet rs, int rowNum) throws SQLException {
						if (Utils.isNotEmpty(rs)) {
							OutputBean outputBean = new OutputBean();
							outputBean.setValue(rs.getString("value"));
							outputBean.setKey(inputBean.getKey());
							outputBean.setTime(rs.getTimestamp("time").getTime());
							outputBean.setOffset(rs.getLong("offset"));
							//outputBean.setTenantid(rs.getString("tenantid"));
							return outputBean;
						} else {
							return null;
						}
					}
				});
			} catch (Exception e) {
				logger.error(Utils.toLog(sql, e));
				return null;
			}
			if (Utils.isNotEmpty(outputBeans))
				return outputBeans.get(0);
			else
				return null;
		} else {
			return null;
		}
	}

	private String makeQuerySql(String key, String value) {
		String sql = "select  offset ,value , time from `";
		String tableName = key;
		sql += tableName;
		sql += "` where value ='" + value + "'";
		return sql;
	}

	private String makeQueryWithTenantSql(String key, String value, String tenantId) {
		String sql = "select  offset ,value , time from `";
		String tableName = key;
		sql += tableName;
		sql += "` where value ='" + value + "'";
		if(Utils.isNotEmpty(tenantId)){
		    sql += " " + " and  tenantid = '" + tenantId + "'";
		}
		return sql;
	}

	
	public List<String> selectAllTableNames(String domain) throws DomainException {
		String sql = " show tables ";
		List<String> tableNames = null;
		try {
			tableNames = jdbcTemplate.query(sql, new RowMapper<String>() {
				
				public String mapRow(ResultSet rs, int rowNum) throws SQLException {
					if (Utils.isNotEmpty(rs)) {
						return rs.getString(1);
					} else {
						return null;
					}
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
//			logger.error(Utils.toLog(e));
		}
		return tableNames;
	}
	
	
	public void updateDeviceUserWithExtInfo(Long offset,InputBean.DeviceExtInfo extInfo){
		String sql = "update deviceuser set %s where offset=%s";
		Map<String, String> kvs =  extInfo.toMap();
		Iterator<String> it = kvs.keySet().iterator();
		StringBuffer setExpress = new StringBuffer("");
		while(it.hasNext()){
			String field = it.next();
			String value =  kvs.get(field);
			setExpress.append(field).append("='").append(value).append("',");
		}
		sql = String.format(sql, setExpress.substring(0, setExpress.length()-1),offset);
		try {
			jdbcTemplate.execute(sql);
		} catch (Exception e) {
			logger.warn(Utils.toLog(sql, e));
		}
	}
	
	public static void main(String[] args) {
		IdMappingDaoImpl idi = new IdMappingDaoImpl();
		InputBean.DeviceExtInfo extInfo = new InputBean.DeviceExtInfo();
		extInfo.setImei("imei");
		extInfo.setMac_address("mac_address");
		idi.updateDeviceUserWithExtInfo(999999999999999999l, extInfo);
	}

	
	public boolean tableIsExist(String domain, String tableName) throws DomainException {
		String sql = " show tables like '" + tableName + "'";
		List<String> tableNames = null;
		try {
			tableNames = jdbcTemplate.query(sql, new RowMapper<String>() {
				
				public String mapRow(ResultSet rs, int rowNum) throws SQLException {
					if (Utils.isNotEmpty(rs)) {
						return rs.getString(1);
					} else {
						return null;
					}
				}
			});
		} catch (Exception e) {
			logger.error(Utils.toLog(e));
		}
		return Utils.isNotEmpty(tableNames);
	}

	
	public boolean createTable(String domain, String tableName) throws DomainException {
		String sql = " CREATE TABLE  if not exists  `" + tableName
				+ "` ( `offset` bigint(20) NOT NULL AUTO_INCREMENT,  `value` varchar(255) NOT NULL,  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (`offset`),  UNIQUE KEY `" + tableName
				+ "_unique` (`value`) ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ";
		try {
			jdbcTemplate.execute(sql);
			return true;
		} catch (Exception e) {
			logger.error(Utils.toLog(e));
			return false;
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see td.userprofile.commons.dao.UserProfileMysqlDao#selectAllUser(java.lang.String)
	 */
	
	public List<OutputBean> queryAll(String domain, final String tableName) throws DomainException {
		if (Utils.isEmpty(tableName))
			return null;
		String sql = "select offset,value,time from `" + tableName + "`";
		List<OutputBean> outputBeans = null;
		try {
			outputBeans = jdbcTemplate.query(sql, new RowMapper<OutputBean>() {
				
				public OutputBean mapRow(ResultSet rs, int rowNum) throws SQLException {
					if (Utils.isNotEmpty(rs)) {
						OutputBean outputBean = new OutputBean();
						outputBean.setValue(rs.getString("value"));
						outputBean.setKey(tableName);
						outputBean.setTime(rs.getTimestamp("time").getTime());
						outputBean.setOffset(rs.getLong("offset"));
						return outputBean;
					} else {
						return null;
					}
				}
			});
		} catch (Exception e) {
			logger.error(Utils.toLog(sql, e));
			return null;
		}
		return outputBeans;
	}

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

}
