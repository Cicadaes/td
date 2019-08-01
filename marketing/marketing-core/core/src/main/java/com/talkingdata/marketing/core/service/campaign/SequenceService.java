package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.SequenceDao;
import com.talkingdata.marketing.core.entity.campaign.Sequence;
import com.talkingdata.marketing.core.entity.dto.SequenceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * 
 * <br>
 * <b>功能：</b>序列 SequenceService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("sequenceService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SequenceService extends BaseService<Sequence, Integer> {
	public final static Logger logger = LoggerFactory.getLogger(SequenceService.class);
	
	@Autowired
	private SequenceDao dao;

	@Override
    public SequenceDao getDao() {
		return dao;
	}
	
	/**
     * 得到序列的当前值 
     * @param sequence (通过seqName获取)
     * @return
     */
	public String selectSeqCurrVal(Sequence sequence) {
		return dao.selectSeqCurrVal(sequence);
	}
    
    /**
     * 获得下一个序列值
     * @param sequence (通过seqName获取)
     * @return
     */
	public SequenceDto selectSeqNextVal(Sequence sequence) {
		return dao.selectSeqNextVal(sequence.getSeqName(),System.currentTimeMillis());
	}
    
    /**
     * 设置序列的起始值
     * @param sequence(通过seqName, increment)
     * @return
     */
	public String selectSeqSetVal(Sequence sequence) {
		return dao.selectSeqSetVal(sequence);
	}
}
