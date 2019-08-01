package com.talkingdata.datacloud.adapter.common;

import com.talkingdata.datacloud.adapter.entity.*;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import com.talkingdata.datacloud.visual.util.custom.DateUtil;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang.StringUtils;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.talkingdata.datacloud.adapter.util.DataBaseUtil.queryForList;

/**
 * Created by Ocean on 2017/4/11.
 */
public abstract class AbstractAdapter implements IDataSourceAdapter {

  protected static final String DIRVERCLASSNAME = "com.mysql.jdbc.Driver";
  private static final Logger logger = LoggerFactory.getLogger(AbstractAdapter.class);

  /**
   * 获取元数据属性
   */
  @Override
  public List<Map<String, Object>> viewMetadataPropertiesList(String dataSourceConnectionInfo,
      String dataSourceName) {
    throw new RuntimeException("unimplement");
  }

  /**
   * 获取样例数据
   */
  @Override
  public Map<String, Object> viewDataSourceDataList(DataPreviewPage dataPreviewPage) {
    throw new RuntimeException("unimplement");
  }

  @Override
  public List<String> viewDimensionList(String dataSourceConnectionInfo, String dataSourceName) {
    throw new RuntimeException("unimplement");
  }

  @Override
  public List<String> viewDateDimensionList(String dataSourceConnectionInfo,
      String dataSourceName) {
    throw new RuntimeException("unimplement");
  }

  @Override
  public List<String> viewMetricList(String dataSourceConnectionInfo, String dataSourceName) {
    throw new RuntimeException("unimplement");
  }

  @Override
  public String getQuerySql(String dataSourceConnectionInfo, String dataSourceName) {
    throw new RuntimeException("unimplement");
  }

  @Override
  public List<String> viewSourceList(String dataSourceConnectionInfo) {
    throw new RuntimeException("unimplement");
  }

  @Override
  public List<String> getViewList(String dataSourceConnectionInfo) {
    throw new RuntimeException("unimplement");
  }

  protected abstract void addOtherResult(JdbcBean jdbcBean, QueryParameter queryParameter,
      List<Map<String, Object>> result) throws Exception;

  @Override
  public Object findData(QueryParameter queryParameter) {
    JdbcBean jdbcBean = getJdbcBean(queryParameter);
    try {
      changeLimit(queryParameter);
      //查询维度个数
      queryDimensionLimt(jdbcBean, queryParameter);

      String querySql = assemblingSql(jdbcBean, queryParameter);
      logger.info("querySql={}", querySql);
      if (queryParameter.isShowSql()) {
        return querySql;
      }
      //查询结果
      List<Map<String, Object>> queryResult = DataBaseUtil.queryForList(jdbcBean, querySql);
      //对于metric有null值的转换为0
      changeNullToZero(queryParameter, queryResult);
      //是否补零
      settingZero(queryParameter, queryResult);
      //对于维度或指标进行格式转换
      convertResultFormat(queryParameter, queryResult);
      //统计饼图里"其他"扇区的数据
      addOtherResult(jdbcBean, queryParameter, queryResult);
      //当前记录总数的占比
      proportion(queryParameter, queryResult);
      //指标变维度
      metricToDimension(queryParameter, queryResult);
      //添加记录总计
      Object result = queryPageCount(jdbcBean, queryParameter, queryResult);

      //增加查询标识
      result = addQueryId(queryParameter, result);
      return result;
    } catch (Exception e) {
      logger.error("查询sql失败", e);
      return null;
    }
  }

  /**
   * 统计总条数
   */
  protected Object addQueryId(QueryParameter queryParameter, Object result) {
    if (queryParameter.getQueryId() == null || "".equals(queryParameter.getQueryId())) {
      return result;
    } else {
      if (result instanceof Map) {
        Map<String, Object> convertResult = (Map<String, Object>) result;
        convertResult.put("queryId", queryParameter.getQueryId());
        return convertResult;
      } else if (result instanceof List) {
        Map<String, Object> resultWithQueryId = new LinkedHashMap();
        resultWithQueryId.put("queryId", queryParameter.getQueryId());
        resultWithQueryId.put("data", result);
        return resultWithQueryId;
      } else {
        return result;
      }
    }
  }

