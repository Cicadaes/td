/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:50
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.status;

/**
 * The Enum RunStatus. The default character set is UTF-8
 * 
 * @author davy
 */
public enum RunStatus implements Status {

	/** The unknow. */
	unknow(0),
	/** The stop. */
	stop(1),
	/** The run. */
	run(2),
	/** The stoping. */
	stoping(3),
	/** The wait. */
	wait(4),
	/** The runing. */
	runing(5),
	/** The stoped. */
	stoped(6),
	/** The run over. */
	runOver(7);

	/** The status. */
	private int status;

	/**
	 * Instantiates a new run status.
	 * 
	 * @param status
	 *            the status
	 */
	private RunStatus(int status) {
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
	 * Checks if is run over.
	 * 
	 * @param etlStatus
	 *            the framework status
	 * @return true, if is run over
	 */
	public static boolean isRunOver(RunStatus etlStatus) {
		return runOver.equals(etlStatus);
	}

	/**
	 * Checks if is run.
	 * 
	 * @param etlStatus
	 *            the framework status
	 * @return true, if is run
	 */
	public static boolean isRun(RunStatus etlStatus) {
		return run.equals(etlStatus);
	}

	/**
	 * Checks if is runing.
	 * 
	 * @param etlStatus
	 *            the framework status
	 * @return true, if is runing
	 */
	public static boolean isRuning(RunStatus etlStatus) {
		return runing.equals(etlStatus);
	}
}
