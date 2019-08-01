package td.enterprise.wanalytics.etl.task.heatmap;


import com.google.common.base.Strings;

import com.alibaba.fastjson.JSON;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import td.enterprise.entity.Project;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.HttpClientUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;


@SuppressWarnings({"FieldCanBeLocal", "SqlDialectInspection", "SqlNoDataSourceInspection", "Duplicates", "WeakerAccess", "unchecked"})
@Slf4j
public class ProjectHeatMapTask {

  @SuppressWarnings("unused")
  private static final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
  private static final SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
  private static final SimpleDateFormat formatHour = new SimpleDateFormat("HH");
  private static DateTimeFormatter HOUR_PATTERN = DateTimeFormatter.ofPattern("yyyyMMddHH");
  private static DateTimeFormatter DAY_PATTERN = DateTimeFormatter.ofPattern("yyyyMMdd");
  private static Connection conn2Analytics;
  private static String remotePathPrefix = "/data/wifianalytics/bestseller/"; // 探针数据本地存储路径前缀
  private static String computeCoordinateUrl; // third part compute service url
  private static String queryProjectSqlTemplate = "select id,tenant_id from TD_PROJECT where status = 1 and project_type = 1";  // get project idList
  private static String queryProjectPlaceInfoSqlTemplate = "select corners from `TD_PROJECT_PLACE` where project_id = %d"; // get picture info of 1 project id
  private static String queryProjectProbeSqlTemplate = "select related_attribute, longitude, latitude from `TD_INSTALL_INFO` where project_id = %d and related_type = 3 and status = 1"; // get probe info
  private static String batchInsertDataToHeatMapSqlTemplate = "insert into TD_PROJECT_HEAT_MAP " // insert result to heat map
      + "(tenant_id,project_id,timestamp,date,hour,mac,x, y, in_room) " + "values (?,?,?,?,?,?,?,?,?)";

  static {
    conn2Analytics = DbWifianalyticsConn.getConnection();
    computeCoordinateUrl = HttpUtil.getParamFromConfigServer("heatmap.compute.url");
  }

  public static List batchComputeCoordinates(String computeCoordinateUrl, Map data) {
    log.info("Entering to batch compute coordinates. batch compute coordinates. compute service url:{}", computeCoordinateUrl);
    if (Strings.isNullOrEmpty(computeCoordinateUrl)) {
      log.error("computeCoordinateUrl is null");
      return new ArrayList();
    }
    if (data == null) {
      log.info("data is null");
      return new ArrayList();
    }
    return HttpClientUtil.postWithJson(computeCoordinateUrl, data, List.class);
  }

  public static void batchInsertDataToHeatMapTable(Integer tenantId,Integer projectId, List data) {
    try {
      log.info("Entering to batchInsertDataToHeatMapTable.  tenant_id:{},project_id:{}, data size:{}", tenantId,projectId, data.size());
      PreparedStatement inserts = conn2Analytics.prepareStatement(batchInsertDataToHeatMapSqlTemplate);
      int count = 0;
      for (Object aData : data) {
        count++;
        inserts.setInt(1,tenantId);
        inserts.setInt(2, projectId);
        ArrayList arrayList = (ArrayList) aData;
        for (int j = 0; j < arrayList.size(); j++) {
          if (j == 0) {
            long timestamp = (long) ((double) arrayList.get(j) * 1000);
            String hour = formatHour.format(timestamp);
            String date = formatDate.format(timestamp);
            inserts.setTimestamp(3, new Timestamp(timestamp));
            inserts.setString(4, date); //date
            inserts.setString(5, hour);  //hour
          } else if (j == 1) {
            inserts.setString(6, (String) arrayList.get(j)); //mac
          } else if (j == 2) {
            inserts.setDouble(7, (Double) ((ArrayList) (arrayList.get(j))).get(0));//x coordinate
            inserts.setDouble(8, (Double) ((ArrayList) (arrayList.get(j))).get(1));//y coordinate
          } else {
            inserts.setBoolean(9, Boolean.parseBoolean((String) arrayList.get(j))); // user location is in room?
          }
          log.debug("insert a row to mysql. data:{}", arrayList.get(j));
        }
        inserts.addBatch();
        if (count % 200 == 0) {
          log.debug("batch insert data to mysql");
          inserts.executeBatch();
        }
      }
      inserts.executeBatch();
      inserts.close();

    } catch (Exception e) {
      log.error("insert data to mysql error. projectId:{}, data:{}", projectId, data);
    }
  }

