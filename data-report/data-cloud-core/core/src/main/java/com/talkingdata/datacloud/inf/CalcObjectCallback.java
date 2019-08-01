package com.talkingdata.datacloud.inf;

import java.util.Map;

public interface CalcObjectCallback {

	/**
	 * 构建azkaban调度任务计算需要参数,该方法由monitor调用，返回给azkaban，初始化flow上下文
	 * 
	 * @param bizObjectId
	 * @throws Exception
	 */
	Map<String,Object> buildInputParam(String bizObjectId)  throws Exception;
	
	/**
	 * 更新业务对象信息
	 * 
	 * @param bizObjectId
	 * @param calcStatus
	 * @throws Exception
	 */
	void updateBizObject(String bizObjectId, int calcStatus)  throws Exception;
}
