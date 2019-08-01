package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.EtlErrorRecord;
import com.talkingdata.datacloud.page.admin.EtlErrorRecordPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>ETL错误记录 EtlErrorRecordDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EtlErrorRecordDao extends BaseDao<EtlErrorRecord> {
	int updateErrorCountById(Integer id);
	
	public int queryWithSearchByCount(EtlErrorRecordPage page);
	
	public List<EtlErrorRecord> queryWithSearchByList(EtlErrorRecordPage page);
}
