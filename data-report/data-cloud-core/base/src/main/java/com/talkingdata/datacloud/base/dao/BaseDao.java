package com.talkingdata.datacloud.base.dao;

import java.util.List;

import com.talkingdata.datacloud.base.entity.BaseEntity;
import com.talkingdata.datacloud.base.page.BasePage;

/**
 * 2016-12-28 copy from dmp
 */
public interface BaseDao<T extends BaseEntity> {

    int insert(T record);

    int updateByPrimaryKey(T record);

    int updateByPrimaryKeySelective(T record);

    T selectByPrimaryKey(Object id);

    int deleteByPrimaryKey(Object id);

    public int queryByCount(BasePage page);

    public List<T> queryByList(BasePage page);

}
