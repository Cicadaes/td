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
import td.enterprise.wanalytics.etl.util.PositionUtil;
import td.enterprise.wanalytics.etl.util.PositionUtil.Gps;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.DecimalFormat;
import java.util.Map;

/**
 * 用户到项目中心距离计算
 * @author junmin.li
 *
 */
public class ProjectDistanceTask {

	private static final Logger logger = Logger.getLogger(ProjectDistanceTask.class);
	
	private final static double distance = 8000; //按照1000000米外不用算100KM外，忽略计算
	
	public static void main(String[] args) {
		try{

			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("projectId", "projectId", true, "项目ID");
			options.addOption("inputFile", "inputFile", true, "坐标点文件");
			options.addOption("outputFile", "outputFile", true, "计算结果输出文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String projectId = line.getOptionValue("projectId");
			String inputFile = line.getOptionValue("inputFile");
			String outputFile = line.getOptionValue("outputFile");
			logger.info("================ projectId=" + projectId + " inputFile=" + inputFile + " outputFile=" + outputFile);
			execute(Integer.parseInt(projectId),inputFile,outputFile);
			long end = System.currentTimeMillis();
			logger.info("ProjectDistanceTask Used times :" + (end - begin)/1000 + " seconds");
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}
	
	public static void execute(int projectId,String inputFile,String outputFile) throws Exception{
		logger.info("ProjectDistanceTask start....");
	    BufferedReader br = null;
	    BufferedWriter bw = null;

        String sql = "select longitude,latitude,project_name from TD_PROJECT where id=" + projectId;
        Map<String,Object> map = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);

	    if(map == null || null == map.get("longitude")  ||  null ==  map.get("latitude")){
	    	throw new Exception("未找到项目或者项目中心坐标为空，projectId=" + projectId);
	    }

        String projectLatitude = map.get("latitude")   + "";//百度坐标
        String projectLongitude = map.get("longitude")  + "" ;
	    
	    Gps gps =  PositionUtil.bd09_To_Gps84(Double.parseDouble(projectLatitude), Double.parseDouble(projectLongitude));
	    if(gps == null){
	    	throw new Exception("项目中心坐标转化为GPS坐标失败：projectLatitude=" + projectLatitude + " projectLongitude=" + projectLongitude);
	    }
	    try {
            br = new BufferedReader(new FileReader(inputFile));
            bw = new BufferedWriter(new FileWriter(outputFile));
            String line = br.readLine();
            long lineIndex = 1;
            DecimalFormat format = new DecimalFormat("0");
            while (null != line){
            	if(lineIndex % 1000 == 0){
            		logger.info("已处理行数 =" + lineIndex);
            		bw.flush();
            	}
            	if(StringUtils.isBlank(line)){
            		continue;
            	}
            	String values [] = line.split("\t");
            	String longtitude = values[0];//GPS坐标
            	String latitude = values[1];
            	String hourType = values[2];
            	
            	double tempDistance = PositionUtil.lantitudeLongitudeDist(Double.parseDouble(longtitude), Double.parseDouble(latitude), gps.getWgLon(), gps.getWgLat());
                line = br.readLine();
                //小于指定结果，记录到文件中
                if( tempDistance < distance ){
            		bw.append(longtitude).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
            		bw.append(latitude).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
            		bw.append(hourType).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
            		bw.append(format.format(tempDistance)).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
            	}
            }
            bw.flush();
        } catch (Exception e) {
            logger.error("ProjectDistanceTask failed! inputFile=" + inputFile + "outputFile=" + outputFile,e);
        }finally {
        	FileUtil.close(br);
        	FileUtil.close(bw);
        }
	    logger.info("ProjectDistanceTask end....");
	}

}

