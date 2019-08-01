package com.talkingdata.datacloud.adapter.common;

import com.talkingdata.datacloud.adapter.entity.*;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import org.apache.commons.lang.StringUtils;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import static com.talkingdata.datacloud.adapter.util.DataBaseUtil.queryForList;

/**
 * Created by yangruobin on 2017/11/29.
 */
public abstract class AbstractMysqlAdapter extends AbstractAdapter {

  protected static final String DIRVERCLASSNAME = "com.mysql.jdbc.Driver";

  @Override
  public boolean testConnection(String dataSourceConnectionInfo) {
    JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSourceConnectionInfo, DIRVERCLASSNAME);
    return DataBaseUtil.testConnection(jdbcBean);
  }

  @Override
  public List<String> viewSourceList(String dataSourceConnectionInfo) {
    JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSourceConnectionInfo, DIRVERCLASSNAME);
    return DataBaseUtil.showTables(jdbcBean);
  }

  @Override
  public List<String> getViewList(String dataSourceConnectionInfo) {
    JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSourceConnectionInfo, DIRVERCLASSNAME);
    return DataBaseUtil.showView(jdbcBean);
  }

  @Override
  public String getQuerySql(String dataSourceConnectionInfo, String tableName) {
    JdbcBean jdbcBean = JdbcBean.getJdbcBean(dataSourceConnectionInfo, DIRVERCLASSNAME);
    String querySql = "SELECT * FROM " + tableName;
    List<String> columnRes = DataBaseUtil.querySomeMetaData(jdbcBean, querySql, null, true);
    return String
        .format("SELECT %s FROM %s", StringUtils.join(columnRes.toArray(), ","), tableName);
  }

  @Override
  protected String assemblingSql(JdbcBean jdbcBean, QueryParameter queryParameter)
      throws Exception {
    StringBuilder operatorSb = new StringBuilder();
    String prefixName = "REPORT_TEMP_";
    char suffixName = 'A';
    String aliasName = prefixName + suffixName;
    StringBuilder fromTableSql = new StringBuilder();
    StringBuilder whereSql = new StringBuilder();
    StringBuilder selectSql = new StringBuilder();
    StringBuilder groupBySql = new StringBuilder();
    StringBuilder orderBySql = new StringBuilder();
    StringBuilder limitBySql = new StringBuilder();

    fromTableSql.append(" FROM ");
    String[] selectAndGroupAndOrder = getSelectAndGroupAndOrderSql(jdbcBean, queryParameter);
    //合并select语句
    selectSql.append(selectAndGroupAndOrder[0]);
    //合并groupBy语句
    groupBySql.append(selectAndGroupAndOrder[1]);
    //添加where条件
    whereSql.append(getWhereSqlWithWhereStr(queryParameter));
    //添加orderBy字段
    orderBySql.append(selectAndGroupAndOrder[2]);
    //添加from字段
    fromTableSql.append(jdbcBean.getTableName() + " AS " + aliasName);
    //条数限制
    limitBySql.append(getLimitSqlStr(queryParameter));
    operatorSb.append(selectSql).append(fromTableSql).append(whereSql).append(groupBySql)
        .append(orderBySql).append(limitBySql);
    queryParameter.setQuerySql(operatorSb.toString());
    return queryParameter.getQuerySql();
  }

  /**
   * 统计其他扇区数据
   */
  @Override
  protected void addOtherResult(JdbcBean jdbcBean, QueryParameter queryParameter,
      List<Map<String, Object>> result) throws Exception {
    if (queryParameter.getQueryType() != 1) {
      return;
    }
    //统计饼图里"其他"扇区的数据
    String dimentioins = null;

    //维度查询的个数
    for (Dimension dimentioinFieldFunction : queryParameter.getDimensions()) {
      if (dimentioins == null) {
        dimentioins = dimentioinFieldFunction.getField();
      } else {
        dimentioins += "," + dimentioinFieldFunction.getField();
      }
    }
    StringBuilder whereSql = new StringBuilder();

    whereSql.append(getWhereSqlWithWhereStr(queryParameter));

    String countSql =
        "SELECT COUNT(DISTINCT " + dimentioins + ") AS COUNT FROM " + jdbcBean.getTableName()
            + " AS TEMP_COUNT " + whereSql.toString();
    List<Map<String, Object>> totalCountResult = queryForList(jdbcBean, countSql);
    Long allCount = (Long) totalCountResult.get(0).get("COUNT");
    if (allCount > queryParameter.getCount()) {
      //统计所有指标的总量
      QueryParameter totalQueryParameter = new QueryParameter();
      totalQueryParameter.setMetrics2(queryParameter.getMetrics());
      totalQueryParameter.setFilters(queryParameter.getFilters());
      String totalSql = assemblingSql(jdbcBean, totalQueryParameter);
      List<Map<String, Object>> totalResult = queryForList(jdbcBean, totalSql);
      Map<String, Object> totalResultMap = totalResult.get(0);
      //总量减去前n-1条记录的指标即为其他的指标之和
      for (int i = 0; i < result.size() - 1; i++) {
        Map<String, Object> mainResult = result.get(i);
        for (Metric metric : queryParameter.getMetrics()) {
          Double value = Double.parseDouble(mainResult.get(metric.getField()).toString());
          Double allValue = Double.parseDouble(totalResultMap.get(metric.getField()).toString());
          totalResultMap.put(metric.getField(), allValue - value);
        }
      }
      for (Dimension dimension : queryParameter.getDimensions()) {
        totalResultMap.put(dimension.getField(), "其他");
      }
      //去掉最后一个，把其他改为最后一个
      result.remove(result.size() - 1);
      result.add(totalResultMap);
    }
  }

  @Override
  protected String assemblingPageCountSql(QueryParameter queryParameter) {
    String querySql = queryParameter.getQuerySql();
    String queryCountSql =
        "SELECT COUNT(*) AS pageCount FROM (" + querySql.substring(0, querySql.lastIndexOf("LIMIT"))
            + ") AS TEMP";
    return queryCountSql;
  }

  /**
   * 拼装SELECT和GROUP的SQL
   */
  protected String[] getSelectAndGroupAndOrderSql(JdbcBean jdbcBean,
      QueryParameter queryParameter) {
    List<String> selectSqlList = new ArrayList<>();
    List<String> groupBySqlList = new ArrayList<>();
    List<String> dimentsionList = new ArrayList<>();
    StringBuilder selectSql = new StringBuilder();
    StringBuilder groupBySql = new StringBuilder();
    selectSql.append("SELECT ");

    if (queryParameter.isDistinct()) {
      selectSql.append("DISTINCT ");
    }

    //添加groupBy语句
    for (GroupBy groupByFieldFunction : queryParameter.getGroupBy()) {
      String functionField = getFieldFunction(groupByFieldFunction.getField(),
          groupByFieldFunction.getFunction(), jdbcBean.getDriverClassName());
      groupBySqlList.add(functionField);
    }
    //添加select中的日期维度字段
    for (Dimension dateDimension : queryParameter.getDateDimensions()) {
      String dateField;
      if (queryParameter.getDateGranularity() == 1) {
        dateField = "DATE_FORMAT(" + dateDimension.getField() + ", '%Y-%m')";
      } else if (queryParameter.getDateGranularity() == 2) {
//        dateField = "DATE_FORMAT(" + dateDimension.getField() + ", '%Y-%U')";
        dateField = "CONCAT(year(date),'-',lpad(week(date,3),2,0))";
      } else if (queryParameter.getDateGranularity() == 3) {
        dateField = "CONCAT(year(date),'-',lpad(week(date,6),2,0))";
      } else {
        dateField = dateDimension.getField();
      }
      selectSqlList.add(dateField + " AS " + dateDimension.getAlias());
      dimentsionList.add(dateField);
    }
    //添加select中的维度字段
    for (Dimension dimension : queryParameter.getDimensions()) {
      selectSqlList.add(dimension.getField() + " AS " + dimension.getAlias());
      dimentsionList.add(dimension.getAlias());
    }
    //当存在指标并且没有指定分组信息时则用维度分组
    if (queryParameter.getMetrics().size() != 0 && queryParameter.getGroupBy().size() == 0) {
      for (String groupByDimension : dimentsionList) {
        groupBySqlList.add(groupByDimension);
      }
    }

    //添加select中的指标字段
    for (Metric metric : queryParameter.getMetrics()) {
      selectSqlList.add(
          getFieldFunction(metric.getField(), metric.getFunction(), jdbcBean.getDriverClassName())
              + " AS " + metric.getAlias());
    }
    selectSql.append(StringUtils.join(selectSqlList.toArray(), ",") + " ");

    if (queryParameter.getDimensions().size() > 0
        || queryParameter.getDateDimensions().size() > 0) {
      if (groupBySqlList.size() > 0) {
        groupBySql.append(" GROUP BY " + StringUtils.join(groupBySqlList.toArray(), ",") + " ");
      }
    }
    String orderBySql = getOrderByStr(jdbcBean.getDriverClassName(), queryParameter,
        StringUtils.join(dimentsionList.toArray(), ",") + " ");
    String[] selectAndGroups = new String[3];
    selectAndGroups[0] = selectSql.toString();
    selectAndGroups[1] = groupBySql.toString();
    selectAndGroups[2] = orderBySql;
    return selectAndGroups;
  }

  public String getLimitSqlStr(QueryParameter queryParameter) {
    Integer startRow = 0;
    Integer endRow = queryParameter.getCount();
    //添加limit语句
    if (queryParameter.getLimit().size() == 2) {
      int pageId = queryParameter.getLimit().get(0); // 当前页
      int pageSize = queryParameter.getLimit().get(1); // 页大小
      startRow = (pageId - 1) * pageSize;
      endRow = pageSize;
    } else if (queryParameter.getLimit().size() == 1) {
      endRow = queryParameter.getLimit().get(0);
      if (endRow == -1) {
        return "";
      }
    }
    String limitBySql = " LIMIT " + startRow + "," + endRow;
    return limitBySql;
  }

  public String getOrderByStr(String driverClassName, QueryParameter queryParameter) {
    List<String> orderBySqlList = new ArrayList<>();
    if (queryParameter.getOrderBy().size() > 0) {
      for (OrderBy orderByFieldFunction : queryParameter.getOrderBy()) {
        orderBySqlList.add(
            getFieldFunction(orderByFieldFunction.getField(), orderByFieldFunction.getFunction(),
                driverClassName));
      }
      String orderBySql = " ORDER BY " + StringUtils.join(orderBySqlList.toArray(), ",") + " ";
      return orderBySql;
    }
    return "";
  }

  public String getOrderByStr(String driverClassName, QueryParameter queryParameter,
      String dimentsionList) {
    String orderBySql = getOrderByStr(driverClassName, queryParameter);
    if (StringUtils.isEmpty(orderBySql) && !"".equals(dimentsionList.trim())) {
      orderBySql = " ORDER BY " + dimentsionList;
    }
    return orderBySql;
  }

  public String getWhereSqlWithWhereStr(QueryParameter queryParameter) throws Exception {
    StringBuilder whereSql = new StringBuilder();
    if (queryParameter.getFilters().size() > 0 || queryParameter.getDateFilters().size() > 0) {
      whereSql.append(" WHERE 1=1 ");
    }
    whereSql.append(getWhereSqlStr(queryParameter));
    return whereSql.toString();
  }


  public static String getWhereSqlStr(QueryParameter queryParameter) throws Exception {
    StringBuilder whereSql = new StringBuilder();
    SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy-MM-dd");
    for (Filter dateFilter : queryParameter.getDateFilters()) {
      String dateFilterField = dateFilter.getField();
      String dateFilterValue = (String) dateFilter.getValue();
      String dateFileterOperator = dateFilter.getOperator();
      String dataFilterChangeValue = null;
      //查找某月或者某周的第一天
      if ("<".equals(dateFileterOperator) || ">=".equals(dateFileterOperator)) {
        if (queryParameter.getDateGranularity() == 1) {
          SimpleDateFormat monthSdf = new SimpleDateFormat("yyyy-MM");
          Calendar calendar = Calendar.getInstance();
          calendar.setTime(monthSdf.parse(dateFilterValue));
          calendar.set(Calendar.DAY_OF_MONTH, 1);
          dataFilterChangeValue = dateSdf.format(calendar.getTime());
        } else if (queryParameter.getDateGranularity() == 2) {
//                  SimpleDateFormat weekSdf = new SimpleDateFormat("yyyy-ww");
          LocalDate date = LocalDate.parse(dateFilterValue, DateTimeFormat.forPattern("yyyy-ww"));
          dataFilterChangeValue = dateSdf.format(date.toDate());
        } else {
          dataFilterChangeValue = dateFilter.getStringValue();
        }
      }//查找某月或者某周的最后一天
      else if (">".equals(dateFileterOperator) || "<=".equals(dateFileterOperator)) {
        if (queryParameter.getDateGranularity() == 1) {
          SimpleDateFormat monthSdf = new SimpleDateFormat("yyyy-MM");
          Calendar calendar = Calendar.getInstance();
          calendar.setTime(monthSdf.parse(dateFilterValue));
          calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
          dataFilterChangeValue = dateSdf.format(calendar.getTime());
        } else if (queryParameter.getDateGranularity() == 2) {
          LocalDate date = LocalDate.parse(dateFilterValue, DateTimeFormat.forPattern("yyyy-ww"));
          date = date.minusDays(-6);
          dataFilterChangeValue = dateSdf.format(date.toDate());
        } else {
          dataFilterChangeValue = dateFilter.getStringValue();
        }
      }//查找某月或者某周的最后一天
      else if ("=".equals(dateFileterOperator)) {
        if (queryParameter.getDateGranularity() == 1) {
          SimpleDateFormat monthSdf = new SimpleDateFormat("yyyy-MM");
          Calendar calendar = Calendar.getInstance();
          calendar.setTime(monthSdf.parse(dateFilterValue));
          calendar.set(Calendar.DAY_OF_MONTH, 1);
          dataFilterChangeValue = dateSdf.format(calendar.getTime());
          whereSql.append(" AND `" + dateFilterField + "` >= '" + dataFilterChangeValue + "'");

          calendar.setTime(monthSdf.parse(dateFilterValue));
          calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
          dataFilterChangeValue = dateSdf.format(calendar.getTime());
          dateFilter.setOperator("<=");
        } else if (queryParameter.getDateGranularity() == 2) {
          LocalDate date = LocalDate.parse(dateFilterValue, DateTimeFormat.forPattern("yyyy-ww"));
          dataFilterChangeValue = dateSdf.format(date.toDate());
          whereSql.append(" AND `" + dateFilterField + "` >= '" + dataFilterChangeValue + "'");

          date = date.minusDays(-6);
          dataFilterChangeValue = dateSdf.format(date.toDate());
          dateFilter.setOperator("<=");
        } else {
          dataFilterChangeValue = dateFilter.getStringValue();
        }
      }
      if ("in".equals(dateFileterOperator)) {
        dataFilterChangeValue = "('" + dateFilterValue.replace(",", "','") + "')";
        whereSql.append(" AND `" + dateFilterField + "` " + dateFilter.getOperator() + " "
            + dataFilterChangeValue + "");
      } else {
        whereSql.append(" AND `" + dateFilterField + "` " + dateFilter.getOperator() + " '"
            + dataFilterChangeValue + "'");
      }

    }
    for (Filter filter : queryParameter.getFilters()) {
      String value = filter.getValue() + "";
      if ("%%".equals(value)) {
        //如果查询值为%%,则直接忽略查询条件
        continue;
      } else if (filter.getOperator().equals("in")) {
        String valueStr = "'" + (value).replace(",", "','") + "'";
        whereSql.append(
            " AND `" + filter.getField() + "` " + filter.getOperator() + " (" + valueStr + ")");
      } else {
        whereSql.append(
            " AND `" + filter.getField() + "` " + filter.getOperator() + " '" + value + "'");
      }
    }
    return whereSql.toString();
  }

  private String getFieldFunction(String field, String function, String driverName) {
    if (!field.matches("[`0-9a-zA-Z_\\u4e00-\\u9fa5]*")) {
      return field;
    } else if (StringUtils.isEmpty(function)) {
      return "SUM(" + field + ")";
    } else if (function.equals("year")) {
      return "DATE_FORMAT(" + field + ", '%Y')";
    } else if (function.equals("month")) {
      return "DATE_FORMAT(" + field + ", '%Y-%m')";
    } else if (function.toLowerCase().equals("desc") || function.toLowerCase().equals("asc")) {
      return field + " " + function;
    } else if (function.equals("noFunction")) {
      return field;
    } else {
      return function + "(" + field + ")";
    }
  }

}
