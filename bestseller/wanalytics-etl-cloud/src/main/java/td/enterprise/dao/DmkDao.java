package td.enterprise.dao;

import td.enterprise.entity.DmkEntity;

import java.util.List;

/**
 * Created by Administrator on 2017/6/26.
 */
public interface DmkDao extends BaseDao {
    int insertList(List<DmkEntity> p);
}
