package td.enterprise.common.azkaban.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.ParseException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import td.enterprise.common.exception.BusinessException;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * 执行流程
 *
 * @author tao.yang
 * @date 2015年7月7日
 */

/**
 * @author tao.yang
 * @date 2015年7月7日
 *
 */
public class AzkabanExecuteFlowRequest {

    /**
     * The fixed parameter indicating the current ajax action is executeFlow.
     */
    private String ajax = "executeFlow";

    /**
     * The user session id. Example Values: 30d538e2-4794-4e7e-8a35-25a9e2fd5300
     */
    private String sessionId;

    /**
     * The project name of the executing flow.
     */
    private String project;

    /**
     * The flow id to be executed. Example Values: test-flow
     */
    private String flow;

    /**
     * (optional) 可选值 A list of job names that should be disabled for this
     * execution. Should be formatted as a JSON Array String. Example Values:
     * ["job_name_1", "job_name_2", "job_name_N"]
     */
    private String[] disabled;

    /**
     * (optional) 可选值 A list of emails to be notified if the execution succeeds.
     * All emails are delimitted with [,|;|\\s+]. Example Values:
     * foo@email.com,bar@email.com
     */
    private String successEmails;

    /**
     * (optional) 可选值 A list of emails to be notified if the execution fails.
     * All emails are delimitted with [,|;|\\s+]. Example Values:
     * foo@email.com,bar@email.com
     */
    private String failureEmails;

    /**
     * (optional) 可选值 Whether uses system default email settings to override
     * successEmails. Possible Values: true, false
     */
    private String successEmailsOverride;

    /**
     * (optional) 可选值 Whether uses system default email settings to override
     * failureEmails. Possible Values: true, false
     */
    private String failureEmailsOverride;

    /**
     * (optional) 可选值 Whether sends out email notifications as long as the first
     * failure occurs Possible Values: true, false
     */
    private String notifyFailureFirst;

    /**
     * (optional) 可选值 Whether sends out email notifications as long as the last
     * failure occurs. Possible Values: true, false
     */
    private String notifyFailureLast;

    /**
     * (optional) 可选值 If a failure occurs, how should the execution behaves.
     * Possible Values: finishCurrent, cancelImmediately, finishPossible
     */
    private String failureAction;

    /**
     * (optional) 可选值 Concurrent choices. Use ignore if nothing specifical is
     * required Possible Values: ignore, pipeline, queue
     */
    private String concurrentOption;

    /**
     * (optional) 可选值用于覆盖参数,当次有效
     */
    private Map<String, Object> flowOverride;

