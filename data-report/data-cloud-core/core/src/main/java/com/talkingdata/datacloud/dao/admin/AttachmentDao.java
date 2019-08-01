package com.talkingdata.datacloud.dao.admin;

import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.Attachment;

/**
 * 
 * <br>
 * <b>功能：</b>附件 AttachmentDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AttachmentDao extends BaseDao<Attachment> {
	
	public Attachment getByCalcId(String calcId);
	
	int deleteByExcludesTenantIds(@Param(value = "tenantIds") String[] tenantIds);
}
