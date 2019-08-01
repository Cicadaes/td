/**
 * 
 * @author davy
 * 日期:		2013-6-3 11:50:49
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.plugin.changer.atomic.impl;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.plugin.status.HandleStatus;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.commons.atomic.ETLAtomicChanger;

import java.util.concurrent.atomic.AtomicLong;

public abstract class DataFilterAtomicChanger extends ETLAtomicChanger {
	protected static final String DISCARD_MESSAGE = "discardmessage";

	protected String outputName;

	protected static final AtomicLong index = new AtomicLong();

	protected long myIndex;

	public DataFilterAtomicChanger() {
		myIndex = index.addAndGet(1);
	}

	public String getOutputName() {
		return outputName;
	}

	public void setOutputName(String outputName) {
		this.outputName = outputName;
	}

	public long getMyIndex() {
		return myIndex;
	}

	protected boolean needChange(Line line) {
		return Utils.isNotEmpty(line) && !line.getBoolValue(DISCARD) && !line.getBoolValue(FAIL) && !line.discard ; // TODO  增加了这断
	}

	@Override
	public HandleStatus finish() {
		return HandleStatus.success;
	}

	@Override
	public HandleStatus prepare() {
		return HandleStatus.success;
	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + (Utils.isNotEmpty(outputName) ? " outputName=" + outputName : "") + ", myIndex=" + myIndex + "";
	}
}
