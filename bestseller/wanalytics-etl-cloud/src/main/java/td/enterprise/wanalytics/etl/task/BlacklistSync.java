package td.enterprise.wanalytics.etl.task;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.CrowdBlackList;
import td.enterprise.service.CrowdBlackListService;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.*;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 支持从数据库同步到redis中
 * 或者文件中黑名单同步到redis中
 * @author 黑名单同步
 *
 */
public class BlacklistSync {

	private static final Logger logger = Logger.getLogger(BlacklistSync.class);
	static SqlSession sqlSession = null;
    static Connection conn = null;

	public static void main(String[] args) {

		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		sqlSession = sqlSessionFactory.openSession();

        try {
			Options options = new Options();
			options.addOption("f", "f", true, "文件路径");
			options.addOption("a", "a", true, "附件id");
			options.addOption("t", "t", true, "租户id");
			options.addOption("p", "p", true, "项目id");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String file = line.getOptionValue("f");
			String attachmentId = line.getOptionValue("a");
			String tenantId = line.getOptionValue("t");
			String projectId = line.getOptionValue("p");
			long begin = System.currentTimeMillis();
			logger.info("===================file=【" + file + "】attachmentId=【" + attachmentId + " 】tenantId=【" + tenantId+"】projectId=【"+projectId+"】");
			execute(file, attachmentId,tenantId,projectId);
			long end = System.currentTimeMillis();
			logger.info("----BlacklistSync Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
		} catch (Exception e) {
			logger.error("同步黑名单失败：",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}finally {
			sqlSession.commit();
			sqlSession.close();
            DbWifianalyticsConn.close();
		}
		System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);

	}

	public static void execute(String file, String attachmentId,String tenantId,String projectId) throws Exception {

		//如果有文件
		if(StringUtils.isNotBlank(file) && StringUtils.isBlank(tenantId) && StringUtils.isBlank(projectId)){
			throw new Exception("file is not null, tenantId is mand , or project is mand");
		}

		//如果有文件
		if(StringUtils.isNotBlank(file) && StringUtils.isNotBlank(tenantId)){
			importFileMacToRedis(file,tenantId,projectId);
		}

		//如果有附件id
		if(StringUtils.isNotBlank(attachmentId)){
			importMacFromAttachment(Integer.parseInt(attachmentId),projectId);
		}

		//同步全部黑名单
		initBacklistFromDB();

	}

	//重新初始化黑名单
	public static void initBacklistFromDB() throws Exception{
		long begin = System.currentTimeMillis();

		Map<String,String> blacklistMap = new HashMap<String,String> ();
		Statement statement = null;
		ResultSet result = null;
		try{
				conn = DbWifianalyticsConn.getConnection();
				statement = conn.createStatement();
				String sql = "select tenant_id ,project_id, device_mac from TD_CROWD_BLACK_LIST where tenant_id is not null and device_mac is not null";
				result = statement.executeQuery(sql);


			while (result.next()) {
				Long object = result.getLong("project_id");
				if (object==null) {
					continue;
				}
				String key =  result.getString("device_mac").trim().toLowerCase() + "_" + result.getInt("tenant_id") +"_" + object;
				blacklistMap.put(key, "1");
			}
		}catch (SQLException e){
			e.printStackTrace();
		}finally {
			DbCloseUtil.closeAll(result,statement,conn);
		}
			RedisClient.put(blacklistMap, RedisClient.expiredSeconds, Constant.DB_INDEX_BLACK_CROWD);
			long end = System.currentTimeMillis();
		logger.info("============ 初始化黑名单完毕，用时:" + (end-begin) + "毫秒");
	}

	/**
	 * 导入文件到redis中
	 * @param file
	 * @param tenantId
	 * @throws Exception
	 */
	public static void importFileMacToRedis(String file, String tenantId,String projectId) throws Exception{
		long begin = System.currentTimeMillis();
		int count = 0;
		BufferedReader br = null;
		FileReader fr = null;
		try {
			fr = new FileReader(file);
			br = new BufferedReader(fr);
			String line = br.readLine();
			Map<String,String> map = new HashMap<String,String> ();
			logger.info("准备插入数据库=============================");
			while (null != line) {
				if(StringUtils.isNotBlank(line)){
					line = line.trim().toLowerCase();
					String key = line + "_" + tenantId+"_"+projectId;
					map.put(key, "1");
					count ++;
					CrowdBlackList page = new CrowdBlackList();
					page.setDeviceMac(line);
					page.setProjectId(Integer.parseInt(projectId));
                    int  temp = CrowdBlackListService.queryByCount(sqlSession, page);//ProjectId+DeviceMac为联合唯一值
                    if(temp == 0){
						CrowdBlackList t = new CrowdBlackList();
						t.setTenantId(tenantId);
						t.setProjectId(Integer.parseInt(projectId));
						t.setDeviceMac(line);
						t.setSource(3);
						t.setStatus(1);
						t.setCreateBy("syncFromFile");
						t.setCreator("syncFromFile");
						t.setUpdateBy("syncFromFile");
						t.setUpdater("syncFromFile");
						CrowdBlackListService.insert(sqlSession, t);
						logger.info("插入："+line+"[TenantId:"+tenantId+"]"+"[ProjectId:"+projectId+"]");
                   }else{
                	   logger.info("数据库存在该条记录"+line+"[TenantId:"+tenantId+"]"+"[ProjectId:"+projectId+"]");
                   }
				}
				line = br.readLine();
			}
			logger.info("插入数据库结束=============================");
			RedisClient.put(map, RedisClient.expiredSeconds, Constant.DB_INDEX_BLACK_CROWD);
		} catch (Exception e) {
		   throw e;
		} finally {
			FileUtil.close(fr,br);
		}
		long end = System.currentTimeMillis();
		logger.info("============ 导入文件黑名单完毕，用时:" + (end-begin) + "毫秒 导入黑名单个数" +  count );
	}

	public static void importMacFromAttachment(int attatchmentId,String projectId) throws Exception{
		logger.info("============ 初始化黑名单完毕实现--------");
		logger.info("准备插入数据库=============================");
		Map<String,String> map = new HashMap<String,String> ();
		String sql = "select attr4 , attr2,tenant_id from TD_ATTACHMENT where id =" + attatchmentId;
		Map<String,Object> attachmentMap = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
		//ProjectAttachment attachment = ProjectAttachmentService.selectByPrimaryKey(sqlSession, attatchmentId);
		if(attachmentMap == null){
			throw new RuntimeException("attatchmentId=" + attatchmentId + " 没找到附件");
		}
//		byte []  data = (byte [])attachment.getData();
		String path = attachmentMap.get("attr4") + "";
	    try{
			FileInputStream in = new FileInputStream(path);
	    	List<String[]> list = ExcelUtil.readSheetDataByParam(in, "sheet1", 1);
	    	for(int i=0;i < list.size(); i++){
	    		String [] macs = list.get(i);
	    		if(macs != null && macs.length > 0 && StringUtils.isNotBlank(macs[0])){
	    			String mac = macs[0].toLowerCase().trim();
	    			String key = mac +"_" + attachmentMap.get("tenant_id")+"_" + attachmentMap.get("attr2");
					map.put(key, "1");
					CrowdBlackList page = new CrowdBlackList();
                    page.setProjectId(Integer.parseInt(attachmentMap.get("attr2") + ""));
                    page.setDeviceMac(macs[0]);
                    if(projectId != null && StringUtils.isNotBlank(projectId)){
						page.setProjectId(Integer.parseInt(projectId));
					}
                    int  temp = CrowdBlackListService.queryByCount(sqlSession, page);//ProjectId+DeviceMac为联合唯一值
                    if(temp == 0){
		    			CrowdBlackList t = new CrowdBlackList();
						t.setTenantId( attachmentMap.get("tenant_id") + "");
						int projectIdNew = Integer.parseInt(attachmentMap.get("attr2") + "");
						if (projectId != null && StringUtils.isNotBlank(projectId)) {
							projectIdNew = Integer.parseInt(projectId);
						}
						t.setProjectId(projectIdNew);
						t.setDeviceMac(macs[0]);
						t.setSource(2);
						t.setStatus(1);
						t.setCreateBy("syncFromFile");
						t.setCreator("syncFromFile");
						t.setUpdateBy("syncFromFile");
						t.setUpdater("syncFromFile");
						CrowdBlackListService.insert(sqlSession, t);
						logger.info("插入："+macs[0]+"[TenantId:"+attachmentMap.get("tenant_id")+"]"+"[ProjectId:"+ projectIdNew+"]");
                    }else {
                    	logger.info("temp="+temp+"数据库存在该条记录"+macs[0]+"[TenantId:"+attachmentMap.get("tenant_id")+"]"+"[ProjectId:"+projectId+"]");
					}
	    		}
	    	}
	    	logger.info("插入数据库结束=============================");
	    	RedisClient.put(map, RedisClient.expiredSeconds, Constant.DB_INDEX_BLACK_CROWD);
	    }catch(Exception e){
	    	e.printStackTrace();
	    	logger.error("解析文件异常：",e);
	    }
	}
}
