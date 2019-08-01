package td.enterprise.framework.plugin.changer.cache.impl;

import org.mapdb.DBMaker;
import org.mapdb.HTreeMap;
import td.enterprise.framework.commons.cache.CacheStatus;
import td.enterprise.framework.plugin.changer.cache.AbstractCache;
import td.enterprise.framework.plugin.changer.cache.Cache;

/**
 * @author davy <br>
 *         2014-10-09 10:29 <br>
 *         <B>The default encoding is UTF-8 </B><br>
 *         email: davy@d-z.cc<br>
 *         <a href="http://d-z.cc">d-z.cc</a><br>
 */
public class OffHeapCache<K, V> extends AbstractCache<K, V> implements Cache<K, V> {
    protected HTreeMap<K, V> cache;

    public OffHeapCache(String name, long size) {
        cache = DBMaker.newMemoryDirectDB().transactionDisable().cacheLRUEnable().make().createHashMap(name).expireMaxSize(size).makeOrGet();
    }

    
    public void put(K k, V v) {
        cache.put(k, v);
    }

    
    public V get(K k) {
        V v = cache.get(k);
        if (v == null) {
            missCount.incrementAndGet();
        } else {
            hitCount.incrementAndGet();
        }
        return v;
    }

    
    public CacheStatus status() {
        return new CacheStatus(this.getClass().getSimpleName(), this.hashCode(), hitCount.get(), missCount.get(), cache.sizeLong());
    }
}
