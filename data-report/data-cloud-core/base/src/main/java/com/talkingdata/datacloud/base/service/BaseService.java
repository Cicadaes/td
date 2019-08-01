package com.talkingdata.datacloud.base.service;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.base.entity.BaseEntity;
import com.talkingdata.datacloud.base.page.BasePage;

import java.util.List;

/**
 * 2016-12-28 copy from dmp
 */
public abstract class BaseService<T extends BaseEntity, K> {

    public abstract BaseDao<T> getDao();

    public int insert(T t) throws Exception {
        return getDao().insert(t);
    }

    public int updateByPrimaryKey(T t) throws Exception {
        return getDao().updateByPrimaryKey(t);
    }

    public int updateByPrimaryKeySelective(T t) throws Exception {
        return getDao().updateByPrimaryKeySelective(t);
    }

    public T selectByPrimaryKey(K value) throws Exception {
        return getDao().selectByPrimaryKey(value);
    }

    public void deleteByPrimaryKey(K value) throws Exception {
        getDao().deleteByPrimaryKey(value);
    }

    public int queryByCount(BasePage page) throws Exception {
        return getDao().queryByCount(page);
    }

    public List<T> queryByList(BasePage page) throws Exception {
        Integer rowCount = queryByCount(page);
        page.getPager().setRowCount(rowCount);
        return getDao().queryByList(page);
    }

    public T queryBySingle(BasePage page) throws Exception {
        page.setPageSize(1);
        List<T> results = getDao().queryByList(page);
        return null == results || results.size() == 0 ? null : results.get(0);
    }


}
