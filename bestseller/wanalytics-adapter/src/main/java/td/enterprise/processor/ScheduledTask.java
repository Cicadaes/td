package td.enterprise.processor;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import td.enterprise.common.ftp.FtpUtil;
import td.enterprise.common.util.FileUtils;
import td.enterprise.common.util.LogUtils;
import td.enterprise.config.prop.FtpProps;
import td.enterprise.constants.DateConstants;
import td.enterprise.constants.OnOffConstants;
import td.enterprise.entity.FTPLine;
import td.enterprise.service.DataService;

/**
 * Spring动态周期定时任务<br>
 * 
 * @Author liyinglei
 * @Create 2017-10-12 12:31:29
 */
@Component
@Slf4j
public class ScheduledTask {

    @Autowired
    private FtpProps       ftpProps;

    @Autowired
    private DataService<?> dataService;

    @Autowired
    private FtpUtil        ftpUtil;

    @Scheduled(fixedDelayString = "${ftp.fixedDelay}")
    public void execFixedTask() {
        LogUtils.log4Task.info("task start...");
        if (OnOffConstants.isRun) {

            Long startTime = System.currentTimeMillis();
            LocalDateTime now = LocalDateTime.now();

            //处理前一个小时没有处理的文件
            if (now.getMinute() < ftpProps.getFixMinute()) {
                log.info("executeFile previousHour");
                LocalDateTime previousHour = now.minusHours(1L);
                String fileDirectory = previousHour.format(DateConstants.FTP_PATTERN) // 
                        + "/" + previousHour.format(DateConstants.FTP_PATTERN_HOUR) + "/";

                executeFile(fileDirectory);
            }

            String fileDirectory = now.format(DateConstants.FTP_PATTERN) //
                    + "/" + now.format(DateConstants.FTP_PATTERN_HOUR) + "/";

            executeFile(fileDirectory);
            Long runTime = System.currentTimeMillis() - startTime;
            LogUtils.log4Task.info("task over runtime :{} ms", runTime);
        }

    }

    private void executeFile(String fileDirectory) {
        String ftpRemotePath = ftpProps.getRemotePath() + fileDirectory;
        String localPath = ftpProps.getLocalPath() + fileDirectory;
        List<File> list = ftpUtil.downloads(localPath, ftpRemotePath, ftpProps.getDownFileNum());
        for (File file : list) {
            List<FTPLine> ftpLineList = FileUtils.readZipFile(file);
            dataService.processData(ftpLineList, file.getName());
        }
    }

    public boolean run() {
        OnOffConstants.isRun = true;
        LogUtils.log4Task.info("scheduled start...");
        return OnOffConstants.isRun;
    }

    public boolean stop() {
        OnOffConstants.isRun = false;
        LogUtils.log4Task.info("scheduled stop...");
        return OnOffConstants.isRun;
    }
}
