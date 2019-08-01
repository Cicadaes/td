package com.talkingdata.datacloud.visual.controller.report;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.adapter.entity.Filter;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.DataSource;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import com.talkingdata.datacloud.visual.entity.report.DataSourceMetadata;
import com.talkingdata.datacloud.visual.entity.report.Report;
import com.talkingdata.datacloud.visual.page.report.DataSourceMetadataPage;
import com.talkingdata.datacloud.visual.page.report.DataSourcePage;
import com.talkingdata.datacloud.visual.service.report.DataSourceConnectionService;
import com.talkingdata.datacloud.visual.service.report.DataSourceService;
import com.talkingdata.datacloud.visual.service.report.PrivilegeService;
import com.talkingdata.datacloud.visual.util.DataSourceHelper;
import com.talkingdata.datacloud.visual.util.ExcelUtils;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import com.talkingdata.datacloud.visual.util.Msg;
import com.talkingdata.datacloud.visual.util.excel.ExportExcelType;
import com.talkingdata.datacloud.visual.util.excel.ExportVM;
import com.talkingdata.datacloud.visual.vo.DownloadQueryParameter;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.univocity.parsers.csv.CsvWriter;
import com.univocity.parsers.csv.CsvWriterSettings;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Controller
@RequestMapping("/report")
public class DataSourceController extends BaseController {

  private static final Logger logger = LoggerFactory.getLogger(DataSourceController.class);

  @Autowired
  private DataSourceService dataSourceService;

  @Autowired
  private DataSourceConnectionService dataSourceConnectionService;

  @Autowired
  private PrivilegeService privilegeService;

  @Autowired
  private DataSourceMetadataController dataSourceMetadataController;

  @Value("${appcode}")
  private String appCode;


  /**
   * 获取所有数据源配置列表
   */
  @RequestMapping(value = "/dataSources/rows", method = GET, produces = APPLICATION_JSON_UTF8_VALUE)
  @ResponseBody
  public Map<String, Object> queryConfigDataSources(DataSourcePage page) throws Exception {
    page.setOrderBy(Report.fieldToColumn(page.getOrderBy()));
    List<DataSource> dataSourceList = dataSourceService.queryByList(page);
    for (DataSource dataSource : dataSourceList) {
      DataSourceConnection dataSourceConnection = dataSourceConnectionService
          .queryAdapterByPrimaryKey(dataSource.getDataSourceConnectionId());
      dataSource.setAdapterName(dataSourceConnection.getAdapter().getName());
      dataSource.setDataSourceConnectionName(dataSourceConnection.getName());
    }
    return getGridData(page.getPager().getRowCount(), dataSourceList);
  }


  /**
   * 获取表字段
   */
  @RequestMapping(value = "/dataSources/{id}/columns", method = GET)
  @ResponseBody
  public List<DataSourceMetadata> findColumnsList(@PathVariable Integer id) throws Exception {
    DataSourceMetadataPage dataSourceMetadataPage = new DataSourceMetadataPage();
    dataSourceMetadataPage.setPageSize(1000);
    dataSourceMetadataPage.setDataSourceId(id);
    List<DataSourceMetadata> dataSourceMetadataList = dataSourceMetadataController
        .queryByList(dataSourceMetadataPage);
    return dataSourceMetadataList;
  }

