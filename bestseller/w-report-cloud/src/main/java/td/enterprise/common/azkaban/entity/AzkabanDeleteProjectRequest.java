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
 * 创建项目
 *
 * @author ran.li
 * @date 2017年1月18日
 */
public class AzkabanDeleteProjectRequest {

    /**
     * The user session id. Example Values: 30d538e2-4794-4e7e-8a35-25a9e2fd5300
     */
    private String sessionId;

    /**
     * The fixed parameter to indicate the deleting project action.
     */
    private String delete = "true";

    /**
     * The description for the project. This field cannot be empty.
     */
    private String project;

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
        pairs.add(new BasicNameValuePair("delete", delete));
        pairs.add(new BasicNameValuePair("session.id", sessionId));
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

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }


}
