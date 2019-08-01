package td.enterprise.wanalytics.etl.task.tag;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.DmkInputTypeEnum;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.common.tags.TagsDMKImpl;
import td.enterprise.wanalytics.etl.common.tags.TagsFeAsyncImpl;
import td.enterprise.wanalytics.etl.common.tags.TagsFtpAsyncImpl;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.File;
import java.util.HashMap;

/**
 * 获取客群标签
 */
@Slf4j
public class TagsDataGetTask {

    private static int IMPL = 10; //实现类的选择 10代表新的数据结构，11代表fe

    public static void main(String[] args){
        try{
            Options options = new Options();
            options.addOption("tenantId", "tenantId", true, "租户ID");
            options.addOption("date", "date", true, "运行时间");
            options.addOption("inputFile", "inputFile", true, "输入文件");
            options.addOption("outputFile", "outputFile", true, "输出文件");
            options.addOption("inputType", "inputType", true, "输入类型");

            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String tenantId = line.getOptionValue("tenantId");
            String date = line.getOptionValue("date");
            String inputFile = line.getOptionValue("inputFile");
            String outputFile = line.getOptionValue("outputFile");
            String inputType = line.getOptionValue("inputType");
            log.info("inputFile is " + inputFile);
            log.info("outputFile is " + outputFile);
            log.info("inputType is " + inputType);

            long t0 = System.currentTimeMillis();
            Boolean execute = execute(tenantId, date, inputFile, outputFile,inputType);
            long t1 = System.currentTimeMillis();
            log.info("----TagsDataGetTask Task is over.Used " + (t1 - t0) / 1000 + " seconds");
            if ( !execute ) {
                IMPL=1;
            }
        }catch (Exception e){
            log.error("TagsDataGetTask",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }

    }

    public static Boolean execute(String tenantId, String runDate, String inputFile, String outputFilePath,String inputType) {

    	String tagsGetWay = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.Tags_GET_WAY);

    	SyncFileExchangeInterface fileInterface= null;
    	if (WifipixTaskConstant.Tags_GET_FE.equals(tagsGetWay)) {
    		log.info("使用的实现类为 FeImpl");
    		fileInterface = new TagsFeAsyncImpl();
    		IMPL=11;
    	}else if (WifipixTaskConstant.Tags_GET_FTP.equals(tagsGetWay)) {
    		log.info("使用的实现类为 FTP");
    		fileInterface = new TagsFtpAsyncImpl(tenantId, runDate);
		}else if (WifipixTaskConstant.Tags_GET_DMK.equals(tagsGetWay)) {
    		log.info("使用的实现类为DMK");
            DmkInputTypeEnum type = DmkInputTypeEnum.getInstance(inputType);
    		fileInterface = new TagsDMKImpl(type);
		}else {
    		log.error("==【失败信息】=================================================================================================================");
    		log.error("DMP数据库中，Key="+ WifipixTaskConstant.TDID_GET_WAY+"[这条配置没有找到/没有匹配到]["+ WifipixTaskConstant.TDID_GET_FE+"/"+ WifipixTaskConstant.TDID_GET_DMP+"/"+ WifipixTaskConstant.TDID_GET_FTP+"]");
    		log.error("===================================================================================================================");
    		System.exit(1);
    	}

        log.info("TagsDataGetTask start ...");
        try {
            File outputFile = new File (outputFilePath);
            Response response = fileInterface.exchangeFile(new File(inputFile), outputFile, false,new HashMap());
            if (response.getCode() == Response.Status.SUCCESS) {
                //对标签中的内容进行转化，保持统一格式
                log.info("Get Tags Success!");
            } else {
                log.error("TagsDataGetTask status not successed !");
            }
        } catch (Exception e) {
            log.error("TagsDataGetTask not successed !", e);
            return false;
        }
        log.info("TagsDataGetTask end ...");

        return true;
    }


}
