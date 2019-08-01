package td.enterprise.wanalytics.etl.task.custom;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

import td.enterprise.entity.ProjectTypeEnum;
import td.enterprise.wanalytics.etl.util.CubeUtils;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.utils.QueryServiceUtils;
@Slf4j
public class FigureKMean {

	 public static Logger logger = Logger.getLogger(FigureKMean.class);
	 private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";

	public static void main(String[] args) {
		String taskId = null;
		String outputFile =null;
		String runDate=null;
		String confpath=null;
		Options options = new Options();
		options.addOption("taskId", "taskId", true, "taskId");
		options.addOption("outputFile", "outputFile", true, "outputFile");
		options.addOption("confFile", "confFile", true, "confFile");
		options.addOption("runDate", "runDate", true, "runDate");
		CommandLineParser parser = new PosixParser();
		CommandLine lines = null;
		try {
			lines = parser.parse(options, args);
			taskId = lines.getOptionValue("taskId");
			outputFile = lines.getOptionValue("outputFile");
			runDate = lines.getOptionValue("runDate");
			confpath = lines.getOptionValue("confFile");
			
		} catch (ParseException e1) {
			logger.error("参数异常了 ",e1);
			log.info(""+args);
			System.exit(1);
		}
		
		logger.info("========================FigureKMean开始执行，获取参数============================");
		
		try{
			int execute = execute(taskId, outputFile,runDate,confpath);
			if (execute==1) {
				logger.error("===================发生了异常");
				log.info("发生了异常");
				System.exit(1);
			}else if (execute==2) {
				logger.error("===============没有符合条件的人群");
				log.info("没有符合条件的人群");
				System.exit(2);
			}
		}catch(Exception e){
			logger.error("未知的错误发生了",e);
			System.exit(1);
		}
		
	}

	public static int execute(String taskId, String outputpath,String rundate,String confpath) {
		//=========从TD_KMEANS_CROWD中读取信息
		logger.info("========================从TD_KMEANS_CROWD中读取信息============================");
		String sql = "select * from TD_KMEANS_CROWD where id=" +taskId ;
		List<Map<String, Object>> queryForList = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
		Map<String, Object> map = queryForList.get(0);
		
		String startDate = (String)map.get("start_date");
		String endDate = (String)map.get("end_date");
		Integer tenantId = (Integer)map.get("tenant_id");
		Integer projectId = (Integer)map.get("project_id");
		
		Integer dateType = (Integer)map.get("date_type");
		Integer execId = (Integer)map.get("exec_id");
		
		Integer dimensionality = (Integer)map.get("dimensionality");
		Integer classification= (Integer)map.get("classification");
		if (classification.intValue()==0) {
			classification= 10;
		}
		Integer seedCrowdId = (Integer)map.get("seed_crowd_id");
		String crowdSql="select * from TD_CROWD where id="+seedCrowdId ;
		List<Map<String, Object>> crowd = QueryUtils.query(crowdSql,QueryUtils.WIFIANALYTICS_DB);
		String crowdType= (String)crowd.get(0).get("type");
		String trim = crowdType.toUpperCase().trim();
		String cubeName = null;
		switch (trim) {
		case "AU":
			cubeName="bitmap.active_user_day_cube";
			break;
		case "CU":
			cubeName="bitmap.tenant_import_user_cube";
			break;
		case "NU":
			cubeName="bitmap.new_user_day_cube";
			break;
		case "OU":
			cubeName="bitmap.old_user_day_cube";
			break;
		default:
			log.info("未识别的人群:"+trim);
			logger.error("未识别的人群:"+trim);
			return 1;
		}
		logger.info("========================根据获得的数据计算  初始客群============================");

		//项目ids
		String projectIds = projectId + "";

		String projectSql = "select project_type from TD_PROJECT where id=" + projectId;
		Map<String,Object> projectMap = QueryUtils.querySingle(projectSql,QueryUtils.WIFIANALYTICS_DB);
		int projectType = (Integer) projectMap.get("project_type");
		if(projectType == ProjectTypeEnum.PROJECT_GROUP.getCode()){
			List<String> childProjectList = new ArrayList<String> ();
			childProjectList = CustomGroup.queryChildrenByParam(projectId + "",childProjectList);
			projectIds = "";
			int size = childProjectList.size();
			int i=0;
			for(String tempId : childProjectList){
				projectIds +=  tempId  ;
				if(i < size - 1){
				 	projectIds += ",";
				}
				i ++;
			}
		}
		String makeSql = makeSql(cubeName,tenantId,projectIds,startDate,endDate,dateType);

		//offset 使用的是租户的offset，可以从租户进行查询了
		List<Integer> list = QueryServiceUtils.invokeForOffset("post", queryUrl, makeSql);
		if (list==null || list.isEmpty()) {
			logger.info("=ERROR======初始客群为空====不进行下一步计算====任务即将结束");
			logger.error("=========[list is null]===[sql is]:"+makeSql);
			return 2;
		}
		logger.info("========客群计算成功=============客群大小为:"+list.size()+"===============");
		logger.info("========通过offset，获取对应的 mac 地址===============");

		List<String> macFromOffset = CubeUtils.getMacFromOffset(tenantId + "", list);
		
		String[] split = outputpath.split("/");
		String dirpath="";
		for (int i = 0; i < split.length-1; i++) {
			dirpath+=split[i];
			if (i!=split.length-2) {
				dirpath+="/";
			}
			
		}
		logger.info("========为输出路径创建文件夹=="+dirpath+"=========");
		File file = new File(dirpath);
		if (!file.exists()) {
			file.mkdirs();
		}
		
		logger.info("========准备写出mac文件=========");
		BufferedWriter bw = null;
		FileWriter fw = null;
		try {
			fw = new FileWriter(new File(outputpath));
			bw = new BufferedWriter(fw);
			for (String mac : macFromOffset) {
				bw.write(mac);
				bw.newLine();
			}
			bw.flush();
		} catch (IOException e) {
			logger.error("写出mac失败",e);
			log.info("写出amc失败："+ e.getMessage());
			return 1;
		}finally {
			FileUtil.close(bw,fw);
			fw = null;
			bw = null;
		}
		logger.info("========写出mac文件【成功】==="+outputpath+"======");
		
		logger.info("========准备写出配置文件==="+outputpath+"======");
		try {
			fw = new FileWriter(new File(confpath));
			bw = new BufferedWriter(fw);
			bw.write(tenantId+"");
			bw.write(",");
			bw.write(projectId+"");
			bw.write(",");
			bw.write(startDate+"");
			bw.write(",");
			bw.write(endDate+"");
			bw.write(",");
			bw.write(dimensionality+"");
			bw.write(",");
			bw.write(seedCrowdId+"");
			bw.write(",");
			bw.write(classification+"");
			bw.write(",");
			bw.write(execId+"");
			bw.flush();
			logger.info("写出配置文件成功，路径为"+confpath);
		} catch (IOException e) {
			logger.error("写出配置文件失败",e);
			log.info("写出配置文件失败："+ e.getMessage());
			return 1;
		}finally {
			FileUtil.close(bw,fw);
		}
		return 0;
	}

