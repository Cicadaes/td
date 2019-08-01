package td.enterprise.framework.plugin.changer.cache.impl;

import com.google.common.base.Function;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.cache.CacheStatus;
import td.enterprise.framework.plugin.changer.cache.Cache;

import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

public class GuavaCache<K, V> implements Cache<K, V> {
    private static final Logger log = LoggerFactory.getLogger(GuavaCache.class);
    private com.google.common.cache.Cache<K, V> cache;

    public GuavaCache() {
        this(86400, 200 * 10000);
    }

    public GuavaCache(long expireAfterAccess, int maximumSize) {
        CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder().expireAfterAccess(expireAfterAccess, TimeUnit.SECONDS).recordStats().maximumSize(maximumSize);
        this.cache = cacheBuilder.build();
    }

    public GuavaCache(long expireAfterWrite, long expireAfterAccess, int maximumSize) {
        CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder().expireAfterWrite(expireAfterWrite, TimeUnit.SECONDS).expireAfterAccess(expireAfterAccess, TimeUnit.SECONDS).recordStats().maximumSize(maximumSize);
        this.cache = cacheBuilder.build();
    }

    public void put(K k, V v) {
        cache.put(k, v);
    }

    public V get(K k) {
        try {
            return cache.getIfPresent(k);
        } catch (Exception e) {
            log.warn("Return null for key : [" + k + "], because ", e);
            return null;
        }
    }

    public V get(final K k, final Function<K, V> loader) {
        try {
            return cache.get(k, new Callable<V>() {
                public V call() throws Exception {
                    return loader.apply(k);
                }
            });
        } catch (CacheLoader.InvalidCacheLoadException e) {
        } catch (Exception e) {
            log.warn("Return null for key : [" + k + "], because ", e);
        }
        return null;
    }

    public CacheStatus status() {
        return new CacheStatus(this.getClass().getSimpleName(), this.hashCode(), cache.stats().hitCount(), cache.stats().missCount(), cache.size());
    }
}
