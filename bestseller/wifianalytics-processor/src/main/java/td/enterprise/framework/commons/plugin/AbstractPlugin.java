/**
 * @author davy
 * 日期:		2013-5-23 11:17:49
 * <p/>
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons.plugin;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.framework.commons.GlobalVariables;
import td.enterprise.framework.commons.error.MalformedBoolValueException;
import td.enterprise.framework.commons.error.NoSucnParamException;
import td.enterprise.framework.commons.plugin.monitor.PluginMonitor;
import td.enterprise.framework.commons.util.Utils;

import java.util.Observable;

/**
 * The Class AbstractPlugin. The default character set is UTF-8
 * <p>
 * 中文： <br>
 * 这个类是一个抽象插件类，他实现了一部分Pluginable的方法。 <br>
 * English: <br>
 * This class is an abstract plugin class, he achieved some Pluginable approach.<br>
 * </p>
 *
 * @author davy
 */
public abstract class AbstractPlugin implements Pluginable {

    /**
     * The logger.
     */
    private Logger logger = LoggerFactory.getLogger(AbstractPlugin.class);

    protected PluginParam param;

    protected PluginMonitor monitor;

    /**
     * The plugin name.
     */
    protected String pluginName;

    /**
     * The plugin version.
     */
    protected String pluginVersion;

    /**
     */
    protected GlobalVariables globalVariables;

    protected volatile boolean shouldStop;

    public boolean isShouldStop() {
        return shouldStop;
    }

