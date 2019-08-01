package td.enterprise.wanalytics.etl.common.position;

import org.apache.log4j.Logger;
import org.omg.CORBA.SystemException;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.position.PositionDataGetTask;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

/**
 * 调用数据中心接口，根据mac地址获取该批次mac地址对应的位置属性。具体执行步骤如下：
 * 1.	调用数据中心文件上传接口，将上一步骤导出的mac地址文件上传，请求数据进行位置匹配计算任务。
 * 2.	通过任务ID获取数据中心任务的执行状态。如果任务未运行完成，则等待60秒之后再继续查询任务的执行状态。如果任务运行异常，打印异常信息。如果任务运行完成，则退出任务执行状态检查。
 * 3.	通过数据中心文件下载接口获取任务的执行结果文件。
 * @author junmin.li
 *
 */
public class PositionFeAsyncImpl  implements SyncFileExchangeInterface {
	
	public Logger logger = Logger.getLogger(PositionDataGetTask.class);
	
	private static long queryPeriod = Constant.CFG_STATUS_QUERY_PERIOD;
    private static int queryMaxNumber = Constant.CFG_STATUS_QUERY_MAX_NUMBER;

	/**
	 * 上传文件
	 * @return
	 * @throws Exception
	 * @throws UnsupportedEncodingException
	 * @throws SystemException
	 */
	public String submitTask(File inputFile) throws Exception {
//		    ServiceConf conf = WifipixTaskConstant.getService(WifipixTaskConstant.TD_DMP_BATCH_TASK_SUBMIT);
//		    String appkeyValue = conf.getAppkey();
//		    String tokenValue = conf.getToken();
//	        Map  rsp = HttpUtil.SubmitPost(conf.getService(),
//                    HttpUtil.getFEBetchMacMatchPotionReqEntry(inputFile.getAbsolutePath(), tokenValue, appkeyValue));
//	        return checkHttpResponse(rsp);
        return  null;
	}
	
	 public  String checkHttpResponse(Map rsp) throws Exception {
//	        if (null == rsp) {
//	        	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,null,new Exception("respone map is null!"));
//	            throw new Exception("respone map is null!");
//	        }
//	        String msg = (String) rsp.get("msg");
//	        String taskid = rsp.get("taskid") + "";
//	        logger.info("msg : " + msg + "  taskid : " + taskid);
//	        if (!"ok".equals(msg) || "".equals(taskid)) {
//	        	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD, null, new Exception("submit task failed !"));
//	            throw new Exception("submit task failed !");
//	        }
//	        return taskid;
         return null;
	 }
	 
	 /**
	  * 查询Task 状态 
	  * @param taskid
	  * @return
	  * @throws Exception
	  * @throws UnsupportedEncodingException
	  */
	 public  Boolean queryTaskStatus(String taskid) throws Exception {
//	        Boolean isSuccessed = false;
//	        Boolean queryContinue = true;
//	        int queryNum = 0;
//	        ServiceConf serviceConf = WifipixTaskConstant.getService(WifipixTaskConstant.TD_DMP_BATCH_TASK_STATUS);
//	        while (queryContinue) {
//	            try {
//	                Thread.sleep(queryPeriod);
//	            } catch (InterruptedException e) {
//	                logger.info("thread sleep interrupted ! ", e);
//	            }
//	            Map rsp = HttpUtil.SubmitGet(HttpUtil.getFEBetchTaskStatusReqUrl(serviceConf.getService(), taskid, serviceConf.getAppkey(), serviceConf.getToken()));
//	            if (null == rsp) {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,taskid,new Exception("respone map is null!"));
//	                throw new Exception("respone map is null!");
//	            }
//	            Integer msg = (Integer) rsp.get("msg");
//	            logger.debug("msg : " + msg);
//	            if (-1 == msg) {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,taskid, new Exception("task not exist !" + " taskid : " + taskid));
//	                throw new Exception("task not exist !" + " taskid : " + taskid);
//	            } else if (1 == msg) {
//	                logger.info("task is running !" + " taskid : " + taskid);
//	                if (queryNum >= queryMaxNumber) {
//	                    queryContinue = false;
//	                    logger.info("task is running ,but  queryMaxNumber reach!");
//	                }
//	            } else if (3 == msg) {
//	                logger.info("task successed !" + " taskid : " + taskid);
//	                queryContinue = false;
//	                isSuccessed = true;
//	            } else if (4 == msg) {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE, taskid, new Exception("task failed !" + " taskid : " + taskid));
//	                logger.info("task failed !" + " taskid : " + taskid);
//	                queryContinue = false;
//	                isSuccessed = false;
//	            } else {
//	            	logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE, taskid, new Exception(" query task status msg is error ! msg=" + msg));
//	                throw new Exception(" query task status msg is error ! msg=" + msg);
//	            }
//	            queryNum++;
//
//	        }
//	        return isSuccessed;
         return true;
	    }

	 public  Boolean downloadTaskFile(String taskid, String fileSaveAsPath) throws IOException {
//		    ServiceConf conf = WifipixTaskConstant.getService(WifipixTaskConstant.TD_DMP_BATCH_TASK_SUBMIT);
//		    String appkeyValue = conf.getAppkey();
//		    String tokenValue = conf.getToken();
//	        return HttpUtil.downloadFEBetchTaskResultFile(taskid, fileSaveAsPath, tokenValue, appkeyValue);
         return true;
	 }
	 
	@Override
	public Response exchangeFile(File tdidGzFile, File outputFile, boolean isGzip,
			Map map) {
		Response response = new Response();
		try{
			String taskId = submitTask(tdidGzFile);
//			String service = "根据TDID获取地理位置";
//	        Integer macCount = FileUtil.getFileRowCount(tdidGzFile.getAbsolutePath().replaceAll(".gz", ""));
			Boolean isSuccessed = queryTaskStatus(taskId);
			if(isSuccessed ){
				try{
					boolean d = downloadTaskFile(taskId,outputFile.getAbsolutePath());
					if(d){
						response.setCode(Response.Status.SUCCESS);
					}else {
						response.setCode(Response.Status.ERROR);
					}
				}catch(Exception e){
                	logger.error("下载文件异常：", e);
                }
			}else{
				response.setCode(Response.Status.ERROR);
			}
		}catch(Exception e){
			logger.error("获取地理位置异常：", e);
			response.setMsg(e.getMessage());
			response.setCode(Response.Status.ERROR);
		}
		return response;
	}
	
	public static void main(String [] args ){
		PositionFeAsyncImpl t = new PositionFeAsyncImpl();
		File tdidFile = new File("E:/product_mac/tdid100.gz");
		File resultFile = new File("E:/product_mac/tdid100_position.gz");
		Response  response = t.exchangeFile(tdidFile, resultFile, true, new HashMap());
		if (response.getCode().getValue() == Response.Status.SUCCESS.getValue() ){
			System.out.println("Success");
		}else {
			System.out.println("Failure");
		}
	}

}
