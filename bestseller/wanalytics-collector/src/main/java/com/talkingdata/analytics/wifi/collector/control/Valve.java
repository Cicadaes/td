package com.talkingdata.analytics.wifi.collector.control;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * <p>Datetime   : 2013-10-21 下午6:16:13</p>
 * <p>Title      : Valve.java</p>
 * <p>Description: </p>
 * <p>Copyright  : Copyright (c) 2013</p>
 * <p>Company    : TendCloud</p>
 * @author  <a href="mailto:jinhu.fan@tendcloud.com">fjh</a>
 */
public class Valve {

	private static AtomicBoolean on = new AtomicBoolean(true);
	
	public static AtomicBoolean copy4test = new AtomicBoolean(false);
	
	public static void off() {
		if (on.get()) {
			on.set(false);
			AsyncProcesser.getInstance().shutdownSchedule();
		}
	}
	
	public static void on() {
		if (!on.get()) {
			AsyncProcesser.getInstance().startSchedule();
			on.set(true);
		}
	}
	
	public static boolean isOn() {
		return on.get();
	}
	
}