  /**
   * 获取样例数据
   */
  @RequestMapping(value = "/dataSources/{id}/sampleData", method = GET)
  @ResponseBody
  public Map<String, Object> findSampleDataList(@PathVariable Integer id) throws Exception {
    //初始化数据源参数
    DataSource dataSource = dataSourceService.queryDataSourceConnectionByPrimaryKey(id);

    DataPreviewPage dataPreviewPage = new DataPreviewPage();
    dataPreviewPage.setDataSourceConnectionInfo(dataSource.getDataSourceConnection().getParams());
    dataPreviewPage.setQuerySql(dataSource.getMappedDataSource());
    dataPreviewPage.setPageSize(100);
    //获取adapter
    IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSource.getDataSourceConnection());
    //通过Adapter获取样例数据
    return adapter.viewDataSourceDataList(dataPreviewPage);
  }

  /**
   * 下载样例数据为CVS
   */
  @RequestMapping(value = "/dataSources/{id}/sampleData/download", method = GET)
  @ResponseBody
  public void download(@PathVariable Integer id, HttpServletResponse response) throws Exception {
    DataSource dataSource = dataSourceService.selectByPrimaryKey(id);
    //通过Adapter获取字典值
    List<Map<String, Object>> sampleDate = (List<Map<String, Object>>) findSampleDataList(id)
        .get("data");
    if (sampleDate == null || sampleDate.size() == 0) {
      throw new IOException("当前数据源没有样例数据");
    } else {
      LinkedHashMap<String, Object> recordHead = new LinkedHashMap();
      Map<String, Object> firstRecord = sampleDate.get(0);
      for (String key : firstRecord.keySet()) {
        recordHead.put(key, key);
      }
      List<Map<String, Object>> sampleDateWithHead = new ArrayList<>();
      sampleDateWithHead.add(recordHead);
      sampleDateWithHead.addAll(sampleDate);
      response.setContentType("application/x-msdownload;");
      response.setHeader("Content-disposition",
          "attachment; filename=" + dataSource.getName() + "_sample.csv");
      String resultJson = JSONUtils
          .writeValueAsCunstomString(sampleDateWithHead, "yyyy-MM-dd HH:mm:ss");
      List<Map<String, Object>> conversionList = JSONUtils.readValueToBean(resultJson, List.class);
      CsvWriterSettings settings = new CsvWriterSettings();
      try (ServletOutputStream out = response.getOutputStream()) {
        CsvWriter writer = new CsvWriter(out, Charset.forName("UTF-8"), settings);
        for (Map<String, Object> recordMap : conversionList) {
          writer.writeRow(recordMap);
        }
        writer.flush();
      }
    }
  }


  @RequestMapping(value = "/dataSources/id/getExportExcel/{uuid}", method = GET)
  @ResponseBody
  public ResponseEntity<Void> getExportExcel(@PathVariable("uuid") String uuid,
      HttpServletRequest request, HttpServletResponse response) throws IOException {
    HttpSession session = request.getSession();
    String filePath = (String) session.getAttribute(uuid);
    String fileName = session.getAttribute(uuid + "_fileName") + ".xls";
    try {
      String agent = request.getHeader("USER-AGENT");
      String downLoadName = null;
      if (null != agent && (-1 != agent.indexOf("MSIE") || agent.contains("Trident"))) // IE
      {
        downLoadName = java.net.URLEncoder.encode(fileName, "UTF-8");
      } else if (null != agent && -1 != agent.indexOf("Mozilla")) // Firefox
      {
        downLoadName = new String(fileName.getBytes("UTF-8"), "iso-8859-1");
      }
      // 设置response的Header
      response.setContentType("application/octet-stream");
      response.addHeader("Content-Disposition", "attachment;filename=" + downLoadName);
    } catch (Exception ex) {
      ex.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

    }
    FileInputStream inputStream = null;
    OutputStream os = null;
    try {
      if (filePath != null) {
        inputStream = new FileInputStream(filePath);
        os = response.getOutputStream();
        byte[] buffer = new byte[1024];
        int size = 0;
        while ((size = inputStream.read(buffer, 0, 1024)) > 0) {
          os.write(buffer, 0, size);
        }
        os.flush();

        session.removeAttribute(uuid); // 用完后从session中移除
        session.removeAttribute(uuid + "_fileName");
        new File(filePath).delete();//删除临时文件

        return new ResponseEntity<>(HttpStatus.OK);
      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      if (null != inputStream) {
        inputStream.close();
      }
      if (null != os) {
        os.close();
      }
    }
  }

  /**
   * 根据datasourceId获取数据
   */
  @RequestMapping(value = "/dataSources/id/data", method = POST)
  @ResponseBody
  @Cacheable(value = "datareport_data", keyGenerator = "datareportKeyGenerator")
  public Object findData(@RequestBody QueryParameter queryParameter) throws Exception {
    //初始化数据源参数
    DataSource dataSource = dataSourceService
        .queryDataSourceConnectionByPrimaryKey(queryParameter.getDatasource_id());
    queryParameter.setDataSourceConnectionInfo(dataSource.getDataSourceConnection().getParams());
    queryParameter.setDataSourceName(dataSource.getMappedDataSource());

    if (queryParameter.getDatasource_id() == 27) {
      HttpSession session = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
          .getRequest().getSession();
      User user = (User) session.getAttribute("user");

      String dataSourceConnectionInfo = queryParameter.getDataSourceConnectionInfo();
      JdbcBean tmpJdbcBean = JdbcBean
          .getJdbcBean(dataSourceConnectionInfo, queryParameter.getDataSourceName(),
              "com.mysql.jdbc.Driver");

      String queryUser =
          "select group_sign,logical_city from TD_BS_USER where user_id='" + user.getUmid() + "'";
      List<Map<String, Object>> userList = DataBaseUtil.queryForList(tmpJdbcBean, queryUser);

      if (userList.size() > 0) {
        String groupSign = userList.get(0).get("group_sign").toString();

        if ("N".equals(groupSign)) {
          List<Filter> filters = queryParameter.getFilters();
          boolean flag = false;
          for (Filter tmp : filters) {
            if ("project_type".equals(tmp.getField().trim()) && "1"
                .equals(tmp.getValue().toString().trim())) {
              flag = true;
              break;
            }
          }
          if (flag) {

            Filter needAddFilter = new Filter();
//                    "field":"project_id","operator":"in","value":"87131,129958,134981,87138"
            needAddFilter.setField("C_CITY_CN_NAME");
            needAddFilter.setOperator("in");
            StringBuffer buffer = new StringBuffer();
            for (int k = 0; k < userList.size(); k++) {
              if (k == 0) {
                buffer.append(userList.get(k).get("logical_city"));
              } else {
                buffer.append(",").append(userList.get(k).get("logical_city"));
              }

            }
            needAddFilter.setValue(buffer.toString());

            filters.add(needAddFilter);
            if (buffer.toString().length() > 0) {
              queryParameter.setFilters(filters);
            }
          }
        }
      }
    }

    //获取adapter
    IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSource.getDataSourceConnection());
    Object result = adapter.findData(queryParameter);

    //通过Adapter获取数据
    return result;
  }


  /**
   * 根据datasourceId获取数据
   */
  @RequestMapping(value = "/dataSources/id/data/exportExcel", method = POST)
  @ResponseBody
