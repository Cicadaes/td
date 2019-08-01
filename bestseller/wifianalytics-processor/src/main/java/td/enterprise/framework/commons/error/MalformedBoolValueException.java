package td.enterprise.framework.commons.error;

/**
 * Created by guodong.cheng on 15/9/10.
 */
public class MalformedBoolValueException extends RuntimeException {
    public MalformedBoolValueException() {
        super();
    }

    public MalformedBoolValueException(String value) {
        super("Malformed boolean value '" + value + "'!");
    }

    public MalformedBoolValueException(String message, Throwable cause) {
        super(message, cause);
    }

    public MalformedBoolValueException(Throwable cause) {
        super(cause);
    }

}