  public static void execute(String date, int hour) throws SQLException {
    log.info("Entering to execute");
    List<FTPLine> ftpLineList = getBeaconsData(date, hour);
    if (ftpLineList == null || ftpLineList.size() == 0) {
      log.info("ftpLineList is null or ftpLineList size = 0");
      return;
    }
    List<Project> list = queryProjectIdList();
    if (list == null) {
      log.info("project id list is null");
      return;
    }
    for (Project p : list) {  // 循环每个project
      Map param = createParam(ftpLineList, p.getId());
      if (param == null || param.size() == 0) {
        continue;
      }
      List computeResult = batchComputeCoordinates(computeCoordinateUrl, param);
      log.info("compute result size:{}", computeResult.size());
      batchInsertDataToHeatMapTable(Integer.parseInt(p.getTenantId()),p.getId(), computeResult);
      log.debug("insert records to db. projectId:{}, size:{}", p.getId(), computeResult.size());
    }
  }

  private static Map createParam(List<FTPLine> ftpLineList, Integer id) {
    log.info("Entering to createParam. project_id:{}", id);
    Map<String, Object> param = new HashMap<>();
    Map<String, Object> room = new HashMap<>();
    List corners = queryProjectPlaceCorners(id);
    if (corners == null || corners.size() == 0) {
      log.info("corners is null or corners size = 0. project_id:{}", id);
      return new HashMap();
    }
    Map<String, Object> beacons = queryProjectBeacons(id);
    if (beacons == null || beacons.size() == 0) {
      log.info("beacons is null or corners size = 0. project_id:{}", id);
      return new HashMap();
    }
    if (beacons.size() < 3) {
      beacons = getOneBeacon(beacons);
      log.info("beacons size < 3. get one beacon to calculate. project_id:{}, beacon:{}", id, beacons);
    }
    room.put("beacons", beacons);
    room.put("corners", corners);
    List filteredDataByAPMac = filterDataByProjectAPMac(ftpLineList, beacons.keySet()); // 根据beacons mac 地址过滤数据
    log.info("filterData size:{}", filteredDataByAPMac.size());

    if (filteredDataByAPMac.size() == 0) {
      log.info("filtered data is null or corners size = 0. project_id:{}", id);
      return new HashMap();
    }
    param.put("rssi", filteredDataByAPMac);
    param.put("room", room);
    return param;
  }

  private static Map<String, Object> getOneBeacon(Map<String, Object> beacons) {
    Set<String> keySet = beacons.keySet();
    Object[] objects = keySet.toArray();
    @SuppressWarnings("SuspiciousMethodCalls")
    List<String> value = (List<String>) beacons.get(objects[0]);
    HashMap<String, Object> map = new HashMap<>();
    map.put(objects[0].toString(), value);
    return map;
  }

  private static List<Map> filterDataByProjectAPMac(List<FTPLine> ftpLineList, Set beacons) {
    log.debug("Entering to filterDataByProjectAPMac");
    List<FTPLine> lineList = new ArrayList<>();
    for (FTPLine ftpLine : ftpLineList) {
      if (beacons.contains(ftpLine.getApMac())) {
        lineList.add(ftpLine);
      }
    }
    List<Map> mapList = convertFTPLineToMap(lineList);
    log.debug("record size:{} beacons macs:{}", mapList.size(), beacons);
    return mapList; // list元素为 map
  }

