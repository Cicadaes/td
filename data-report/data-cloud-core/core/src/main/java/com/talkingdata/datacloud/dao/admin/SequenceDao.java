package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.Sequence;

/**
 * 
 * <br>
 * <b>功能：</b>序列 SequenceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface SequenceDao extends BaseDao<Sequence> {
	/**
     * 得到序列的当前值 
     * @param sequence (通过seqName获取)
     * @return
     */
	public String selectSeqCurrVal(Sequence sequence);
    
    /**
     * 获得下一个序列值
     * @param sequence (通过seqName获取)
     * @return
     */
	public String selectSeqNextVal(Sequence sequence);
    
    /**
     * 设置序列的起始值
     * @param sequence(通过seqName, increment)
     * @return
     */
	public String selectSeqSetVal(Sequence sequence);
	
}
