package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

public class CorrelationCountSaveTask {

	public static Logger logger = Logger.getLogger(CorrelationCountSaveTask.class);
	
	public static void main(String[] args) {
		String tenantId 			= null;
		String projectId 			= null;
		String crowdId 				= null;
		String competitorProjectId 	= null;
		String competitorCrowdId 	= null;
		String cycleStatistics 		= null;
		String runDate 				= null;
		String startDate 			= null;
		String endDate 				= null;
		String outputpath 			= null;
		
		Options options = new Options();
		
		options.addOption("tenantId", 				"tenantId", 			true, 		"租户ID");
		options.addOption("projectId", 				"projectId", 			true, 		"项目ID");
		options.addOption("crowdId", 				"crowdId", 				true, 		"人群ID");
		options.addOption("competitorProjectId", 	"competitorProjectId", 	true, 		"竞品项目ID");
		options.addOption("competitorCrowdId", 		"competitorCrowdId", 	true,		"竞品人群ID");
		options.addOption("cycleStatistics", 		"cycleStatistics", 		true, 		"时间周期");
		options.addOption("runDate", 				"runDate", 				true, 		"执行时间");
		options.addOption("startDate", 				"startDate", 			true, 		"开始时间");
		options.addOption("endDate", 				"endDate", 				true, 		"结束时间");
		options.addOption("inputpath", 				"inputpath", 			true, 		"文件输出路径");
		
		CommandLineParser parser = new PosixParser();
		CommandLine lines = null;
		try {
			lines = parser.parse(options, args);
			
			tenantId 			= lines.getOptionValue("tenantId");
			projectId 			= lines.getOptionValue("projectId");
			crowdId 			= lines.getOptionValue("crowdId");
			competitorProjectId = lines.getOptionValue("competitorProjectId");
			competitorCrowdId 	= lines.getOptionValue("competitorCrowdId");
			cycleStatistics 	= lines.getOptionValue("cycleStatistics");
			runDate 			= lines.getOptionValue("runDate");
			startDate 			= lines.getOptionValue("startDate");
			endDate 			= lines.getOptionValue("endDate");
			outputpath 			= lines.getOptionValue("inputpath");
			
		} catch (ParseException e1) {
			logger.error("参数异常 ",e1);
			System.exit(1);
		}
		
		execute(tenantId,projectId,crowdId,competitorProjectId,competitorCrowdId,cycleStatistics,runDate,startDate,endDate,outputpath);
	}
	private static void execute(String tenantId, 			String projectId, 			String crowdId, 	String competitorProjectId,
								String competitorCrowdId, 	String cycleStatistics, 	String runDate, 	String startDate, 
								String endDate,			String outputpath) {
		
		BufferedReader br = null;
		FileReader fr = null;
		String readLine=null;
		try {
			fr = new FileReader(new File(outputpath));
			br = new BufferedReader(fr);
			readLine = br.readLine();
		} catch (Exception e1) {
			logger.error("读取计算文件失败",e1);
			System.exit(1);
		}finally {
			FileUtil.close(fr,br);
		}
		
		String[] split = readLine.split(",");
		
		Integer activeCount 		 = Integer.parseInt(split[0]);
		Integer compareActiveCount = Integer.parseInt(split[1]);
		Integer commonCount 		 = Integer.parseInt(split[2]);

		String deleteSql = "delete from TD_TENANT_CORRELATION_COUNT where project_id=" + projectId + " and compare_project_id=" + competitorProjectId + " and run_date='" +  runDate + "'";

		QueryUtils.execute(deleteSql,QueryUtils.WIFIANALYTICS_DB);

        String sql = "insert into TD_TENANT_CORRELATION_COUNT values (null," + tenantId + ","
                + projectId + ","  + crowdId + "," + activeCount + ","  + competitorProjectId + ","
                + competitorCrowdId + "," + compareActiveCount + "," + commonCount + ","  + cycleStatistics + ",'"
                + runDate + "','" + startDate + "','" + endDate + "')" ;

        logger.info("sql=" + sql);
        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);

        logger.error("覆盖度成功");
	}
}
