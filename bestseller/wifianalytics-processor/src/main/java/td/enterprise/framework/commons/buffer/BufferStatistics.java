/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:50
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.buffer;

import td.enterprise.framework.commons.util.StringUtils;
import td.enterprise.framework.commons.util.Utils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * The Class BufferStatistics. The default character set is UTF-8
 * 
 * @author davy
 */
public class BufferStatistics {

	/** The id. */
	private String id;

	/** The begin time. */
	private Date beginTime;

	/** The end time. */
	private Date endTime;

	/** The line rx. */
	private long lineRx;

	/** The line tx. */
	private long lineTx;

	/** The byte rx. */
	private long byteRx;

	/** The byte tx. */
	private long byteTx;

	/** The line r refused. */
	private long lineRRefused;

	/** The line t refused. */
	private long lineTRefused;

	/** The period in seconds. */
	private long periodInSeconds;

	/** The line rx total. */
	private long lineRxTotal;

	/** The line tx total. */
	private long lineTxTotal;

	/** The byte rx total. */
	private long byteRxTotal;

	/** The byte tx total. */
	private long byteTxTotal;

	/** The total seconds. */
	private long totalSeconds;

	/** The buffer. */
	private Buffer buffer;

	/**
	 * Instantiates a new buffer statistics.
	 * 
	 * @param id
	 *            the id
	 * @param buffer
	 *            the buffer
	 */
	public BufferStatistics(String id, Buffer buffer) {
		this.buffer = buffer;
		this.setId(id);
		lineRx = 0;
		lineTx = 0;
		byteRx = 0;
		byteTx = 0;
		lineRRefused = 0;
		lineTRefused = 0;
		lineRxTotal = 0;
		lineTxTotal = 0;
		byteRxTotal = 0;
		byteTxTotal = 0;
		totalSeconds = 0;
		beginTime = new Date();
	}

	public Date getBeginTime() {
		return beginTime;
	}

	/**
	 * Period pass.
	 */
	public void periodPass() {
		lineRx = 0;
		lineTx = 0;
		byteRx = 0;
		byteTx = 0;
		// lineRRefused = 0;
		// lineTRefused = 0;
		totalSeconds += periodInSeconds;
	}

	/**
	 * Gets the id.
	 * 
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * Sets the id.
	 * 
	 * @param id
	 *            the new id
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * Gets the line rx.
	 * 
	 * @return the line rx
	 */
	public long getLineRx() {
		return lineRx;
	}

	/**
	 * Inc line rx.
	 * 
	 * @param i
	 *            the i
	 */
	public void incLineRx(long i) {
		this.lineRx += i;
		this.incLineRxTotal(i);
	}

	/**
	 * Gets the line tx.
	 * 
	 * @return the line tx
	 */
	public long getLineTx() {
		return lineTx;
	}

	/**
	 * Inc line tx.
	 * 
	 * @param i
	 *            the i
	 */
	public void incLineTx(long i) {
		this.lineTx += i;
		this.incLineTxTotal(i);
	}

	/**
	 * Gets the byte rx.
	 * 
	 * @return the byte rx
	 */
	public long getByteRx() {
		return byteRx;
	}

	/**
	 * Inc byte rx.
	 * 
	 * @param i
	 *            the i
	 */
	public void incByteRx(long i) {
		this.byteRx += i;
		this.incByteRxTotal(i);
	}

	/**
	 * Gets the byte tx.
	 * 
	 * @return the byte tx
	 */
	public long getByteTx() {
		return byteTx;
	}

	/**
	 * Inc byte tx.
	 * 
	 * @param i
	 *            the i
	 */
	public void incByteTx(long i) {
		this.byteTx += i;
		this.incByteTxTotal(i);
	}

	/**
	 * Gets the line r refused.
	 * 
	 * @return the line r refused
	 */
	public long getLineRRefused() {
		return lineRRefused;
	}

	/**
	 * Inc line r refused.
	 * 
	 * @param lineRRefused
	 *            the line r refused
	 */
	public void incLineRRefused(long lineRRefused) {
		this.lineRRefused += lineRRefused;
	}

	/**
	 * Gets the line t refused.
	 * 
	 * @return the line t refused
	 */
	public long getLineTRefused() {
		return lineTRefused;
	}

