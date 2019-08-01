package td.enterprise.framework.plugin.changer.cache.impl;

import td.enterprise.framework.commons.cache.CacheStatus;
import td.enterprise.framework.plugin.changer.cache.AbstractCache;
import td.enterprise.framework.plugin.changer.cache.Cache;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by davy on 14-8-13.
 */
public class ConcurrentHashCache<K, V> extends AbstractCache<K, V> implements Cache<K, V> {
    protected ConcurrentHashMap<K, V> map = new ConcurrentHashMap<K, V>();

    public void put(K k, V v) {
        map.put(k, v);
    }

    public V get(K k) {
        V v = map.get(k);
        if (v == null) {
            missCount.incrementAndGet();
        } else {
            hitCount.incrementAndGet();
        }
        return v;
    }

    public CacheStatus status() {
        return new CacheStatus(this.getClass().getSimpleName(), this.hashCode(), hitCount.get(), missCount.get(), map.size());
    }
}
