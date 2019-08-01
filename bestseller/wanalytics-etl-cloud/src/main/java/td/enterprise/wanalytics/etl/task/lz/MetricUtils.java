package td.enterprise.wanalytics.etl.task.lz;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.Project;
import td.enterprise.entity.Sensor;
import td.enterprise.entity.Threshold;
import td.enterprise.service.ProjectService;
import td.enterprise.service.SensorService;
import td.enterprise.service.ThresholdService;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

@Slf4j
public class MetricUtils {
    /**
     * 批处理大小
     */
    public static final Integer BATCH_SIZE = 2000;

    private static String       queryUrl   = null;
    static {
        try {
            queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
            //queryUrl = "http://172.23.4.137/wifianalytics-queryengine/api/query";
            //queryUrl = "http://10.150.34.6/wifianalytics-queryengine/api/query";
        } catch (Exception e) {
            log.error("MetricUtils初始化异常:", e);
        }
    }

    /**
     * 获取所有店铺 
     * @return
     */
    public static Map<String, Project> queryAllProjects() {
        Map<String, Project> allProjects = null;
        List<Project> list = null;
        SqlSession sqlSession = null;
        Project qp = new Project();
        qp.setStatus(1);
        qp.setProjectType(1);
        try {
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession();
            list = ProjectService.queryByList(sqlSession, qp);
        } catch (Exception e) {
            log.error("queryAllProjects异常", e);
        } finally {
            if (null != sqlSession) {
                sqlSession.close();
            }
        }
        if (null == list || list.isEmpty()) {
            log.error("queryAllProjectsError,projects is empty");
            return null;
        }
        allProjects = new HashMap<>(list.size());
        for (Project p : list) {
            allProjects.put(String.valueOf(p.getId()), p);
        }
        return allProjects;
    }

    /**
     * 所有店铺阈值设置
     * @return
     *
     */
    public static Map<String, Threshold> queryAllProjectsThreshold() {
        Map<String, Threshold> result = null;
        List<Threshold> list = null;
        SqlSession sqlSession = null;
        Project qp = new Project();
        qp.setStatus(1);
        qp.setProjectType(1);
        try {
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession();
            list = ThresholdService.queryListByProject(sqlSession, qp);
        } catch (Exception e) {
            log.error("queryAllProjectsThreshold异常", e);
        } finally {
            if (null != sqlSession) {
                sqlSession.close();
            }
        }
        if (null == list || list.isEmpty()) {
            return null;
        }
        result = new HashMap<>(list.size());
        for (Threshold t : list) {
            result.put(String.valueOf(t.getProjectId()), t);
        }
        return result;
    }

    /**
     * 获取有效探针 去除":"号，并且转换成小写
     * @return
     */
    public static Map<String, Sensor> queryAllSensor() {
        Map<String, Sensor> allSensors = null;
        List<Sensor> list = null;
        SqlSession sqlSession = null;
        Sensor q = new Sensor();
        q.setStatus(1);
        try {
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession();
            list = SensorService.queryByList(sqlSession, q);
        } catch (Exception e) {
            log.error("queryAllSensor异常", e);
        } finally {
            if (null != sqlSession) {
                sqlSession.close();
            }
        }
        if (null == list || list.isEmpty()) {
            log.error("queryAllSensor,sensors is empty");
            return null;
        }
        allSensors = new HashMap<>(list.size());
        for (Sensor s : list) {
            if (StringUtils.isNotEmpty(s.getSensorMac())) {
                allSensors.put(s.getSensorMac().replaceAll(":", "").toLowerCase(), s);
            }
        }
        return allSensors;
    }

    private static QueryEngineResult queryEngine(String scriptSql, Object... params) {
        String script = null;
        QueryEngineResult result = null;
        script = String.format(scriptSql, params);
        result = QueryServiceUtils.invoke("post", queryUrl, script);
        if (null == result) {
            result = new QueryEngineResult();
            result.setResults(new ArrayList<ResultBean>());
        }
        return result;
    }

    /**
     * @param dateStr
     * @param scriptSql
     * @return
     */
    public static Map<String, Integer> queryMetricDateMap(String dateStr, String scriptSql) {
        List<ResultBean> rl = queryEngine(scriptSql, dateStr).getResults();

        Map<String, Integer> rm = new HashMap<>(rl.size());
        for (ResultBean rb : rl) {
            rm.put(rb.getKey(), Integer.parseInt(String.valueOf(rb.getValue())));
        }
        return rm;
    }

    /**
     * @param dateStr
     * @param hour
     * @param scriptSql
     * @return
     */
    public static Map<String, Integer> queryMetricDateAndHourMap(String dateStr, Integer hour, String scriptSql) {
        List<ResultBean> rl = queryEngine(scriptSql, dateStr, hour).getResults();

        Map<String, Integer> rm = new HashMap<>(rl.size());
        for (ResultBean rb : rl) {
            rm.put(rb.getKey(), Integer.parseInt(String.valueOf(rb.getValue())));
        }
        return rm;
    }

    public static List<Integer> queryEngineOffset(String scriptSql, Object... params) {
        String script = null;
        List<Integer> result = null;
        script = String.format(scriptSql, params);
        result = QueryServiceUtils.invokeForOffset("post", queryUrl, script);
        if (null == result) {
            result = new ArrayList<>();
        }
        return result;
    }
}
