package td.enterprise.wanalytics.etl.task.position;


import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.FileUtil;


@SuppressWarnings({"FieldCanBeLocal", "SqlDialectInspection", "SqlNoDataSourceInspection", "WeakerAccess"})
@Slf4j
public class ProjectSaveCrowdAreaTask {
  private static String tenantId;
  private static String projectId;
  private static String crowdId;
  private static String crowdType;
  private static String crowdName;
  private static String projectType;
  private static String startDate;
  private static String endDate;
  private static String runDate;
  private static int areaType;// 1.小区，2.城市行政区
  private static int cycleStatistics = 30;
  private static int metricValue;

  private static final Connection conn2Analytics;
  private static String batchInsertDataToTenantTopAreaTemplate = "insert into TD_TENANT_TOP_AREA_COUNT " // insert result to heat map
      + "(tenant_id, project_id,crowd_id, run_date, area_type, metric_value, cycle_statistics, " +
      " start_date, end_date, area_name, project_type, crowd_type, crowd_name) " + "values (?,?,?,?,?,?,?,?,?,?,?,?,?)";

  static {
    conn2Analytics = DbWifianalyticsConn.getConnection();
  }

  public static void execute(String inputFile) throws SQLException {
    log.info("Entering to execute. inputFile:{}", inputFile);
    List<AreaEntity> areaEntityList = getDataFromDisk(inputFile);
    batchInsertDataToTopAreaTable(areaEntityList);
  }

  private static List<AreaEntity> getDataFromDisk(String file) {
    List<String> stringList = FileUtil.readFileAsList(file);
    return convertStringToAreaEntity(stringList);
  }

  private static List<AreaEntity> convertStringToAreaEntity(List<String> stringList) {
    List<AreaEntity> areaEntityList = new ArrayList<>();
    for (String string : stringList) {
      String[] split = string.split("\t");
      AreaEntity areaEntity = new AreaEntity();
      areaEntity.setAreaName(split[0]);
      areaEntity.setMetricValue(Integer.parseInt(split[1]));
      areaEntityList.add(areaEntity);
    }
    return areaEntityList;
  }

  public static void batchInsertDataToTopAreaTable(List<AreaEntity> data) throws SQLException {
    log.info("begin to batch insert data to TD_PROJECT_HEAT_MAP");
    log.info("project_id:{}, data size:{}", projectId, data.size());
    PreparedStatement inserts = conn2Analytics.prepareStatement(batchInsertDataToTenantTopAreaTemplate);
    int count = 0;
    for (AreaEntity aData : data) {
      count++;
      inserts.setString(1, tenantId);
      inserts.setString(2, projectId);
      inserts.setString(3, crowdId);
      inserts.setString(4, runDate);
      inserts.setInt(5, areaType);
      inserts.setInt(6, aData.getMetricValue());
      inserts.setInt(7, cycleStatistics);
      inserts.setString(8, startDate);
      inserts.setString(9, endDate);
      inserts.setString(10, aData.getAreaName());
      inserts.setInt(11, 1);
      inserts.setString(12, crowdType);
      inserts.setString(13, crowdName);
      log.debug("insert a row to mysql. data:{}" + aData.toString());

      inserts.addBatch();
      if (count % 200 == 0) {
        log.debug("batch insert data to mysql. num:{}", count % 200);
        inserts.executeBatch();
      }
    }
    inserts.executeBatch();
  }


  public static void main(String[] args) {
    Options options = new Options();
    options.addOption("i", "inputFile", true, "输入文件路径");
    options.addOption("p", "projectId", true, "projectId");
    options.addOption("c", "crowdId", true, "crowdId");
    options.addOption("t", "crowdType", true, "crowdType");
    options.addOption("n", "crowdName", true, "crowdName");
    options.addOption("s", "startDate", true, "startDate");
    options.addOption("e", "endDate", true, "endDate");
    options.addOption("r", "runDate", true, "runDate");
    options.addOption("a", "areaType", true, "areaType");
    options.addOption("t", "tenantId", true, "tenantId");

    String inputFile;

    CommandLineParser parser = new PosixParser();
    CommandLine line;
    try {
      line = parser.parse(options, args);
      inputFile = line.getOptionValue("inputFile");
      tenantId = line.getOptionValue("tenantId");
      projectId = line.getOptionValue("projectId");
      crowdId = line.getOptionValue("crowdId");
      crowdType = line.getOptionValue("crowdType");
      crowdName = line.getOptionValue("crowdName");
      startDate = line.getOptionValue("startDate");
      endDate = line.getOptionValue("endDate");
      runDate = line.getOptionValue("runDate");
      areaType = Integer.parseInt(line.getOptionValue("areaType"));


      log.info("inputFile:{}, tenant:{} projectId:{} crowdId:{} crowdType:{}, startDate:{} endDate:{} runDate:{}, areaType:{}",
          inputFile, tenantId, projectId, crowdId, crowdType, startDate, endDate, runDate, areaType);
//    String inputFile = "/Users/kayc/wanalytics/datafile/tmp/position_offset_2017-10-25/top/6047_770_residence.area";
      execute(inputFile);
    } catch (Exception e1) {
      e1.printStackTrace();
    }
  }
}

@SuppressWarnings("WeakerAccess")
@Data
@Builder
class AreaEntity {
  public AreaEntity() {
  }

  public AreaEntity(String tenantId, String projectId, String crowdId, String crowdType, String crowdName, String projectType, String startDate, String endDate, String runDate, String areaName, int areaType, int cycleStatistics, int metricValue) {
    this.tenantId = tenantId;
    this.projectId = projectId;
    this.crowdId = crowdId;
    this.crowdType = crowdType;
    this.crowdName = crowdName;
    this.projectType = projectType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.runDate = runDate;
    this.areaName = areaName;
    this.areaType = areaType;
    this.cycleStatistics = cycleStatistics;
    this.metricValue = metricValue;
  }

  private String tenantId;
  private String projectId;
  private String crowdId;
  private String crowdType;
  private String crowdName;
  private String projectType;
  private String startDate;
  private String endDate;
  private String runDate;
  private String areaName;
  private int areaType;// 1.小区，2.城市行政区
  private int cycleStatistics = 30;
  private int metricValue;
}


