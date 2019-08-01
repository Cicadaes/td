package td.enterprise.wanalytics.idmapping;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.dao.DuplicateKeyException;
import td.enterprise.framework.commons.error.DomainException;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.wanalytics.idmapping.bean.InputBean;
import td.enterprise.wanalytics.idmapping.bean.OutputBean;
import td.enterprise.wanalytics.idmapping.dao.IdMappingDao;
import td.enterprise.wanalytics.idmapping.utils.InputBeanUtils;
import td.enterprise.wanalytics.idmapping.utils.OutputBeanUtils;
import td.enterprise.wanalytics.processor.cache.CacheFactory;

import java.io.IOException;
import java.util.List;
import java.util.Set;

/**
 * IDMapping的新增/查询服务
 */
public class IdMappingService {

	private static final Logger logger = LoggerFactory.getLogger(IdMappingService.class);

	private IdMappingDao dao;

	private Set<String> idMappingTables;

	public static final String domain = "wifianalytics_user"; //

	private static IdMappingService idMappingService;

	/**
	 * 获取IdMappingService，可以获取和维护offset信息
	 * @return
	 */
	@SuppressWarnings("resource")
	public static IdMappingService getIdMappingService() {
		if (idMappingService == null) {
			ApplicationContext applicationContext = new ClassPathXmlApplicationContext(new String[] { "idMappingContext.xml",
			        "datafilter-spring-beans.xml" });
			idMappingService = applicationContext.getBean("idMappingService", IdMappingService.class);
		}
		return idMappingService;
	}

	/**
	 * 初始化方法，可加载静态资源或初始化某些变量
	 * 请仅在创建本对象时执行一次
	 * @throws DomainException 
	 */
	public void init() throws DomainException {
		List<String> idTables = dao.selectAllTableNames(null);
		this.idMappingTables = new java.util.concurrent.CopyOnWriteArraySet<String>();
		this.idMappingTables.addAll(idTables);
	}

	/**
	 * 往IDMapping表插入一条数据，如果表不存在则会自动创建
	 * @param inputBean
	 * @return
	 * @throws DomainException
	 * @throws IOException 
	 */
	public OutputBean insert(InputBean inputBean) throws DomainException, DuplicateKeyException {
		if (InputBeanUtils.check(inputBean)) {
			String key = inputBean.getKey();
			String domain = inputBean.getDomain();
			if (!idMappingTables.contains(key) && !dao.tableIsExist(domain, key)) {
				createTable(domain, key);
			} else if (!idMappingTables.contains(key)) {
				idMappingTables.add(key);
				logger.info("将" + key + "加入缓存");
			}
			try {
				return myInsert(inputBean);
			} catch (DuplicateKeyException e) {
				throw e;
			}
		} else {
			return null;
		}
	}

	/**
	 * 根据表名和Offset Value查询对象
	 * @param inputBean
	 * @return
	 * @throws DomainException
	 */
	public OutputBean query(InputBean inputBean) throws DomainException {
		logger.trace(String.format("===== 查询Offset对象-> table:{},hash value:{}, tenant:{}", inputBean.getKey(), inputBean.getValue(),
		        inputBean.getTenantid()));
		OutputBean outputBean = null;
		String tableName = inputBean.getKey();
		if (!idMappingTables.contains(tableName)) {
			if (dao.tableIsExist(inputBean.getDomain(), tableName)) {
				idMappingTables.add(tableName);
				outputBean = dao.query(inputBean);
			}
		} else {
			outputBean = dao.query(inputBean);
		}
		return outputBean;
	}

	private void createTable(String domain, String tableName) throws DomainException {
		boolean ok = dao.createTable(domain, tableName);
		logger.info("创建{}的{}", domain, tableName);
		if (ok) {
			idMappingTables.add(tableName);
			logger.info("将{}加入缓存", tableName);
		} else {
			logger.error("创建表{}失败", tableName);
		}

	}

	private OutputBean myInsert(InputBean inputBean) throws DomainException {
		OutputBean outputBean = dao.query(inputBean);
		if (Utils.isNotEmpty(outputBean)) {
			return outputBean;
		}
		boolean ok = dao.insert(inputBean);
		outputBean = dao.query(inputBean);
		if (Utils.isNotEmpty(outputBean) && ok) {
			outputBean.setNew(true);
		}
		return outputBean;
	}

	/**
	 * 简单插入，如果重复插入的话会抛出异常
	 * @param inputBean
	 * @return
	 * @throws DomainException
	 */
	public OutputBean insertOnly(InputBean inputBean) throws DomainException {
		// 自动判断并创建表
		String key = inputBean.getKey();
		String domain = inputBean.getDomain();
		if (!idMappingTables.contains(key)) {
			createTable(domain, key);
		}
		// 尝试插入数据
		boolean ok = dao.insert(inputBean);
		OutputBean outputBean = null;
		if (ok) {
			outputBean = dao.query(inputBean);
		}
		return outputBean;
	}

