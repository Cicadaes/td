package td.enterprise.dao;

import java.util.List;
import java.util.Map;


/**
 * @author Alex
 * Created by Alex on 2018/1/29.
 */
public interface ProjectIndexDao {

    int queryByCount(String projectId);

    /**
     * 批量更新
     */
    void batchUpdate(List<Map> list);

}
