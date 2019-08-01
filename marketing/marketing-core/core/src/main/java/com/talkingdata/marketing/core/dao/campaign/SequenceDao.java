package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.Sequence;
import com.talkingdata.marketing.core.entity.dto.SequenceDto;
import org.apache.ibatis.annotations.Param;

/**
 * <br>
 * <b>功能：</b>序列 SequenceDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface SequenceDao extends BaseDao<Sequence> {
    /**
     * 得到序列的当前值
     *
     * @param sequence (通过seqName获取)
     * @return string
     */
    public String selectSeqCurrVal(Sequence sequence);

    /**
     * 获得下一个序列值
     *
     * @param seqName     the seq name
     * @param currentTime the current time
     * @return sequence dto
     */
    public SequenceDto selectSeqNextVal(@Param("seqName") String seqName,@Param("currentTime") Long currentTime);

    /**
     * 设置序列的起始值
     *
     * @param sequence the sequence
     * @return string
     */
    public String selectSeqSetVal(Sequence sequence);
	
}
