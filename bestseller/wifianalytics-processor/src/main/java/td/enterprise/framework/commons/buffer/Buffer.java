/**
 * 
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.buffer;

import td.enterprise.framework.commons.plugin.line.Line;

/**
 * The Interface Buffer.
 * The default character set is UTF-8
 *
 * @author davy 日期: 2013-8-13 下午5:40:00
 * <p>
 * 中文：<br>
 * 这个接口是用与插件与插件间缓冲用的。reader将读出的数据放入r_c_buffer,changer从r_c_buffer取出数据处理完成后将数据放入c_w_buffer,writer从c_w_buffer中取出数据。
 * <br>
 * English:<br>
 * This interface is used between the plug and the plug-in buffer to use. reader will read out the data into
 * r_c_buffer, changer Remove from r_c_buffer upon completion of data processing data into c_w_buffer, writer
 * pull data from c_w_buffer.
 * </p>
 */
public interface Buffer {
	
	/**
	 * 中文：<br>
	 * 这个方法用来初始化Buffer<br>
	 * id是用来唯一标识Buffer的<br>
	 * lineLimit是Buffer的限制，这个限制可以避免Buffer过大。<br>
	 * destructLimit这个是预留的参数，现在没用，可以传0。<br>
	 * English:<br>
	 * This method is used to initialize the Buffer <br>
	 * id is used to uniquely identify the Buffer <br>
	 * lineLimit Is Buffer constraints, this limitation can be avoided Buffer too large. <br>
	 * destructLimit this parameter is set aside, now useless, you can pass 0.
	 *
	 * @param id the id
	 * @param lineLimit the line limit
	 * @param destructLimit the destruct limit
	 * @return true, if successful
	 */
	public abstract boolean init(String id, int lineLimit);


	/**
	 * Checks if is push closed.
	 *
	 * @return true, if is push closed
	 */
	public abstract boolean isPushClosed();

	/**
	 * Sets the push closed.
	 *
	 * @param close the new push closed
	 */
	public abstract void setPushClosed(boolean close);

	/**
	 * 中文：<br>
	 * 获取LineLimit的值<br>
	 * English:<br>
	 * The value obtained LineLimit.
	 *
	 * @return the line limit
	 */
	public abstract int getLineLimit();

	/**
	 * Gets the stat.
	 *
	 * @return the stat
	 */
	public abstract BufferStatistics getStat();

	/**
	 * Size.
	 *
	 * @return the int
	 */
	public int size();

	/**
	 * Offer.
	 *
	 * @param e the e
	 * @return true, if successful
	 */
	public boolean offer(Line e);

	/**
	 * Poll.
	 *
	 * @return the line
	 */
	public Line poll();

	/**
	 * Adds the.
	 *
	 * @param e the e
	 * @return true, if successful
	 */
	public boolean add(Line e);

	/**
	 * Checks if is empty.
	 *
	 * @return true, if is empty
	 */
	public boolean isEmpty();

	/**
	 * Clear.
	 */
	public void clear();

	/**
	 * Peek.
	 *
	 * @return the line
	 */
	public Line peek();

}