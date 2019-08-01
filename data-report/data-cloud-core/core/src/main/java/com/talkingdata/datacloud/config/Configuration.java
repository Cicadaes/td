package com.talkingdata.datacloud.config;

import com.talkingdata.datacloud.cache.ParamCacheManager;
import com.talkingdata.datacloud.constant.CommonConstants;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class Configuration {
	private static Configuration instance;

	private ParamCacheManager cm = ParamCacheManager.getInstance();

	private Configuration() {
		
	}

	public static Configuration getInstance() {
		if(instance == null){
			instance = new Configuration();
		}
		return instance;
	}

	public String getConfig(String key) {
		return (String) cm.getElementValue(CommonConstants.CACHE_PARAM, key);
	}

	public Map<String, String> match(String regex) {
		Map<String, String> cmap = new HashMap<String, String>();
		Set<Object> confNames = cm.get(CommonConstants.CACHE_PARAM).keySet();
		if (confNames != null && confNames.size() > 0) {
			try {
				Pattern p = Pattern.compile(regex);
				for (Object confName : confNames) {
					String key = (String) confName;
					Matcher m = p.matcher(key);
					if (m.find()) {
						cmap.put(key, getConfig(key));
					}
				}
			} catch (PatternSyntaxException e) {
				e.printStackTrace();
			}
		}
		return cmap;
	}
	
	public void refreshParam(String cacheName) {
		if (CommonConstants.CACHE_PARAM.equals(cacheName)) {
			cm.remove(cacheName);
		}
	}
}