//    @Cacheable(value="datareport_data",key="#queryParameter")
  public ResponseEntity<ExportVM> findData4Export(HttpServletRequest request,
      @RequestBody DownloadQueryParameter queryParameter) throws Exception {
    // 安全起见，设置limit 为-1，设置showSql 为false;
    List<Integer> limits = new ArrayList<>();
    limits.add(-1);
    queryParameter.setLimit(limits);
    queryParameter.setShowSql(false);

    Object result = findData(queryParameter);
    String resultJson = JSONUtils.writeValueAsString(result);

    // 创建导出文件目录
    String exportFolder = "/attachment/wifianalytics/export";
    File file = new File(exportFolder);
    file.mkdirs();

    // 文件名
    String uuid = UUID.randomUUID().toString().replaceAll("-", "");

    String title = null;
    if (ExportExcelType.SELL_AMOUNT.getCode() == queryParameter.getExportExcelType()) {
      title = "运营概览-销售金额";
      DataSourceConEcxelHelper.sellAmount(exportFolder, uuid, title, resultJson);

    } else if (ExportExcelType.PASSENGER_FLOW_DYNAMICS.getCode() == queryParameter
        .getExportExcelType()) {
      title = "客流动态-小时动态";
      DataSourceConEcxelHelper.passengerFlowDynamics(exportFolder, uuid, title, resultJson);

    } else if (ExportExcelType.GROUPOVERVIEW_INDICATORS.getCode() == queryParameter
        .getExportExcelType()) {
      title = "集团概览-指标概览";
      DataSourceConEcxelHelper.groupIndicators(exportFolder, uuid, resultJson);

    } else if (ExportExcelType.GROUPOVERVIEW_INDICATORS.getCode() == queryParameter
        .getExportExcelType()) {
      title = "集团概览-四象限分布";
      DataSourceConEcxelHelper.groupFourGuadrant(exportFolder, uuid, resultJson);

    } else if (ExportExcelType.GROUPOVERVIEW_INDICATORS.getCode() == queryParameter
        .getExportExcelType()) {
      title = "集团概览_运营概览_客流指标";
      String indicator = queryParameter.getMetrics().get(0).getField();
      DataSourceConEcxelHelper
          .groupOperationPassengerFlowIndicators(exportFolder, uuid, resultJson, indicator);
    }

    HttpSession session = request.getSession();
    session.setAttribute(uuid, exportFolder + "/" + uuid);
    session.setAttribute(uuid + "_fileName", title);
    ExportVM vm = new ExportVM();
    vm.setAttachId(uuid);

    return new ResponseEntity<ExportVM>(vm, HttpStatus.OK);
  }


  /**
   * 创建dataSource
   */
  @RequestMapping(value = "/dataSources", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
  @ResponseBody
  public Map<String, Object> create(HttpServletRequest request, @RequestBody DataSource dataSource)
      throws Exception {
    String checkResult = checkDataSourceName(dataSource);
    if (checkResult != null) {
      return Msg.getFailureMessage(checkResult);
    }
    User user = privilegeService.getUserByRequest(request);
    dataSource.setCreator(user.getName());
    dataSource.setCreateBy(user.getUmid());
    dataSource.setUpdater(user.getName());
    dataSource.setUpdateBy(user.getUmid());
    int success = dataSourceService.insert(dataSource);
    if (success > 0) {
      dataSourceMetadataController.initDataSourceMetaDataTable(dataSource);
      return Msg.getSuccessMessage("保存成功");
    } else {
      return Msg.getFailureMessage("保存失败");
    }
  }


  /**
   * 修改dataSource
   */
  @RequestMapping(value = "/dataSources", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
  @ResponseBody
  public Map<String, Object> update(HttpServletRequest request, @RequestBody DataSource dataSource)
      throws Exception {
    String checkResult = checkDataSourceName(dataSource);
    if (checkResult != null) {
      return Msg.getFailureMessage(checkResult);
    }
    User user = privilegeService.getUserByRequest(request);
    dataSource.setUpdater(user.getName());
    dataSource.setUpdateBy(user.getUmid());
    int success = dataSourceService.updateByPrimaryKeySelective(dataSource);
    if (success > 0) {
      return Msg.getSuccessMessage("修改成功");
    } else {
      return Msg.getFailureMessage("修改失败");
    }
  }

  private String checkDataSourceName(DataSource dataSource) throws Exception {
    String checkResult = null;
    if (dataSource.getName() == null || "".equals(dataSource.getName())) {
      checkResult = "数据源名称不能为空";
    } else if (dataSource.getName().length() > 255) {
      checkResult = "数据源不能超过225个字符";
    } else if (dataSource.getName().matches(".*[\\\\/:\\*\\?<>|].*")) {
      checkResult = "数据源不能包含特殊字符（\\/:*?<>|）";
    } else if (isDuplicationName(dataSource)) {
      checkResult = "存在名称为'" + dataSource.getName() + "'的数据源，请修改数据源名称";
    }
    return checkResult;
  }


  private boolean isDuplicationName(DataSource dataSource) throws Exception {
    DataSourcePage dataSourcePage = new DataSourcePage();
    dataSourcePage.setName(dataSource.getName());
    if (dataSource.getId() != null) {
      dataSourcePage.setId(dataSource.getId());
      dataSourcePage.setIdOperator("<>");
    }
    int i = dataSourceService.queryByCount(dataSourcePage);
    return i >= 1;
  }

  /**
   * 删除dataSource
   */
  @RequestMapping(value = "/dataSources/{id}", method = DELETE)
  @ResponseBody
  public void delete(@PathVariable Integer id) throws Exception {
    dataSourceService.deleteByPrimaryKey(id);
    logger.info("delete from TD_DC_VISUAL_DATA_SOURCE where id = {}", id);
  }

  /**
   * 获取数据源连接信息
   */
  @RequestMapping(value = "/dataSources/{id}/connectionInfo", method = GET)
  @ResponseBody
  public String getDataSourcesConnectionInfo(@PathVariable Integer id) throws Exception {
    DataSource dataSource = dataSourceService.queryAdapterByPrimaryKey(id);
    String implClass = dataSource.getDataSourceConnection().getAdapter().getImplClass();
    JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSource.getDataSourceConnection().getParams(),
        dataSource.getMappedDataSource(), implClass);
    return jdbcBean.getUrl();
  }

  /**
   * 下载结果数据
   */
  @RequestMapping(value = "/dataSources/id/data/download", method = POST)
  @ResponseBody
  public void download(HttpServletResponse response,
      @RequestBody DownloadQueryParameter downloadQueryParameter) throws Exception {
    List<Map<String, Object>> resultMapList = (List<Map<String, Object>>) findData(
        downloadQueryParameter);
    List<String> recordHead = new ArrayList<>();
    List<String> keys = new ArrayList<>();
    Map<String, Object> firstRecord = resultMapList.get(0);
    for (String key : firstRecord.keySet()) {
      if (key.contains("占比")) {
        recordHead.add("占比");
      } else {
        recordHead.add(key);
      }
      keys.add(key);
    }
    String columnNames[] = recordHead.toArray(new String[0]);//列名
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    try {
      ExcelUtils.createWorkBook(resultMapList, columnNames, columnNames).write(os);
    } catch (IOException e) {
      e.printStackTrace();
    }
    byte[] content = os.toByteArray();
    InputStream is = new ByteArrayInputStream(content);
    // 设置response参数，可以打开下载页面
    response.reset();
    response.setContentType("application/vnd.ms-excel;charset=utf-8");
    response.setHeader("Content-Disposition", "attachment;filename=" + new String(
        (downloadQueryParameter.getDataSourceName() + ".xls").getBytes(), "iso-8859-1"));
    ServletOutputStream out = response.getOutputStream();
    BufferedInputStream bis = null;
    BufferedOutputStream bos = null;
    try {
      bis = new BufferedInputStream(is);
      bos = new BufferedOutputStream(out);
      byte[] buff = new byte[2048];
      int bytesRead;
      // Simple read/write loop.
      while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
        bos.write(buff, 0, bytesRead);
      }
    } catch (final IOException e) {
      throw e;
    } finally {
      if (bis != null) {
        bis.close();
      }
      if (bos != null) {
        bos.close();
      }
    }
  }

  /**
   * 下载结果数据
   */
  @RequestMapping(value = "/dataSources/id/data/downloadExcel", method = POST)
  @ResponseBody
  public String downloadExcel(@RequestBody DownloadQueryParameter downloadQueryParameter)
      throws Exception {
    String downPath = "webapps/download/";

    Calendar calendar = Calendar.getInstance();
    Date currentDate = calendar.getTime();
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd_HHmmssSSS");
    String fileName =
        downloadQueryParameter.getDownloadName() + "_" + formatter.format(currentDate) + ".xls";

    Workbook workbook = null;

    List<Map<String, Object>> resultMapList = (List<Map<String, Object>>) findData(
        downloadQueryParameter);
    if (resultMapList.size() > 0) {
      List<String> recordHead = new ArrayList<>();
      List<String> keyList = new ArrayList<>();
      Map<String, Object> firstRecord = resultMapList.get(0);
      for (String key : firstRecord.keySet()) {
        if (key.contains("占比")) {
          recordHead.add("占比");
        } else {
          recordHead.add(key);
        }
        keyList.add(key);
      }

      String columnNames[] = recordHead.toArray(new String[0]);//列名
      String keys[] = keyList.toArray(new String[0]);//键值
      workbook = ExcelUtils.createWorkBook(resultMapList, keys, columnNames);
    } else {
      workbook = new HSSFWorkbook();
    }

    try {
      File filePath = new File(downPath);
      if (!filePath.exists()) {
        filePath.mkdirs();
      }
      FileOutputStream outputStream = new FileOutputStream(downPath + fileName);
      workbook.write(outputStream);
      outputStream.flush();
      outputStream.close();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (workbook != null) {
        workbook.close();
      }
    }
    return "download" + "/" + fileName;
  }

