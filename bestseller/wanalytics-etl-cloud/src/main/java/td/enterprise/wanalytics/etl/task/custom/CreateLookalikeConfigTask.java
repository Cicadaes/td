package td.enterprise.wanalytics.etl.task.custom;


import java.io.BufferedWriter;
import java.io.FileWriter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.entity.LookalikeCrowd;
import td.enterprise.service.LookalikeCrowdService;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.FileUtil;


/**
 * 
 * @author junmin.li
 *
 */
public class CreateLookalikeConfigTask {
	 public static Logger logger = Logger.getLogger(CreateLookalikeConfigTask.class);
	 
	 public static void main(String []args) throws ParseException {
			Options options = new Options();
			options.addOption("taskId", "taskId", true, "taskId");
			options.addOption("runDate", "runDate", true, "runDate");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line  = parser.parse(options, args);
			String outputFile = line.getOptionValue("outputFile");
			String taskId     = line.getOptionValue("taskId");
			String runDate     = line.getOptionValue("runDate");
			execute(outputFile,Integer.parseInt(taskId),runDate);
			logger.info("CreateLookalikeConfigTask.. 生成lookalike配置文件成功！");
   }
	 
	public static Boolean execute(String outputFile,int taskId,String runDate){
		BufferedWriter bw = null;
		FileWriter fw = null;
        try {
        	fw = new FileWriter(outputFile);
            bw = new BufferedWriter(fw);
            LookalikeCrowd crowd =  LookalikeCrowdService.selectByPrimaryKey(taskId);
        	bw.append(crowd.getTenantId()).append(Constant.SEPARATER);
        	bw.append(crowd.getProjectId() + "").append(Constant.SEPARATER);
        	bw.append(crowd.getSeedCrowdId() + "").append(Constant.SEPARATER);
        	bw.append("0").append(Constant.SEPARATER);
        	bw.append(runDate).append(Constant.SEPARATER);
        	bw.append(crowd.getSeedCrowdStartDate()).append(Constant.SEPARATER);
        	bw.append(crowd.getSeedCrowdEndDate()).append(Constant.SEPARATER);
        	bw.append(crowd.getSeedType());
        	bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
            bw.flush();
        }catch(Exception e){
        	logger.error("写到文件失败：", e);
        	e.printStackTrace();
        }finally{
			FileUtil.close(bw,fw);
        }
		return true;
	}
}
