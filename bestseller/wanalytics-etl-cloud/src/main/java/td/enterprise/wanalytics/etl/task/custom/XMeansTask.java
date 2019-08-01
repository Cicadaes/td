package td.enterprise.wanalytics.etl.task.custom;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.bean.ServiceConf;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.BaseTask;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;


/**
 * Xmeans接口调用
 * @author junmin.li
 *
 */
public class XMeansTask extends BaseTask {
	public static Logger logger = Logger.getLogger(XMeansTask.class);
	
	private static long queryPeriod = Constant.CFG_STATUS_QUERY_PERIOD;
    private static int queryMaxNumber = Constant.CFG_STATUS_QUERY_MAX_NUMBER;
//    private static  ServiceInterfaceCallLogService logService =  null;
    
	public static void main(String[] args)  {
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("inputFile", "inputFile", true, "输入文件");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			options.addOption("maxClass", "maxClass", true, "最大分类数，x-means会选择小于这个值的最优分类");
			options.addOption("feature", "feature", true, "0,不带feature，1 带有feature");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			inputFile = line.getOptionValue("inputFile");
			outputFile = line.getOptionValue("outputFile");
			int feature = Integer.parseInt(line.getOptionValue("feature"));
			int maxClass = Integer.parseInt(line.getOptionValue("maxClass"));
			Boolean r = execute(inputFile, outputFile,maxClass,feature);
			long end = System.currentTimeMillis();
			logger.info("XMeansTask Used times :" + (end - begin)/1000 + " seconds");
		 }catch(Exception e){
			 logger.error("获取Lookalike失败： ", e);
			 System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
		 }
		 System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	@SuppressWarnings("rawtypes")
	public static Boolean execute(String inputFile, String outputFile,int maxClass,int feature) throws Exception {
		   try{
//			logService = ApplicationContextManager.getBean(ServiceInterfaceCallLogService.class);
		    File outFile = new File(outputFile);
		    ServiceConf conf =  SysConfigUtil.getServiceConfig(WifipixTaskConstant.X_MEANS_TASK_SUBMIT);
		    String appKey = conf.getAppkey();
		    String token = conf.getToken();
		    String serviceUrl = conf.getService();
        	Map<String,String> param = new HashMap<String,String> ();
        	
        	param.put(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_FILE_KEY, inputFile);//Xmeans
        	param.put(WifipixTaskConstant.FEATURE, "1");
        	param.put(WifipixTaskConstant.MAX_CLASS, maxClass + "");
        	param.put(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY,token);
        	param.put(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY,appKey );
//        	ServiceInterfaceCallLog serviceInterfaceCallLog = logService.createServiceInterfaceCallLog(WifipixTaskConstant.X_MEANS_TASK_SUBMIT, runDate, tenantId, projectId, crowdId, param, azkabanExecId,WifipixTaskConstant.TASK_TYPE_XMEANS);
//        	serviceCallLogId = serviceInterfaceCallLog.getId();
            String taskid = submitTask(inputFile,appKey,token,serviceUrl,maxClass, feature);
            String service = "XMeans接口" ;
            Integer macCount = FileUtil.getFileRowCount(inputFile);
            Boolean isSuccessed = queryTaskStatus(taskid,service,macCount);
//            logService.invokeServiceSuccess(serviceCallLogId, taskid,WifipixTaskConstant.TASK_STATUS_FINISH);
            if (isSuccessed) {
                logger.info("taskid : " + taskid + "  outputFilePath : " + outFile.getAbsolutePath());
                try{
                	 Boolean downloadSuccessed = downloadTaskFile(taskid, outFile.getAbsolutePath());
                     if (downloadSuccessed) {
//                     	logService.invokeServiceSuccess(serviceCallLogId, taskid,WifipixTaskConstant.TASK_STATUS_DOWNLOAD);
                         logger.info(" download sucessed ! taskid : " + taskid + "  outputFilePath : " + outFile.getAbsolutePath());
                     }else{
                    	 throw new Exception("文件下载失败  taskid=" + taskid);
                     } 
                }catch(Exception e){
                	logger.error("下载文件异常：", e);
//                	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,taskid,e);
                }
            } else {
//            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,taskid,new Exception("任务执行异常"));
                logger.error("query status not successed !");
            }
		   }catch(Exception e){
			   logger.error("任务执行失败:", e);
//			   logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,null, e);
			   throw e;
		   }

	    return false;
	}

