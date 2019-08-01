package td.enterprise.framework.commons.error;

/**
 * Created by guodong.cheng on 15/9/10.
 */
public class NoSucnParamException extends RuntimeException {
    public NoSucnParamException() {
        super();
    }

    public NoSucnParamException(String key) {
        super("No such param '" + key + "' found!");
    }

    public NoSucnParamException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoSucnParamException(Throwable cause) {
        super(cause);
    }

}