  private static Map<String, Object> queryProjectBeacons(Integer id) {
    log.debug("Entering to queryProjectBeacons");
    Statement statement;
    HashMap<String, Object> beacons = new HashMap<>();
    try {
      statement = conn2Analytics.createStatement();
      String sql = String.format(queryProjectProbeSqlTemplate, id);
      ResultSet resultSet = statement.executeQuery(sql);
      while (resultSet.next()) {
        String mac = resultSet.getString(1).replace(":", ""); // get mac, e.g. 1c:ab:34:7a:6b:a0, log文件为了压缩，没有:号
        double x = resultSet.getDouble(2);
        double y = resultSet.getDouble(3);
        beacons.put(mac, Arrays.asList(x, y));
      }
    } catch (SQLException e) {
      log.error("invoke queryProjectPlaceCorners error");
      e.printStackTrace();
    }
    return beacons;
  }

  private static List queryProjectPlaceCorners(Integer id) {
    log.debug("Entering queryProjectPlaceCorners");
    Statement statement;
    List corners = new ArrayList<>();
    try {
      statement = conn2Analytics.createStatement();
      String sql = String.format(queryProjectPlaceInfoSqlTemplate, id);
      ResultSet resultSet = statement.executeQuery(sql);
      while (resultSet.next()) {
        String temp = resultSet.getString(1);
        if (!Strings.isNullOrEmpty(temp)) {
          corners = JSON.parseObject(temp, List.class);
        }
      }
    } catch (SQLException e) {
      log.error("invoke queryProjectPlaceCorners error. projectId:{}", id);
      e.printStackTrace();
    }
    return corners;
  }

  /**
   *店铺id
   * @return
   */
  private static List<Project> queryProjectIdList() {
    log.info("Entering queryProjectIdList");
    Statement statement = null;
    ResultSet resultSet = null;
    List<Project> projectIdList = new ArrayList<>();
    try {
      statement = conn2Analytics.createStatement();
      resultSet = statement.executeQuery(queryProjectSqlTemplate);
      while (resultSet.next()) {
        Project p = new Project();
        p.setId(resultSet.getInt(1));
        p.setTenantId(resultSet.getInt(2) + "");
        projectIdList.add(p);  // get project id column
      }
    } catch (SQLException e) {
      log.error("queryProjectIdList error");
      e.printStackTrace();
    }finally {
      try{
        resultSet.close();
        statement.close();
      }catch(Exception e ) {}

    }
    return projectIdList;
  }

  public static List<FTPLine> getBeaconsData(String date, int hour) {
    log.debug("Entering getBeaconsData. date:{}, hour:{}", date, hour);
    String day_prefix;
    String hour_prefix;
    LocalDateTime localDateTime;
    LocalDateTime lastHourOfLocalDateTime;
    if (Strings.isNullOrEmpty(date)) {
      log.info("date is null");
      localDateTime = LocalDateTime.now();
      lastHourOfLocalDateTime = localDateTime.minusHours(1);
    } else {
      String[] split = date.split("-");
      lastHourOfLocalDateTime = LocalDateTime.of(Integer.parseInt(split[0]),
          Integer.parseInt(split[1]), Integer.parseInt(split[2]), hour, 20).minusHours(1);
    }
    day_prefix = lastHourOfLocalDateTime.format(DAY_PATTERN);
    hour_prefix = lastHourOfLocalDateTime.format(HOUR_PATTERN);

    String path = remotePathPrefix + day_prefix + "/" + hour_prefix;
    log.debug("file path:{}", path);

    List<FTPLine> beaconsDataFromDisk = getBeaconsDataFromDisk(path);
    log.debug("record size:{}", beaconsDataFromDisk.size());
    return beaconsDataFromDisk;
  }

