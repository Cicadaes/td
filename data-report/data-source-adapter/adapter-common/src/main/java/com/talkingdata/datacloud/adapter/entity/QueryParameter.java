package com.talkingdata.datacloud.adapter.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.talkingdata.datacloud.util.StringUtils;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by yangruobin on 2017/6/1.
 */
public class QueryParameter implements Cloneable {

  protected static final Logger logger = LoggerFactory.getLogger(QueryParameter.class);

  protected String tenantId;
  @JsonIgnore
  protected Integer reportId;
  @JsonIgnore
  protected String charUUID;
  @JsonIgnore
  protected String userName;
  @JsonIgnore
  protected String requestTitle;
  protected Integer datasource_id;
  protected List<Dimension> dimensions = new ArrayList<>();
  protected List<Dimension> dateDimensions = new ArrayList<>();
  protected List<Metric> metrics = new ArrayList<>();
  protected List<Filter> filters = new ArrayList<>();
  protected List<Filter> dateFilters = new ArrayList<>();
  protected List<Integer> limit = new ArrayList<>();
  protected List<OrderBy> orderBy = new ArrayList<>();
  protected List<GroupBy> groupBy = new ArrayList<>();
  protected List<Map<String, String>> metricToDimension = new ArrayList<>();
  @JsonIgnore
  private Filter startDateFilter = null;
  @JsonIgnore
  private Filter endDateFilter = null;
  /**
   * 查询Sql语句
   */
  @JsonIgnore
  private String querySql;
  /**
   * 是否需要查询总页数
   */
  protected boolean pageCount = false;
  /**
   * 把指标中为null的记录转为0。
   */
  protected boolean nullToZero = true;
  /**
   * 当前指标相对于查询出来的某个维度总记录指标之和的占比。
   * 当ALL时时所有指标之和的占比
   */
  protected List<String> proportion = new ArrayList<>();
  /**
   * 当查询条件中的维度没有对应记录时，置为0。
   */
  protected boolean settingZero = false;
  /**
   * 默认为0，正常查询，当为1时，需要把limit外的数据查询出来。
   */
  protected Integer queryType = 0;
  /**
   * 日期粒度，默认为0，
   * 0:日粒度，查询条件的值格式为yyyy-MM-dd,
   * 1:月粒度,查询条件格式是yyyy-MM（注：MM为01-12）,
   * 2:周粒度，查询条件格式是yyyy-ww(注：ww为年中周数，00-52，星期一是星期的第一天 ),
   * 3:周粒度，查询条件格式是yyyy-ww(注：ww为年中周数，00-52，星期日是星期的第一天 )
   */
  protected Integer dateGranularity = 0;
  /**
   * 是否去重
   */
  protected boolean distinct = false;
  /**
   * 是否显示sql，默认为false
   */
  protected boolean showSql = false;
  /**
   * 每次查询标识
   */
  protected String queryId;
  @JsonIgnore
  protected Integer count = 100;
  @JsonIgnore
  protected String dataSourceName;
  @JsonIgnore
  protected String dataSourceConnectionInfo;

  public Integer getDatasource_id() {
    return datasource_id;
  }

  public void setDatasource_id(Integer datasource_id) {
    this.datasource_id = datasource_id;
  }

  public List<Dimension> getDimensions() {
    return dimensions;
  }

  public void setDimensions(List<Object> dimensions) {
    for (Object field : dimensions) {
      Dimension dimension = new Dimension();
      if (field instanceof String) {
        if (StringUtils.isEmpty((String) field)) {
          continue;
        }
        dimension.setField((String) field);
      } else {
        try {
          dimension = JSONUtils
              .readValueToBean(JSONUtils.writeValueAsString(field), Dimension.class);
        } catch (Exception e) {
          logger.info("转换FieldFunction失败:" + e.getMessage());
          continue;
        }
      }
      this.dimensions.add(dimension);
    }

  }

  public List<Metric> getMetrics() {
    return metrics;
  }

  public void setMetrics(List<Object> metrics) {
    for (Object field : metrics) {
      Metric metric = new Metric();
      if (field instanceof String) {
        if (StringUtils.isEmpty((String) field)) {
          continue;
        }
        metric.setField((String) field);
      } else {
        try {
          metric = JSONUtils.readValueToBean(JSONUtils.writeValueAsString(field), Metric.class);
        } catch (Exception e) {
          logger.info("转换FieldFunction失败:" + e.getMessage());
          continue;
        }
      }
      this.metrics.add(metric);
    }
  }

  public void setMetrics2(List<Metric> metrics) {
    this.metrics = metrics;
  }

  public void setOrderBy(List<Object> orderBys) {
    for (Object field : orderBys) {
      OrderBy orderBy = new OrderBy();
      if (field instanceof String) {
        if (StringUtils.isEmpty((String) field)) {
          continue;
        }
        orderBy.setField((String) field);
      } else {
        try {
          orderBy = JSONUtils.readValueToBean(JSONUtils.writeValueAsString(field), OrderBy.class);
        } catch (Exception e) {
          logger.info("转换FieldFunction失败:" + e.getMessage());
          continue;
        }
      }
      this.orderBy.add(orderBy);
    }
  }

