package td.enterprise.wanalytics.etl.task.counter;


import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.springframework.util.CollectionUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import td.enterprise.entity.Project;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

@SuppressWarnings({"FieldCanBeLocal", "SqlDialectInspection", "SqlNoDataSourceInspection"})
@Slf4j
public class SaveStayTimesToMysqlTask {
  private static Connection conn2Analytics;
  private static List<Map<String, Object>> allProject;
  private static String batchInsertDataToTDMetricOfflineDayTemplate = "insert into TD_METRIC_DAY_OFFLINE " // insert result to
      + "(interval_2,interval_5,interval_10,interval_15, project_id, project_type, project_name,  region, channel, brand, province, city, date) "
      + "values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
      + "ON DUPLICATE KEY UPDATE interval_2 = VALUES(interval_2),interval_5=VALUES(interval_5) ,interval_10=VALUES(interval_10), interval_15=VALUES(interval_15)";


  static {
    allProject = findAllProject();
  }


  private static void batchInsertDataToHeatMapTable(List<MetricDayOfflineEntity> data) throws SQLException {
    log.info("Entering to batch insert data to TD_METRIC_DAY_OFFLINE");
    log.info(" data size= " + data.size());
    PreparedStatement inserts = conn2Analytics.prepareStatement(batchInsertDataToTDMetricOfflineDayTemplate);
    int count = 0;
    for (MetricDayOfflineEntity entity : data) {
      count++;
      putValues(inserts, entity);
      inserts.addBatch();
      if (count % 200 == 0) {
        log.debug("batch insert data to mysql");
        inserts.executeBatch();
      }
    }
    inserts.executeBatch();
    inserts.close();
  }

  private static void putValues(PreparedStatement inserts, MetricDayOfflineEntity entity) throws SQLException {
    inserts.setInt(1, entity.getTime1());
    inserts.setInt(2, entity.getTime5());
    inserts.setInt(3, entity.getTime15());
    inserts.setInt(4, entity.getTime16());
    inserts.setInt(5, entity.getId());
    inserts.setInt(6, entity.getProjectType() == null ? 0 : entity.getProjectType());
    inserts.setString(7, entity.getProjectName());
    inserts.setString(8, entity.getRegion());
    inserts.setString(9, entity.getChannel());
    inserts.setString(10, entity.getBrand());
    inserts.setString(11, entity.getProvince());
    inserts.setString(12, entity.getCity());
    inserts.setString(13, entity.getDate());
  }

  private static List<MetricDayOfflineEntity> convertStringListToEntity(List<String> data) {
    List<MetricDayOfflineEntity> list = new ArrayList<>();
    for (String string : data) {
      MetricDayOfflineEntity entity = createEntity(string);
      list.add(entity);
    }
    return list;
  }

  private static MetricDayOfflineEntity createEntity(String string) {
    log.info("Entering to MetricDayOfflineEntity. string:{}", string);
    String[] values = string.split(",");
    int projectId = Integer.parseInt(values[1]);
    String date = values[2];
    int time1 = Integer.parseInt(values[11]);
    int time5 = Integer.parseInt(values[12]);
    int time15 = Integer.parseInt(values[13]);
    int time16 = Integer.parseInt(values[14]);
    Map<String, Object> project = getProjectById(projectId);
    if (CollectionUtils.isEmpty(project)) {
      log.error("Can not find project. project_id:{}", projectId);
    }

    MetricDayOfflineEntity entity = new MetricDayOfflineEntity();
    entity.setTime1(time1);
    entity.setTime5(time5);
    entity.setTime15(time15);
    entity.setTime16(time16);
    entity.setDate(date);
    entity.setId(projectId);
    entity.setProjectName(String.valueOf(project.get("project_name")));
    entity.setProjectType((Integer) project.get("project_type"));
    entity.setCity(String.valueOf(project.get("city")));
    entity.setProvince(String.valueOf(project.get("province")));
    entity.setChannel(String.valueOf(project.get("channel")));
    entity.setRegion(String.valueOf(project.get("region")));
    entity.setBrand(String.valueOf(project.get("brand")));
    return entity;
  }

  private static List<Map<String, Object>> findAllProject() {
    log.info("Entering to findAllProject");
    String sql = "select * from TD_PROJECT where status=1 ";
    List<Map<String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
    log.info("active project size:{}", list.size());
    return list;
  }

  private static Map<String, Object> getProjectById(int projectId) {
    for (Map<String, Object> map : allProject) {
      if (map.get("project_num") != null && map.get("project_num").toString().equals(projectId + "")) {
        return map;
      }
    }
    log.info("not find project. project_id:{}", projectId);
    return new HashMap<>();
  }

  public static void execute(String inputFile) throws SQLException {
    log.info("Entering to SaveStayTimesTOMysqlTask jod");
    List<String> data = FileUtil.readFileAsList(inputFile);
    List<MetricDayOfflineEntity> entityList = convertStringListToEntity(data);
    batchInsertDataToHeatMapTable(entityList);
  }

  public static void main(String[] args){
    Options options = new Options();
    options.addOption("i", "inputFile", true, "输入文件");
    options.addOption("d", "date", true, "日期");
    CommandLineParser parser = new DefaultParser();
    CommandLine cmd;
    String date = null; // 2017-10-11 pattern
    String inputFile = null;
    try {
      cmd = parser.parse(options, args);
      date = cmd.getOptionValue("date");
      inputFile = cmd.getOptionValue("inputFile");
      conn2Analytics = DbWifianalyticsConn.getConnection();
      log.info("date:{}, inputFile:{}", date, inputFile);
      execute(inputFile);
    } catch (Exception e1) {
      log.error("params error,date:{},inputFile:{}", date, inputFile, e1);
      e1.printStackTrace();
    } finally {
      try {
        conn2Analytics.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
  }
}

@EqualsAndHashCode(callSuper = true)
@Data
class MetricDayOfflineEntity extends Project {
  private int time1; // 0-2
  private int time5; // 2-5
  private int time15; // 5-15
  private int time16; // > 15
  private String date;

}
