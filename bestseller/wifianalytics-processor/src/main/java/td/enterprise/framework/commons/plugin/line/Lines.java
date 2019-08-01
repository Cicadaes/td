/**
 * 
 */
package td.enterprise.framework.commons.plugin.line;

import java.util.ArrayList;
import java.util.Collection;

/**
 * @author davy 2014年2月13日 下午4:56:59
 */
public class Lines extends ArrayList<Line> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1814845739035239124L;

	/**
	 * 
	 */
	public Lines() {
	}

	/**
	 * @param initialCapacity
	 */
	public Lines(int initialCapacity) {
		super(initialCapacity);
	}

	/**
	 * @param c
	 */
	public Lines(Collection<? extends Line> c) {
		super(c);
	}

	public Lines(Line... lines) {
		this();
		for (Line line : lines) {
			this.add(line);
		}
	}

}