//    /**
//     * 获取图表的请求信息
//     * @param id
//     * @return
//     * @throws Exception
//     */
//    @RequestMapping(value = "/chartSettings/chart/{uuid}", method = POST)
//    @ResponseBody
//    public List<ChartSetting> getBuildChartSetting(@PathVariable String uuid, @RequestBody ChartsData chartsData) throws Exception {
//        List<ChartSetting> chartSettingList=new ArrayList<>();
//        ChartSetting chartSetting=new ChartSetting();
//        chartSetting.setUuid(uuid);
//        chartSetting.setRequestPath("report/dataSources/id/metaData");
//        chartSetting.setRequestMethod("POST");
//
//
//        QueryParameter queryParameter=new QueryParameter();
//        queryParameter.setDatasource_id(1);
//        List<Object>dimensionsList=new ArrayList<>();
//        dimensionsList.add("name");
//        queryParameter.setDimensions(dimensionsList);
//        List<Object>metricsList=new ArrayList<>();
//        metricsList.add("name");
//        queryParameter.setMetrics(metricsList);
//
//        chartSetting.setRequestData(queryParameter);
//        chartSettingList.add(chartSetting);
//        return chartSettingList;

//        Chart chart=null;
//        for(Stage stage:chartsData.getReport().getStages()){
//            for(Component component:stage.getComponents()){
//                if(component.getChart().getUuid().equals(uuid)){
//                    chart=component.getChart();
//                }
//            }
//        }
//        if(chart==null){
//            logger.error("没有找到uuid为"+uuid+"的图表");
//            return null;
//        }
//        ConfigDefinition configDefinition=configDefinitionService.queryById(chart.getStyleConfigDefinitionId());
//        //如果为分组器或者过滤器时查询所有图表的信息
//        if(configDefinition.getGroupId()==13||configDefinition.getGroupId()==14){
//
//        }else{
//
//        }
//
//
//        return null;
//    }

  //清理不合理的维度字段
