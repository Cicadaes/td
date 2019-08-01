package td.enterprise.wanalytics.etl.task.filterblackmac;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.entity.CrowdBlackList;
import td.enterprise.service.CrowdBlackListService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbUserConn;
import td.enterprise.wanalytics.etl.util.DbCloseUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;


/**
 * 根据offset 查询出来mac地址导入到黑名单中
 * @author junmin.li
 *
 */
public class ImportBlackOffsetListTask {
	private static final Logger logger = LoggerFactory.getLogger(ImportBlackOffsetListTask.class);
	static SqlSession sqlSession = null;

	public static void main(String args []) throws Exception{
		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		sqlSession = sqlSessionFactory.openSession();

		try {

			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("i", "inputFile", true, "文件路径");
			options.addOption("totalDays", "totalDays", true, "总天数");
			options.addOption("days", "days", true, "出现天数");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String inputFile = line.getOptionValue("inputFile");
			String totalDays = line.getOptionValue("totalDays");
			String days = line.getOptionValue("days");
			logger.info("------inputFile is " + inputFile);
			execute(inputFile, totalDays, days);
			long end = System.currentTimeMillis();
			logger.info("------inputFile=" + inputFile + "处理完毕！" + " 用时:" + (end - begin) / 1000 + " seconds.");

		}catch (Exception e){
			logger.error("查询出来mac地址导入到黑名单中：",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}finally {
			sqlSession.close();
		}
	}
	 
	 public static void execute(String inputFilePath,String totalDays ,String days) throws Exception{
		 File inputFile = new File(inputFilePath);
	     BufferedReader br = null;
		 FileReader fr = null;
         try {
         	 fr = new FileReader(inputFile);
             br = new BufferedReader(fr);
             String line = null;
             while (StringUtils.isNotBlank((line = br.readLine()) )  ){
                  String values [] = line.split(",");
                  String tenantId = values[0];
                  String projectId = values[1];
                  String offset = values[2];
                  String mac = getMacFromOffset(tenantId, offset);
                  if(mac == null){
                	  logger.error("ignore data tenantId " + tenantId + " projectId=" + projectId + " offset=" + offset + " mac is null");
                	  continue;
                  }
                  CrowdBlackList page = new CrowdBlackList();
                  page.setTenantId(tenantId);
                  page.setProjectId(Integer.parseInt(projectId));
                  page.setDeviceMac(mac);
                  int  count = CrowdBlackListService.queryByCount(sqlSession, page);
                  String filterReason = "连续" + totalDays + "天内出现" + days + "次规则中实际出现次数：" + values[3] ;
                  if(count == 0){
              		CrowdBlackList t = new CrowdBlackList();
        			t.setTenantId(tenantId);
        			t.setProjectId(Integer.parseInt(projectId));
        			t.setDeviceMac(mac);
        			t.setSource(3);
        			t.setStatus(1);
        			t.setFilterReason(filterReason);
        			t.setCreateBy("system");
        			t.setCreator("system");
        			t.setUpdateBy("system");
        			t.setUpdater("system");
        			CrowdBlackListService.insert(sqlSession, t);
                  }else{
                	  logger.warn("Duplicate! ignore data tenantId " + tenantId + " projectId=" + projectId + "offset=" + offset + " mac=" + mac);
                  }
             }
         } catch (Exception e) {
             throw new Exception(e);
         }finally{
        	FileUtil.close(fr,br);
         }

	 }
	 
	 public static String getMacFromOffset(String tenantId, String offset) throws Exception{
		 Connection conn = null;
		 Statement statement = null;
		 ResultSet result = null;
		 String sql = "select `value` from tenant_" + tenantId + " where `offset` =" + offset;
		 try {
			 conn = DbUserConn.getConnection();
			 statement = conn.createStatement();
			 result = statement.executeQuery(sql);

			 while (result.next()) {
				 return result.getString("value") + "";
			 }

		 }catch (Exception e){
		 	e.printStackTrace();
		 }finally {
			 DbCloseUtil.closeAll(result,statement,conn);
		 }

		 return null;
	 }
}
