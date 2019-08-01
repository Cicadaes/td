package td.enterprise.common.exception;


import td.enterprise.common.constant.SystemMessage;
import td.enterprise.common.util.MessageHelper;

/**
 * 业务异常信息
 *
 * @author tao.yang
 * @date 2015年7月11日
 */
public class BusinessException extends Exception {

    /**
     *
     */
    private static final long serialVersionUID = -7988813165075626448L;

    private SystemMessage systemMessage;
    private Object[] msgArgs;

    /**
     * @param message       日志消息
     * @param cause
     * @param systemMessage 系统消息
     * @param msgArgs       系统消息参数
     */
    public BusinessException(String message, Throwable cause, SystemMessage systemMessage, Object... msgArgs) {
        super(message, cause);
        this.systemMessage = systemMessage;
        this.msgArgs = msgArgs;
    }

    /**
     * @param cause
     * @param systemMessage 系统消息
     * @param msgArgs       系统消息参数
     */
    public BusinessException(Throwable cause, SystemMessage systemMessage, Object... msgArgs) {
        super(cause.getMessage(), cause);
        this.systemMessage = systemMessage;
        this.msgArgs = msgArgs;
    }

    /**
     * @param message       日志消息
     * @param systemMessage 系统消息
     * @param msgArgs       系统消息参数
     */
    public BusinessException(String message, SystemMessage systemMessage, Object... msgArgs) {
        super(message);
        this.systemMessage = systemMessage;
        this.msgArgs = msgArgs;
    }

    /**
     * @param systemMessage 系统消息
     * @param msgArgs       系统消息参数
     */
    public BusinessException(SystemMessage systemMessage, Object... msgArgs) {
        super(MessageHelper.getSystemMessage(systemMessage));
        this.systemMessage = systemMessage;
        this.msgArgs = msgArgs;
    }

    public SystemMessage getSystemMessage() {
        return systemMessage;
    }

    public Object[] getMsgArgs() {
        return msgArgs;
    }


    /**
     * 异常信息
     *
     * @param formatMessage
     */
    @Deprecated
    public BusinessException(String formatMessage, String... args) {
        super(String.format(formatMessage, args));
    }

    /**
     * 异常信息
     *
     * @param code
     */
    public BusinessException(String code) {
        super(code);
        this.code = code;
    }

    /**
     * 构造函数 :异常信息
     *
     * @param errorCode 错误编码
     * @param code      翻译编码或者是错误信息
     */
    @Deprecated
    public BusinessException(String code, String errorCode) {
        super(code);
        this.code = code;
        this.errorCode = errorCode;
    }

    /**
     * 异常
     *
     * @param e 异常
     */
    @Deprecated
    public BusinessException(Exception e) {
        super(e);
    }

    /**
     * @param message
     * @param e
     */
    public BusinessException(String message, Exception e) {
        super(message, e);
    }

    public BusinessException(String code, String errorCode, Exception e) {
        super(code);
        this.code = code;
        this.errorCode = errorCode;
    }

    /**
     * @param throwable 异常
     */
    @Deprecated
    public BusinessException(Throwable throwable) {
        super(throwable);
    }

    /**
     * @param message   异常消息
     * @param throwable 异常
     */
    @Deprecated
    public BusinessException(String message, Throwable throwable) {
        super(message, throwable);
    }

    @Deprecated
    private String code;

    @Deprecated
    private String errorCode;

    @Deprecated
    public String getCode() {
        return code;
    }

    @Deprecated
    public void setCode(String code) {
        this.code = code;
    }

    @Deprecated
    public void setMsgArgs(Object[] msgArgs) {
        this.msgArgs = msgArgs;
    }

    @Deprecated
    public String getErrorCode() {
        return errorCode;
    }

    @Deprecated
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    @Deprecated
    public BusinessException(String code, Throwable t, Object[] msgArgs) {
        super(code, t);
        this.code = code;
//		this.throwable = t;
        this.msgArgs = msgArgs;
    }

    @Deprecated
    public BusinessException(String code, Object[] msgArgs) {
        super(code);
        this.code = code;
        this.msgArgs = msgArgs;
    }

}
