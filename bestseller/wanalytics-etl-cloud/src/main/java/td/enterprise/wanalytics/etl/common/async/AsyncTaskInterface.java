package td.enterprise.wanalytics.etl.common.async;


import td.enterprise.wanalytics.etl.common.error.BusinessException;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public interface AsyncTaskInterface {
	/**
	 * 上传Mac文件，返回Taskid
	 * 
	 * @param filePath 文件路径
	 * @return 本次执行Taskid,用来查询、下载
	 * @throws Exception
	 */
	String uploadTaskFile(String filePath) throws Exception;
	
	
	/**
	 * 查询任务状态
	 * 
	 * @param taskid
	 * @param service
	 * @param macCount
	 * @param projectId
	 * @return
	 * @throws BusinessException
	 * @throws UnsupportedEncodingException
	 */
	Boolean queryTaskStatus(String taskid, String service, Integer macCount, Integer projectId, Integer crowdId)
			throws BusinessException, UnsupportedEncodingException;
	
	
	/**
	 * 下载TDID文件
	 * @param taskid
	 * @param outputFilePath
	 * @return
	 * @throws IOException
	 */
	Boolean downloadTaskFile(String taskid, String outputFilePath) throws Exception;
}
