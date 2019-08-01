package com.talkingdata.datacloud.util;

import org.apache.commons.lang.StringUtils;

public class FileNameUtils {
    public static final int MAX_NAME_LENGTH = 255;
    public static void checkFileName(String fileName) {
        checkFileName(fileName, true, true);
    }

    public static void checkFileName(String fileName, boolean forWindows, boolean forLinux) {
        if (StringUtils.isEmpty(fileName)) {
            throw new IllegalArgumentException("文件名为空");
        }
        if (fileName.length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("文件名过长，长度不能超过"+MAX_NAME_LENGTH);
        }
        for (char c : fileName.toCharArray()) {
            switch (c) {
                case '/':
                    throw new IllegalArgumentException("文件名包含非法字符 /");
                case '\0':
                    throw new IllegalArgumentException("文件名包含非法字符  \\0");
                case '\\':
                case ':':
                case '*':
                case '?':
                case '"':
                case '<':
                case '>':
                case '|':
                    if (forWindows) throw new IllegalArgumentException("文件名包含非法字符 " + c);
            }
        }
        if (forLinux && (".".equals(fileName) || "..".equals(fileName))) {
            throw new IllegalArgumentException("非法文件名 " + fileName);
        }
    }

    public static boolean checkFileNameMaxLength(String fileName,int maxLength){
        boolean b = false;
        if(StringUtils.isEmpty(fileName)){
            return b;
        }
        String lastFileName = null;
        int index = fileName.lastIndexOf("/");
        if(index>=0){
            lastFileName = fileName.substring(index+1);
        }else{
            lastFileName = fileName;
        }
        if(lastFileName.length()>maxLength){
            b = true;
        }
        return b;
    }
}
