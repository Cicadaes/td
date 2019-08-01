package td.enterprise.wanalytics.etl.task.custom;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.entity.LookalikeCrowd;
import td.enterprise.entity.ProjectTypeEnum;
import td.enterprise.service.LookalikeCrowdService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 根据任务生成mac文件
 *
 */
public class GenerateLookalikeMacTask {

	public static Logger logger = Logger.getLogger(GenerateLookalikeMacTask.class);
	
	public static void main(String []args){
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("t", "taskId", true, "任务id");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			int  taskId = Integer.parseInt(line.getOptionValue("taskId"));
			String  outputFile = line.getOptionValue("outputFile");
			logger.info("Params: taskId=" +  taskId );
			execute(taskId,outputFile);
			long end = System.currentTimeMillis();
			logger.info("GenerateLookalikeMacTask Used times :" + (end - begin)/1000 + " seconds");
		 }catch(Exception e){
			 logger.error("获取Mac位置失败： ", e);
			 System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		 }
		 System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	public static void execute(int taskId,String outputFile) throws Exception{
		LookalikeCrowd lookalikeCrowd = LookalikeCrowdService.selectByPrimaryKey(taskId);
		if(null == lookalikeCrowd){
			throw new Exception("没有查找到任务taskId=" + taskId);
		}
		String tenantId = lookalikeCrowd.getTenantId();
		int projectId = lookalikeCrowd.getProjectId();
		int crowdId = lookalikeCrowd.getSeedCrowdId();
		String crowdType = lookalikeCrowd.getSeedType();
		String startDate = lookalikeCrowd.getSeedCrowdStartDate();
		String endDate = lookalikeCrowd.getSeedCrowdEndDate();

		String projectIds = projectId + "";

		//如果是合并客流，从店铺总获取mac
		String sql = "select project_type from TD_PROJECT where id=" + projectId ;
		Map<String,Object> projectMap = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
		if(null != projectMap && null != projectMap.get("project_type")){
			int projectType = Integer.parseInt(projectMap.get("project_type") + "")  ;

			if(projectType == ProjectTypeEnum.PROJECT_GROUP.getCode()){
				//判断店组是否是单独客流
				sql = "select 1 from TD_PROJECT_GROUP_COMPUTE where group_id=" + projectId + " and compute_type=2";
				projectMap = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
				//如果是合并客流，查询店组下的店铺
				if(projectMap == null  || projectMap.isEmpty()){
					List<String> list = new ArrayList<String>();
					List<String> tempList = CustomGroup.queryChildrenByParam(projectId + "",list);
					String ids = ListUtils.getConcatIds(tempList);
					if(StringUtils.isNotBlank(ids)){
						projectIds = ids;
					}
				}
			}
		}
		GetProjectCrowdMacTask.execute(tenantId, projectIds, crowdId, crowdType, startDate, endDate, outputFile);
	}
}
