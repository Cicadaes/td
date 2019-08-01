package com.talkingdata.datacloud.util;

import com.google.common.io.ByteStreams;
import com.talkingdata.datacloud.exception.FormException;
import com.talkingdata.datacloud.vo.TreeNode;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.fs.FileUtil;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.util.*;

/**
 * Created by qingfa.zhou on 16/8/24.
 */
public class HdfsUtil implements AutoCloseable {

    private FileSystem fs;

    /**
     * @param hdfsUri <b>eg:</b> hdfs://172.23.6.3:8020
     */
    public HdfsUtil(String hdfsUri) throws IOException {
        System.setProperty("HADOOP_USER_NAME", "hadoop");
        fs = initFs(hdfsUri);
    }

    private FileSystem initFs(String hdfsUri) throws IOException {
        if (null == fs) {
            fs = FileSystem.get(URI.create(hdfsUri), new Configuration());
        }
        return fs;
    }

    public FileSystem getFs() {
        return fs;
    }

    public long lengthOf(Path path) throws IOException {
        if (isFile(path)) {
            return fs.getFileStatus(path).getLen();
        } else if (isDirectory(path)) {
            return fs.getContentSummary(path).getSpaceConsumed();
        }
        throw new FileNotFoundException("file not found: " + path);
    }

    public List<FileStatus> fileList(List<FileStatus> fileStatusList,
                                     String fileDir)
            throws IOException {
        FileStatus[] fileStatuses = fs.listStatus(new Path(fileDir), new PathFilter() {
            @Override
            public boolean accept(Path path) {
                return !(path.getName().startsWith("_"));
            }
        });
        for (FileStatus fileStatus : fileStatuses) {
            if (fileStatus.isFile()) {
                fileStatusList.add(fileStatus);
            } else {
                fileList(fileStatusList, fileStatus.getPath().toUri().getPath());
            }
        }
        return fileStatusList;
    }

    public List<FileStatus> fileListAndFilter(List<FileStatus> fileStatusList,
                                                   String fileDir,
                                                   final String filterName)
            throws IOException {
        FileStatus[] fileStatuses = fs.listStatus(new Path(fileDir), new PathFilter() {
            @Override
            public boolean accept(Path path) {
                return !(path.getName().startsWith("_"));
            }
        });
        for (FileStatus fileStatus : fileStatuses) {
            if (fileStatus.isFile()) {
                if(fileStatus.getPath().getName().endsWith(filterName)){
                    fileStatusList.add(fileStatus);
                }
            } else {
                fileList(fileStatusList, fileStatus.getPath().toUri().getPath());
            }
        }
        return fileStatusList;
    }

    public List<FileStatus> fileList(List<FileStatus> fileStatuseList,
            String fileDir,
            final String type) throws IOException {
        List<FileStatus> fileStatuses = new ArrayList<>();
        for (FileStatus _status : fileList(fileStatuseList, fileDir)) {
            if (_status.getPath().getName().endsWith(type)) {
                fileStatuses.add(_status);
            }
        }
        return fileStatuses;
    }

    public boolean exist(Path path) throws IOException {
        return fs.exists(path);
    }

    public boolean exist(String path) throws IOException {
        return exist(new Path(path));
    }

    public boolean isFile(Path path) throws IOException {
        return fs.isFile(path);
    }

    public boolean isDirectory(Path path) throws IOException {
        return fs.isDirectory(path);
    }

    public FileStatus getFileStatus(Path file) throws IOException {
        return fs.getFileStatus(file);
    }

    public FSDataOutputStream create(Path path, boolean overwrite) throws IOException {
        return fs.create(path, overwrite);
    }

    public FSDataInputStream open(Path f) throws IOException {
        return fs.open(f);
    }

    public void copyFromLocalFile(Path src, Path dst) throws IOException {
        fs.copyFromLocalFile(src, dst);
    }

    public void copyToLocalFile(Path src, Path dst) throws IOException {
        fs.copyToLocalFile(src, dst);
    }

    public boolean delete(Path f, boolean recursive) throws IOException {
        return fs.delete(f, recursive);
    }

    public boolean rename(Path src, Path dst) throws IOException {
        return fs.rename(src, dst);
    }

    public boolean mkdirs(Path f) throws IOException {
        return fs.mkdirs(f);
    }

    public void copyDir(Path from, Path to) throws IOException {
        FileUtil.copy(fs, from, fs, to, false, new Configuration());
    }

    @Override
    public void close() throws IOException {
        if (fs != null) {
            fs.close();
        }
    }

    public String readFile(String file) {
        try {
            Path path = new Path(file);
            if (!isFile(path)) {
                throw new RuntimeException(file + " is not HDFS file");
            }
            try (FSDataInputStream in = open(path); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                ByteStreams.copy(in, out);
                out.flush();
                return new String(out.toByteArray());
            }
        } catch (IOException e) {
            throw new RuntimeException("read file failed " + file);
        }
    }


    public FSDataOutputStream append(Path path) throws IOException {
        return fs.append(path);
    }