	/**
	 *
	 * @param inputFile
	 * @param appkey
	 * @param token
	 * @param serviceUrl
	 * @param maxClass
	 * @param feature
	 * @return
	 * @throws Exception
	 */
	public static String submitTask(String inputFile,String appkey,String token,String serviceUrl,int maxClass,int feature) throws Exception {
	        Map  rsp = HttpUtil.SubmitPost(serviceUrl,
	                HttpUtil.getXmeansReqEntry(inputFile,token,appkey,maxClass, feature));
	        return checkHttpResponse(rsp);
	}
	
	 public static String checkHttpResponse(Map rsp) throws Exception {
	        if (null == rsp) {
//	        	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,null,new Exception("respone map is null!"));
	            throw new Exception("respone map is null!");
	        }
	        String msg = (String) rsp.get("msg");
	        String taskid = rsp.get("task_id") + "";
	        logger.info("msg : " + msg + "  taskid : " + taskid);
	        if ((msg != null && !"success".equals(msg)) || "".equals(taskid)) {
//	        	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD, null, new Exception("submit task failed !"));
	            throw new Exception("submit task failed !");
	        }
	        return taskid;
	 }
	 
	 /**
	  * 查询Task 状态 
	  * @param taskid
	  * @return
	  * @throws Exception
	  * @throws UnsupportedEncodingException
	  */
	 public static Boolean queryTaskStatus(String taskid,String service,Integer macCount) throws Exception {
	        Boolean isSuccessed = false;
	        Boolean queryContinue = true;
	        int queryNum = 0;
//	        ServiceConf serviceConf = WifipixTaskConstant.getService(WifipixTaskConstant.X_MEANS_TASK_STATUS);
		    ServiceConf serviceConf =  SysConfigUtil.getServiceConfig(WifipixTaskConstant.X_MEANS_TASK_STATUS);
	        Date submitTime = new Date();
	        boolean isSendEmail = false;
	        while (queryContinue) {
	            try {
	                Thread.sleep(queryPeriod);
	            } catch (InterruptedException e) {
	                logger.info("thread sleep interrupted ! ", e);
	            }
//	            if(isSendEmail == false){
//	            	isSendEmail = AlarmEmailUtil.sendEmail(taskid, service, projectId,crowdId,submitTime,macCount);
//	            }
	            Map rsp = HttpUtil.SubmitGet(HttpUtil.getLookalikeTaskStatusReqUrl(serviceConf.getService(),taskid,serviceConf.getAppkey(),serviceConf.getToken()));
	            if (null == rsp) {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,taskid,new Exception("respone map is null!"));
	                throw new Exception("respone map is null!");
	            }
	            Integer msg = Integer.parseInt(rsp.get("msg") + "");
	            logger.debug("msg : " + msg);
	            if (-1 == msg) {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,taskid, new Exception("task not exist !" + " taskid : " + taskid));
	                throw new Exception("task not exist !" + " taskid : " + taskid);
	            } else if (1 == msg) {
	                logger.info("task is running !" + " taskid : " + taskid);
	                if (queryNum >= queryMaxNumber) {
	                    queryContinue = false;
	                    logger.info("task is running ,but  queryMaxNumber reach!");
	                }
	            } else if (3 == msg) {
	                logger.info("task successed !" + " taskid : " + taskid);
	                queryContinue = false;
	                isSuccessed = true;
	            } else if (4 == msg) {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE, taskid, new Exception("task failed !" + " taskid : " + taskid));
	                logger.info("task failed !" + " taskid : " + taskid);
	                queryContinue = false;
	                isSuccessed = false;
	            } else {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE, taskid, new Exception(" query task status msg is error ! msg=" + msg));
	                throw new Exception(" query task status msg is error ! msg=" + msg);
	            }
	            queryNum++;

	        }
	        return isSuccessed;
	    }

	 public static Boolean downloadTaskFile(String taskid, String fileSaveAsPath) throws IOException {
		    ServiceConf conf =  SysConfigUtil.getServiceConfig(WifipixTaskConstant.X_MEANS_TASK_DOWNLOAD);
//		    ServiceConf conf = WifipixTaskConstant.getService(WifipixTaskConstant.X_MEANS_TASK_DOWNLOAD);
		    String appkeyValue = conf.getAppkey();
		    String tokenValue = conf.getToken();
		    String serviceUrl = conf.getService();
	        return HttpUtil.downloadLookalikeResultFile(taskid, fileSaveAsPath,tokenValue,appkeyValue,serviceUrl);
	 }
}
