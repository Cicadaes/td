package com.talkingdata.datacloud.util;

import java.io.IOException;
import java.net.URI;
import java.util.*;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 在HDFS上进行disk usage统计的工具
 * 
 * @author yizhu.sun 2016年11月10日
 */
public class HdfsDiskUsageUtils {
//
//  private static final Logger logger = LoggerFactory.getLogger(HdfsDiskUsageUtils.class);
//
//  private static TreeMap<String, PathStatus> cache;
//
//  /**
//   * 扫描HDFS指定目录，统计文件数和字节数
//   * 
//   * @return 指定目录的文件数和字节数(级联的)
//   */
//  public static PathStatus scan(Configuration hadoopConf, String scanPath,
//      DatasetDiskUsageService datasetDiskUsageService) throws IOException {
//    loadCache(datasetDiskUsageService);
//    String nameNodeUrl = HdfsNamenodeUtil.getNameNodeUrl();
//    PathStatus result = scan(FileSystem.get(URI.create(nameNodeUrl), hadoopConf), new Path(scanPath), datasetDiskUsageService);
//    return result;
//  }
//
//  /**
//   * @param cache 注意这个Map中的数据可能被删除
//   */
//  private static PathStatus scan(FileSystem fileSystem, Path scanPath,
//      DatasetDiskUsageService datasetDiskUsageService) throws IOException {
//    String pathString = scanPath.toUri().getPath();
//    String pathName = getNameFromPath(pathString);
//    FileStatus fileStatus = fileSystem.getFileStatus(scanPath);
//    long timestamp = fileStatus.getModificationTime();
//    PathStatus pathStatus = new PathStatus(timestamp, 0, 0L);
//    DatasetDuDetail detail = new DatasetDuDetail();
//    int childDirCount = 0;
//    int childFileCount = 0;
//    if (fileSystem.isDirectory(scanPath)) {
//      TreeSet<String> pathsExist = new TreeSet<>();
//      FileStatus[] children = fileSystem.listStatus(scanPath);
//      boolean hasChildDir = false;
//      for (FileStatus child : children) {
//        if (child.isDirectory()) {
//          hasChildDir = true;
//          break;
//        }
//      }
//      if (!hasChildDir) {
//        PathStatus lastStatus = getCache(pathString, timestamp);
//        if (lastStatus != null) {
//          // 如果一个路径上次计算过且时间戳没变，则直接返回上次计算的结果
//          logger.info(">>>>> hit cache: {}", pathString); // TODO change to debugDataPipeline
//          return lastStatus;
//        }
//      }
//      logger.info(">>>>> scan: {}", pathString); // TODO change to debugDataPipeline
//      for (FileStatus child : children) {
//        pathsExist.add(child.getPath().toUri().getPath());
//        if (child.isDirectory()) {
//          try {
//            PathStatus subPathStatus = scan(fileSystem, child.getPath(), datasetDiskUsageService);
//            pathStatus.files += subPathStatus.files;
//            pathStatus.bytes += subPathStatus.bytes;
//          } catch (IOException e) {
//            logger.error(">>>>> IOException: ", e);
//          }
//          childDirCount++;
//        } else if (child.isFile()) {
//          // 子路径为文件的，只统计不记录
//          pathStatus.files += 1;
//          pathStatus.bytes += child.getLen();
//          childFileCount++;
//        }
//      }
//      // 删除已经被物理删除的路径
//      removeChildrenPath(pathString, pathsExist, datasetDiskUsageService);
//      detail.setIsDir(true);
//    } else if (fileSystem.isFile(scanPath)) {
//      pathStatus.files = 1;
//      pathStatus.bytes = fileSystem.getFileStatus(scanPath).getLen();
//      removePath(pathString, datasetDiskUsageService);
//      detail.setIsDir(false);
//    } else {
//      // 不统计link
//      return pathStatus;
//    }
//    detail.setDirTimestamp(timestamp);
//    detail.setCurrentPath(pathString);
//    detail.setCurrentName(pathName);
//    detail.setChildDirCount(childDirCount);
//    detail.setChildFileCount(childFileCount);
//    detail.setFileCount(pathStatus.files);
//    detail.setByteCount(pathStatus.bytes);
//    detail.setParentPath(scanPath.getParent().toUri().getPath());
//    cache.put(pathString, pathStatus);
//    if (datasetDiskUsageService != null) {
//      datasetDiskUsageService.upsertDetail(detail);
//    }
//    return pathStatus;
//  }
//
//  private static String getNameFromPath(String pathString) {
//    pathString = pathString.replaceAll("[/\\\\]+", "/");
//    pathString = pathString.replaceAll("/$", "");
//    int index = pathString.lastIndexOf("/");
//    index = index == -1 ? 0 : index + 1;
//    return pathString.substring(index);
//  }
//
//  private static PathStatus getCache(String path, long timestamp) {
//    PathStatus lastStatus = cache.get(path);
//    if (lastStatus != null && lastStatus.timestamp == timestamp) {
//      return lastStatus;
//    } else {
//      return null;
//    }
//  }
//
//  private static void removePath(String path, DatasetDiskUsageService datasetDiskUsageService) {
//    logger.info(">>>>> remove path from cache: {}", path); // TODO change to debugDataPipeline
//    cache.remove(path);
//    if (datasetDiskUsageService != null) datasetDiskUsageService.deleteDetailsByPath(path);
//  }
//
//  private static void removeChildrenPath(String path, TreeSet<String> pathsExist,
//      DatasetDiskUsageService datasetDiskUsageService) {
//    int index = path.length() + 1;
//    String ceilingPath = cache.higherKey(path);
//    while (ceilingPath != null && ceilingPath.startsWith(path)) {
//      if (ceilingPath.length() > index && ceilingPath.indexOf('/', index) < 0 && !pathsExist.contains(ceilingPath)) {
//        removeChildrenPath(ceilingPath, pathsExist, datasetDiskUsageService);
//        removePath(ceilingPath, datasetDiskUsageService);
//      }
//      ceilingPath = cache.higherKey(ceilingPath);
//    }
//  }
//
//  private static synchronized void loadCache(DatasetDiskUsageService datasetDiskUsageService) {
//    if (cache == null) cache = datasetDiskUsageService.getPathStatusCache();
//  }
//
//  public static class PathStatus {
//
//    public PathStatus() {}
//
//    public PathStatus(long timestamp, int files, long bytes) {
//      this.timestamp = timestamp;
//      this.files = files;
//      this.bytes = bytes;
//    }
//
//    private long timestamp;
//    private int files;
//    private long bytes;
//
//    public long getTimestamp() {
//      return timestamp;
//    }
//
//    public int getFiles() {
//      return files;
//    }
//
//    public long getBytes() {
//      return bytes;
//    }
//
//  }
//
}
