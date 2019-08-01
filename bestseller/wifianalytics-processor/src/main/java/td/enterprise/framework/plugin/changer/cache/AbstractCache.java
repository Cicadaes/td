package td.enterprise.framework.plugin.changer.cache;

import com.google.common.base.Function;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Created by davy on 14-8-18.
 */
public abstract class AbstractCache<K, V> implements Cache<K, V> {
    protected AtomicLong hitCount = new AtomicLong();
    protected AtomicLong missCount = new AtomicLong();

    public V get(K k, Function<K, V> loader) {
        V v = get(k);
        if (v != null) {
            hitCount.incrementAndGet();
            return v;
        } else {
            missCount.incrementAndGet();
            v = loader.apply(k);
            if (v != null) {
                put(k, v);
                return v;
            } else {
                return null;
            }
        }
    }
}
