package com.talkingdata.wifianalytics.offline.compute.main;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import com.talkingdata.wifianalytics.offline.compute.config.Config;
import com.talkingdata.wifianalytics.offline.compute.job.Job;
import com.talkingdata.wifianalytics.offline.compute.job.JobParameter;
import com.talkingdata.wifianalytics.offline.compute.job.JobScheduler;
import com.talkingdata.wifianalytics.offline.compute.job.task.Task;
import com.talkingdata.wifianalytics.offline.compute.util.Util;
import org.apache.log4j.Logger;
/**
 * Created by loong on 4/26/16.
 */
public class JobMain {

    private static Logger logger = Logger.getLogger(JobMain.class);

    private static Job jobScheduler = new JobScheduler();

    private static final String DEFAULT_DATE_INTERVAL = "1"; //默认处理几天前的

    /**
     * 离线计算入口函数
     * args参数:
     * 0-jobname : 任务名,可<b>逗号分割</b>
     * 1-date : 执行日期,指定跑哪一天的数据, 格式 : yyyy-MM-dd
     * 2-date interval : 执行date之前多少天的数据计算,默认31,该值会对应到数据库中的data_type字段
     * 3-tenant_id : 租户id,不传则计算全部
     * 4-project_id : 项目id,传tenant_id后,此参数才会生效
     * 5-place_id : 场地id
     * 6-sensor_id : 探针id,传place_id后,此参数才会生效
     * 7-room_id: 房间_id
     * @param args
     */
    public static void main(String[] args) {
        logger.info("Offline Job begin, parameters : " + Arrays.toString(args));
        //校验传入的参数
        args = checkParameter(args);
        //执行任务
        jobScheduler.run(JobParameter.build(args));
    }

    private static String[] checkParameter(String[] args) {
        if (args.length < 2) {
            logger.error("parameter error!");
            System.exit(0);
        }
        String[] result = new String[7];
        try {
            checkJobName(args[0]);
            result[0] = args[0];
            checkDate(args[1]);
            result[1] = args[1];
            if (args.length > 2) {
                if (Util.isInt(args[2])) {
                    result[2] = args[2];
                }
            } else {
                //将dateInterval置入默认值
                result[2] = DEFAULT_DATE_INTERVAL;
            }
            if (args.length > 3) {
                result[3] = args[3];
            }
            for (int i = 4; i < 8; i++) {
                checkIntAndPut(result, args, i);
            }
        } catch (Exception e) {
            logger.error("parameter error : " + e);
            System.exit(0);
        }
        return result;
    }

    private static void checkIntAndPut(String[] result, String[] args, int i) {
        if (args.length > i) {
            if (Util.isInt(args[i])) {
                result[i] = args[i];
            }
        }
    }


    private static void checkDate(String date) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat(Config.DATE_FORMAT);
        Date d = format.parse(date);
        if (d.getTime() > System.currentTimeMillis()) {
            throw new RuntimeException("Job date is must before today!");
        }
    }

    private static void checkJobName(String arg) {
        for (String jobName : arg.split(",")) {
            if (!Task.TaskName.contains(jobName)) {
                throw new RuntimeException("Job name is not found!");
            }
        }
    }
}
