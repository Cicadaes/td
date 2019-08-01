package td.enterprise.wanalytics.etl.common.tags;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.common.async.AsyncTaskInterface;
import td.enterprise.wanalytics.etl.bean.ServiceConf;
import td.enterprise.wanalytics.etl.common.error.BusinessException;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Map;

public class TagsFeAsyncImpl implements AsyncTaskInterface, SyncFileExchangeInterface {

    public static Logger logger = Logger.getLogger(TagsFeAsyncImpl.class);

    private static long queryPeriod = Constant.CFG_STATUS_QUERY_PERIOD;
    private static int queryMaxNumber = Constant.CFG_STATUS_QUERY_MAX_NUMBER;

    /**
     * @param taskid
     * @return
     * @throws BusinessException
     * @throws UnsupportedEncodingException
     */
    @SuppressWarnings("deprecation")
	@Override
	public Boolean queryTaskStatus(String taskid, String service, Integer macCount, Integer projectId,Integer crowdId)throws UnsupportedEncodingException{
        Boolean isSuccessed = false;
        Boolean queryContinue = true;
        int queryNum = 0;
        ServiceConf serviceConf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMP_BATCH_TASK_STATUS);
        Date submitTime = new Date();
        while (queryContinue) {
            try {
                Thread.sleep(queryPeriod);
            } catch (InterruptedException e) {
                logger.info("thread sleep interrupted ! ", e);
            }

            logger.debug(HttpUtil.getFEBetchTaskStatusReqUrl(serviceConf.getService(), taskid, serviceConf.getAppkey(), serviceConf.getToken()));
            @SuppressWarnings("rawtypes")
			Map rsp = HttpUtil.SubmitGet(HttpUtil.getFEBetchTaskStatusReqUrl(serviceConf.getService(), taskid, serviceConf.getAppkey(), serviceConf.getToken()));

            if (null == rsp) {
                throw new BusinessException("respone map is null!");
            }
            Integer msg = (Integer) rsp.get("msg");
            logger.debug("msg : " + msg);
            if (-1 == msg) {
                throw new BusinessException("task not exist !" + " taskid : " + taskid);
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
                logger.info("task failed !" + " taskid : " + taskid);
                queryContinue = false;
                isSuccessed = false;
            } else {
                throw new BusinessException(" query task status msg is error ! msg=" + msg);
            }
            queryNum++;
        }

        return isSuccessed;
    }


    /**
     * 下载任务执行结果
     *
     * @param taskid
     * @param fileSaveAsPath
     * @return
     * @throws IOException
     */
    @Override
    public Boolean downloadTaskFile(String taskid, String fileSaveAsPath) throws IOException {
        ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMP_BATCH_TASK_SUBMIT);
        String appkeyValue = conf.getAppkey();
        String tokenValue = conf.getToken();
        return HttpUtil.downloadFEBetchTaskResultFile(taskid, fileSaveAsPath, tokenValue, appkeyValue);
    }


    @SuppressWarnings("deprecation")
	@Override
    public String uploadTaskFile(String filePath) throws Exception {
        ServiceConf conf = SysConfigUtil.getServiceConfig(WifipixTaskConstant.TD_DMP_BATCH_TASK_SUBMIT);
        String appkeyValue = conf.getAppkey();
        String tokenValue = conf.getToken();
        @SuppressWarnings("rawtypes")
		Map rsp = HttpUtil.SubmitPost(conf.getService(),
                HttpUtil.getFEBetchTDIDMatchTagReqEntry(filePath, tokenValue, appkeyValue));
        if (null == rsp) {
            throw new BusinessException("respone map is null!");
        }
        String msg = (String) rsp.get("msg");
        String taskid = String.valueOf(rsp.get("taskid"));
        logger.info("msg : " + msg + "  taskid : " + taskid);
        if (!"ok".equals(msg) || StringUtils.isBlank(taskid)) {
            throw new BusinessException("submit MacMatchTag task failed !");
        }
        return taskid;
    }

	@Override
	public Response exchangeFile(File macFile, File outputFile, boolean isGzip, @SuppressWarnings("rawtypes") Map map) {
		Response response = new Response();
		try{
			String taskId = uploadTaskFile(macFile.getAbsolutePath());
			Integer projectId = (Integer)map.get("projectId");
			Integer macCount = (Integer)map.get("macCount");
			boolean status = queryTaskStatus(taskId, "MACTDID", macCount, projectId,0);
			if(status ){
				boolean d = downloadTaskFile(taskId,outputFile.getAbsolutePath());
				if(d){
					response.setCode(Response.Status.SUCCESS);
				}else {
					response.setCode(Response.Status.ERROR);
				}
			}else{
				response.setCode(Response.Status.ERROR);
			}
		}catch(Exception e){
			logger.error("MACTDID异常：", e);
			response.setMsg(e.getMessage());
			response.setCode(Response.Status.ERROR);
		}
		return response;
	}



}
