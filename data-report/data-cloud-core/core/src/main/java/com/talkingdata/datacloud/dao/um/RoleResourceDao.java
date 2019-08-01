package com.talkingdata.datacloud.dao.um;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.um.RoleResource;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>UM_ROLE_RESOURCE RoleResourceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface RoleResourceDao extends BaseDao<RoleResource> {
    List<RoleResource> getRoleResourceByCatalogId(Integer catalogId);
    List<RoleResource> getRoleResourceByCatalogIds(String catalogIds);
}
