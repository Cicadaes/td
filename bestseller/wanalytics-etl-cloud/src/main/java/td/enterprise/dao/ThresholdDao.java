package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.Project;
import td.enterprise.entity.Threshold;

public interface ThresholdDao extends BaseDao<Threshold> {

    List<Threshold> queryListByProject(Project p);
}
