package com.talkingdata.datacloud.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class MapUtils {
	/**
	 * 创建新的map对象，将原map中的key，value复制
	 * @param map
	 * @return
	 */
	public static <K, V> Map<K, V> copyMap(Map<? extends K, ? extends V> map) {
		Map<K, V> out = new HashMap<K, V>(map.size());
		if(map instanceof Map) {
			
			for(Entry<? extends K, ? extends V> entry : map.entrySet()) {
				out.put(entry.getKey(), entry.getValue());
			}
	       
		}
		 return out;
    }
	
	/**
	 * 创建新的map对象，将原map中的key，value复制
	 * @param map
	 * @return
	 * @throws Exception 
	 */
	public static <K, V> Map<K, V> cloneMap(Map<? extends K, ? extends V> map) throws Exception {
		Map<K, V> out = new HashMap<K, V>(map.size());
		if(map instanceof Map) {
//				ByteArrayOutputStream byteout = null;
//				ByteArrayInputStream bytein = null;
//				ObjectOutputStream outStr = null;
//				ObjectInputStream inStr = null;
				Object object = null;
				
				for(Entry<? extends K, ? extends V> entry : map.entrySet()) {
					K key = entry.getKey();
					V value = entry.getValue();
//					byteout = new ByteArrayOutputStream();
//					outStr = new ObjectOutputStream(byteout);
//					outStr.writeObject(value);
//					bytein = new ByteArrayInputStream(byteout.toByteArray());
//					inStr = new ObjectInputStream(bytein);
//					object = inStr.readObject();
					out.put((K)deepClone(key), (V)deepClone(value));
				}
			
	       
		}
		 return out;
    }
	
	private static Object deepClone(Object obj) throws Exception {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(baos);
		oos.writeObject(obj);
		
		ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
		ObjectInputStream ois = new ObjectInputStream(bais);
		return ois.readObject();
		
	}
}
