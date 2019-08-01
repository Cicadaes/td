package com.talkingdata.datacloud.service.report;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Joiner;
import com.talkingdata.datacloud.util.HttpUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/2/13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Service
public class SnipeProxyService {

  private Logger logger = LoggerFactory.getLogger(SnipeProxyService.class);

  public SnipeChart chartDetail(String url, String chartId) {
    List<SnipeChart> charts = chartInfo(url, chartId);
    if (charts.size() > 0) {
      return charts.get(0);
    }
    return SnipeChart.NULL_OBJECT;
  }

  public List<SnipeChart> chartDetail(String url, List<String> chartIds) {
    String ids = Joiner.on(",").join(chartIds);
    return chartInfo(url, ids);
  }

  public List<SnipeChart> chartInfo(String url, String chartIds) {
    try {
      Map<String, Object> queryParam = new HashMap<>();
      queryParam.put("ids", chartIds);
      String json = HttpUtil.get(url, queryParam);
      String result = new ObjectMapper().readTree(json).get("result").toString();
      List<SnipeChart> response = new ObjectMapper().readValue(result, new TypeReference<List<SnipeChart>>() {
      });
      return response;
    } catch (Exception e) {
      logger.error("Get chart {} from Snipe failed {}", chartIds, e);
    }
    return Collections.emptyList();
  }

  public SnipeReport reportDetail(String url, String reportId) {
    List<SnipeReport> reports = reportInfo(url, reportId);
    if (reports.size() > 0) {
      return reports.get(0);
    }
    return SnipeReport.NULL_OBJECT;
  }

  public List<SnipeReport> reportDetail(String url, List<String> reportIds) {
    String ids = Joiner.on(",").join(reportIds);
    return reportInfo(url, ids);
  }

  private List<SnipeReport> reportInfo(String url, String reportIds) {
    try {
      Map<String, Object> queryParam = new HashMap<>();
      queryParam.put("ids", reportIds);
      String json = HttpUtil.get(url, queryParam);
      String result = new ObjectMapper().readTree(json).get("result").toString();
      List<SnipeReport> response = new ObjectMapper().readValue(result, new TypeReference<List<SnipeReport>>() {
      });
      return response;
    } catch (Exception e) {
      logger.error("Get report {} from Snipe failed {}", reportIds, e);
    }
    return Collections.emptyList();
  }

  public static class SnipeChart {
    public final String _id;
    public final String img;
    public final String dataId;
    public final String chartName;
    public final String chartType;
    public final int reportCount;
    public final static SnipeChart NULL_OBJECT = new SnipeChart("0", "", "0", "Get title failed", "0", 0);

    @JsonCreator
    public SnipeChart(@JsonProperty("_id") String _id, @JsonProperty("img") String img, @JsonProperty("dataId") String dataId,
                      @JsonProperty("chartName") String chartName, @JsonProperty("chartType") String chartType, @JsonProperty("reportCount") int reportCount) {
      this._id = _id;
      this.img = img;
      this.dataId = dataId;
      this.chartName = chartName;
      this.chartType = chartType;
      this.reportCount = reportCount;
    }
  }

  public static class SnipeReport {
    public final String id;
    public final String title;
    public final int chartCount;
    public final String createDateTime;
    public final String modifyDataTime;
    public final static SnipeReport NULL_OBJECT = new SnipeReport("0", "Get title failed", 0, "", "");

    @JsonCreator
    public SnipeReport(@JsonProperty("id") String id, @JsonProperty("title") String title, @JsonProperty("chartCount") int chartCount,
                       @JsonProperty("createDateTime") String createDateTime, @JsonProperty("modifyDataTime") String modifyDataTime) {
      this.id = id;
      this.title = title;
      this.chartCount = chartCount;
      this.createDateTime = createDateTime;
      this.modifyDataTime = modifyDataTime;
    }
  }
}
