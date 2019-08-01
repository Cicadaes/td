package td.enterprise.web.rest;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import td.enterprise.collector.control.AsyncProcesser;
import td.enterprise.common.ftp.FtpUtil;
import td.enterprise.common.util.FileUtils;
import td.enterprise.config.prop.FtpProps;
import td.enterprise.constants.DateConstants;
import td.enterprise.constants.ThreadConstants;
import td.enterprise.entity.FTPLine;
import td.enterprise.processor.ScheduledTask;
import td.enterprise.service.DataService;

import com.alibaba.fastjson.JSONObject;

@Slf4j
@Controller
public class FtpDataController extends BaseController {

    @Autowired
    private FtpProps       ftpProps;

    @Autowired
    private DataService<?> dataService;

    @Autowired
    private FtpUtil        ftpUtil;

    @RequestMapping(value = "/fixdata/local", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject fixDataLocal(String startDate, int startHour, int endHour) {
        JSONObject result = new JSONObject();

        LocalDate fixDate = LocalDate.parse(startDate, DateConstants.FTP_PATTERN);

        for (int i = startHour; i < endHour; i++) {
            LocalTime fixTime = LocalTime.of(i, 0);
            LocalDateTime fixDateTime = LocalDateTime.of(fixDate, fixTime);
            String localPath = ftpProps.getLocalPath() + fixDateTime.format(DateConstants.FTP_PATTERN) + "/"
                    + fixDateTime.format(DateConstants.FTP_PATTERN_HOUR) + "/";

            File fixDataDirectory = new File(localPath);
            if (!fixDataDirectory.isDirectory()) {
                log.info(localPath + " is not directory");
                result.put(localPath, "false");
                continue;
            }

            File[] list = fixDataDirectory.listFiles();
            for (File file : list) {
                List<FTPLine> ftpLineList = FileUtils.readZipFile(file);
                dataService.offlineProcessData(ftpLineList, file.getName());
            }
        }
        result.put("success", "true");
        return result;
    }

    @RequestMapping(value = "/ftp", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject ftp(String startDate, int startHour, int endHour) {
        JSONObject result = new JSONObject();

        LocalDate fixDate = LocalDate.parse(startDate, DateConstants.FTP_PATTERN);
        for (int i = startHour; i < endHour; i++) {
            LocalTime fixTime = LocalTime.of(i, 0);
            LocalDateTime fixDateTime = LocalDateTime.of(fixDate, fixTime);
            String fileDirectory = fixDateTime.format(DateConstants.FTP_PATTERN) + "/" + fixDateTime.format(DateConstants.FTP_PATTERN_HOUR) + "/";
            log.info("fixdata ftp directory:{}", fileDirectory);
            String ftpRemotePath = ftpProps.getRemotePath() + fileDirectory;
            String localPath = ftpProps.getLocalPath() + fileDirectory;
            List<File> list = ftpUtil.downloads(localPath, ftpRemotePath, 10000);
        }

        result.put("success", "true");
        return result;
    }

    @RequestMapping(value = "/fixdata/ftp", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject fixDataFtp(String startDate, int startHour, int endHour) {
        JSONObject result = new JSONObject();

        LocalDate fixDate = LocalDate.parse(startDate, DateConstants.FTP_PATTERN);
        for (int i = startHour; i < endHour; i++) {
            LocalTime fixTime = LocalTime.of(i, 0);
            LocalDateTime fixDateTime = LocalDateTime.of(fixDate, fixTime);
            String fileDirectory = fixDateTime.format(DateConstants.FTP_PATTERN) + "/" + fixDateTime.format(DateConstants.FTP_PATTERN_HOUR) + "/";
            log.info("fixdata ftp directory:{}", fileDirectory);
            String ftpRemotePath = ftpProps.getRemotePath() + fileDirectory;
            String localPath = ftpProps.getLocalPath() + fileDirectory;
            List<File> list = ftpUtil.downloads(localPath, ftpRemotePath, 10000);

            for (File file : list) {
                List<FTPLine> ftpLineList = FileUtils.readZipFile(file);
                dataService.offlineProcessData(ftpLineList, file.getName());
            }

        }

        result.put("success", "true");
        return result;
    }

    @Autowired
    private ScheduledTask task;

    @RequestMapping(value = "/task/run", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject taskRun() {
        JSONObject result = new JSONObject();
        result.put("success", "true");
        result.put("runState", task.run());
        return result;
    }

    @RequestMapping(value = "/task/stop", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject taskStop() {
        JSONObject result = new JSONObject();
        result.put("success", "true");
        result.put("runState", task.stop());
        return result;
    }

    @RequestMapping(value = "/thread/size", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject threadSize(int inSize, int outSize, int sendSize, int scheduleSize, int queueSize) {
        JSONObject result = new JSONObject();
        ThreadConstants.IN_THREAD_SIZE = inSize;
        ThreadConstants.OUT_THREAD_SIZE = outSize;
        ThreadConstants.SEND_THREAD_SIZE = sendSize;
        ThreadConstants.OUT_SCHEDULE_THREAD_SIZE = scheduleSize;
        ThreadConstants.QUEUE_THREAD_SIZE = queueSize;
        result.put("success", "true");
        result.put("ThreadConstants.IN_THREAD_SIZE", ThreadConstants.IN_THREAD_SIZE);
        result.put("ThreadConstants.OUT_THREAD_SIZE", ThreadConstants.OUT_THREAD_SIZE);
        result.put("ThreadConstants.SEND_THREAD_SIZE", ThreadConstants.SEND_THREAD_SIZE);
        result.put("ThreadConstants.OUT_SCHEDULE_THREAD_SIZE", ThreadConstants.OUT_SCHEDULE_THREAD_SIZE);
        result.put("ThreadConstants.QUEUE_THREAD_SIZE", ThreadConstants.QUEUE_THREAD_SIZE);
        return result;
    }

    @RequestMapping(value = "/thread/stat", method = RequestMethod.GET)
    @ResponseBody
    public String threadStat() {
        return AsyncProcesser.getInstance().stats();
    }

}
