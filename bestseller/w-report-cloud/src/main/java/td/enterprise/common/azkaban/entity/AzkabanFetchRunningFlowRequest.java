package td.enterprise.common.azkaban.entity;

import org.apache.http.ParseException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * Given an execution id, this API call fetches all the detailed information of that execution, including a list of all the job executions.
 * Method: GET
 * Request URL: /executor?ajax=fetchexecflow
 * Parameter Location: Request Query String
 *
 * @author yangtao
 */
public class AzkabanFetchRunningFlowRequest {

    /**
     * The fixed parameter indicating the fetchexecflow action.
     */
    private String url = "/executor";

    private String ajax = "getRunning";

    /**
     * The user session id.
     */
    private String sessionid;

    private String project;

    private String flow;


    /**
     * 将参数转化成url
     *
     * @return
     * @throws ParseException
     * @throws UnsupportedEncodingException
     * @throws IOException
     */
    public String parse() {
        List<BasicNameValuePair> pairs = new ArrayList<BasicNameValuePair>();
        pairs.add(new BasicNameValuePair("ajax", ajax));
        pairs.add(new BasicNameValuePair("session.id", sessionid));
        pairs.add(new BasicNameValuePair("project", project));
        pairs.add(new BasicNameValuePair("flow", flow));
        try {
            url = url + "?" + EntityUtils.toString(new UrlEncodedFormEntity(pairs, "UTF-8"));
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

    public void setUrl(String url) {
        this.url = url;
    }

    public void setAjax(String ajax) {
        this.ajax = ajax;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public void setFlow(String flow) {
        this.flow = flow;
    }
}