  protected void proportion(QueryParameter queryParameter, List<Map<String, Object>> resultList) {
    //是否显示占比
    if (queryParameter.getProportion().size() == 0) {
      return;
    }
    String dimensionName = queryParameter.getProportion().get(0);
    if ("ALL".equals(dimensionName.toUpperCase())) {
      Double totalValue = 0D;
      for (Map resultMap : resultList) {
        for (Metric metric : queryParameter.getMetrics()) {
          String metricKey = metric.getResultAlias();
          Object value = resultMap.get(metricKey);
          totalValue += Double.parseDouble(value.toString());
        }
      }
      for (Map resultMap : resultList) {
        for (Metric metric : queryParameter.getMetrics()) {
          String metricKey = metric.getResultAlias();
          Double value = Double.parseDouble(resultMap.get(metricKey).toString());
          Double proportion = new BigDecimal(value / totalValue * 100)
              .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
          resultMap.put(metricKey + "_占比", proportion);
        }
      }
    } else {
      Map<String, Double> dimensionSumMap = new HashedMap();
      for (Map resultMap : resultList) {
        String dimension = resultMap.get(dimensionName).toString();
        for (Metric metric : queryParameter.getMetrics()) {
          Double metricValue = Double
              .parseDouble(resultMap.get(metric.getResultAlias()).toString());
          if (dimensionSumMap.containsKey(dimension)) {
            Double dimensionSum = dimensionSumMap.get(dimension);
            dimensionSumMap.put(dimension, metricValue + dimensionSum);
          } else {
            dimensionSumMap.put(dimension, metricValue);
          }
        }
      }
      for (Map resultMap : resultList) {
        String dimension = resultMap.get(dimensionName).toString();
        Double dimensionSum = dimensionSumMap.get(dimension);
        for (Metric metric : queryParameter.getMetrics()) {
          Double metricValue = Double
              .parseDouble(resultMap.get(metric.getResultAlias()).toString());
          Double proportion = new BigDecimal(metricValue / dimensionSum * 100)
              .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
          resultMap.put(dimension + "_占比", proportion);
        }
      }
    }

  }

  protected void metricToDimension(QueryParameter queryParameter,
      List<Map<String, Object>> resultList) {

  }

  protected JdbcBean getJdbcBean(QueryParameter queryParameter) {
    String dataSourceConnectionInfo = queryParameter.getDataSourceConnectionInfo();
    JdbcBean jdbcBean = JdbcBean
        .getJdbcBean(dataSourceConnectionInfo, queryParameter.getDataSourceName(), DIRVERCLASSNAME);
    return jdbcBean;
  }

  protected abstract String assemblingSql(JdbcBean jdbcBean, QueryParameter queryParameter)
      throws Exception;

  /**
   * 拼装统计页数Sql
   */
  protected abstract String assemblingPageCountSql(QueryParameter queryParameter);

  protected void convertResultFormat(QueryParameter queryParameter,
      List<Map<String, Object>> resultList) {
    List<Dimension> dimensionList = new ArrayList<>();
    dimensionList.addAll(queryParameter.getDateDimensions());
    dimensionList.addAll(queryParameter.getDimensions());
    for (Dimension dimension : dimensionList) {
      if (dimension.getConvertFunction() == null) {
        continue;
      }
      ConvertInterface convertInterface = dimension.getConvertFunction();
      for (Map<String, Object> resultMap : resultList) {
        String dimensionKey = dimension.getResultAlias();
        Object currentValue = resultMap.get(dimensionKey);
        if (convertInterface.isConvert(currentValue)) {
          resultMap.put(dimensionKey, convertInterface.convertValue(currentValue));
        }
      }
    }
  }

