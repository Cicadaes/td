package td.enterprise.framework.plugin.changer.cache.impl;

import com.google.common.base.Function;
import com.google.common.cache.CacheBuilder;
import org.apache.commons.io.FileUtils;
import org.mapdb.BTreeMap;
import org.mapdb.DB;
import org.mapdb.DBMaker;
import td.enterprise.framework.commons.KeyValue;
import td.enterprise.framework.commons.cache.CacheStatus;
import td.enterprise.framework.plugin.changer.cache.Cache;

import java.io.File;
import java.io.IOException;
import java.util.NavigableSet;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class MapdbGuavaCache<K, V> implements Cache<K, V> {
	private com.google.common.cache.Cache<K, V> cache;

	private DB db;
	private BTreeMap<K, V> treeMap;
	private static String cacheName = "cache";

	public MapdbGuavaCache() {
		this(System.getenv("HOME") + "/tmp/mapdb/" + cacheName);
	}

	public MapdbGuavaCache(String path) {
		this(path, 86400, 200 * 10000);
	}

	public MapdbGuavaCache(String path, long duration, int maximumSize) {
		CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder().expireAfterAccess(duration, TimeUnit.SECONDS).recordStats().maximumSize(maximumSize);
		this.cache = cacheBuilder.build();
		File file = new File(path);
		try {
			FileUtils.forceMkdir(file.getParentFile());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		db = DBMaker.newFileDB(file).make();
//		db = DBMaker.newFileDB(file).closeOnJvmShutdown().make();
		treeMap = db.getTreeMap(cacheName);
		NavigableSet<K> keySet = treeMap.keySet();
		for (K k : keySet) {
			cache.put(k, treeMap.get(k));
		}
	}

	public void put(K k, V v) {
		cache.put(k, v);
		treeMap.put(k, v);
	}

	public V get(K k) {
		return cache.getIfPresent(k);
	}

	public V get(final K k, final Function<K, V> loader) {
		try {
			return cache.get(k, new Callable<V>() {
				@Override
				public V call() throws Exception {
					return loader.apply(k);
				}
			});
		} catch (ExecutionException e) {
			throw new RuntimeException(e);
		}
	}

	public BTreeMap<K, V> getTreeMap() {
		return treeMap;
	}

	public CacheStatus status() {
		return new CacheStatus(this.getClass().getSimpleName(), this.hashCode(), cache.stats().hitCount(), cache.stats().missCount(), cache.size());
	}

	public void close() {
		if (!db.isClosed()){
			db.commit();
			db.close();
		}
	}

	public static void main(String[] args) {
		MapdbGuavaCache<String, KeyValue<String, String>> cache = new MapdbGuavaCache<String, KeyValue<String, String>>();
		// cache.put("223.73.97.77", new KV<String, String>("中国", "广东"));
		// cache.put("122.248.100.47", new KV<String, String>("缅甸", "default"));

		BTreeMap<String, KeyValue<String, String>> treeMap = cache.getTreeMap();
		NavigableSet<String> keySet = treeMap.keySet();
		System.out.println("size:" + keySet.size());
//		for (String ip : keySet) {
//			KV<String, String> value = treeMap.get(ip);
//			System.out.println("ip:" + ip + ", region:" + value.k + "," + value.v);
//		}
		cache.close();
	}
}
