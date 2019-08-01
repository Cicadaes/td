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
 * 中止流程
 *
 * @author tao.yang
 * @date 2015年7月7日
 */

/**
 * @author tao.yang
 * @date 2015年7月7日
 *
 */
public class AzkabanCancelFlowRequest {

    /**
     * The fixed parameter indicating the current ajax action is cancelFlow.
     */
    private String ajax = "cancelFlow";

    /**
     * The user session id. Example Values: 30d538e2-4794-4e7e-8a35-25a9e2fd5300
     */
    private String sessionId;

    /**
     * The execution id.
     */
    private String execid;

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
        pairs.add(new BasicNameValuePair("session.id", sessionId));
        pairs.add(new BasicNameValuePair("execid", execid));

        try {
            String url = "/executor?" + EntityUtils.toString(new UrlEncodedFormEntity(pairs, "UTF-8"));
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

    public String getAjax() {
        return ajax;
    }

    public void setAjax(String ajax) {
        this.ajax = ajax;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getExecid() {
        return execid;
    }

    public void setExecid(String execid) {
        this.execid = execid;
    }

}