	public void updateDeviceUserWithExtInfo(Long offset, InputBean.DeviceExtInfo extInfo) {
		if (offset > 0 && extInfo != null && extInfo.toMap().size() > 0) {
			dao.updateDeviceUserWithExtInfo(offset, extInfo);
		}
	}

	public IdMappingDao getDao() {
		return dao;
	}

	public void setDao(IdMappingDao dao) {
		this.dao = dao;
	}

	/**
	 * 增加租户级别的 offset
	 * @param tenantId
	 * @param deviceMac
	 * @return
	 * @throws DomainException 
	 */
	public OutputBean getDeviceIDMappingByMac(String tenantId, String deviceMac) throws DomainException {
		InputBean in = new InputBean();
		in.setDomain("idmapping");
		in.setKey("tenant_" + tenantId); // 默认表名为default+租户
		in.setTenantid(tenantId);
		in.setValue(deviceMac);
		Cache cache = CacheFactory.getTenantUserCache();
		OutputBean outputBean = null;
		if (InputBeanUtils.check(in)) {
			// 查询缓存
			Element element = cache.get(tenantId + "_" + deviceMac);
			if (Utils.isNotEmpty(element)) {
				outputBean = (OutputBean) element.getValue();
			}
			if (OutputBeanUtils.isEmpty(outputBean)) {
				outputBean = query(in);
				if (OutputBeanUtils.isNotEmpty(outputBean)) {
					// 写入缓存
					cache.put(new Element(tenantId + "_" + deviceMac, outputBean));
				} else {
					outputBean = insert(in);
					if (OutputBeanUtils.isNotEmpty(outputBean)) {
						// 写入缓存
						cache.put(new Element(tenantId + "_" + deviceMac, outputBean));
					}
				}
			}
		}
		return outputBean;
	}
	
	/**
	 * 增加店前客流租户级别的 offset
	 * @param tenantId
	 * @param deviceMac
	 * @return
	 * @throws DomainException 
	 */
	public OutputBean getDeviceIDMappingByMacFront(String tenantId, String deviceMac, String tab) throws DomainException {
		InputBean in = new InputBean();
		in.setDomain("idmapping");
		in.setKey("front_" + tab + "_" + tenantId); // 默认表名为default+租户-店前客流offset按周分表
		in.setTenantid(tenantId);
		in.setValue(deviceMac);
		Cache cache = CacheFactory.getFrontUserCache();
		OutputBean outputBean = null;
		if (InputBeanUtils.check(in)) {
			// 查询缓存
			Element element = cache.get(tenantId + "_" + deviceMac);
			if (Utils.isNotEmpty(element)) {
				outputBean = (OutputBean) element.getValue();
			}
			if (OutputBeanUtils.isEmpty(outputBean)) {
				outputBean = query(in);
				if (OutputBeanUtils.isNotEmpty(outputBean)) {
					// 写入缓存
					cache.put(new Element(tenantId + "_" + deviceMac, outputBean));
				} else {
					outputBean = insert(in);
					if (OutputBeanUtils.isNotEmpty(outputBean)) {
						// 写入缓存
						cache.put(new Element(tenantId + "_" + deviceMac, outputBean));
					}
				}
			}
		}
		in = null;
		return outputBean;
	}

	public OutputBean getDeviceIDMappingByProjectAndMac(String tenantid, String projectId, String deviceMac,String time) throws DomainException {
		InputBean in = new InputBean();
		in.setDomain("idmapping");
		in.setTenantid(tenantid);
		in.setKey("project_" + tenantid + "_" + projectId);
		in.setValue(deviceMac);
		in.setTime(time);
		Cache cache = CacheFactory.getProjectUserCache();
		OutputBean outputBean = null;
		if (InputBeanUtils.check(in)) {
			// 查询缓存
			Element element = cache.get(tenantid + "_" + projectId + "_" + deviceMac);
			if (Utils.isNotEmpty(element)) {
				outputBean = (OutputBean) element.getValue();
			}
			if (OutputBeanUtils.isEmpty(outputBean)) {
				outputBean = query(in);
				if (OutputBeanUtils.isNotEmpty(outputBean)) {
					// 写入缓存
					cache.put(new Element(tenantid + "_" + projectId + "_" + deviceMac, outputBean));
				} else {
					outputBean = insert(in);
					if (OutputBeanUtils.isNotEmpty(outputBean)) {
						// 写入缓存
						cache.put(new Element(tenantid + "_" + projectId + "_" + deviceMac, outputBean));
					}
				}
			}
		}
		in = null;
		return outputBean;
	}

	public static void main(String[] args) {
		IdMappingService idMappingService = IdMappingService.getIdMappingService();
		try {
			idMappingService.getDeviceIDMappingByMac("100201", "abcdefghijklmn");
		} catch (DomainException e) {
		}
	}

}
