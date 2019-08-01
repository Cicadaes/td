package td.enterprise.common.azkaban.entity;

import org.apache.http.ParseException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class AzkabanFetchFlowsofProjectRequest {

    /**
     * The fixed parameter indicating the fetchexecflow action.
     */
    private String ajax = "fetchprojectflows";

    /**
     * The user session id.
     */
    public String sessionid;

    /**
     * The project name to be fetched.
     */
    public String project;


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
        try {
            String url = "/manager?" + EntityUtils.toString(new UrlEncodedFormEntity(pairs, "UTF-8"));
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

    public String getSessionid() {
        return sessionid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

}
