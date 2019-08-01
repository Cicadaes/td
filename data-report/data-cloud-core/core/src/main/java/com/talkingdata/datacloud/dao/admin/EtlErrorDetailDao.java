package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.EtlErrorDetail;

/**
 * 
 * <br>
 * <b>功能：</b>ETL错误明细 EtlErrorDetailDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EtlErrorDetailDao extends BaseDao<EtlErrorDetail> {
	
	public EtlErrorDetail getByEtlErrorRecordId(Integer etlErrorRecordId);
	
}
