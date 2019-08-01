package td.enterprise.framework.commons.error;

import java.text.MessageFormat;

@SuppressWarnings("serial")
public class DomainException extends Exception {
	
	public DomainException() {
		super();
	}

	public DomainException(String message) {
		super(message);
	}

	public DomainException(Throwable cause) {
		super(cause);
	}

	public DomainException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public DomainException(String exception, Object... args) {
		super(MessageFormat.format("Error. " + exception, args));
	}
	

}