	private static String makeSql(String cubeName, Integer tenantid, String projectIds, String startdate, String enddate,
								  Integer datetype) {
		
		StringBuffer sb = new StringBuffer();
		sb.append("r30223=select * from ");
		sb.append(cubeName);
		sb.append(" ");
		sb.append("where 1=1 ");
		sb.append("and tenant_id="+tenantid+" and project_id in (" + projectIds +")  ");
		
		if (datetype.intValue() == 0) { //全天
			sb.append(" and (date between " + startdate + " and " + enddate + ")");
		}else {
			sb.append(" and (");
			ArrayList<String> giveweekday = giveweekday(startdate, enddate, datetype);

			for (int i = 0; i < giveweekday.size(); i++) {
				if (i==giveweekday.size()-1) {
					sb.append(" date="+giveweekday.get(i)+")");
				}else{
					sb.append(" date="+giveweekday.get(i)+" or");
				}
			}
		}
		sb.append("; r30223.results[0].value.toArray();");
		
		return sb.toString();
	}
	
	public static ArrayList<String> giveweekday(String start, String end, Integer daytype) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		ArrayList<String> dates = new ArrayList<String>();
		Date begin=null;
		Date over=null;
		try {
			begin = simpleDateFormat.parse(start);
			over = simpleDateFormat.parse(end);
		} catch (Exception e) {
			logger.error("日期格式不对");
			return dates;
		}
		if (begin==null||over==null) {
			logger.error("日期格式不对");
			return dates;
		}
		
		ArrayList<Integer> dayofweek = new ArrayList<Integer>();
		for (int i = 0; i < 7; i++) {
			dayofweek.add(i);
		}
		
		if (1== (daytype.intValue())) {
			dayofweek.remove(0);
			dayofweek.remove(5);
		}else if (2== (daytype.intValue())) {
			for (int i = 0; i < 5; i++) {
				dayofweek.remove(1);
			}
		}
		

		
		Calendar cal = Calendar.getInstance();
		cal.setTime(begin);
		boolean bContinue = true;
		while(bContinue){
			if (!over.before(cal.getTime())) {
				int i = cal.get(Calendar.DAY_OF_WEEK)-1;
				if (dayofweek.contains(i)) {
					dates.add(simpleDateFormat.format(cal.getTime()));
				}
				cal.add(Calendar.DAY_OF_MONTH, 1);
	        } else {
	            break;
	        }
		}
		return dates;
	}
	

}
