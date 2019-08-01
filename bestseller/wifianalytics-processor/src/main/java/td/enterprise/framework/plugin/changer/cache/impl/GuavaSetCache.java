package td.enterprise.framework.plugin.changer.cache.impl;

import com.google.common.cache.CacheBuilder;
import td.enterprise.framework.commons.cache.CacheStatus;
import td.enterprise.framework.commons.cache.ICacheStatus;

import java.util.AbstractSet;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.TimeUnit;

public class GuavaSetCache<E> extends AbstractSet<E> implements Set<E>, Cloneable, java.io.Serializable, ICacheStatus {

    private static final long serialVersionUID = 1L;

    private static final Object PRESENT = new Object();

    private com.google.common.cache.Cache<E, Object> cache;

    public GuavaSetCache() {
        this(86400, 200 * 10000);
    }

    public GuavaSetCache(long duration, int maximumSize) {
        CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder().expireAfterAccess(duration, TimeUnit.SECONDS).recordStats().maximumSize(maximumSize);
        this.cache = cacheBuilder.build();
    }

    public Iterator<E> iterator() {
        return cache.asMap().keySet().iterator();
    }

    public boolean add(E e) {
        cache.put(e, PRESENT);
        return true;
    }

    public int size() {
        return (int) cache.size();
    }


    public CacheStatus status() {
        return new CacheStatus(this.getClass().getSimpleName(), this.hashCode(), cache.stats().hitCount(), cache.stats().missCount(), cache.size());
    }
}
