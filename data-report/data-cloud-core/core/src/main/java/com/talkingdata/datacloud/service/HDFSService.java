package com.talkingdata.datacloud.service;

import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.tools.ant.taskdefs.Input;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;

import static java.lang.System.in;

/**
 * Created by gjqiao on 2017/1/16.
 */
public class HDFSService implements AutoCloseable{

    private Logger logger = LoggerFactory.getLogger(HDFSService.class);

    @Value("#{configProperties['defaultFS']}")
    private String defaultFS;

    private FileSystem fs;

    public HDFSService(){
        try {
            fs = FileSystem.get(URI.create(defaultFS), new Configuration());
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }

    public HDFSService(String fsNameNode){
        try {
            fs = FileSystem.get(URI.create(fsNameNode), new Configuration());
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    public void write2HDFS(String hdfspath,String fileName) throws IOException{
        InputStream inputStream = new FileInputStream(fileName);
        Path path =  new Path(hdfspath);
        if(!isFile(path)){
            fs.createNewFile(path);
        }

        FSDataOutputStream output = fs.create(path, true);
        IOUtils.copy(inputStream, output);
        output.flush();
        output.close();
        fs.close();
    }

    public void getFileList(String path) throws IOException {
        fs.listFiles(new Path(path),true);
    }

    public FileStatus[] getFileStatusList(String path) throws IOException {
        return fs.listStatus(new Path(path));
    }

    public boolean mkdirs(Path f) throws IOException {
        return fs.mkdirs(f);
    }
    public boolean exist(Path path) throws IOException {
        return fs.exists(path);
    }

    public boolean isFile(Path path) throws IOException {
        return fs.isFile(path);
    }

    public boolean isDirectory(Path path) throws IOException {
        return fs.isDirectory(path);
    }
    @Override
    public void close() throws Exception {
        fs.close();
    }
}