    /**
     * 将参数转化成url
     * @return
     * @throws ParseException
     * @throws UnsupportedEncodingException
     * @throws IOException
     */
    public String parse() throws BusinessException {
        List<BasicNameValuePair> pairs = new ArrayList<BasicNameValuePair>();
        pairs.add(new BasicNameValuePair("ajax", ajax));
        pairs.add(new BasicNameValuePair("session.id", sessionId));
        pairs.add(new BasicNameValuePair("project", project));
        pairs.add(new BasicNameValuePair("flow", flow));

        if (disabled != null && disabled.length > 0) {
            try {
                pairs.add(new BasicNameValuePair("disabled", new ObjectMapper().writeValueAsString(disabled)));
            } catch (Exception e) {
                throw new BusinessException("disabled参数转json出错", e);
            }
        }
        if (successEmails != null && !"".equals(successEmails)) {
            pairs.add(new BasicNameValuePair("successEmails", successEmails));
        }
        if (failureEmails != null && !"".equals(failureEmails)) {
            pairs.add(new BasicNameValuePair("failureEmails", successEmails));
        }
        if (successEmailsOverride != null && !"".equals(successEmailsOverride)) {
            pairs.add(new BasicNameValuePair("successEmailsOverride", successEmailsOverride));
        }
        if (failureEmailsOverride != null && !"".equals(failureEmailsOverride)) {
            pairs.add(new BasicNameValuePair("failureEmailsOverride", failureEmailsOverride));
        }
        if (notifyFailureFirst != null && !"".equals(notifyFailureFirst)) {
            pairs.add(new BasicNameValuePair("notifyFailureFirst", notifyFailureFirst));
        }
        if (notifyFailureLast != null && !"".equals(notifyFailureLast)) {
            pairs.add(new BasicNameValuePair("notifyFailureLast", notifyFailureLast));
        }
        if (failureAction != null && !"".equals(failureAction)) {
            pairs.add(new BasicNameValuePair("failureAction", failureAction));
        }
        if (concurrentOption != null && !"".equals(concurrentOption)) {
            pairs.add(new BasicNameValuePair("concurrentOption", concurrentOption));
        }
        try {
            String url = "/executor?" + EntityUtils.toString(new UrlEncodedFormEntity(pairs, "UTF-8"));
            if (flowOverride != null && flowOverride.size() > 0) {
                for (Entry<String, Object> flowOverrideEntry : flowOverride.entrySet()) {
                    String key = flowOverrideEntry.getKey();
                    String value = String.valueOf(flowOverrideEntry.getValue());
                    org.apache.commons.codec.net.URLCodec urlCodec = new org.apache.commons.codec.net.URLCodec();
                    url += "&flowOverride[" + key + "]=" + urlCodec.encode(value);
                }
            }
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

    /**
     * @return the sessionId
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * @param sessionId
     *            the sessionId to set
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * @return the project
     */
    public String getProject() {
        return project;
    }

    /**
     * @param project
     *            the project to set
     */
    public void setProject(String project) {
        this.project = project;
    }

    /**
     * @return the flow
     */
    public String getFlow() {
        return flow;
    }

    /**
     * @param flow
     *            the flow to set
     */
    public void setFlow(String flow) {
        this.flow = flow;
    }

    /**
     * @return the successEmails
     */
    public String getSuccessEmails() {
        return successEmails;
    }

    /**
     * @param successEmails
     *            the successEmails to set
     */
    public void setSuccessEmails(String successEmails) {
        this.successEmails = successEmails;
    }

    /**
     * @return the failureEmails
     */
    public String getFailureEmails() {
        return failureEmails;
    }

    /**
     * @param failureEmails
     *            the failureEmails to set
     */
    public void setFailureEmails(String failureEmails) {
        this.failureEmails = failureEmails;
    }

    /**
     * @return the successEmailsOverride
     */
    public String getSuccessEmailsOverride() {
        return successEmailsOverride;
    }

    /**
     * @param successEmailsOverride
     *            the successEmailsOverride to set
     */
    public void setSuccessEmailsOverride(String successEmailsOverride) {
        this.successEmailsOverride = successEmailsOverride;
    }

    /**
     * @return the failureEmailsOverride
     */
    public String getFailureEmailsOverride() {
        return failureEmailsOverride;
    }

    /**
     * @param failureEmailsOverride
     *            the failureEmailsOverride to set
     */
    public void setFailureEmailsOverride(String failureEmailsOverride) {
        this.failureEmailsOverride = failureEmailsOverride;
    }

    /**
     * @return the notifyFailureFirst
     */
    public String getNotifyFailureFirst() {
        return notifyFailureFirst;
    }

    /**
     * @param notifyFailureFirst
     *            the notifyFailureFirst to set
     */
    public void setNotifyFailureFirst(String notifyFailureFirst) {
        this.notifyFailureFirst = notifyFailureFirst;
    }

    /**
     * @return the notifyFailureLast
     */
    public String getNotifyFailureLast() {
        return notifyFailureLast;
    }

    /**
     * @param notifyFailureLast
     *            the notifyFailureLast to set
     */
    public void setNotifyFailureLast(String notifyFailureLast) {
        this.notifyFailureLast = notifyFailureLast;
    }

    /**
     * @return the failureAction
     */
    public String getFailureAction() {
        return failureAction;
    }

    /**
     * @param failureAction
     *            the failureAction to set
     */
    public void setFailureAction(String failureAction) {
        this.failureAction = failureAction;
    }

    /**
     * @return the concurrentOption
     */
    public String getConcurrentOption() {
        return concurrentOption;
    }

    /**
     * @param concurrentOption
     *            the concurrentOption to set
     */
    public void setConcurrentOption(String concurrentOption) {
        this.concurrentOption = concurrentOption;
    }

    /**
     * @return the disabled
     */
    public String[] getDisabled() {
        return disabled;
    }

    /**
     * @param disabled
     *            the disabled to set
     */
    public void setDisabled(String[] disabled) {
        this.disabled = disabled;
    }

    /**
     * @return the flowOverride
     */
    public Map<String, Object> getFlowOverride() {
        return flowOverride;
    }

    /**
     * @param flowOverride the flowOverride to set
     */
    public void setFlowOverride(Map<String, Object> flowOverride) {
        this.flowOverride = flowOverride;
    }

}
