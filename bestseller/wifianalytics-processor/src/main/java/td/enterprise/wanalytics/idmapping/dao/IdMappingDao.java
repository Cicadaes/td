package td.enterprise.wanalytics.idmapping.dao;

import td.enterprise.framework.commons.error.DomainException;
import td.enterprise.wanalytics.idmapping.bean.InputBean;
import td.enterprise.wanalytics.idmapping.bean.OutputBean;

import java.util.List;


public interface IdMappingDao {

	public boolean insert(InputBean inputBean) throws DomainException;

	public OutputBean query(InputBean inputBean) throws DomainException;
	
	public void updateDeviceUserWithExtInfo(Long offset,InputBean.DeviceExtInfo extInfo);
	
	public List<String> selectAllTableNames(String domain) throws DomainException;

	public boolean tableIsExist(String domain,String tableName) throws DomainException;

	public boolean createTable(String domain,String tableName) throws DomainException;

	public List<OutputBean> queryAll(String domain,String tableName) throws DomainException;
	
}
