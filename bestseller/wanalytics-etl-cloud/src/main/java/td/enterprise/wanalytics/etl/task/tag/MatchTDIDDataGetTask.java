package td.enterprise.wanalytics.etl.task.tag;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;

import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.tdid.IDMappingDMKImpl;
import td.enterprise.wanalytics.etl.common.tdid.TdidFeAsyncImpl;
import td.enterprise.wanalytics.etl.common.tdid.TdidFtpAsyncImpl;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;

import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.*;
import java.util.HashMap;

/**
 * 根据 mac id 返回mac 和 tdid 对应关系文件
 * @author weiguang.liu
 */
@Slf4j
public class MatchTDIDDataGetTask {

    public static Logger logger = Logger.getLogger(MatchTDIDDataGetTask.class);

    public static void main(String[] args) {
        try {
            long start = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("t", "tenantId", true, "租户id");
            options.addOption("d", "date", true, "时间");
            options.addOption("r", "inputFile", true, "输入文件");
            options.addOption("r", "outputFile", true, "输出文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String tenantId = line.getOptionValue("tenantId");
            String runDate = line.getOptionValue("date");

            String inputFile = line.getOptionValue("inputFile");
            String outputFile = line.getOptionValue("outputFile");

            log.info("inputFile is " + inputFile);
            log.info("outputFile is " + outputFile);
            execute(tenantId, runDate, inputFile, outputFile);
            long end = System.currentTimeMillis();
            log.info("用时:" + (end- start)/1000 + "秒");
        } catch (Exception e) {
            log.error("匹配TDID失败： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    @SuppressWarnings("deprecation")
	public static Boolean execute(String tenantId, String runDate, String inputFile, String outputFile) throws Exception {

        String tdidGetWay = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_GET_WAY);

        //mac tdid接口 ，上传mac地址，返回mac tdid 映射关系
    	SyncFileExchangeInterface idmapping = null;

        logger.info("获取数据接口类型为[" + tdidGetWay + "]");

    	if (WifipixTaskConstant.TDID_GET_FE.equals(tdidGetWay)) {
    		log.info("使用的实现类为 FeImpl");
    		idmapping = new TdidFeAsyncImpl();
    	}else if (WifipixTaskConstant.TDID_GET_FTP.equals(tdidGetWay)) {
    		log.info("使用的实现类为 FTP");
    		idmapping = new TdidFtpAsyncImpl(tenantId, runDate);
		}else if (WifipixTaskConstant.TDID_GET_DMK.equals(tdidGetWay)) {
    		log.info("使用的实现类为DMK");
    		idmapping = new IDMappingDMKImpl();
		}else {
    		log.error("==【失败信息】=================================================================================================================");
    		log.error("DMP数据库中，Key="+ WifipixTaskConstant.TDID_GET_WAY+"[这条配置没有找到/没有匹配到]["+ WifipixTaskConstant.TDID_GET_FE+"/"+ WifipixTaskConstant.TDID_GET_DMP+"/"+ WifipixTaskConstant.TDID_GET_FTP+"]");
    		log.error("===================================================================================================================");
    		System.exit(1);
    	}

        File outFile = new File( outputFile );
        File macFile = new File(inputFile) ;
        Response response = idmapping.exchangeFile(macFile,outFile,false,new HashMap());

        //调用接口返回成功
        if (response.getCode() == Response.Status.SUCCESS) {
//            String unzipFileName = outputFile.replaceAll(".gz","");
//            FileUtil.unzipGz(outFile, new File(unzipFileName));
        } else {
            logger.error("MatchTDIDDataGetask status not successed !");
            throw new Exception("MatchTDID失败：" + response.getMsg());
        }
        return true;
    }

}
