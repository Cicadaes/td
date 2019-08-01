package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.SequenceSub;

/**
 * 
 * <br>
 * <b>功能：</b>序列 SequenceSubDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface SequenceSubDao extends BaseDao<SequenceSub> {
	/**
     * 获得当前的数字
     * @param sequenceSub 中只需要：seqSubName
     * @return
     */
    public Integer selectSeqSubCurrNum(SequenceSub sequenceSub);
    
    /**
     * 获得下一个数字
     * @param sequenceSub
     * @return 中只需要：seqSubName
     */
    public Integer selectSeqSubNextNum(SequenceSub sequenceSub);
    
    /**
     * 获得当前的序列号
     * @param sequenceSub 中只需要：seqSubName,connectSign
     * @return
     */
    public String selectSeqSubCurrVal(SequenceSub sequenceSub);
    
    /**
     * 获得下一个序列号
     * @param sequenceSub
     * @return 中只需要：seqSubName,connectSign
     */
    public String selectSeqSubNextVal(SequenceSub sequenceSub);
    
    /**
     * 设置序列号
     * @param sequenceSub 中只需要：seqSubName, curValue, remark connectSign
     * @return
     */
    public String selectSeqSubSetVal(SequenceSub sequenceSub);
	
}
