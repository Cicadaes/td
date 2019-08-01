package com.talkingdata.datacloud.visual.util;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * Created by yangruobin on 2017/10/13.
 */
public class FileUtils {
    public static String readContent(String fileName) {
        StringBuffer buffer = new StringBuffer();
        try {
            BufferedReader reader = new BufferedReader(new java.io.FileReader(fileName));
            String line = null;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        } catch (IOException ioexception) {
            throw new IllegalStateException(ioexception);
        }
        return buffer.toString();
    }
}
