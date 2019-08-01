/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.status;

/**
 * The Enum HandleStatus. The default character set is UTF-8
 * 
 * @author davy
 */
public enum HandleStatus implements Status {

	/** The success. */
	success(1),
	/** The fail. */
	fail(2),
	/** The error. */
	error(3),
	/** The discard. */
	discard(5),
	/** The exception. */
	exception(6);

	/** The status. */
	private int status;

	/**
	 * Instantiates a new handle status.
	 * 
	 * @param status
	 *            the status
	 */
	private HandleStatus(int status) {
		this.status = status;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see Status#getStatus()
	 */
	
	public int getStatus() {
		return status;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Enum#toString()
	 */
	
	public String toString() {
		return this.name();
	}

	/**
	 * 中文： <br>
	 * 如果是真，返回success，否则返回fail。 <br>
	 * English: <br>
	 * If it is true, return success, otherwise fail.
	 * 
	 * @param successFlag
	 *            the success flag
	 * @return the success or fail
	 */
	public static HandleStatus getSuccessOrFail(boolean successFlag) {
		return successFlag ? success : fail;
	}

	/**
	 * 中文： <br>
	 * 如果是success返回真。 <br>
	 * English: <br>
	 * Returns true if success.
	 * 
	 * @param status
	 *            the status
	 * @return true, if is success
	 */
	public static boolean isSuccess(HandleStatus status) {
		return success.equals(status);
	}

}
