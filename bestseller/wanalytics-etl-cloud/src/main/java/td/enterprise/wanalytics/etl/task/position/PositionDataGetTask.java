package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.DmkInputTypeEnum;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.common.position.PositionDMKImpl;
import td.enterprise.wanalytics.etl.common.position.PositionFeAsyncImpl;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * 获取runDate 上个月对应的位置信息
 * @author junmin.li
 *
 */
public class PositionDataGetTask {

    public static Logger logger = Logger.getLogger(PositionDataGetTask.class);
	
	public static void main(String[] args)  {
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("runDate", "runDate", true, "执行日期");
			options.addOption("inputFile", "inputFile", true, "输入文件");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			options.addOption("inputType", "inputType", true, "输入文件类型");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String runDate = line.getOptionValue("runDate");
			String inputFile = line.getOptionValue("inputFile");
			String outputFile = line.getOptionValue("outputFile");
			String inputType = line.getOptionValue("inputType");
			Boolean r = execute(inputFile, outputFile,runDate,inputType);
			long end = System.currentTimeMillis();
			logger.info("PositionDataGetTask Used times :" + (end - begin)/1000 + " seconds");
		 }catch(Exception e){
			 logger.error("获取mac地址位置失败： ", e);
			 System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
		 }
		 System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	

	@SuppressWarnings("rawtypes")
	public static Boolean execute(String inputFile, String outputFile,String runDate,String inputType) throws Exception {
		String tagsGetWay = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.POSITION_GET_WAY);
    	SyncFileExchangeInterface fileInterface= null;
    	if (WifipixTaskConstant.POSITION_GET_FE.equals(tagsGetWay)) {
    		logger.info("position 使用的实现类为 FeImpl");
    		fileInterface = new PositionFeAsyncImpl();
    	}else if (WifipixTaskConstant.POSITION_GET_DMK.equals(tagsGetWay)) {
    		logger.info("使用的实现类为DMK");
			DmkInputTypeEnum type = DmkInputTypeEnum.getInstance(inputType);
			fileInterface = new PositionDMKImpl(type);
		}else {
    		logger.error("==【失败信息】=================================================================================================================");
    		logger.error("DMP数据库中，Key="+ WifipixTaskConstant.POSITION_GET_FE+"[这条配置没有找到/没有匹配到][" + WifipixTaskConstant.POSITION_GET_FE+"/"+ WifipixTaskConstant.POSITION_GET_DMK+"]");
    		logger.error("===================================================================================================================");
    		System.exit(1);
    	}
        logger.info("PositionDataGetTask start ...");
        try {
        	Map<String,Object> map = new HashMap<String,Object>();
        	String month = DateUtil.getPreviousMonth(runDate);//获取上个月份
        	map.put("month", month);
            File outFile = new File(outputFile);
        	Response response = fileInterface.exchangeFile(new File(inputFile), outFile, false,map);
            if (response.getCode() == Response.Status.SUCCESS) {
//            	String unzipGzFilePath = unzipGzFile(outputFile);
//                logger.info("unzipGzFilePath : " + unzipGzFilePath);
            }else{
                logger.error("下载文件失败!");
            }
        } catch (Exception e) {
            logger.error("PositionDataGetTask not successed !", e);
            return false;
        }
        logger.info("PositionDataGetTask end ...");
        return true;
	}

	
}
