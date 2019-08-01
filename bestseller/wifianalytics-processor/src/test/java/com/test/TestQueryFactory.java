package com.test;

import net.sf.ehcache.Cache;
import td.enterprise.framework.plugin.changer.Changer;
import td.enterprise.wanalytics.changer.SensorPropFillChanger;
import td.enterprise.wanalytics.processor.cache.CacheFactory;

public class TestQueryFactory {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
	   Changer sensorPropFillChanger = new SensorPropFillChanger();
	   
	   Cache projectCahce =  CacheFactory.getProjectCache();
	}

}
