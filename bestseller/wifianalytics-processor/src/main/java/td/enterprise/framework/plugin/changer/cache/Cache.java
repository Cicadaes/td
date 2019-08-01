package td.enterprise.framework.plugin.changer.cache;

import com.google.common.base.Function;
import td.enterprise.framework.commons.cache.ICacheStatus;

/**
 * Created by davy on 14-8-13.
 */
public interface Cache<K,V> extends ICacheStatus{

    public void put(K k, V v);

    public V get(K k);

    public V get(K k, Function<K, V> loader);

}