  /**
   * 统计总条数
   */
  protected Object queryPageCount(JdbcBean jdbcBean, QueryParameter queryParameter,
      List<Map<String, Object>> resultList) {
    //统计总条数
    if (queryParameter.isPageCount()) {
      String queryCountSql = assemblingPageCountSql(queryParameter);
      Map<String, Object> countResult = DataBaseUtil.queryForMap(jdbcBean, queryCountSql);
      Long count = (Long) countResult.get("pageCount");
      Map<String, Object> resultWithPageCount = new LinkedHashMap();
      resultWithPageCount.put("total", count);
      resultWithPageCount.put("data", resultList);
      return resultWithPageCount;
    } else {
      return resultList;
    }
  }

  /**
   * 对于查询结果为0，则设置默认值
   */
  private Map<String, Object> getDefaultResult(QueryParameter queryParameter) {
    Map<String, Object> defaultResult = new LinkedHashMap();
    String defaultValue = "暂无数据";
    for (Dimension dimension : queryParameter.getDimensions()) {
      defaultResult.put(dimension.getResultAlias(), dimension.getResultAlias() + defaultValue);
    }
    for (Metric metric : queryParameter.getMetrics()) {
      defaultResult.put(metric.getResultAlias(), 0);
    }
    return defaultResult;
  }

  public void queryDimensionLimt(JdbcBean jdbcBean, QueryParameter queryParameter)
      throws Exception {
    for (Dimension dimension : queryParameter.getDimensions()) {
      if (dimension.getLimit() > 0) {
        QueryParameter dimensionQueryParameter = new QueryParameter();
        dimensionQueryParameter.getDimensions().add(dimension);
        dimensionQueryParameter.getMetrics().addAll(queryParameter.getMetrics());
        dimensionQueryParameter.getFilters().addAll(queryParameter.getFilters());
        dimensionQueryParameter.getDateFilters().addAll(queryParameter.getDateFilters());
        for (Metric metric : queryParameter.getMetrics()) {
          OrderBy orderBy = new OrderBy();
          orderBy.setField(metric.getAlias());
          orderBy.setFunction("DESC");
          dimensionQueryParameter.getOrderBy().add(orderBy);
          queryParameter.getOrderBy().add(orderBy);
        }
        dimensionQueryParameter.getLimit().add(dimension.getLimit());
        String querySql = assemblingSql(jdbcBean, dimensionQueryParameter);

        List<Map<String, Object>> queryResult = queryForList(jdbcBean, querySql);
        List<String> dimensionValueList = new ArrayList<>();
        for (Map<String, Object> resultMap : queryResult) {
          String resultDimensionValue = (String) resultMap.get(dimension.getResultAlias());
          dimensionValueList.add(resultDimensionValue);
        }
        Filter dimensionFilter = new Filter();
        dimensionFilter.setField(dimension.getField());
        dimensionFilter.setOperator("in");
        dimensionFilter.setValue(StringUtils.join(dimensionValueList.toArray(), ","));
        queryParameter.getFilters().add(dimensionFilter);
      }
    }
  }

  /**
   * 对于指标为NULL的记录，把指标值转为0
   */
  protected void changeNullToZero(QueryParameter queryParameter,
      List<Map<String, Object>> resultList) {
    //是否转零
    if (!queryParameter.isNullToZero()) {
      return;
    }
    for (Map resultMap : resultList) {
      for (Metric metric : queryParameter.getMetrics()) {
        String metricKey = metric.getResultAlias();
        Object value = resultMap.get(metricKey);
        if (value == null) {
          resultMap.put(metricKey, new BigDecimal(0));
        }
      }
    }
  }

