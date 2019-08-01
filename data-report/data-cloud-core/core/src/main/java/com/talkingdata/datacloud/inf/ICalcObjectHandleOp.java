package com.talkingdata.datacloud.inf;

/**
 * 计算对象处理
 * @author Shuaibing.zhao
 *
 */
public interface ICalcObjectHandleOp {
	
	/**
	 * 校验计算对象是否已删除，true已删除，false未删除
	 * 
	 * @param bizObjectId
	 * @return
	 * @throws Exception
	 */
	public boolean checkCalcObjectIsDelete(String bizObjectId) throws Exception;
}
