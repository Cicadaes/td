package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;

/**
 * 格式化项目距离统计结果，生成文件，然后导入到mysql表中
 * @author junmin.li
 *
 */
public class ProjectDistanceFormatTask {

	private static final Logger logger = Logger.getLogger(ProjectDistanceFormatTask.class);
	
	public static void main(String[] args) {
		try{

			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("inputFile", "inputFile", true, "输入文件");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String inputFile = line.getOptionValue("inputFile");
			String outputFile = line.getOptionValue("outputFile");
			logger.info("================inputFile=" + inputFile + " outputFile=" + outputFile);
			long end = System.currentTimeMillis();
			execute(inputFile,outputFile);
			logger.info("ProjectDistanceFormatTask Used times :" + (end - begin)/1000 + " seconds");
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}
	
	public static void execute(String inputFile,String outputFile) throws Exception{
		logger.info("ProjectDistanceTask start....");
	    BufferedReader br = null;
	    BufferedWriter bw = null;
		FileReader fr = null;
		FileWriter fw = null;
	    try {
			fr = new FileReader(inputFile);
			fw = new FileWriter(outputFile);
            br = new BufferedReader(fr);
            bw = new BufferedWriter(fw);
           
//          1 3 5 10
//          1 < 1000
//          3 1000~2999
//          5 3000~5000
//          10 > 5000
            
            String line = br.readLine();
            
            ArrayList<String> arrayList = new ArrayList<>();
            arrayList.add("1");
            arrayList.add("3");
            arrayList.add("5");
            arrayList.add("10");
            
            while (null != line && line.isEmpty() == false ){
            	String values [] = line.replaceAll("," , ", ").split(",");
            	String tenantId = values[0].trim();
            	String projectId = values[1].trim();
            	String crowdId = values[2].trim();
            	String runDate = values[3].trim();
            	String startDate = values[4].trim();
            	String endDate = values[5].trim();
            	String cycleStatistics = values[6].trim();
            	String hourType = values[7].trim();
            	String crowdType = values[12].trim();
            	String crowdName = values[13].trim();
				String crowdNum = values[14].trim();
            	
            	 for (int i = 8,j=0; i < values.length-3; i++,j ++ ) {
            		bw.append("TD_TENANT_HOUSING_COVERAGE_COUNT|");
 					bw.append(tenantId).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(projectId).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(crowdId).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(runDate).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(hourType).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(arrayList.get(j)).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(values[i].trim()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(cycleStatistics).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(startDate).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(endDate).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(crowdName).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
 		    		bw.append(crowdType).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
					 bw.append(crowdNum).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
 				 }
	    		line = br.readLine();
            }
            bw.flush();
        } catch (Exception e) {
            logger.error("ProjectDistanceTask failed! inputFile=" + inputFile + "outputFile=" + outputFile,e);
        }finally {
        	FileUtil.close(br,bw,fr,fw);
        }
	    logger.info("ProjectDistanceTask end....");
	}

}

