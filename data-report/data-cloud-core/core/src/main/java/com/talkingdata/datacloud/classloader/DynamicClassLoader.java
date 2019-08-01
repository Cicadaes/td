package com.talkingdata.datacloud.classloader;

/**
 * Created by hadoop on 2017/2/9.
 */
public class DynamicClassLoader extends ClassLoader {


    public Class<?> findClass(byte[] b) throws ClassNotFoundException {

        return defineClass(null, b, 0, b.length);
    }
}