  /**
   * 对于没有查询到记录的维度，则对预期指标置0
   */
  protected void settingZero(QueryParameter queryParameter, List<Map<String, Object>> resultList) {
    //是否置零
    if (!queryParameter.isSettingZero()) {
      return;
    }
    //对于查询结果为0，则返回默认值
    if (resultList.size() == 0) {
//            Map<String,Object>defaultResult=getDefaultResult(queryParameter);
//            resultList.add(defaultResult);
      return;
    }

    Dimension firstDimension;
    Dimension secendDimension = null;
    //设置第一维度和第二细分维度
    if (queryParameter.getDateDimensions().size() > 0) {
      firstDimension = queryParameter.getDateDimensions().get(0);
      if (queryParameter.getDimensions().size() >= 1) {
        secendDimension = queryParameter.getDimensions().get(0);
      }
    } else if (queryParameter.getDimensions().size() >= 2) {
      firstDimension = queryParameter.getDimensions().get(0);
      secendDimension = queryParameter.getDimensions().get(1);
    } else if (queryParameter.getDimensions().size() == 1) {
      firstDimension = queryParameter.getDimensions().get(0);
    } else {
      return;
    }

    List<Object> firstDimensionList = firstDimensionList(queryParameter, firstDimension);

    //如果非时序维度，则按照普通维度补0
    if (firstDimensionList.size() == 0) {
      //当维度为非时间维度时，统计维度个数
      Set<Object> currentDimensionSet = new HashSet<>();
      //统计维度的类别
      for (Map resultMap : resultList) {
        Object currentDimension = resultMap.get(firstDimension.getResultAlias());
        currentDimensionSet.add(currentDimension);
      }
      firstDimensionList.addAll(currentDimensionSet);
    }

    //当没有细分维度时
    if (secendDimension == null) {
      //添加缺省值
      for (int sequentialIndex = 0; sequentialIndex < firstDimensionList.size();
          sequentialIndex++) {
        Object sequentialValue = firstDimensionList.get(sequentialIndex);
        if (sequentialIndex < resultList.size()) {
          Map result = resultList.get(sequentialIndex);
          Object resultSequentialValue = result.get(firstDimension.getResultAlias());
          if (!(sequentialValue.equals(resultSequentialValue))) {
            Map<String, Object> insertMap = new LinkedHashMap<>();
            insertMap.put(firstDimension.getResultAlias(), sequentialValue);
            for (Metric metric : queryParameter.getMetrics()) {
              insertMap.put(metric.getResultAlias(), 0);
            }
            resultList.add(sequentialIndex, insertMap);
          }
        } else {
          Map<String, Object> insertMap = new LinkedHashMap<>();
          insertMap.put(firstDimension.getResultAlias(), sequentialValue);
          for (Metric metric : queryParameter.getMetrics()) {
            insertMap.put(metric.getResultAlias(), 0);
          }
          resultList.add(insertMap);
        }
      }
    } else {//当存在细分维度时
      //存储目前最多的子维度分类
      List<Object> secendDimensionList = new ArrayList<>();
      //统计当前子维度分类
      List<Object> currentSubdivisionList = new ArrayList<>();
      //记录前一个时序维度的值
      Object beforeDimension = null;
      //统计细分维度的类别
      for (Map resultMap : resultList) {
        Object currentDimension = resultMap.get(firstDimension.getResultAlias());
        if (currentDimension.equals(beforeDimension)) {
          currentSubdivisionList.add(resultMap.get(secendDimension.getResultAlias()));
        } else {
          beforeDimension = currentDimension;
          if (currentSubdivisionList.size() > secendDimensionList.size()) {
            secendDimensionList.clear();
            secendDimensionList.addAll(currentSubdivisionList);
          }
          currentSubdivisionList.clear();
          currentSubdivisionList.add(resultMap.get(secendDimension.getResultAlias()));
        }
      }
      if (currentSubdivisionList.size() > secendDimensionList.size()) {
        secendDimensionList.clear();
        secendDimensionList.addAll(currentSubdivisionList);
      }
      //结果序列索引
      int resultIndex = 0;
      //添加缺省值
      for (int sequentialIndex = 0; sequentialIndex < firstDimensionList.size();
          sequentialIndex++) {
        Object sequentialValue = firstDimensionList.get(sequentialIndex);
        for (int subdivisionIndex = 0; subdivisionIndex < secendDimensionList.size();
            subdivisionIndex++) {
          Object subdivisionValue = secendDimensionList.get(subdivisionIndex);
          if (resultIndex < resultList.size()) {
            Map result = resultList.get(resultIndex);
            Object resultSequentialValue = result.get(firstDimension.getResultAlias());
            Object resultSubdivisionValue = result.get(secendDimension.getResultAlias());
            if (!(sequentialValue.equals(resultSequentialValue) && subdivisionValue
                .equals(resultSubdivisionValue))) {
              Map<String, Object> insertMap = new LinkedHashMap<>();
              insertMap.put(firstDimension.getResultAlias(), sequentialValue);
              insertMap.put(secendDimension.getResultAlias(), subdivisionValue);
              for (Metric metric : queryParameter.getMetrics()) {
                insertMap.put(metric.getResultAlias(), 0);
              }
              resultList.add(resultIndex, insertMap);
            }
          } else {
            Map<String, Object> insertMap = new LinkedHashMap<>();
            insertMap.put(firstDimension.getResultAlias(), sequentialValue);
            insertMap.put(secendDimension.getResultAlias(), subdivisionValue);
            for (Metric metric : queryParameter.getMetrics()) {
              insertMap.put(metric.getResultAlias(), 0);
            }
            resultList.add(insertMap);
          }
          resultIndex++;
        }
      }
    }
  }

