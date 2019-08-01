package com.talkingdata.marketing.core.util;

import org.apache.commons.lang.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 *
 * @author gjqiao
 * @date 2017/1/4
 */
public class FolderUtil {
    private static final Logger logger = LoggerFactory.getLogger(FolderUtil.class);
    private FolderUtil(){

    }

    /**
     * Prepare folder.
     *
     * @param folderPath the folder path
     */
    public static void prepareFolder(String folderPath){
        File f = new File(folderPath);
        if(!f.exists()){
            logger.debug(String.format("create Dir %s",folderPath));
            f.mkdirs();
        }else{
            delFolder(folderPath);
        }
    }

    /**
     * Del folder.
     * //param folderPath 文件夹完整绝对路径
     * @param folderPath the folder path
     */
    public static void delFolder(String folderPath) {
        //删除完里面所有内容
        delAllFile(folderPath);
        File myFilePath = new File(folderPath);
        if(myFilePath.exists()) {
            // 删除空文件夹
            myFilePath.delete();
        }

    }

    /**
     * Del all file boolean.
     *删除指定文件夹下所有文件
     * param path 文件夹完整绝对路径
     * @param path the path
     * @return the boolean
     */

    public static boolean delAllFile(String path) {
        boolean flag = false;
        File file = new File(path);
        if (!file.exists()) {
            return flag;
        }
        if (!file.isDirectory()) {
            return flag;
        }
        String[] tempList = file.list();
        File temp = null;
        if(!ArrayUtils.isEmpty(tempList)) {
            for (int i = 0; i < tempList.length; i++) {
                if (path.endsWith(File.separator)) {
                    temp = new File(path + tempList[i]);
                } else {
                    temp = new File(path + File.separator + tempList[i]);
                }
                if (temp.isFile()) {
                    temp.delete();
                }
                if (temp.isDirectory()) {
                    // 先删除文件夹里面的文件
                    delAllFile(path + "/" + tempList[i]);
                    //再删除空文件夹
                    delFolder(path + "/" + tempList[i]);
                    flag = true;
                }
            }
        }
        if(file.isDirectory()){
            file.delete();
        }
        return flag;
    }

    /**
     * Get file name string.
     *
     * @param folderName the folder name
     * @param postPrefix the post prefix
     * @return the string
     */
    public static String getFileName(String folderName,String postPrefix){
        File file = new File(folderName);
        File[] files = file.listFiles();
        if(!ArrayUtils.isEmpty(files)) {
            for (File file1 : files) {
                if (file1.getName().contains(postPrefix)) {
                    return file1.toString();
                }
            }
        }
        return null;
    }

    /**
     * Get file name list with out snap list.
     *
     * @param foldName the fold name
     * @return the list
     */
    public static List<String> getFileNameListWithOutSnap(String foldName){
        File folder = new File(foldName);
        String []fileNames = folder.list();
        if(fileNames==null){
            return Collections.emptyList();
        }
        List<String> fileNameList = new ArrayList<>();
        for(String fileName:fileNames){
            int jarPosition = fileName.indexOf("-0.0.1-SNAPSHOT.jar");
            if(jarPosition!=-1) {
                fileNameList.add(fileName.substring(0, jarPosition));
                continue;
            }
            jarPosition = fileName.indexOf(".jar");
            if(jarPosition!=-1) {
                fileNameList.add(fileName.substring(0, jarPosition));
                continue;
            }
        }

        return fileNameList;
    }

    /**
     * Get full operator name string.
     *
     * @param operatorName the operator name
     * @param foldeName    the folde name
     * @return the string
     */
    public static String getFullOperatorName(String operatorName,String foldeName ){
        if(foldeName==null){
            throw new IllegalArgumentException("foldName is null");
        }
        File file = new File(foldeName);
        if(!file.exists()||!file.isDirectory()){
            throw new IllegalArgumentException(String.format("foldName is not exists or foldName is not a Directory,foldName=%s",foldeName));
        }
        String[] fileNames = new File(foldeName).list();
        if(fileNames==null){
            throw new IllegalArgumentException(String.format("foldName has no jars,foldName=%s",foldeName));
        }
        for(String fileName:fileNames){
            if(fileName.contains(operatorName)){
                return fileName;
            }
        }
        throw new IllegalArgumentException(String.format("foldName does not contains operatorName,foldName=%s,operaorName=%s",foldeName,operatorName));
    }

}
