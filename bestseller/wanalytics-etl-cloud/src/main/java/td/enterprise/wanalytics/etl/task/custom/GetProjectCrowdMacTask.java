package td.enterprise.wanalytics.etl.task.custom;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.*;

/**
 * 获取项目人群下mac地址
 * @author junmin.li
 *
 */
public class GetProjectCrowdMacTask {
	
	public static Logger logger = Logger.getLogger(GetProjectCrowdMacTask.class);
	

	public static void main(String[] args) {
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("t", "tenantId", true, "租户ID");
			options.addOption("p", "projectId", true, "项目ID");
			options.addOption("c", "crowdId", true, "客群ID");
			options.addOption("s", "startDate", true, "开始日期");
			options.addOption("e", "endDate", true, "结束日期");
			options.addOption("crowdType", "crowdType", true, "人群类型");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			options.addOption("schedulerTaskLogId", "schedulerTaskLogId", true, "azkaban计算任务id");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String tenantId = line.getOptionValue("tenantId");
			int projectId = Integer.parseInt(line.getOptionValue("projectId"));
			int crowdId = Integer.parseInt(line.getOptionValue("crowdId"));
			String crowdType = line.getOptionValue("crowdType");
			String azkabanExecId = line.getOptionValue("schedulerTaskLogId");
			String startDate = line.getOptionValue("startDate");
			String endDate = line.getOptionValue("endDate");
			String outputFile = line.getOptionValue("outputFile");

			logger.info("Params: tenantId=" +  tenantId + " projectId=" + projectId + " crowdId=" + crowdId 
					+ " azkabanExecId=" + azkabanExecId + " startDate=" + startDate + " endDate=" + endDate + " outputFile=" + outputFile );
			execute(tenantId,projectId + "",crowdId,crowdType,startDate,endDate, outputFile);
			long end = System.currentTimeMillis();
			logger.info("GetProjectCrowdMacTask Used times :" + (end - begin)/1000 + " seconds");
		 }catch(Exception e){
			 logger.error("获取Mac位置失败： ", e);
			 System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		 }
		 System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	public static void execute(String tenantId,String projectIds,Integer crowdId,String crowdType,String startDate,String endDate,String outputFile) throws Exception {
		//查询query-engine 获取offset
		List<Integer>  offsetList = CubeUtils.queryOffsetList(projectIds ,crowdType,startDate,endDate);
		//根据offset 获取mac地址
		List<String> macList = CubeUtils.getMacFromOffset(tenantId,offsetList);
		//写入到文件中
		writeToFile(outputFile,macList);
		
		//生成gzip 格式文件 
		File file = new File(outputFile);
		String path = file.getParent();
		String fileName = file.getName();
		GZipUtil.gzip(outputFile, path, fileName + ".gz");
	}
	

    /**
     * 写入到文件中
     * @param macList
     */
    public static void writeToFile(String outputFile,List<String> macList){
		BufferedWriter bw = null;
		FileWriter fw = null;
		try {
			fw = new FileWriter(outputFile);
			bw = new BufferedWriter(fw);
			int i = 0;
			if(null != macList){
				for(String mac : macList){
					bw.append(mac);
					bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
					i ++ ;
					if(i % 1000 ==0 ){
						bw.flush();
					}
				}
			}
			bw.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FileUtil.close(bw,fw);
		}
    }

}
