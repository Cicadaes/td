package td.enterprise.common.azkaban.entity;

import org.apache.http.ParseException;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

/**
 * Schedule Flow
 *
 * @author Yan
 * @date 2016年11月14日
 */

public class AzkabanScheduleFlowRequest {

    /**
     * simple
     * curl -k http://54.222.189.137/schedule -d "ajax=scheduleFlow&projectName=CounterDayTask&flow=WifiAnalyticsCounterDayMaster&projectId=7&scheduleTime=1,06,AM,CST&scheduleDate=&is_recurring=on&period=1d" -b azkaban.browser.session.id=4b5c23d2-ecd9-4ed9-9c8f-f377974f43cc
     */

    private String url = "/schedule";

    /**
     * The fixed parameter indicating the current ajax action is executeFlow.
     */
    private String ajax = "scheduleFlow";

    /**
     * The user session id. Example Values: 30d538e2-4794-4e7e-8a35-25a9e2fd5300
     */
    private String sessionId;

    /**
     * The project name of the executing flow.
     */
    private String projectName;

    /**
     * The flow id to be executed. Example Values: test-flow
     */
    private String flowName;

    private String projectId;

    private String scheduleTime;

    private String scheduleDate;

    private String is_recurring;

    private String period;

    /**
     * 将参数转化成url
     *
     * @return
     * @throws ParseException
     * @throws UnsupportedEncodingException
     * @throws IOException
     */
    public String parse() {
        Map<String, Object> pairs = new HashMap<String, Object>();
        pairs.put("session.id", sessionId);
        pairs.put("projectName", projectName);
        pairs.put("projectId", projectId);
        pairs.put("flow", flowName);
        pairs.put("scheduleTime", scheduleTime);
        pairs.put("scheduleDate", scheduleDate);
        pairs.put("ajax", ajax);
        if (null != is_recurring && is_recurring.equals("on")) {
            pairs.put("is_recurring", is_recurring);
            pairs.put("period", period);
        }

        try {
            url = url + "?" + getUrlParamsByMap(pairs);
            return url;
        } catch (Throwable th) {
            if (th instanceof Error) {
                throw ((Error) th);
            }
            if (th instanceof RuntimeException) {
                throw ((RuntimeException) th);
            }
            throw new RuntimeException(th);
        }
    }

    public static String getUrlParamsByMap(Map<String, Object> map) {
        if (map == null) {
            return "";
        }
        StringBuffer sb = new StringBuffer();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            sb.append(entry.getKey() + "=" + entry.getValue());
            sb.append("&");
        }
        String s = sb.toString();
        if (s.endsWith("&")) {
            s = org.apache.commons.lang.StringUtils.substringBeforeLast(s, "&");
        }
        return s;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public void setFlowName(String flowName) {
        this.flowName = flowName;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public void setScheduleTime(String scheduleTime) {
        this.scheduleTime = scheduleTime;
    }

    public void setScheduleDate(String scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public void setIs_recurring(String is_recurring) {
        this.is_recurring = is_recurring;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
