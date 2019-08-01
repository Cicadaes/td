package com.talkingdata.datacloud.dao.catalog;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.catalog.Catalog;
import com.talkingdata.datacloud.page.catalog.CatalogPage;

import java.util.List;
import java.util.Map;

/**
 *
 * <br>
 * <b>功能：</b>dict_catalog CatalogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CatalogDao extends BaseDao<Catalog> {
    List<Catalog> queryByListWithPrivilege(CatalogPage page);
    List<Catalog> queryUserDirs(Map<String, String> params);
    List<Catalog> queryPermissionDirs(Map<String, String> params);
    List<Catalog> queryByListWithIds(CatalogPage page);
    Catalog queryCatalogWithParentByID(Integer id);
    void updateNullStorageTypeByID(Catalog catalog);
}
