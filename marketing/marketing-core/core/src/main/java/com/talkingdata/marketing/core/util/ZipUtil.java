package com.talkingdata.marketing.core.util;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.util.Zip4jConstants;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.Zip;
import org.apache.tools.ant.types.FileSet;

import java.io.File;
import java.io.IOException;

/**
 *
 * @author gjqiao
 * @date 2017/1/4
 */
public class ZipUtil {

    /**
     * 压缩文件构造函数
     */
    private ZipUtil() {
    }

    /**
     * 执行压缩操作
     *
     * @param pathName    需要被压缩的文件/文件夹
     * @param zipFileName 最终压缩生成的压缩文件：目录+压缩文件名.zip
     * @throws IOException the io exception
     */
    public static void compress(String pathName, String zipFileName) throws IOException {
        File srcdir = new File(pathName);
        File zipFile = new File(zipFileName);
        if (!srcdir.exists()) {
            throw new IOException(pathName + "不存在！");
        }
        if (zipFile.exists()) {
            zipFile.delete();
        }

        Project prj = new Project();
        Zip zip = new Zip();
        zip.setProject(prj);
        zip.setDestFile(zipFile);
        FileSet fileSet = new FileSet();
        fileSet.setProject(prj);
        fileSet.setDir(srcdir);
        //fileSet.setIncludes("**/*.java"); //包括哪些文件或文件夹 eg:zip.setIncludes("*.java");
        //fileSet.setExcludes(...); //排除哪些文件或文件夹
        zip.addFileset(fileSet);
        zip.execute();
    }

    /***
     * 和上一个方法相比，可以处理被压缩目录有奇怪名称的问题
     * @param dir the dir
     * @param targetZip the target zip
     * @throws ZipException the zip exception
     */
    public static void compress2(String dir, String targetZip) throws ZipException {
        File zip = new File(targetZip);
        if (zip.exists()) {
            zip.delete();
        }
        ZipFile zipFile = new ZipFile(targetZip);
        ZipParameters parameters = new ZipParameters();
        parameters.setCompressionMethod(Zip4jConstants.COMP_DEFLATE);
        parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_NORMAL);
        parameters.setIncludeRootFolder(false);
        zipFile.createZipFileFromFolder(dir, parameters, true, 10485760);
    }

    /**
     * De compress.
     *
     * @param zip       the zip
     * @param targetDir the target dir
     * @throws ZipException the zip exception
     */
    public static void deCompress(File zip, File targetDir) throws ZipException {
        FolderUtil.delFolder(targetDir.getAbsolutePath());
        targetDir.mkdirs();
        ZipFile zipFile = new ZipFile(zip);
        zipFile.setFileNameCharset("UTF-8");
        zipFile.extractAll(targetDir.getAbsolutePath());
    }
}