//    private void cleanDisabledField(QueryParameter queryParameter){
//        //删除维度字段为空的对象
//        List<String> disabledField=new ArrayList<>();
//        for(String dimension:queryParameter.getDimensions()){
//            if(null==dimension||"".equals(dimension))
//                disabledField.add(dimension);
//        }
//        for(String dimensions:disabledField){
//            queryParameter.getDimensions().remove(dimensions);
//        }
//        disabledField.clear();
//        //删除指标字段为空的对象
//        for(String metric:queryParameter.getMetrics()){
//            if(null==metric||"".equals(metric))
//                disabledField.add(metric);
//        }
//        for(String metric:disabledField){
//            queryParameter.getMetrics().remove(metric);
//        }
//        //整理过滤条件
//        List<Filter> filterList=queryParameter.getFilters();
//        List<Filter> oldFilterList=new ArrayList<>();
//        List<Filter> newFilterList=new ArrayList<>();
//        for(Filter filter:filterList){
//            if(filter.getOperator().contains("&&")){
//                String[]operators=filter.getOperator().split("&&");
//                List valueList=(List)filter.getValue();
//                for(int i=0;i<operators.length;i++){
//                    Filter newFilter=new Filter();
//                    newFilter.setField(filter.getField());
//                    newFilter.setOperator(operators[i]);
//                    newFilter.setValue(valueList.get(i));
//                    newFilterList.add(newFilter);
//                }
//                oldFilterList.add(filter);
//            }
//        }
//        queryParameter.getFilters().removeAll(oldFilterList);
//        queryParameter.getFilters().addAll(newFilterList);
//    }

  //    /**