	/**
	 * Inc line t refused.
	 * 
	 * @param lineTRefused
	 *            the line t refused
	 */
	public void incLineTRefused(long lineTRefused) {
		this.lineTRefused += lineTRefused;
	}

	/**
	 * Gets the period in seconds.
	 * 
	 * @return the period in seconds
	 */
	public long getPeriodInSeconds() {
		return periodInSeconds;
	}

	/**
	 * Sets the period in seconds.
	 * 
	 * @param periodInSeconds
	 *            the new period in seconds
	 */
	public void setPeriodInSeconds(long periodInSeconds) {
		this.periodInSeconds = periodInSeconds;
	}

	/**
	 * Gets the line rx total.
	 * 
	 * @return the line rx total
	 */
	public long getLineRxTotal() {
		return lineRxTotal;
	}

	/**
	 * Inc line rx total.
	 * 
	 * @param lineRxTotal
	 *            the line rx total
	 */
	public void incLineRxTotal(long lineRxTotal) {
		this.lineRxTotal += lineRxTotal;
	}

	/**
	 * Gets the line tx total.
	 * 
	 * @return the line tx total
	 */
	public long getLineTxTotal() {
		return lineTxTotal;
	}

	/**
	 * Inc line tx total.
	 * 
	 * @param lineTxTotal
	 *            the line tx total
	 */
	public void incLineTxTotal(long lineTxTotal) {
		this.lineTxTotal += lineTxTotal;
	}

	/**
	 * Gets the byte rx total.
	 * 
	 * @return the byte rx total
	 */
	public long getByteRxTotal() {
		return byteRxTotal;
	}

	/**
	 * Inc byte rx total.
	 * 
	 * @param byteRxTotal
	 *            the byte rx total
	 */
	public void incByteRxTotal(long byteRxTotal) {
		this.byteRxTotal += byteRxTotal;
	}

	/**
	 * Gets the byte tx total.
	 * 
	 * @return the byte tx total
	 */
	public long getByteTxTotal() {
		return byteTxTotal;
	}

	/**
	 * Inc byte tx total.
	 * 
	 * @param byteTxTotal
	 *            the byte tx total
	 */
	public void incByteTxTotal(long byteTxTotal) {
		this.byteTxTotal += byteTxTotal;
	}

	/**
	 * Gets the speed.
	 * 
	 * @param byteNum
	 *            the byte num
	 * @param seconds
	 *            the seconds
	 * @return the speed
	 */
	public String getSpeed(long byteNum, long seconds) {
		if (seconds == 0) {
			seconds = 1;
		}
		long bytePerSecond = byteNum / seconds;
		long unit = bytePerSecond;
		if ((unit = bytePerSecond / 1000000) > 0) {
			return unit + "MB/s";
		} else if ((unit = bytePerSecond / 1000) > 0) {
			return unit + "KB/s";
		} else {
			if (byteNum > 0 && bytePerSecond <= 0) {
				bytePerSecond = 1;
			}
			return bytePerSecond + "B/s";
		}
	}

	/**
	 * Get average line speed.
	 * 
	 * @param lines
	 *            Line amount
	 * @param seconds
	 *            Costed time.
	 * @return Average line speed.
	 */
	public String getLineSpeed(long lines, long seconds) {
		if (seconds == 0) {
			seconds = 1;
		}
		long linePerSecond = lines / seconds;

		if (lines > 0 && linePerSecond <= 0) {
			linePerSecond = 1;
		}

		return linePerSecond + "条/s";
	}

	/**
	 * Get the state of storage space during a period.
	 * 
	 * @return String of State during a period.
	 */
	public String getPeriodState() {
		return String.format("stat:  %s speed %s %s|", this.buffer.size(), getSpeed(this.byteRx, this.periodInSeconds), getLineSpeed(this.lineRx, this.periodInSeconds));
	}

	/**
	 * Get all the state of storage space.
	 * 
	 * @return String of all the State.
	 */
	public String getTotalStat() {
		endTime = new Date();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		long timeElapsed = (endTime.getTime() - beginTime.getTime()) / 1000;
		return Utils.toLog("ID:", id, "\tSize:", this.buffer.size(), "\t队列开始时间:", df.format(beginTime), "\t运行:", StringUtils.ToString(timeElapsed), "秒", "\t平均line速度:", getLineSpeed(lineRx, timeElapsed), "\t数据传输", String.valueOf(lineRx), "行");
	}

}
