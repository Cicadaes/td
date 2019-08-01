package td.enterprise.wanalytics.etl.common.error;

/**
 * Created by Yan on 16/3/17.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    /**
     * @param throwable 异常
     */
    @Deprecated
    public BusinessException(Throwable throwable) {
        super(throwable);
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
     * @param message
     * @param e
     */
    public BusinessException(String message, Exception e) {
        super(message, e);
    }
}