//     * 获取所有数据源
//     * @param
//     * @return
//     * @throws Exception
//     */
//    @RequestMapping(value = "/dataSources", method = GET,produces = APPLICATION_JSON_UTF8_VALUE)
//    @ResponseBody
//    public List<com.talkingdata.datacloud.visual.vo.DataSource> query() throws Exception {
//        DataSourcePage page=new DataSourcePage();
//        List<DataSource> dataSourceList=dataSourceService.queryByList(page);
//        DataSourceHelper.buildDataSource(dataSourceList);
//        return DataSourceHelper.buildVoDataSource(dataSourceList);
//    }

  /**
   * 获取数据源面板默认元数据
   * @param
   * @return
   * @throws Exception

   @RequestMapping(value = "/dataSources/{id}/defaultDataSourcesMetadata", method = GET)
   @ResponseBody public Map<String,String> queryDefaultMetadata(@PathVariable Integer id) throws Exception {
   //初始化数据源参数
   DataSource dataSource = dataSourceService.selectByPrimaryKey(id);
   List<OperatorParameter> operatorParameters = getParameters(dataSource);
   //获取adapter
   IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSource);

   Map<String,String>resultMap=adapter.getDefaultDataSourceMetadata(operatorParameters);
   //        return DataSourceDefinition.configDefinitionList2DataSourceDefinitionList(configDefinitionList);
   return resultMap;
   }
   */
  /**
   * 获取数据源连接器对应的数据源列表
   * @param id
   * @return
   * @throws Exception

   @RequestMapping(value = "/dataSourceConnectors/{id}/dataSources", method = GET)
   @ResponseBody public List<DataSource> queryByDataSourceConnectors(@PathVariable Integer id) throws Exception {
   DataSourcePage page=new DataSourcePage();
   page.setAdapterId(id);
   return dataSourceService.queryByList(page);
   }

   @RequestMapping(value = "/dataSources/rows", method = GET)
   @ResponseBody public Map<String, Object> queryRows(DataSourcePage page) throws Exception {
   page.setOrderBy(DataSource.fieldToColumn(page.getOrderBy()));
   List<DataSource> rows = dataSourceService.queryByList(page);
   return getGridData(page.getPager().getRowCount(), rows);
   }
   */
