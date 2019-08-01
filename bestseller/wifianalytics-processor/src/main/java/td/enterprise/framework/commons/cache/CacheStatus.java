/**
 * 
 */
package td.enterprise.framework.commons.cache;

/**
 * @author davy 2014年8月27日 下午12:24:19
 */
public class CacheStatus {
	public final String className;
	public final int hashcode;
	public final long hitCount;
	public final long missCount;
	public final long allCount;
	public final double hisRate;
	public final long size;

	public CacheStatus(String className, int hashcode, long hitCount, long missCount, long size) {
		super();
		this.className = className;
		this.hashcode = hashcode;
		this.hitCount = hitCount;
		this.missCount = missCount;
		this.size = size;
		this.allCount = hitCount + missCount;
		this.hisRate = allCount == 0 ? 0 : hitCount * 1.0 / allCount;
	}

}
