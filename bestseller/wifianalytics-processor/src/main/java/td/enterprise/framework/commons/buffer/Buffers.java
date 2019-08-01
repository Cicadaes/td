package td.enterprise.framework.commons.buffer;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by davy on 14-7-21.
 */
public class Buffers extends ArrayList<Buffer> {
	private static final long serialVersionUID = -3946445487887394205L;

	public Buffers(int initialCapacity) {
		super(initialCapacity);
	}

	public Buffers() {
	}

	public Buffers(Collection<? extends Buffer> c) {
		super(c);
	}

	public Buffers(Buffer... buffers) {
		this();
		for (Buffer buffer : buffers) {
			this.add(buffer);
		}
	}

}
