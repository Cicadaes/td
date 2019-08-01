package td.enterprise.wanalytics.etl.task.filterblackmac;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.DbCloseUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

/**
 * 查询10内，有5天到访的用户mac地址
 * @author 过滤出来黑名单
 */
@Slf4j
public class FilterBlackMacTask {
	public static Logger logger = Logger.getLogger(FilterBlackMacTask.class);
	
	private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";

	public static void main(String[] args) {
		try {
			Options options = new Options();
			options.addOption("projectId", "projectId", true, "项目ID");
			options.addOption("startDate", "startDate", true, "开始日期");
			options.addOption("endDate", "endDate", true, "结束日期");
			options.addOption("outputFile", "outputFile", true, "结束日期");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String projectId = line.getOptionValue("projectId");
			String startDate = line.getOptionValue("startDate");
			String endDate = line.getOptionValue("endDate");
			String outputFile = line.getOptionValue("outputFile");
			long begin = System.currentTimeMillis();
			execute(Integer.parseInt(projectId),startDate,endDate,outputFile);
			long end = System.currentTimeMillis();
			logger.info("----FilterBlackMacTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
		} catch (Exception e) {
			logger.error("错误：",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
		System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	public static void execute(int projectId,String startDate,String endDate,String outputFile) throws Exception{
		logger.info("---------projectId=" + projectId + " startDate=" + startDate + " endDate=" + endDate + " outputFile");
		String tenantId = "";
		Connection conn = null;
		Statement statement = null;
		ResultSet result = null;
		String sql = "select tenant_id from TD_PROJECT where id = " + projectId;
		try {
			conn = DbWifianalyticsConn.getConnection();
			statement = conn.createStatement();
			result = statement.executeQuery(sql);
			while (result.next()) {

				tenantId = result.getString("tenant_id");


			}
		}catch (SQLException e){
			e.printStackTrace();
		}finally {
			DbCloseUtil.closeAll(result,statement,conn);
		}
		if (StringUtils.isBlank(tenantId)) {
			throw new RuntimeException("项目id=" + projectId + " 不存在或者tenantId 为空！");

		}

		BufferedWriter bw = null;
		FileWriter fw = null;
		try {
			fw = new FileWriter(outputFile);
			bw = new BufferedWriter(fw);
			for(String tempDate = startDate; tempDate.compareTo(endDate) < 0; ){
				List<Integer> list = queryOffsetList(tenantId,projectId,tempDate);
				if(null != list){
					for(Integer t : list){
						bw.append(tenantId).append("\t");
						bw.append(projectId + "").append("\t");
						bw.append(tempDate + "").append("\t");
						bw.append(t + "").append("\n");
					}
					bw.flush();
				}
				tempDate = DateUtil.getDateString(tempDate, 1);
			}
			bw.flush();
		} catch (Exception e) {
			throw new Exception("FilterFileTask failed!", e);
		} finally {
			FileUtil.close(bw,fw);
		}
	}
	
	public static List<Integer> queryOffsetList(String tenantId,int projectId,String date){
		String script = "r30223=select * from bitmap.active_user_day_cube where tenant_id=" + tenantId + " and project_id="
				+ projectId + " and date ='" + date + "'  group by date; r30223.results[0].value.toArray();";
		List<Integer>  list = QueryServiceUtils.invokeForOffset("post", queryUrl, script);
		if(null != list){
			logger.info("queryEngine-result:" + Arrays.toString(list.toArray()));
		}
		return list;
	}
	
//	public static void main(String [] args ){
//	    String startDate = "2017-03-06";
//	    String endDate = "2017-03-16";
//	    
//	    for(String tempDate = startDate; tempDate.compareTo(endDate) < 0; ){
//            log.info("date =" + tempDate);
//            tempDate = DateUtils.getDateString(tempDate, 1);
//        }
//	}

}
