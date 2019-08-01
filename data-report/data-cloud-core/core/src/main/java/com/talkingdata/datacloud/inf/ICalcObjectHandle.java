package com.talkingdata.datacloud.inf;

import com.talkingdata.datacloud.entity.BaseCalcRecord;

/**
 * 负责计算对象状态的对象的调度,例如：CrowdModel,LookalikeCrowd,SystemTag对象的状态修改
 * @author yangtao
 */
public interface ICalcObjectHandle {

	public void fireClaclObjectChange(BaseCalcRecord baseCalcRecord) throws Exception;

}
