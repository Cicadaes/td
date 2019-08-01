package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

import java.io.*;
import java.util.List;

/**
 * 线下采集地理位置批处理代码迁移
 *  区域来源和职住来源 生成。其中职住来源，生成数据后，通过hive 导出到文件，然后再导入到mysql中。区域来源也是类似.
 *  生成hive临时表 td_project_poi_temp_${projectid}
 * projectId, tdid,mac ,longtitude,latitude, workday, hour,  count , begindate,  enddate, regionname,regiontype
 */
public class PositionFilterTask {
	
	public static Logger logger = Logger.getLogger(PositionFilterTask.class);
	
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
			Boolean r = execute(cityName, inputFile,outputFile);
			long end = System.currentTimeMillis();
			logger.info("PositionFilterTask Used times :" + (end - begin)/1000 + " seconds");
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}

	
	/**
	 * 
	 * @param inputFile  输入文件路径
	 * @param cityName
	 * @param outputFile 输出文件路径
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings("rawtypes")
	public static Boolean execute(String cityName,String inputFile, String outputFile) throws Exception {
		logger.info("PositionFilterTask start....");
	    BufferedReader br = null;
	    BufferedWriter bw = null;
		FileReader fr = null;
		FileWriter fw = null;
	    if(StringUtils.isEmpty(cityName)){
	    	 throw new RuntimeException("【 " + cityName + "】城市为空");
	    }
	    try {
	    	fr = new FileReader(inputFile);
	    	fw = new FileWriter(outputFile);
	    	ProjectPositionTransfer transfer = new ProjectPositionTransfer();
            br = new BufferedReader(fr);
            bw = new BufferedWriter(fw);
            String line = br.readLine();
            List<ProjectPosition> list = null;
            while (null != line){
                //读取位置信息，转换为项目信息
            	list = transfer.transfer(line,cityName);
            	//写到文件上
            	write(bw,list);
                 
                line = br.readLine();
            }
          
        } catch (Exception e) {
            logger.error("PositionFilterTask failed! inputFile=" + inputFile + "outputFile=" + outputFile ,e);
            logger.info("PositionFilterTask end with exception....");
        }finally {
            FileUtil.close(br,bw,fr,fw);
        }
	    logger.info("PositionFilterTask end....");
		return true;
	}

	/**
	 * 输出到文件上，然后导入到hive中
	 * @param writer
	 * @param list
	 * @throws IOException
	 */
    private static void write(BufferedWriter writer,List<ProjectPosition> list) throws IOException{
    	if(null != list && list.isEmpty() == false){
    		for(ProjectPosition pp : list){
    			//忽略掉没有取到地区的 数据
    			writer.append(pp.getTdId()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getMac()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getLongtitude()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getLatitude()).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getDayType() + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getHour() + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getHourType() + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append(pp.getMetricValue() + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
                writer.append((pp.getRegionName() == null ?  "": pp.getRegionName() )).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append((pp.getRegionType() == null ?  "": pp.getRegionType() ) ).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append((pp.getBd09Longtitude() == null ?  "": pp.getBd09Longtitude() ) ).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append((pp.getBd09Latitude() == null ?  "": pp.getBd09Latitude() ) ).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
    			writer.append((pp.getBussinessName() == null ?  "": pp.getBussinessName() ) ).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
    			writer.flush();
    		}
    	}
    }
}