    /*
         * (non-Javadoc)
         *
         * @see Pluginable#getGlobalVariables()
         */
    public GlobalVariables getGlobalVariables() {
        return globalVariables;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#setGlobalVariables(GlobalVariables)
     */
    public void setGlobalVariables(GlobalVariables globalVariables) {
        this.globalVariables = globalVariables;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#getParam()
     */
    public PluginParam getParam() {
        return param;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#setParam(PluginParam)
     */
    public void setParam(PluginParam param) {
        this.param = param;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#getPluginName()
     */
    public String getPluginName() {
        return pluginName;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#setPluginName(java.lang.String)
     */
    public void setPluginName(String pluginName) {
        this.pluginName = pluginName;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#getPluginVersion()
     */
    public String getPluginVersion() {
        return pluginVersion;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#setPluginVersion(java.lang.String)
     */
    public void setPluginVersion(String pluginVersion) {
        this.pluginVersion = pluginVersion;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#getMonitor()
     */
    public PluginMonitor getMonitor() {
        return monitor;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#setMonitor(PluginMonitor)
     */
    
    public void setMonitor(PluginMonitor monitor) {
        this.monitor = monitor;
    }

    /*
     * (non-Javadoc)
     *
     * @see Pluginable#setContextClassLoader(java.lang.ClassLoader)
     */
    public void setContextClassLoader(ClassLoader classLoader) {
        Thread.currentThread().setContextClassLoader(classLoader);
    }

    /**
     * *
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的String类型的值，为空返回null。<br>
     * English:<br>
     * Returns a getParam (String key) of the value of type String, null returns null.
     * </p>
     *
     * @param key the key
     * @return the param string value
     */
    public String getParamStringValue(String key) {
        return getParamStringValue(key, null);
    }

    /**
     * 中文：<br>
     * 返回一个getParam(String key)的String类型的值，为空返回defaultValue。<br>
     * English:<br>
     * Returns a getParam(String key) of type String value is null return defaultValue.
     *
     * @param key          the key
     * @param defaultValue the default value
     * @return the param string value
     */
    public String getParamStringValue(String key, String defaultValue) {
        Object value = getParam(key);
        if (value != null) {
            return value.toString();
        }
        return defaultValue;
    }

    /**
     * 中文： <br>
     * 这个方法是从globalVariables中获取一个值，如果没有，那么就从param中获的，如果还没有，那么返回null。 <br>
     * English: <br>
     * This method is to get a value from globalVariables, if not, then won from param, and if not, then return null.
     *
     * @param key the key
     * @return the param
     */
    public Object getParam(String key) {
        Object value = null;
        if (Utils.isNotEmpty(globalVariables) && globalVariables.containsKey(key)) {
            value = globalVariables.get(key);
        } else if (Utils.isNotEmpty(param) && param.containsKey(key)) {
            value = param.get(key);
        }
        return value;
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的boolean类型的值，为空或者转成boolean有异常时返回false。<br>
     * English:<br>
     * Returns a getParam(String key) of type boolean value is empty or when transferred to a boolean abnormal returns
     * false.
     * </p>
     *
     * @param key the key
     * @return the param bool value
     */
    public boolean getParamBoolValue(String key) {
        Object value = getParam(key);
        if (value == null) {
            throw new NoSucnParamException(key);
        }
        String boolStr = value.toString();
        if ("true".equalsIgnoreCase(boolStr)) {
            return true;
        } else if ("false".equalsIgnoreCase(boolStr)) {
            return false;
        } else {
            throw new MalformedBoolValueException(boolStr);
        }
//        return getParamBoolValue(key, false);
    }

    /**
     * 中文：<br>
     * 返回一个getParam(String key)的boolean类型的值，为空或者转成boolean有异常时返回defaultValue。<br>
     * English:<br>
     * Returns a getParam(String key) of type boolean value is empty or when transferred to a boolean abnormal returns
     * defaultValue.
     *
     * @param key          the key
     * @param defaultValue the default value
     * @return the param bool value
     */
    public boolean getParamBoolValue(String key, boolean defaultValue) {
        Object value = getParam(key);
        if (value == null) {
            return defaultValue;
        }
        return Boolean.parseBoolean(value.toString());
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的int类型的值，为空或者解析成int有异常返回0。<br>
     * English:<br>
     * Returns a getParam(String key) of type int value is empty or parse an int abnormal returns 0.
     * </p>
     *
     * @param key the key
     * @return the param int value
     */
    public int getParamIntValue(String key) {
        Object value = getParam(key);
        if (value == null) {
            throw new NoSucnParamException(key);
        }
        return Integer.parseInt(value.toString());
//        return getParamIntValue(key, 0);
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的int类型的值，为空或者解析成int有异常返回defaultValue。<br>
     * English:<br>
     * Returns a getParam(String key) of type int value is empty or parse an int abnormal returns defaultValue.
     * </p>
     *
     * @param key          the key
     * @param defaultValue the default value
     * @return the param int value
     */
    public int getParamIntValue(String key, int defaultValue) {
        String value = getParamStringValue(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            defaultValue = Integer.parseInt(value);
        } catch (NumberFormatException e) {
            logger.warn("Parse " + key + "'s value '" + value + "' to int failed, return default value '" + defaultValue + "'!");
        }
        return defaultValue;
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的long类型的值，为空或者解析成long有异常时返回0。<br>
     * English:<br>
     * Returns a getParam(String key) of type long value is empty or parse a long abnormal returns 0.
     * </p>
     *
     * @param key the key
     * @return the param long value
     */
    public long getParamLongValue(String key) {
        Object value = getParam(key);
        if (value == null) {
            throw new NoSucnParamException(key);
        }
        return Long.parseLong(value.toString());
//        return getParamLongValue(key, 0);
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的long类型的值，为空或者解析成long有异常时返回defaultValue。<br>
     * English:<br>
     * Returns a getParam(String key) of type long value is empty or parse a long abnormal returns defaultValue.
     * </p>
     *
     * @param key          the key
     * @param defaultValue the default value
     * @return the param long value
     */
    public long getParamLongValue(String key, long defaultValue) {
        String value = getParamStringValue(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            defaultValue = Long.parseLong(value);
        } catch (NumberFormatException e) {
            logger.warn("Parse " + key + "'s value '" + value + "' to long failed, return default value '" + defaultValue + "'!");
        }
        return defaultValue;
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的double类型的值，为空或者解析成double有异常时返回0。<br>
     * English:<br>
     * Returns a getParam(String key) of type double value is empty or when parsed into double abnormal returns 0.
     * </p>
     *
     * @param key the key
     * @return the param double value
     */
    public double getParamDoubleValue(String key) {
        Object value = getParam(key);
        if (value == null) {
            throw new NoSucnParamException(key);
        }
        return Double.parseDouble(value.toString());
//        return getParamDoubleValue(key, 0.0);
    }

    /**
     * <p>
     * 中文：<br>
     * 返回一个getParam(String key)的double类型的值，为空或者解析成double有异常时返回defaultValue。<br>
     * English:<br>
     * Returns a getParam(String key) of type double value is empty or parsed into double abnormal returns defaultValue.
     * </p>
     *
     * @param key          the key
     * @param defaultValue the default value
     * @return the param double value
     */
    public double getParamDoubleValue(String key, double defaultValue) {
        String value = getParamStringValue(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            defaultValue = Double.parseDouble(value);
        } catch (NumberFormatException e) {
            logger.warn("Parse " + key + "'s value '" + value + "' to double failed, return default value '" + defaultValue + "'!");
        }
        return defaultValue;
    }

    
    public void update(Observable o, Object arg) {
        shouldStop = true;
    }
}
