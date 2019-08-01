package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.FtpClientConfig;

/**
 * 
 * <br>
 * <b>功能：</b>客户端配置 FtpClientConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface FtpClientConfigDao extends BaseDao<FtpClientConfig> {
	public FtpClientConfig selectByCode(String code);
}
