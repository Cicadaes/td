package td.enterprise.dao;

/**
 * Created by Yan on 2017/3/6.
 * Dao操作基础类
 */


import td.enterprise.page.BasePage;

import java.util.List;

public interface BaseDao<T> {

    /**
     * 插入数据
     *
     * @param record
     * @return
     */
    int insert(T record);


    /**
     * 更新数据
     *
     * @param record
     * @return
     */
    int updateByPrimaryKey(T record);


    /**
     * @param record
     * @return
     */
    int updateByPrimaryKeySelective(T record);


    /**
     * 根据ID 获取数据
     *
     * @param id
     * @return
     */
    T selectByPrimaryKey(Object id);

    /**
     * 根据id 删除数据
     *
     * @param id
     * @return
     */
    int deleteByPrimaryKey(Object id);

    /**
     * 获取总数
     *
     * @param page
     * @return
     */
    int queryByCount(BasePage page);

    /**
     * 获取列表
     *
     * @param page
     * @return
     */
    List<T> queryByList(BasePage page);
}