  private List<Object> firstDimensionList(QueryParameter queryParameter, Dimension firstDimension) {
    List<Object> firstDimensionList = new ArrayList<>();
    String start = null;
    String end = null;
    //统计时序图所包含的序列
    for (Filter filter : queryParameter.getDateFilters()) {
      if (filter.getField().equals(firstDimension.getField())) {
        if (">=".equals(filter.getOperator())) {
          start = filter.getStringValue();
        } else if ("<=".equals(filter.getOperator())) {
          end = filter.getStringValue();
        } else if ("in".equals(filter.getOperator())) {
          for (String dateValue : filter.getStringValue().split(",")) {
            firstDimensionList.add(dateValue);
          }
          break;
        }
      }
    }
    if (!firstDimensionList.isEmpty()) {// operator is 'in'
      return firstDimensionList;
    }

    try {
      if (queryParameter.getDateGranularity() == 2) {
        LocalDate startDate = LocalDate.parse(start, DateTimeFormat.forPattern("yyyy-ww"));
        LocalDate endDate = LocalDate.parse(end, DateTimeFormat.forPattern("yyyy-ww"));
        DateUtil.findWeeks(startDate, endDate).forEach(week -> {
          firstDimensionList.add(week);
        });
      } else {
        SimpleDateFormat sdf;
        List<Date> dateList;
        if (queryParameter.getDateGranularity() == 1) {
          sdf = new SimpleDateFormat("yyyy-MM");
          Date startDate = sdf.parse(start);
          Date endDate = sdf.parse(end);
          dateList = DateUtil.findMonths(startDate, endDate);
        } else {
          sdf = new SimpleDateFormat("yyyy-MM-dd");
          Date startDate = sdf.parse(start);
          Date endDate = sdf.parse(end);
          dateList = DateUtil.findDates(startDate, endDate);
        }
        for (Date dateValue : dateList) {
          firstDimensionList.add(sdf.format(dateValue));
        }
      }
    } catch (Exception e) {
      logger.error("转化日期错误");
    }

    return firstDimensionList;
  }


  /**
   * 查询记录的条数限制
   */
  protected void changeLimit(QueryParameter queryParameter) {
    Integer limitsCount = 1;
    for (Integer limitCount : queryParameter.getLimit()) {
      limitsCount *= limitCount;
    }
    if (limitsCount == 0 || queryParameter.getLimit().size() == 0) {
      limitsCount = queryParameter.getCount();
    }
    queryParameter.setCount(limitsCount);
  }

  /**
   * 转换keylin查询结果为同一格式
   */
  public List<Map<String, Object>> convertResult(List<String> columns, List<List<String>> rets) {
    List<Map<String, Object>> resultMapList = new ArrayList<>();
    for (List<String> ret : rets) {
      Map<String, Object> resultMap = new HashMap<>();
      for (int i = 0; i < ret.size(); i++) {
        resultMap.put(columns.get(i), ret.get(i));
      }
      resultMapList.add(resultMap);
    }
    return resultMapList;
  }


}
