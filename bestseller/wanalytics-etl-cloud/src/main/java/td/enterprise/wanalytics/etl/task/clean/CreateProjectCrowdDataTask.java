package td.enterprise.wanalytics.etl.task.clean;


import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

/**
 * @author junmin.li
 *
 */
public class CreateProjectCrowdDataTask {
	 public static Logger logger = Logger.getLogger(CreateProjectCrowdDataTask.class);
	 
	 public static void main(String []args) throws ParseException {
			Options options = new Options();
			options.addOption("o", "outputFile", true, "输出文件");
			options.addOption("r", "runDate", true, "开始日期");
			options.addOption("sqlFile", "sqlFile", true, "sqlFile");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String outputFile = line.getOptionValue("outputFile");
			String runDate    = line.getOptionValue("runDate");
			String sqlFile = line.getOptionValue("sqlFile");
			execute(outputFile,runDate,sqlFile);
			logger.info("CreateProjectCrowdDataTask.. 生成租户项目人群文件完毕");
   }
	 
	public static Boolean execute(String outputFile,String runDate,String sqlFile){
		BufferedWriter bw = null;
		FileWriter fw = null;
        try {
        	String sql = FileUtil.readFileAsString(new File(sqlFile));
        	fw = new FileWriter(outputFile);
            bw = new BufferedWriter(fw);
            List<TenantProjectCrowd> list = queryData(runDate,sql);
            for(TenantProjectCrowd tpc : list){
            	bw.append(tpc.getTenantId()).append(Constant.SEPARATER);
            	bw.append(tpc.getProjectId() + "").append(Constant.SEPARATER);
            	bw.append(tpc.getCrowdId()).append(Constant.SEPARATER);
            	bw.append(tpc.getCycleStatistics() + "").append(Constant.SEPARATER);
            	bw.append(tpc.getRunDate()).append(Constant.SEPARATER);
            	bw.append(tpc.getStartDate()).append(Constant.SEPARATER);
            	bw.append(tpc.getEndDate());
            	bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
            }
            bw.flush();
        }catch(Exception e){
        	logger.error("写到文件失败：", e);
        	e.printStackTrace();
        }finally{
			FileUtil.close(bw,fw);
        }
		   
		return true;
	}
	
	@SuppressWarnings("rawtypes")
	public static List<TenantProjectCrowd> queryData(String runDate,String sql){
		List<Map<String,Object>> list = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
		List<TenantProjectCrowd> tempList = new ArrayList<TenantProjectCrowd>();
		if(null != list){
			for(Map<String,Object> map : list){
				TenantProjectCrowd temp = new TenantProjectCrowd();
				temp.setTenantId(map.get("tenant_id").toString());
				temp.setProjectId(Integer.parseInt(map.get("project_id").toString()));
				temp.setCrowdId(map.get("crowd_id").toString());
				tempList.add(temp);
			}
		}

		List<TenantProjectCrowd>  resList = new ArrayList<TenantProjectCrowd> ();
		
		Map<String,String> ignoreMap = new HashMap<String,String> ();
		String values = HttpUtil.getParamFromConfigServer("azkaban.ignore.projects");
		if(StringUtils.isNotBlank(values)){
			for(String s: values.split(",")){
				if(StringUtils.isNotBlank(s)){
					ignoreMap.put(s, s);
				}
			}
		}

		String daysStr = HttpUtil.getParamFromConfigServer("wifianalytics.calc.cycle.statistics");
	    String days [] = daysStr.split(",");
	    for(String day : days){
	    	if(null != list){
	    		int  interval = Integer.parseInt(day);
	    		//开始日期
	    		String startDate = DateUtil.getDateString(runDate,  - interval);
	    		//结束日期
	    		String endDate = DateUtil.getDateString(runDate, 0- 1);

                for(TenantProjectCrowd tpc : tempList){
	    			if(ignoreMap.get(tpc.getProjectId() + "") != null){
	    				continue;
	    			}
	    			TenantProjectCrowd temp = new TenantProjectCrowd();
	    			temp.setTenantId(tpc.getTenantId());
	    			temp.setProjectId(tpc.getProjectId());
	    			temp.setCrowdId(tpc.getCrowdId());
	    			temp.setCrowdType(tpc.getCrowdType());
	    			temp.setCycleStatistics(interval);
	    			temp.setRunDate(runDate);
	    			temp.setStartDate(startDate);
	    			temp.setEndDate(endDate);
	    			resList.add(temp);
	    		}
	    	}
	    }
		return resList;
	}

}
