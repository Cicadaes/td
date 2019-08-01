package td.enterprise.service;

/**
 * Created by Yan on 2017/3/6.
 */

import org.springframework.web.multipart.MultipartFile;
import td.enterprise.dao.BaseDao;
import td.enterprise.page.BasePage;

import java.util.List;

public abstract class BaseService<T> {

    public abstract BaseDao<T> getDao();

    public int insert(T t) {
        return getDao().insert(t);
    }

    public int updateByPrimaryKey(T t) {
        return getDao().updateByPrimaryKey(t);
    }

    public int updateByPrimaryKeySelective(T t) {
        return getDao().updateByPrimaryKeySelective(t);
    }

    public T selectByPrimaryKey(Object id) {
        return getDao().selectByPrimaryKey(id);
    }

    public void deleteByPrimaryKey(Object... ids) {
        if (ids == null || ids.length < 1) {
            return;
        }
        for (Object id : ids) {
            getDao().deleteByPrimaryKey(id);
        }
    }

    public int queryByCount(BasePage page) {
        return getDao().queryByCount(page);
    }

    public List<T> queryByList(BasePage page) {
        Integer rowCount = queryByCount(page);
        page.getPager().setRowCount(rowCount);
        return getDao().queryByList(page);
    }

    public T queryBySingle(BasePage page) {
        page.setRows(1);
        List<T> results = getDao().queryByList(page);
        return null == results || results.size() == 0 ? null : results.get(0);
    }

}

