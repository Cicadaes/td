package com.talkingdata.datacloud.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

/**
 * 算子类加载器
 * Created by yangtao on 2017/2/8.
 */
public class OperatorClassLoaderManager extends ClassLoader {

    private String jarPath;

    public OperatorClassLoaderManager(String jarPath, ClassLoader parent) {
        super(parent);
        this.jarPath = jarPath;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] classData = loadClassData(name);  //根据类的二进制名称,获得该class文件的字节码数组
        if (classData == null) {
            System.out.println("findClass  " + name);
            throw new ClassNotFoundException();
        }
        return defineClass(name, classData, 0, classData.length);  //将class的字节码数组转换成Class类的实例
    }

    private byte[] loadClassData(String className) {
        System.out.println("loadClassData =========== " + className);
        try {
            JarFile jarFile = new JarFile(jarPath);
            Enumeration<JarEntry> entrys = jarFile.entries();
            while (entrys.hasMoreElements()) {

                JarEntry jarEntry = entrys.nextElement();
                String fileName = jarEntry.getName();
                String t = classNameToPath(className);
                if (fileName.endsWith(".class") && fileName.equals(t)) {

                    InputStream is = jarFile.getInputStream(jarEntry);
                    ByteArrayOutputStream byteSt = new ByteArrayOutputStream();
                    int len = 0;
                    try {
                        while ((len = is.read()) != -1) {
                            byteSt.write(len);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return byteSt.toByteArray();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return null;
    }

    private String classNameToPath(String className) {
        return className.replace('.', File.separatorChar) + ".class";
    }

//    public Class<?> loadClass(String jarFile) throws ClassNotFoundException {
//        return this.loadClass(className);
//    }

    public static void main(String[] args) throws Exception {
        String rootUrl1 = "E:\\tmp\\temp\\mysql-connector-java-5.1.36.jar";
        rootUrl1 = "C:\\Users\\yangtao\\Desktop\\code back\\test.jar";
        OperatorClassLoaderManager hdfsClassLoader1 = new OperatorClassLoaderManager(rootUrl1, OperatorClassLoaderManager.getSystemClassLoader());
        String classname = "test.Test3";
        Class<?> clazz1 = hdfsClassLoader1.loadClass(classname);
        Class<?> class2 = hdfsClassLoader1.loadClass("test.Test2");
//        Class<?> class3 = Class.forName("test.Test2");
        System.out.println(class2);
        System.out.println(clazz1);
        Class<?> clazz3 = Class.forName("test.Test3");
        System.out.println(OperatorClassLoaderManager.getSystemClassLoader());
//        System.out.println("=============================================" + clazz3);
    }
}
