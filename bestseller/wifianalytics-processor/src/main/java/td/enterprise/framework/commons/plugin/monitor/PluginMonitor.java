/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.monitor;

/**
 * The Interface PluginMonitor. The default character set is UTF-8
 * <p>
 * 中文： <br>
 * 这个接口负责统计一次job过程中，成功、失败、丢弃的条数与大小。 <br>
 * English: <br>
 * This interface is responsible for statistics during a job, success, failure, the number and size of discarded.
 * </p>
 * 
 * @author davy
 */
public interface PluginMonitor {

	/**
	 * 中文： <br>
	 * 获取输出的大小。 <br>
	 * English: <br>
	 * Get the output size.
	 * 
	 * @return the throughout size
	 */
	public abstract long getThroughoutSize();

	/**
	 * 中文： <br>
	 * 获取输出的条数。 <br>
	 * English: <br>
	 * Gets the number of output.
	 * 
	 * @return the throughout count
	 */
	public abstract long getThroughoutCount();

	/**
	 * 中文： <br>
	 * 获取处理成功的条数。 <br>
	 * English: <br>
	 * Gets the number of successful treatment.
	 * 
	 * @return the success counts
	 */
	public abstract long getSuccessCounts();

	/**
	 * 中文： <br>
	 * 获取处理失败的条数。 <br>
	 * English: <br>
	 * Gets the number of treatment failures.
	 * 
	 * @return the fail counts
	 */
	public abstract long getFailCounts();

	/**
	 * 中文： <br>
	 * 获取处理成功的大小。 <br>
	 * English: <br>
	 * Get the size of successfully processed.
	 * 
	 * @return the success sizes
	 */
	public abstract long getSuccessSizes();

	/**
	 * 
	 * 中文： <br>
	 * 获取处理失败的大小。 <br>
	 * English: <br>
	 * The size of the acquisition process fails.
	 * 
	 * @return the fail sizes
	 */
	public abstract long getFailSizes();

	/**
	 * 中文： <br>
	 * 获取处理中应该丢弃掉的数据的大小，所谓丢弃指并不是异常等引起的，但是在输出中不需要的数据。 <br>
	 * English: <br>
	 * Acquisition process should discard the data size, the so-called drop means is not caused by abnormal, but not in
	 * the output data.
	 * 
	 * @return the discard sizes
	 */
	public long getDiscardSizes();

	/**
	 * 中文： <br>
	 * 获取处理中应该丢弃掉的数据的条数，所谓丢弃指并不是异常等引起的，但是在输出中不需要的数据。 <br>
	 * English: <br>
	 * Acquisition process should discard number of pieces of data, the so-called drop means is not caused by abnormal,
	 * but not in the output data.
	 * 
	 * @return the discard count
	 */
	public long getDiscardCount();

	/**
	 * 中文： <br>
	 * 调用此方法设置成功的大小，条数为1。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the size of success, the number is 1. This method will automatically put the job in the
	 * size and number of addition.
	 * 
	 * @param size
	 *            the size
	 */
	public abstract void success(long size);

	/**
	 * 中文： <br>
	 * 调用此方法设置成功的条数和大小。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the number and size of success. This method will automatically put the job in the size
	 * and number of addition.
	 * 
	 * @param count
	 *            the count
	 * @param size
	 *            the size
	 */
	public abstract void success(long count, long size);

	/**
	 * 中文： <br>
	 * 调用此方法设置成功，大小为0,条数为1。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Calling this method successfully set size is 0, the number is 1. This method will automatically put the job in
	 * the size and number of addition.
	 */
	public abstract void success();

	/**
	 * 中文： <br>
	 * 调用此方法设置失败的条数和大小。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the number and size of fail. This method will automatically put the job in the size and
	 * number of addition.
	 * 
	 * 
	 * @param count
	 *            the count
	 * @param size
	 *            the size
	 */
	public abstract void fail(long count, long size);

	/**
	 * 中文： <br>
	 * 调用此方法设置失败的大小，条数为1。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the size of fail, the number is 1. This method will automatically put the job in the size
	 * and number of addition.
	 * 
	 * @param size
	 *            the size
	 */
	public abstract void fail(long size);

	/**
	 * 中文： <br>
	 * 调用此方法设置失败，大小为0,条数为1。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set fails, the size is 0, the number is 1. This method will automatically put the job in the
	 * size and number of addition.
	 */
	public abstract void fail();

	/**
	 * 中文： <br>
	 * 调用此方法设置丢弃的条数和大小。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the number and size of discarded. This method will automatically put the job in the size
	 * and number of addition.
	 * 
	 * @param count
	 *            the count
	 * @param size
	 *            the size
	 */
	public abstract void discard(long count, long size);

	/**
	 * 中文： <br>
	 * 调用此方法设置丢弃的大小，条数为1。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the size of the drop, the number is 1. This method will automatically put the job in the
	 * size and number of addition.
	 * 
	 * @param size
	 *            the size
	 */
	public abstract void discard(long size);

	/**
	 * 中文： <br>
	 * 调用此方法设置丢弃，大小为0,条数为1。此方法将自动把此次job中的大小和条数相加。 <br>
	 * English: <br>
	 * Call this method to set the discard, size 0, the number is 1. This method will automatically put the job in the
	 * size and number of addition.
	 */
	public abstract void discard();

	/**
	 * 中文： <br>
	 * 清除PluginMonitor的统计结果。 <br>
	 * English: <br>
	 * Clear PluginMonitor statistical results.
	 */
	public abstract void clear();

	/**
	 * 中文： <br>
	 * 此PluginMonitor监控的对象的名字。name与id决定唯一一个PluginMonitor。 <br>
	 * English: <br>
	 * This PluginMonitor name of the object monitored.name and id decided that the only one PluginMonitor.
	 * 
	 * @return the target name
	 */
	public String getTargetName();

	/**
	 * Sets the target name.
	 * 
	 * @param targetName
	 *            the new target name
	 */
	public void setTargetName(String targetName);

	/**
	 * 中文： <br>
	 * 此PluginMonitor监控的对象的id。name与id决定唯一一个PluginMonitor。 <br>
	 * English: <br>
	 * This PluginMonitor id of the object monitored.name and id decided that the only one PluginMonitor.
	 * 
	 * @return the target id
	 */
	public long getTargetId();

	/**
	 * Sets the target id.
	 * 
	 * @param targetId
	 *            the new target id
	 */
	public void setTargetId(long targetId);

}