//    /**
//     * 根据datasourceId获取渲染面板的数据
//     * @param id
//     * @return
//     * @throws Exception
//     */
//    @RequestMapping(value = "/dataSources/{id}", method = GET)
//    @ResponseBody
//    public com.talkingdata.datacloud.visual.vo.DataSource find(@PathVariable Integer id) throws Exception {
//        DataSource dataSource = dataSourceService.selectByPrimaryKey(id);
//        DataSourceHelper.buildDataSource(dataSource);
//        //临时从数据库中查询
//        return DataSourceHelper.buildVoDataSource(dataSource);
//    }

  /**
   * 获取字典值
   * @param
   * @return
   * @throws Exception

   @RequestMapping(value = "/dataSources/id/optionDictionary", method = POST)
   @ResponseBody public List<String> findSourceList(@RequestParam String key,@RequestBody CallBackParameter callBackParameter) throws Exception {
   List<OperatorParameter> selectParameters=callBackParameter.getDatasource_config();
   //初始化数据源参数
   DataSource dataSource = dataSourceService.selectByPrimaryKey(callBackParameter.getDatasource_id());
   List<OperatorParameter> operatorParameters = getParameters(dataSource);
   //用户已选参数
   operatorParameters.addAll(selectParameters);
   //获取adapter
   IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSource);
   //通过Adapter获取字典值
   return adapter.getOptionItemDictionary(operatorParameters,key);
   }
   */

//    @RequestMapping(value = "/dataSources", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
//    @ResponseBody
//    public Map<String, Object> create(HttpServletRequest request,@RequestBody DataSourceConnectionVo dataSourceConnection) throws Exception {
//        DataSource dataSource=new DataSource();
//        dataSource.setName(dataSourceConnection.getName());
//        String checkResult=checkDataSourceName(dataSource);
//        if(checkResult!=null){
//            return Msg.getFailureMessage(checkResult);
//        }
//
//        dataSourceConnectionService.insert(dataSourceConnection);
//        String params=dataSourceConnection.getParams();
//        Map<String,Object> map=JSONUtils.readValueToMap(params);
//        String talbeName=(String)map.get("tableName");
//        dataSource.setDataSourceConnectionId(dataSourceConnection.getId());
//        dataSource.setMappedDataSource(talbeName);
//        User user = SecurityHelper.getUser(request);
//        dataSource.setCreator(user.getName());
//        dataSource.setCreateBy(user.getUmid());
//        dataSource.setUpdater(user.getName());
//        dataSource.setUpdateBy(user.getUmid());
//        int success=dataSourceService.insert(dataSource);
//        if(success>0)
//            return Msg.getSuccessMessage("保存成功");
//        else
//            return Msg.getFailureMessage("保存失败");
//    }
  /**
   * 获取表名，待删除方法
   * @param
   * @return
   * @throws Exception

   @RequestMapping(value = "/dataSources/tables", method = POST)
   @ResponseBody public Map<String, Object> findSourceList(@RequestBody CallBackParameter callBackParameter) throws Exception {
   Integer adapterId=callBackParameter.getAdapter_id();
   Map<String,String> dataSourceMap = new HashMap<>();
   for(OperatorParameter operatorParameter:callBackParameter.getDatasource_config() ){
   dataSourceMap.put(operatorParameter.getCode(),(String) operatorParameter.getValue());
   }
   String dataSource=JSONUtils.writeValueAsString(dataSourceMap);
   //获取adapter
   IDataSourceAdapter adapterDataSource = DataSourceHelper.findAdapterByAdapterId(adapterId);
   boolean result=adapterDataSource.testConnection(dataSource);
   if(!result){
   return Msg.getFailureMessage("数据源配置无法连接数据源");
   }
   //通过Adapter获取字典值
   List<String> sources=adapterDataSource.viewSourceList(dataSource);

   return Msg.getSuccessData(sources);
   }
   */

}
