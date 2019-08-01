package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

import java.io.*;


/**
 * 根据经纬度，算出来附近150米以内的小区，交通站，大厦名称
 * @author junmin.li
 *
 */
public class ProjectAreaTopNTask {
   public static Logger logger = Logger.getLogger(ProjectAreaTopNTask.class);
	
	public static void main(String[] args) {
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
            options.addOption("cityName", "cityName", true, "城市名称");
			options.addOption("inputFile", "inputFile", true, "输入文件");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
		    String cityName = line.getOptionValue("cityName");
			String inputFile = line.getOptionValue("inputFile");
			String outputFile = line.getOptionValue("outputFile");
			Boolean r = execute(inputFile, outputFile,cityName);
			long end = System.currentTimeMillis();
			logger.info("ProjectAreaTopNTask Used times :" + (end - begin)/1000 + " seconds");
	   }catch(Exception e){
		 logger.error("职住来源TOP区域： ", e);
		 System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
	   }
	   System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	/**
	 * 
	 * @param inputFile  输入文件路径
	 * @param outputFile 输出文件路径
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings("rawtypes")
	public static Boolean execute(String inputFile, String outputFile,String cityName) throws Exception {
		logger.info("ProjectAreaTopNTask start....");
	    BufferedReader br = null;
	    BufferedWriter bw = null;
		FileReader fr = null;
		FileWriter fw = null;
	    try {
	    	ProjectAreaTopNTransfer transfer = new ProjectAreaTopNTransfer(cityName);
	    	fr = new FileReader(inputFile);
	    	fw = new FileWriter(outputFile);
            br = new BufferedReader(fr);
            bw = new BufferedWriter(fw);
            String line = br.readLine();
            ProjectAreaTopN  areaTopN = null;
            long lineIndex = 1;
            while (null != line){
            	if(lineIndex % 1000 == 0){
            		logger.info("Deal line number =" + lineIndex);
            		bw.flush();
            	}
                //读取位置信息，转换为项目信息
            	areaTopN = transfer.transfer(line,lineIndex ++);
            	//写到文件上
            	write(bw,areaTopN);
                 
                line = br.readLine();
            }
            bw.flush();
        } catch (Exception e) {
            logger.error("ProjectAreaTopNTask failed! inputFile=" + inputFile + "   outputFile=" + outputFile,e);
            logger.info("ProjectAreaTopNTask end with exception....");
        }finally {
            FileUtil.close(br,bw,fr,fw);
        }
	    logger.info("ProjectAreaTopNTask end....");
		return true;
	}

	/**
	 * 输出到文件上，然后导入到hive中
	 * @param writer
	 * @throws IOException
	 */
    private static void write(BufferedWriter writer,ProjectAreaTopN areaTopN) throws IOException{
    	if(null != areaTopN){
			writer.append(areaTopN.getAreaName()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
			writer.append(areaTopN.getAreaType()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
			writer.append(areaTopN.getLatitude()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
			writer.append(areaTopN.getLongtitude()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
    	}
    }
}