    //思考下这个方法的描述.
    //返回指定深度depth的文件夹数组,其中：a)每层都必须只能是文件夹,b)parentPath的每个子目录都是相同的depth深度.
    //所以,这个返回结果,数组最少也是有一个值.为了支撑depth而唯一的目录.即depth代单传.

    //延伸思考.目录结构这种其实就有点像(单性别)家谱一样。有子必有父,有父不一定有子.每个路径的前缀就是父辈的基因.一代代往下传.
    public FileStatus[] listChildFolderPaths(String parentPath,int depth) throws IOException, FormException {

        Path path = new Path(parentPath);
        List<Path> pathList = Arrays.asList(path);
        FileStatus[] fileStatusArray = null;
        for(int i=0;i<depth;i++){
            for(Path p : pathList) {
                fileStatusArray = fs.listStatus(p);
                if (null != fileStatusArray && fileStatusArray.length != 0) {
                    List<Path> fileStatusList = new ArrayList<>();
                    for (FileStatus fileStatus : fileStatusArray) {
                        if (!fileStatus.isDirectory()) {
                            throw new FormException("title", "发现文件,异常退出.");
                        } else {
                            fileStatusList.add(fileStatus.getPath());
                        }
                    }
                    pathList = fileStatusList;

                } else {
                    throw new FormException("title", "未能预期到达更深层目录，异常退出");
                }
            }// for(p
        }// for(i

        return fileStatusArray;
    }

    public  List<TreeNode> makeTreeNodeList(String parent, HdfsUtil fs, FileStatus[] fileStatusList) throws IOException {
        List<TreeNode> list = new ArrayList<>();
        for (FileStatus status : fileStatusList) {
            TreeNode node = new TreeNode();
            if (status.isFile()) {
                node.setIcon("fa-file-word-o");
                node.setLeaf(true);
            } else if (status.isDirectory()) {
                Path nowPath = status.getPath();
                if(fs.getFs().listStatus(nowPath).length>0){
                    node.setExpandedIcon("fa-folder-open");
                }
                node.setCollapsedIcon("fa-folder");
//                    node.setExpandedIcon("fa-folder-open");
                node.setLeaf(false);
            } else {
                continue;
            }
            String name = status.getPath().toUri().getPath().replaceFirst(parent,"").replaceFirst("^/+","");
            node.getData().setPath(parent.replaceFirst("/+$","") + "/" + name);
            node.setLabel(name);
            list.add(node);
        }
        return list;
    }


    public List<FileStatus> childPathList(List<Path> pathlist) throws IOException {
        return  Arrays.asList(fs.listStatus(pathlist.toArray(new Path[pathlist.size()])));
    }

    /**
     * 获取层级深度相同的pathList的子节点.  都没有子节点或者都有子节点,那么正常返回.否则抛异常.
     * @param pathlist
     * @return
     * @throws IOException
     */
    public Map<String,Object> childPathListProportioned(List<Path> pathlist,boolean quickBreak) throws IOException {
        List<FileStatus> resultList = new ArrayList<>();
        Map<String, Object> resultMap = new HashMap<>();
        boolean even = true;
        resultMap.put("childList",resultList);

        boolean haveSons = false;
        boolean haveNoSons = false;
        for(int i=0 ; i< pathlist.size();i++){
            FileStatus[] fileStatus = fs.listStatus(pathlist.get(i));
            if(null != fileStatus && fileStatus.length > 0){
                resultList.addAll(Arrays.asList(fileStatus));
                //任何一个节点的子节点不为空,其他节点就都不能为空了.
                haveSons = true;
            }else{
                haveNoSons = true;
            }

            if(even && haveSons && haveNoSons){
                even = false;
                if(quickBreak){
                    break;
                }
            }
        }


        resultMap.put("even", even);
        return resultMap;
    }

    public List<Path> fileStatusList2PathList(List<FileStatus> fileStatuses) {
        List<Path> tmpPathList = new ArrayList<>();
        for(FileStatus f : fileStatuses){
            tmpPathList.add(f.getPath());
        }
        return tmpPathList;
    }

    public String getTimePartitionPath(Integer timeFormatLength, FileStatus f) {
        List<String> folderList = Arrays.asList(f.getPath().toUri().getPath().split("/"));
        return String.join("/", folderList.subList(folderList.size() - timeFormatLength, folderList.size()));
    }


    public FileStatus[] listChildQuick(List<Path> pathList,int depth) throws IOException, FormException {

        FileStatus[] fileStatusArray = null;
        for(int i=0;i<depth;i++) {
            fileStatusArray = fs.listStatus(pathList.toArray(new Path[pathList.size()]));
            if (null != fileStatusArray && fileStatusArray.length != 0) {
                pathList = fileStatusList2PathList(Arrays.asList(fileStatusArray));
            } else {
                throw new FormException("title", "未能预期到达更深层目录，异常退出");
            }
        }// for(i

        return fileStatusArray;
    }


}
