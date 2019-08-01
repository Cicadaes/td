/**
 * 
 * @author davy
 * 日期:		2013-5-23 13:51:54
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin.monitor;

import java.util.concurrent.atomic.AtomicLong;

/**
 * 
 * @author davy 日期: 2013-8-15 下午2:30:28
 *         <p>
 *         </p>
 */
public class Monitor implements PluginMonitor {
	protected AtomicLong successCounts = new AtomicLong();
	protected AtomicLong allCounts = new AtomicLong();
	protected AtomicLong failCounts = new AtomicLong();
	protected AtomicLong discardCounts = new AtomicLong();
	protected AtomicLong successSizes = new AtomicLong();
	protected AtomicLong allSizes = new AtomicLong();
	protected AtomicLong failSizes = new AtomicLong();
	protected AtomicLong discardSizes = new AtomicLong();
	protected AtomicLong throughoutSize = new AtomicLong();
	protected AtomicLong throughoutCount = new AtomicLong();
	protected String targetName;
	protected long targetId;

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getThroughoutSize()
	 */
	public long getThroughoutSize() {
		return throughoutSize.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getThroughoutCount()
	 */
	public long getThroughoutCount() {
		return throughoutCount.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getSuccessCounts()
	 */
	public long getSuccessCounts() {
		return successCounts.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getFailCounts()
	 */
	public long getFailCounts() {
		return failCounts.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getSuccessSizes()
	 */
	public long getSuccessSizes() {
		return successSizes.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getFailSizes()
	 */
	public long getFailSizes() {
		return failSizes.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getDiscardSizes()
	 */
	public long getDiscardSizes() {
		return discardSizes.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getDiscardCount()
	 */
	public long getDiscardCount() {
		return discardCounts.get();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#success(long)
	 */
	public void success(long size) {
		success(1, size);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#success(long, long)
	 */
	public void success(long count, long size) {
		successCounts.addAndGet(count);
		successSizes.addAndGet(size);
		throughout(count, size);
	}

	private void throughout(long count, long size) {
		throughoutCount.addAndGet(count);
		throughoutSize.addAndGet(size);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#success()
	 */
	public void success() {
		success(0);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#fail(long, long)
	 */
	public void fail(long count, long size) {
		failCounts.addAndGet(count);
		failSizes.addAndGet(size);
		throughout(count, size);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#fail(long)
	 */
	public void fail(long size) {
		fail(1, size);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#fail()
	 */
	public void fail() {
		fail(0);

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#discard(long, long)
	 */
	public void discard(long count, long size) {
		discardCounts.addAndGet(count);
		discardSizes.addAndGet(size);
		throughout(count, size);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#discard(long)
	 */
	public void discard(long size) {
		discard(1, size);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#discard()
	 */
	public void discard() {
		discard(0);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#clear()
	 */
	public void clear() {
		clear(successCounts);
		clear(failCounts);
		clear(discardCounts);
		clear(successSizes);
		clear(failSizes);
		clear(discardSizes);
		clear(throughoutSize);
		clear(throughoutCount);
	}

	private void clear(AtomicLong _long) {
		if (_long != null)
			_long.getAndSet(0);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getTargetName()
	 */
	public String getTargetName() {
		return targetName;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#setTargetName(java.lang.String)
	 */
	public void setTargetName(String targetName) {
		this.targetName = targetName;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#getTargetId()
	 */
	public long getTargetId() {
		return targetId;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see PluginMonitor#setTargetId(long)
	 */
	public void setTargetId(long targetId) {
		this.targetId = targetId;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Monitor [successCounts=" + successCounts + ", allCounts=" + allCounts + ", failCounts=" + failCounts + ", discardCounts=" + discardCounts + ", successSizes=" + successSizes + ", allSizes=" + allSizes
				+ ", failSizes=" + failSizes + ", discardSizes=" + discardSizes + ", throughoutSize=" + throughoutSize + ", throughoutCount=" + throughoutCount + ", targetName=" + targetName + ", targetId=" + targetId + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (targetId ^ (targetId >>> 32));
		result = prime * result + ((targetName == null) ? 0 : targetName.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Monitor other = (Monitor) obj;
		if (targetId != other.targetId)
			return false;
		if (targetName == null) {
			if (other.targetName != null)
				return false;
		} else if (!targetName.equals(other.targetName))
			return false;
		return true;
	}

}
