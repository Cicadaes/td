/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.status;

/**
 * The Interface PluginStatus.
 * The default character set is UTF-8
 *
 * @author davy
 */
public interface PluginStatus {
	// public void setReadStatus(RunStatus status);

	/**
	 * Gets the read status.
	 *
	 * @return the read status
	 */
	public RunStatus getReadStatus();

	/**
	 * Read over.
	 */
	public void readOver();

	// public void setChangeStatus(RunStatus status);

	/**
	 * Gets the change status.
	 *
	 * @return the change status
	 */
	public RunStatus getChangeStatus();

	/**
	 * Change over.
	 */
	public void changeOver();

	// public void setWiteStatus(RunStatus status);

	/**
	 * Gets the write status.
	 *
	 * @return the write status
	 */
	public RunStatus getWriteStatus();

	/**
	 * Write over.
	 */
	public void writeOver();

	/**
	 * Sets the all read count.
	 *
	 * @param allReadCount the new all read count
	 */
	public void setAllReadCount(int allReadCount);

	/**
	 * Sets the all change count.
	 *
	 * @param allChangeCount the new all change count
	 */
	public void setAllChangeCount(int allChangeCount);

	/**
	 * Sets the all write count.
	 *
	 * @param allWriteCount the new all write count
	 */
	public void setAllWriteCount(int allWriteCount);
}
