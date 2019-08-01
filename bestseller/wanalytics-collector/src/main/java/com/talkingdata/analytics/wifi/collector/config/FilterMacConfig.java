package com.talkingdata.analytics.wifi.collector.config;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by loong on 6/27/16.
 */
public class FilterMacConfig {

    private static AtomicBoolean on = new AtomicBoolean(true);

    public static void off() {
        if (on.get()) {
            on.set(false);
        }
    }

    public static void on() {
        if (!on.get()) {
            on.set(true);
        }
    }

    public static boolean isOn() {
        return on.get();
    }
}
