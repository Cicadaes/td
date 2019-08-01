/**
 * 
 */
package td.enterprise.framework.plugin.changer.commons.utils;

import org.apache.commons.lang.StringUtils;
import td.enterprise.framework.commons.util.Utils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author davy 2013年12月18日 下午4:26:15
 */
public class MapUtils extends Utils {
	public static <V> Map<String, V> keyStartWith(Map<String, V> map, String start) {
		if (isNotEmpty(map)) {
			String[] keys = map.keySet().toArray(new String[] {});
			for (String key : keys) {
				if (!StringUtils.startsWith(key, start)) {
					map.remove(key);
				}
			}
		}
		return map;
	}

	public static <V> Map<String, V> removeKeyStart(Map<String, V> map, String removeKeyStart) {
		if (isNotEmpty(map)) {
			String[] keys = map.keySet().toArray(new String[] {});
			for (String key : keys) {
				if (StringUtils.startsWith(key, removeKeyStart)) {
					V value = map.get(key);
					map.remove(key);
					map.put(StringUtils.removeStart(key, removeKeyStart), value);
				}
			}
		}
		return map;
	}

	public static void main(String[] args) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("a.1", "1");
		map.put("a.2", "2");
		map.put("b.3", "3");
//		map = keyStartWith(map, "a.");
		map=removeKeyStart(map, "a.");
		System.out.println(map);
	}
}
