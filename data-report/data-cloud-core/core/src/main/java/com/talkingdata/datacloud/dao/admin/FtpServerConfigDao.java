package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.FtpServerConfig;
import com.talkingdata.datacloud.page.admin.FtpServerConfigPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>Ftp服务器配置信息 FtpServerConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface FtpServerConfigDao extends BaseDao<FtpServerConfig> {
	public FtpServerConfig selectByCode(String code);
	
	public List<FtpServerConfig> queryByFtpServerConfig(FtpServerConfig ftpServerConfig);
	
	public Integer queryWithSearchByCount(FtpServerConfigPage page);
	
	public List<FtpServerConfig> queryWithSearchByList(FtpServerConfigPage page);
}