  public void setGroupBy(List<GroupBy> groupBy) {
    this.groupBy = groupBy;
  }

  public List<Filter> getFilters() {
    return filters;
  }

  public void setFilters(List<Filter> filters) {
    this.filters = filters;
  }

  public Integer getCount() {
    return count;
  }

  public void setCount(Integer count) {
    this.count = count;
  }

  public List<Integer> getLimit() {
    return limit;
  }

  public void setLimit(List<Integer> limit) {
    this.limit = limit;
  }

  public Integer getQueryType() {
    return queryType;
  }

  public void setQueryType(Integer queryType) {
    this.queryType = queryType;
  }

  public String getDataSourceName() {
    return dataSourceName;
  }

  public void setDataSourceName(String dataSourceName) {
    this.dataSourceName = dataSourceName;
  }

  public String getDataSourceConnectionInfo() {
    return dataSourceConnectionInfo;
  }

  public void setDataSourceConnectionInfo(String dataSourceConnectionInfo) {
    this.dataSourceConnectionInfo = dataSourceConnectionInfo;
  }

  public List<OrderBy> getOrderBy() {
    return orderBy;
  }

  public List<GroupBy> getGroupBy() {
    return groupBy;
  }

  public boolean isPageCount() {
    return pageCount;
  }

  public void setPageCount(boolean pageCount) {
    this.pageCount = pageCount;
  }

  public boolean isSettingZero() {
    return settingZero;
  }

  public void setSettingZero(boolean settingZero) {
    this.settingZero = settingZero;
  }

  public List<Dimension> getDateDimensions() {
    return dateDimensions;
  }

  public void setDateDimensions(List<Dimension> dateDimensions) {
    this.dateDimensions = dateDimensions;
  }

  public List<Filter> getDateFilters() {
    return dateFilters;
  }

  public void setDateFilters(List<Filter> dateFilters) {
    this.dateFilters = dateFilters;
  }

  public Integer getDateGranularity() {
    return dateGranularity;
  }

  public void setDateGranularity(Integer dateGranularity) {
    this.dateGranularity = dateGranularity;
  }

  public Integer getReportId() {
    return reportId;
  }

  public void setReportId(Integer reportId) {
    this.reportId = reportId;
  }

  public String getCharUUID() {
    return charUUID;
  }

  public void setCharUUID(String charUUID) {
    this.charUUID = charUUID;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getRequestTitle() {
    return requestTitle;
  }

  public void setRequestTitle(String requestTitle) {
    this.requestTitle = requestTitle;
  }

  public boolean isShowSql() {
    return showSql;
  }

  public void setShowSql(boolean showSql) {
    this.showSql = showSql;
  }

  public boolean isNullToZero() {
    return nullToZero;
  }

  public void setNullToZero(boolean nullToZero) {
    this.nullToZero = nullToZero;
  }

  public Filter getStartDateFilter() {
    if (startDateFilter == null) {
      for (Filter dateFilter : dateFilters) {
        if (">=".equals(dateFilter.getOperator()) || ">".equals(dateFilter.getOperator())) {
          startDateFilter = dateFilter;
          break;
        }
      }
    }
    return startDateFilter;
  }

  public void setStartDateFilter(Filter startDateFilter) {
    this.startDateFilter = startDateFilter;
  }

  public Filter getEndDateFilter() {
    if (endDateFilter == null) {
      for (Filter dateFilter : dateFilters) {
        if ("<=".equals(dateFilter.getOperator()) || "<".equals(dateFilter.getOperator())) {
          endDateFilter = dateFilter;
        }
      }
    }
    return endDateFilter;
  }

  public void setEndDateFilter(Filter endDateFilter) {
    this.endDateFilter = endDateFilter;
  }

  @Override
  public String toString() {
    String queryParameter = null;
    try {
      queryParameter = JSONUtils.writeValueAsString(this);
    } catch (Exception e) {
      logger.error("JSON转换错误", e);
    }
    return queryParameter;
  }

  @Override
  public QueryParameter clone() throws CloneNotSupportedException {
    return (QueryParameter) super.clone();
  }

  public String getQuerySql() {
    return querySql;
  }

  public void setQuerySql(String querySql) {
    this.querySql = querySql;
  }

  public List<String> getProportion() {
    return proportion;
  }

  public void setProportion(List<String> proportion) {
    this.proportion = proportion;
  }

  public boolean isDistinct() {
    return distinct;
  }

  public void setDistinct(boolean distinct) {
    this.distinct = distinct;
  }

  public String getQueryId() {
    return queryId;
  }

  public void setQueryId(String queryId) {
    this.queryId = queryId;
  }

  public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }
}