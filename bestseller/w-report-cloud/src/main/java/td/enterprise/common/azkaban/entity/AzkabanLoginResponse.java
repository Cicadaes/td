package td.enterprise.common.azkaban.entity;


/**
 * azkaban 登录响应
 *
 * @author tao.yang
 * @date 2015年7月6日
 */
public class AzkabanLoginResponse extends AzkabanResponse {

    private String sessionId;

    /**
     * @return the sessionId
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * @param sessionId the sessionId to set
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean failure() {
        return !(sessionId != null && !"".equals(sessionId));
    }

    public boolean error() {
        return failure();
    }

}
