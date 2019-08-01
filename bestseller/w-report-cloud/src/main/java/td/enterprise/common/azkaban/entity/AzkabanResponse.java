package td.enterprise.common.azkaban.entity;

/**
 * azkaban 响应
 *
 * @author tao.yang
 * @date 2015年7月7日
 */
public abstract class AzkabanResponse {

    /**
     * 消息
     */
    private String message;

    /**
     * 状态
     */
    private String status;

    /**
     * 错误信息
     */
    private String error;

    /**
     * 判断是否失败
     *
     * @return
     */
    public abstract boolean failure();

    /**
     * 判断是否错误
     *
     * @return
     */
    public abstract boolean error();

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the error
     */
    public String getError() {
        return error;
    }

    /**
     * @param error the error to set
     */
    public void setError(String error) {
        this.error = error;
    }

}
