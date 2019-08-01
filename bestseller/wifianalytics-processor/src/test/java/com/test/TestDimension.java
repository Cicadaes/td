package com.test;

import td.enterprise.dmp.common.ApplicationContextManager;
import td.enterprise.dmp.meta.entity.cube.Cube;
import td.enterprise.dmp.meta.entity.cube.Dimension;
import td.enterprise.dmp.meta.service.cube.CubeService;
import td.enterprise.wanalytics.common.Constants;

import java.util.*;

public class TestDimension {

	public static void main(String[] args) throws Exception {
		// 获取基本Cube信息
		CubeService cubeService = ApplicationContextManager.getBean(CubeService.class);
		String cubeName = "active_user_sensor_hour_cube";
		Cube cube = cubeService.getCubeByCubeName(cubeName, Constants.DOMAIN_ID);
		cube = cubeService.buildByCubeName(cubeName, Constants.DOMAIN_ID);
		List<Dimension> dms = cube.getDimensions();
		
		List<String> cols = new ArrayList<String>();
		StringBuffer where = new StringBuffer();
		Map<String, Object> vals = new HashMap<String, Object>();
		for (int i = 0, t = dms.size(); i < t; i++) {
			Dimension d = dms.get(i);
			cols.add(d.getColumn().getName());
		}
        System.out.println(Arrays.toString(cols.toArray()));
	}

}
