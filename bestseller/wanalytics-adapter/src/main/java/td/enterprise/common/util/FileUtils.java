package td.enterprise.common.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import lombok.extern.slf4j.Slf4j;
import td.enterprise.constants.FTPConstants;
import td.enterprise.entity.FTPLine;

/**
 * 文件工具类
 * @description 
 * @author sxk
 * @date 2017年10月12日
 */
@Slf4j
public class FileUtils {
    /**
     * ftp文件时间长度
     */
    private static final int    TIME_LENGTH    = 10;
    /**
     * ftp时间补零
     */
    private static final String TIME_SUFFIX    = "000";
    /**
     * 时间误差
     */
    private static final int    FIX_MIN_MILLIS = -600000;
    private static final int    FIX_MAX_MILLIS = 600000;

    /**
     * 按行读取文件，不去重
     * @param file
     * @return
     */
    public static List<FTPLine> readZipFile(File file) {
        return processFile(file);
    }

    /**
     * 按行读取文件，去重 FTPLine必须实现equals方法
     * @param file
     * @return
     */
    public static Set<FTPLine> readZipFile2Set(File file) {
        return new HashSet<>(processFile(file));
    }

    private static List<FTPLine> processFile(File file) {
        List<FTPLine> rs = new ArrayList<>();
        if (null == file || file.length() == 0) {
            log.error("file is null");
            return rs;
        }
        if (!file.getName().endsWith(FTPConstants.FTP_FILE_SUFFIX)) {
            log.warn("file {} is bak", file.getName());
            return rs;
        }
        try (ZipFile zf = new ZipFile(file)) {
            FTPLine fl = null;
            Enumeration<ZipEntry> entries = (Enumeration<ZipEntry>) zf.entries();
            ZipEntry ze;
            // 枚举zip文件内的文件

            String fileTimeStr = file.getName().substring(0, 12);
            Date fileDate = DateUtil.parse(fileTimeStr, FTPConstants.FTP_NAME_PATTERN);
            if (null == fileDate) {
                LogUtils.log4FileData.error("fileName time error:{}", file.getName());
                return rs;
            }
            Long fileTime = fileDate.getTime();

            while (entries.hasMoreElements()) {
                ze = entries.nextElement();
                // 读取目标对象
                if (ze.isDirectory() || ze.getSize() == 0) {
                    log.error("zipFile is directory or is null");
                    continue;
                } else {
                    log.info("file - " + ze.getName() + " : " + ze.getSize() + " bytes");
                    long size = ze.getSize();
                    rs = new ArrayList<>((int) (size / 100));
                    if (size > 0) {
                        try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(ze)))) {
                            String line;
                            while ((line = br.readLine()) != null) {
                                // daa11952b553,13,1,9c061bcea560,1505231941913
                                String[] split = line.split(",");
                                if (split.length != 5) {
                                    log.error("单行数据格式错误！filename={};line={}", file.getName(), line);
                                    continue;
                                }

                                String timeStr = split[4];
                                //信号强度转化为负值
                                int parseInt = Integer.parseInt(split[1]);
                                if (parseInt > 0) {
                                    parseInt = parseInt * -1;
                                }
                                fl = FTPLine.builder().stationMac(split[0].toLowerCase()).signalStrength(parseInt) //
                                        .channel(Integer.parseInt(split[2])).apMac(split[3]).build();
                                if (fl.getSignalStrength().equals(0) || timeStr.equals("0")) {
                                    LogUtils.log4FileData.warn("ftpline error data:{}", fl.toString());
                                    continue;
                                }

                                if (timeStr.length() == TIME_LENGTH) {
                                    timeStr += TIME_SUFFIX;
                                }

                                Long time = Long.valueOf(timeStr);

                                if ((fileTime - time) < FIX_MIN_MILLIS || (fileTime - time) > FIX_MAX_MILLIS) {
                                    LogUtils.log4FileData.warn("fileName:{},line time error:{}", file.getName(), line);
                                    time = fileDate.getTime();
                                }
                                fl.setTime(time);

                                rs.add(fl);

                                LogUtils.log4FileData.debug(fl.toString());
                            }
                            LogUtils.log4FileData.info("file:{},size:{}", file.getName(), rs.size());
                        } catch (Exception e) {
                            log.error("readZipFile is error", e);
                        }

                    }

                }
            }
        } catch (Exception e) {
            log.error("ZipFile is error", e);
        }
        if (rs.size() > 0) {
            //根据时间升序
            Collections.sort(rs, new Comparator<FTPLine>() {
                @Override
                public int compare(FTPLine o1, FTPLine o2) {
                    return o1.getTime().compareTo(o2.getTime());
                }
            });
        }
        return rs;
    }

}