  private static List<Map> convertFTPLineToMap(List<FTPLine> beaconsDataFromDisk) {
    List<Map> mapList = new ArrayList<>();
    for (FTPLine ftpLine : beaconsDataFromDisk) {
      Map<String, Object> map = new HashMap<>();
      map.put("rssi", ftpLine.getSignalStrength()); // 信号强度
      map.put("mac", ftpLine.getStationMac()); // 用户mac
      map.put("beacon", ftpLine.getApMac()); // 探针mac
      map.put("ts", ftpLine.getTime()); // 数据搜集时间
      mapList.add(map);
    }
    return mapList;
  }

  public static List<FTPLine> getBeaconsDataFromDisk(String path) {
    log.info("Entering getBeaconsDataFromDisk. path:{}", path);
    List<FTPLine> ftpLineList = new ArrayList<>();
    File directoryFile = new File(path);
    File[] listFiles = directoryFile.listFiles();
    if (listFiles == null || listFiles.length == 0) {
      log.info("file is null or file array length == 0");
      return new ArrayList<>();
    }
    for (File file : listFiles) {
      List<FTPLine> ftpLines = readZipFile(file);
      ftpLineList.addAll(ftpLines);
    }
    return ftpLineList;
  }

  @SuppressWarnings({"unchecked", "UnnecessaryContinue"})
  public static List<FTPLine> readZipFile(File file) {
    log.info("Entering readZipFile");
    List<FTPLine> rs = new ArrayList<>();
    if (null == file || file.length() == 0) {
      log.error("file is null or file size is 0. file name:{}", file);
      return rs;
    }
    try (ZipFile zf = new ZipFile(file)) {
      FTPLine fl;
      Enumeration<ZipEntry> entries = (Enumeration<ZipEntry>) zf.entries();
      ZipEntry ze;
      // 枚举zip文件内的文件
      while (entries.hasMoreElements()) {
        ze = entries.nextElement();
        // 读取目标对象
        if (ze.isDirectory() || ze.getSize() == 0) {
          log.error("zipFile is directory or is null");
          continue;
        } else {
          log.info("file - " + ze.getName() + " : " + ze.getSize() + " bytes");
          long size = ze.getSize();
          if (size > 0) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(ze)))) {
              String line;
              while ((line = br.readLine()) != null) {
                String[] split = line.split(",");
                if (split.length != 5) {
                  log.error("单行数据格式错误！filename=" + file.getName() + ";line=" + line);
                  continue;
                }
                fl = FTPLine.builder().stationMac(split[0]).signalStrength(Integer.parseInt(split[1])) //
                    .channel(Integer.parseInt(split[2])).apMac(split[3]).time(Long.parseLong(split[4])).build();
                rs.add(fl);
              }
            } catch (Exception e) {
              log.error("readZipFile is error", e);
            }
          }
        }
      }
    } catch (Exception e) {
      log.error("ZipFile is error", e);
    }
    return rs;
  }

  public static void main(String[] args) {
    Options options = new Options();
    options.addOption("d", "factDate", true, "热力图计算日期");
    options.addOption("h", "factHour", true, "热力图小时");
    CommandLineParser parser = new DefaultParser();
    CommandLine cmd;
    String date = null; //format pattern 2017-10-11
    int hour = 10;
    try {
      cmd = parser.parse(options, args);
      date = cmd.getOptionValue("factDate");
      hour = Integer.parseInt(cmd.getOptionValue("factHour"));
      log.info("date:{}, hour:{}", date, hour);
      execute(date, hour);
    } catch (Exception e) {
      log.error("params error,date:{},hour:{}", date, hour, e);
      e.printStackTrace();
    }
  }
}

@Data
@Builder
class FTPLine {
  private String stationMac;//终端MAC
  private Integer signalStrength;//信号强度
  private Integer channel;//信道
  private String apMac;//AP MAC地址
  private Long time;//扫描时间（设备扫描时间精确到秒）
}


