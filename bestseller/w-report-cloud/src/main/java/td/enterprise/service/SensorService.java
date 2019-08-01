package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.common.util.RedisCacheUtil;
import td.enterprise.common.util.StringUtil;
import td.enterprise.dao.DO.SensorDO;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.SensorDao;
import td.enterprise.dao.SensorTestDao;
import td.enterprise.entity.*;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.ChangeLogPage;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.page.SensorPage;
import td.enterprise.page.mapper.SensorMapper;
import td.enterprise.service.manager.ParamService;
import td.enterprise.service.manager.SysAuditLogService;
import td.enterprise.web.util.JsonUtils;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.*;
import td.olap.query.WiFiAnalyticsQuerService;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

/**
 * <br>
 * <b>功能：</b>探针 SensorService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service
@Slf4j
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SensorService extends BaseService <Sensor> {

    public static String FE_SERVICE_ALARM_SENDEMAILS = "fe.service.alarm.sendemails";

    @Autowired
    private SensorDao dao;

    @Autowired
    private SensorTestDao testDao;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ChangeLogService changeLogService;

    @Inject
    private InstallInfoService installInfoService;

    @Inject
    private ParamService paramService;

    @Autowired
    private RedisCacheUtil redisCacheUtil;

    @Inject
    private SysAuditLogService auditLogService;

    @Inject
    private MailService mailService;

    @Inject
    private SensorMapper sensorMapper;
    private SensorPage page;

    @Inject
    private RedisTemplate redisStringTemplate;

    public SensorDao getDao() {
        return dao;
    }


    public List <SensorDO> findAll(SensorPage page) {
        Integer tenantId = UserInfoUtil.getUser().getTenantId();
        page.setOrder(StringUtil.camelToUnderline(page.getOrder()));
        page.setSort(StringUtil.camelToUnderline(page.getSort()));
        page.setTenantId(tenantId + "");
        // List <SensorVM> sensorVMs = new ArrayList <>();

        List <SensorDO> sensors = queryInfoByList(page);
        // for (SensorDO sensor : sensors) {
        //     SensorVM sensorVM = sensorMapper.sensorDOToSensorVM(sensor);
        //     if (sensor != null) {
        //         sensorVMs.add(sensorVM);
        //     }
        // }

        return sensors;
    }


    /**
     * 查询没有放到房间里的探针列表
     * room_id = null
     * TODO Yan 默认roomid为0，就可以用通用查询接口
     *
     * @param page
     * @return
     */
    public List <SensorInfoVM> querySensorsNoRoom(SensorPage page) {

        List <SensorInfoVM> sensorPages = new ArrayList <>();

        List <Sensor> sensors = dao.querySensorNoRoomByList(page);
        for (Sensor sensor : sensors) {
            SensorInfoVM sensorVM = sensorMapper.sensorToSensorVM(sensor);
            if (sensor != null) {
                sensorPages.add(sensorVM);
            }
        }
        return sensorPages;
    }


    public List <SensorDO> queryByUnion(SensorPage page) {
        List <SensorDO> list = null;
        if ("subProject".equals(page.getQuerySrcType())) {
            list = dao.queryProjectByUnion(page);
        } else {
            list = dao.queryByUnion(page);
        }
        return list;
    }

    /**
     * 创建探针
     *
     * @param sensorVM
     * @return
     */
    public Sensor create(SensorInfoVM sensorVM) {

        Sensor sensor = sensorMapper.sensorVMToSensor(sensorVM);

        User user = UserInfoUtil.getUser();

        Project project = projectService.getDao().selectByPrimaryKey(sensor.getProjectId());
        Integer projectType = project.getProjectType();

        if (projectType == ProjectTypeEnum.PROJECT_SHOP.getCode()) {
            String tenantId = UserInfoUtil.getCurrentUserTenantId();
            String umid = user.getUmid();
            sensor.setTenantId(tenantId);
            sensor.setCreateBy(umid);
            sensor.setCreator(user.getName());
            sensor.setUpdater(umid);
            sensor.setUpdateBy(user.getName());
            sensor.setStatus(ReportConstants.SensorStatus.AVALIABLE);

            //统一改为用信号强度
//        if (sensor.getDistance() != null) {
//            sensor.setMinRssi(SensorRssiUtil.distance2Rssi(sensor.getDistance()));
//        }
            SensorPage page = new SensorPage();
            page.setSensorMac(sensor.getSensorMac());
            List <Sensor> sensors = queryByList(page);
            if (sensors != null && sensors.size() > 0) {
                dao.updateByMac(sensor);
                sensor.setId(sensors.get(0).getId());
            } else {
                dao.insert(sensor);
            }

            //保存部署
            installInfoService.saveSensorInstall(user, sensor, sensorVM.getCustomizedInfo());

            //变更日志
            changeLogService.addLog("TD_SENSOR", sensor.getId() + "", null, sensor);
        }

        //添加审计日志
        auditLogService.insertAuditLong(sensor.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_CREATE,
                "Sensor", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "新建探针记录",
                null, sensor);

        return sensor;
    }

    /**
     * 查询探针 3个小时的数据量
     *
     * @param sensor
     * @param hours
     * @return
     */
    public void getSensorDataCountByHours(Sensor sensor, int hours) {
        List <Integer> hourList = null;

//        int placeId = 0;
        int projectId = 0;
        Long count = 0l;
        count = 0l;
        if (sensor.getProjectId() != null) {
            Project project = projectDao.selectByPrimaryKey(sensor.getProjectId());
            if (project != null) {
                int sensorId = sensor.getId();
                projectId = sensor.getProjectId();
                String tenantId = sensor.getTenantId();
                String openingTime = project.getOpeningTime();
                String closingTime = project.getClosingTime();
                String openingHour = "07";
                String closingHour = "19";
                if (openingTime != null && !openingTime.isEmpty() && openingTime.split(":").length == 2 && openingTime.indexOf("undefined") != -1 && openingTime.indexOf("null") != -1) {
                    openingHour = openingTime.split(":")[0];
                }
                if (openingTime != null && !closingTime.isEmpty() && closingTime.split(":").length == 2 && closingTime.indexOf("undefined") != -1 && openingTime.indexOf("null") != -1) {
                    closingHour = closingTime.split(":")[0];
                }
                String currentHour = String.valueOf(new Date().getHours());
                int openHour = Integer.valueOf(openingHour);
                int closeHour = Integer.valueOf(closingHour);
                int hour = Integer.valueOf(currentHour);
                Date date = new Date();
                hourList = new ArrayList <>();
                if (hour <= closeHour &&
                        (hour >= openHour + hours)) {
                    //取hour之前的3小时
                    for (int i = 1; i <= hours; i++) {
                        hourList.add(hour - i);
                    }
                } else if (hour - openHour <= hours &&
                        hour > openHour) {
                    //取开业时间-查询时间
                    for (int i = 0; i < hour - openHour; i++) {
                        hourList.add(openHour + i);
                    }
                } else if (hour <= openHour) {
                    //取前一天，下班前3小时
                    date = DateUtil.addDay2Date(-1, new Date());
                    for (int i = 1; i <= hours; i++) {
                        hourList.add(closeHour - i);
                    }
                } else if (hour > closeHour) {
                    //取下班前3小时
                    for (int i = 1; i <= hours; i++) {
                        hourList.add(closeHour - i);
                    }
                }
                String hoursStr = "";
                StringBuffer sb = new StringBuffer();
                for (int i : hourList) {
                    sb.append("'");
                    sb.append(i);
                    sb.append("'");
                    sb.append(",");
                }
                if (hourList.size() > 0) {
                    hoursStr = sb.substring(0, sb.length() - 1).toString();
                }

                count = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorDataByHour(sensorId, projectId, tenantId, DateUtil.format(date, "yyyy-MM-dd"), true);
            }
        }
        sensor.setSum3Hour(count);
    }

    /**
     * 更新探针
     *
     * @param sensorVM
     */
    public Sensor update(SensorInfoVM sensorVM) {
        Sensor sensor = sensorMapper.sensorVMToSensor(sensorVM);
        User user = UserInfoUtil.getUser();

        //更新
        SensorPage page = new SensorPage();
        page.setId(sensor.getId());
        Sensor oldSensor = queryBySingle(page);
        InstallInfoPage infoPage = new InstallInfoPage();
        infoPage.setTenantId(sensor.getTenantId());
        infoPage.setRelatedId(sensor.getId());
        infoPage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
        infoPage.setPageEnabled(false);
        List <InstallInfo> infoList = installInfoService.queryByList(infoPage);   //更新 非删除状态的安装记录

        //更新探针安装信息
        for (InstallInfo installInfo : infoList) {
            InstallInfo oldInstallInfo = installInfo;
            installInfo.setRelatedAttribute(sensor.getSensorMac());
            installInfo.setDescription(sensor.getPositionDescription());
            installInfo.setCustomizedInfo(sensorVM.getCustomizedInfo());
            installInfoService.updateByPrimaryKeySelective(installInfo);

            //添加审计日志
            auditLogService.insertAuditLong(installInfo.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
                    "SensorInstallInfo", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "（更新探针）更新探针安装记录",
                    oldInstallInfo, installInfo);
        }

//        if (sensor.getDistance() != null) {
//            sensor.setMinRssi(SensorRssiUtil.distance2Rssi(sensor.getDistance()));
//        }

        //如果探针的信号不为空，且不和原来相等，说明变化了，如果探针信号为空，且原来不为空，说明变化了
        if ((sensor.getMinRssi() != null && !sensor.getMinRssi().equals(oldSensor.getMinRssi())) || (sensor.getMinRssi() == null && oldSensor.getMinRssi() != null)) {
            auditLogService.insertAuditLong(sensor.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
                    "SensorInstallInfo", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "（更新探针）信号强度变化",
                    oldSensor.getMinRssi(), sensor.getMinRssi());
            try {
                Param emailParam = paramService.queryByParamKey(FE_SERVICE_ALARM_SENDEMAILS);
                mailService.sendSensorRssiEmail(oldSensor, sensor, user, emailParam, 2);
            } catch (Exception e) {
                log.error("发送邮件失败", e);
            }
        }

//            Integer sensor.getProjectId() = sensor.getProjectId();
//            Integer oldSensor.getProjectId() = oldSensor.getProjectId();
//
//            Integer sensor.getRoomId() = sensor.getRoomId();
//            Integer oldSensor.getRoomId() = oldSensor.getRoomId();

        boolean send = false;

        if ((sensor.getProjectId() != null && !sensor.getProjectId().equals(oldSensor.getProjectId())) || (sensor.getProjectId() == null && oldSensor.getProjectId() != null)) {
            auditLogService.insertAuditLong(sensor.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
                    "SensorInstallInfo", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "（更新探针）所属项目变化",
                    oldSensor, sensor);
            try {
                Param emailParam = paramService.queryByParamKey(FE_SERVICE_ALARM_SENDEMAILS);
                mailService.sendSensorRssiEmail(oldSensor, sensor, user, emailParam, 1);
            } catch (Exception e) {
                log.error("发送邮件失败", e);
            }
        }
        // if ((sensor.getRoomId() != null && !sensor.getRoomId().equals(oldSensor.getRoomId())) || (sensor.getRoomId() == null && oldSensor.getRoomId() != null)) {
        //     auditLogService.insertAuditLong(ReportConstants.AuditLog.SYSTEM_CODE, sensor.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
        //             "SensorInstallInfo", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "（更新探针）所属房间变化",
        //             oldSensor, sensor);
        //     try {
        //         Param emailParam = paramService.queryByParamKey(FE_SERVICE_ALARM_SENDEMAILS);
        //         Date date = new Date();
        //         SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //         String nowtime = simpleDateFormat.format(date);
        //         String paramValue = emailParam.getParamValue();
        //         String mailTitle = "探针所在房间被修改";
        //         String context = "探针[所在房间]修改,探针id为" + sensor.getId() + ",Mac=" + sensor.getSensorMac() + ",于" + nowtime + ",被UMID=" + user.getUmid() + "的用户，修改。原值为" + oldSensor.getRoomId() + ",现在为" + sensor.getRoomId();
        //         String[] recipientArr = paramValue.split(",");
        //         MailUtil.sendMail(mailTitle, context, recipientArr);
        //     } catch (GeneralSecurityException e) {
        //         log.error("发送邮件失败", e);
        //     }
        // }

        //更新探针属性信息
        sensor.setUpdater(user.getUmid());
        sensor.setUpdateBy(user.getName());
        dao.updateByPrimaryKeySelective(sensor);

        //变更日志
        changeLogService.addLog("TD_SENSOR", sensor.getId() + "", oldSensor, sensor);

        //添加审计日志
        auditLogService.insertAuditLong(sensor.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_UPDATE,
                "Sensor", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "更新探针记录",
                oldSensor, sensor);

        return sensor;
    }


    public void delete(Sensor sensor) {

        Sensor oldSensor = sensor;
        if (sensor != null) {
            sensor.setStatus(ReportConstants.SensorStatus.NO_AVALIABLE);
            int num = updateByPrimaryKeySelective(sensor);
            if (num > 0) {

                //更新探针安装记录
                InstallInfoPage infoPage = new InstallInfoPage();
                infoPage.setTenantId(sensor.getTenantId());
                infoPage.setProjectId(sensor.getProjectId());
                infoPage.setRelatedId(sensor.getId());
                infoPage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
                infoPage.setPageEnabled(false);
                List <InstallInfo> infoList = installInfoService.queryByList(infoPage);   //更新 非删除状态的安装记录
                for (InstallInfo installInfo : infoList) {
                    InstallInfo oldInstallInfo = installInfo;
                    installInfo.setStatus(ReportConstants.InstallInfoStatus.DELETE);  //拆除状态
                    installInfoService.updateByPrimaryKeySelective(installInfo);

                    //添加审计日志
                    auditLogService.insertAuditLong(installInfo.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_DELETE,
                            "SensorInstallInfo", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "(删除探针)删除探针安装记录",
                            oldInstallInfo, installInfo);
                }
            }

            User user = UserInfoUtil.getUser();
            sensor.setUpdater(user.getUmid());
            sensor.setUpdateBy(user.getName());
            installInfoService.deleteSensorInstall(sensor);

            //变更日志
            changeLogService.addLog("TD_SENSOR", sensor.getId() + "", oldSensor, null);

            //
            deleteSensorTest(sensor);

            //添加审计日志
            auditLogService.insertAuditLong(sensor.getProjectId(), ReportConstants.AuditLog.OPERATION_TYPE_DELETE,
                    "Sensor", "", ReportConstants.AuditLog.OPERATION_RESULT_SUCESS, "删除探针记录",
                    oldSensor, sensor);
        }
    }

    /**
     * 批量导入
     * TODO 循环调用 create()
     *
     * @param file
     * @param projectId
     * @return
     */
    public List <String> batchImport(MultipartFile file, int projectId) throws BusinessException {

        User user = UserInfoUtil.getUser();
        List <String> errMsgList = new ArrayList <>();

        String tenantId = UserInfoUtil.getCurrentUserTenantId();
        Project project = null;
        List <String[]> datas = null;
        try {
            if (file != null) {
                log.info("sensor.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
                InputStream is = file.getInputStream();
                String sheetName = "Sheet1";
                int startRowNum = 1;
                datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);
                if (datas.size() == 0) {
                    errMsgList.add("导入模板数据为空");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException("读取导入文件出错");
        }

        if (datas != null) {

            for (String[] strArray : datas) {

                if (strArray.length == 0 ||
                        strArray[0] == null || strArray[0].equals("")) {  //sensorCode,为null，跳到下条记录
                    continue;
                }

                Sensor sensor = new Sensor();
                String errorMsg = checkMacValid(strArray);
                if (StringUtils.isNotEmpty(errorMsg)) {
                    log.error(errorMsg);
                    errMsgList.add(errorMsg);
                } else {
                    String projectPlaceName = strArray.length > 4 ? strArray[4] : null;
                    String roomName = strArray.length > 5 ? strArray[5] : null;
                    if (project == null) {
                        project = projectService.getDao().selectByPrimaryKey(projectId);
                    }

                    sensor.setStatus(ReportConstants.SensorStatus.AVALIABLE);
                    sensor.setSensorCode(strArray[0]);
                    sensor.setSensorName(strArray[1]);
                    sensor.setSensorMac(strArray[2].toLowerCase());

                    if (project != null) {
                        sensor.setProjectId(project.getId());
                    }

                    SensorInfoVM sensorVM = sensorMapper.sensorToSensorVM(sensor);
                    create(sensorVM);

                }
            }
        }
        return errMsgList;
    }

    /**
     * 倒序查询探针修改记录
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List <SensorChangeLogVM> history(ChangeLogPage page) throws Exception {
//        ChangeLogPage changeLogPage = new ChangeLogPage();
        page.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
        page.setModuleId(page.getId() + "");
        page.setId(null);
//        changeLogPage.setPageEnabled(false);
//        changeLogPage.getPager().setPageEnabled(false);
        List <ChangeLog> changeLogs = changeLogService.queryByUpdateDescList(page);
        List <SensorChangeLogVM> sensorChangeLogs = new ArrayList <SensorChangeLogVM>();
        for (ChangeLog changeLog : changeLogs) {
            SensorChangeLogVM sensorChangeLog = new SensorChangeLogVM();
            if (changeLog.getBeforeValue() != null) {
                Sensor oldSensor = JsonUtils.jsonToObject(changeLog.getBeforeValue(), Sensor.class);
                sensorChangeLog.setOldSensor(oldSensor);
            }
            if (changeLog.getAfterValue() != null) {
                Sensor newSensor = JsonUtils.jsonToObject(changeLog.getAfterValue(), Sensor.class);
                newSensor.setUpdateTime(changeLog.getCreateTime());//变更记录的时间
                sensorChangeLog.setNewSensor(newSensor);
            }
            sensorChangeLogs.add(sensorChangeLog);
        }
        return sensorChangeLogs;
    }

    /**
     * 异常探针
     *
     * @param sensors
     * @param date
     * @param hour
     * @return
     */
    public List <String> noDataSensor(List <Sensor> sensors, String date, String hour) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < sensors.size(); i++) {
            sb.append(sensors.get(i).getSensorMac().replace(":", ""));
            if (i != (sensors.size() - 1)) {
                sb.append(",");
            }
        }

        Map <String, Integer> map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNoDataSensor(sb.toString(), date, hour);
        List <String> noDataMac = new ArrayList <>();
        for (Map.Entry <String, Integer> entry : map.entrySet()) {
            if (entry.getValue() == 0) {
                noDataMac.add(entry.getKey());
            }
        }

        return noDataMac;
    }

    /**
     * 探针是否异常
     *
     * @param sensors
     * @param date
     * @param hour
     * @return
     */
    public boolean noDataSensor(Sensor sensors, String date, String hour) {
        String sb = "";
        sb = sensors.getSensorMac().replace(":", "");

        Map <String, Integer> map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryNoDataSensor(sb.toString(), date, hour);
        boolean noDataMac = false;
        for (Map.Entry <String, Integer> entry : map.entrySet()) {
            noDataMac = entry.getValue() != 0;
        }

        return noDataMac;
    }

    /**
     * 无日志时长
     *
     * @param sensors
     * @return
     */
    public long noDataTimes(List <Sensor> sensors) {
        long totalNoDataHours = 0;

        for (Sensor sensor : sensors) {
            String mac = sensor.getSensorMac().replace(":", "");
            //最近有日志的日期
            //先查出最新有数据日期（不支持日期、小时同时倒序查询）
            Map <String, Integer> dateMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryLastDataDate(mac);
            for (Map.Entry <String, Integer> entry : dateMap.entrySet()) {
                String dateStr = entry.getKey();
                Map <String, Integer> hourMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryLastDataHour(mac, dateStr);
                for (Map.Entry <String, Integer> hourEntry : hourMap.entrySet()) {
                    String hour = hourEntry.getKey();
                    if (hour.length() == 1) {
                        hour = "0" + hour;
                    }
                    String timeStr = dateStr + " " + hour;
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH");
                    try {
                        Date date = sdf.parse(timeStr);
                        long between = (new Date().getTime() - date.getTime()) / 1000;//除以1000是为了转换成秒
                        long betweenHour = between % (24 * 3600) / 3600;
                        totalNoDataHours += betweenHour;
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return totalNoDataHours;
    }

    /**
     * 无日志时长
     *
     * @param sensor
     * @return
     */
    public long noDataTimes(Sensor sensor) {
        long totalNoDataHours = 0;

        String mac = sensor.getSensorMac().replace(":", "");
        //最近有日志的日期
        //先查出最新有数据日期（不支持日期、小时同时倒序查询）
        Map <String, Integer> dateMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryLastDataDate(mac);
        for (Map.Entry <String, Integer> entry : dateMap.entrySet()) {
            String dateStr = entry.getKey();
            Map <String, Integer> hourMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryLastDataHour(mac, dateStr);
            for (Map.Entry <String, Integer> hourEntry : hourMap.entrySet()) {
                String hour = hourEntry.getKey();
                if (hour.length() == 1) {
                    hour = "0" + hour;
                }
                String timeStr = dateStr + " " + hour;
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH");
                try {
                    Date date = sdf.parse(timeStr);
                    long between = (new Date().getTime() - date.getTime()) / 1000;//除以1000是为了转换成秒
                    long betweenHour = between % (24 * 3600) / 3600;
                    totalNoDataHours += betweenHour;
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        return totalNoDataHours;
    }


    /**
     * 探针mac数
     *
     * @param sensorDetailVM
     * @return
     */
    public SensorDetailVM macs(SensorDetailVM sensorDetailVM, List <Date> dates) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        //探针mac数
        List <SensorAccountVM> macs = new ArrayList <>();
        int macTotal = 0;

        String sensorId = sensorDetailVM.getId() + "";
        String projectId = sensorDetailVM.getProjectId() + "";
        String startDate = sdf.format(dates.get(dates.size() - 1));
        String endDate = sdf.format(dates.get(0));
        Map <String, Integer> effectiveNewMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorEffectiveMac(projectId, sensorId, startDate, endDate, WiFiAnalyticsQuerService.NEW);
        Map <String, Integer> effectiveOldMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorEffectiveMac(projectId, sensorId, startDate, endDate, WiFiAnalyticsQuerService.OLD);
        Map <String, Integer> allMacMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorAllMac(sensorId, startDate, endDate);

        for (int j = (dates.size() - 1); j >= 0; j--) {
            SensorAccountVM sensorAccountVM = new SensorAccountVM();

            String dateStr = sdf.format(dates.get(j));
            Integer total = allMacMap.get(dateStr) == null ? 0 : allMacMap.get(dateStr);
            Integer effectiveNew = effectiveNewMap.get(dateStr) == null ? 0 : effectiveNewMap.get(dateStr);
            Integer effectiveOld = effectiveOldMap.get(dateStr) == null ? 0 : effectiveOldMap.get(dateStr);
            Long effective = effectiveNew.longValue() + effectiveOld.longValue();

            sensorAccountVM.setDate(dateStr);
            sensorAccountVM.setTotal(total.longValue());
            sensorAccountVM.setEffective(effective);
            macs.add(sensorAccountVM);

            macTotal += sensorAccountVM.getTotal();
        }
        sensorDetailVM.setMacTotal(macTotal);
        sensorDetailVM.setMacs(macs);
        return sensorDetailVM;
    }

    /**
     * 探针log数
     *
     * @param sensorDetailVM
     * @return
     */
    public SensorDetailVM logs(SensorDetailVM sensorDetailVM, List <Date> dates) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List <SensorAccountVM> logs = new ArrayList <>();
        int logTotal = 0;

        String apMac = sensorDetailVM.getSensorMac().replace(":", "");
        String startDate = sdf.format(dates.get(dates.size() - 1));
        String endDate = sdf.format(dates.get(0));
        Map <String, Integer> totalMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorLog(apMac, startDate, endDate, WiFiAnalyticsQuerService.TOTAL);
        Map <String, Integer> effectiveMap = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).querySensorLog(apMac, startDate, endDate, WiFiAnalyticsQuerService.EFFECTIVE);

        for (int j = (dates.size() - 1); j >= 0; j--) {
            SensorAccountVM sensorAccountVM = new SensorAccountVM();

            String dateStr = sdf.format(dates.get(j));
            Integer total = totalMap.get(dateStr) == null ? 0 : totalMap.get(dateStr);
            Integer effective = effectiveMap.get(dateStr) == null ? 0 : effectiveMap.get(dateStr);

            sensorAccountVM.setDate(dateStr);
            sensorAccountVM.setTotal(total.longValue());
            sensorAccountVM.setEffective(effective.longValue());
            logs.add(sensorAccountVM);

            logTotal += sensorAccountVM.getTotal();
        }
        sensorDetailVM.setLogTotal(logTotal);
        sensorDetailVM.setLogs(logs);
        return sensorDetailVM;
    }

    /**
     * 查询所有的探针
     *
     * @param page
     * @return
     */
    private List <SensorDO> queryInfoByList(SensorPage page) {
        int rows = dao.queryInfoByCount(page);
        page.getPager().setRowCount(rows);
        List <SensorDO> list = dao.queryInfoByList(page);
        return list;
    }

    /**
     * 探针手工编号（sensor_code）
     * 探针别名（sensor_name）
     * mac地址（sensor_mac）
     * 位置描述（position_description）
     * 场地名称（project_place_name）
     * 房间名称（room_name）
     *
     * @param data
     * @return
     * @throws
     */
    private String checkMacValid(String[] data) {

        String errorMsg = "";

        if (data.length != 3) {
            errorMsg = "数据模板不符合规格";
        } else {

            String mac = data[2];
            if (mac != null && mac.length() != 17) {
                errorMsg = "mac地址(" + mac + ")长度不够";
            }
            if (null != mac)
                mac = mac.toLowerCase();

            //mac格式校验
            String patternMac = "^[a-f0-9]{2}(:[a-f0-9]{2}){5}$";
            if (!Pattern.compile(patternMac).matcher(mac).find()) {
                errorMsg = "该mac地址(" + mac + ")格式错误";
            }
            SensorPage page = new SensorPage();
            page.setSensorMac(mac);
            page.setStatus(ReportConstants.SensorStatus.AVALIABLE);

            if (dao.queryByCount(page) != 0) {
                errorMsg = "该mac地址(" + mac + ")已存在";
            }

            InstallInfoPage installInfoPage = new InstallInfoPage();
            installInfoPage.setRelatedAttribute(mac);
            installInfoPage.setStatus(ReportConstants.SensorStatus.AVALIABLE);

            if (installInfoService.queryByCount(installInfoPage) != 0) {
                errorMsg = "该mac地址的安装信息(" + mac + ")已存在";
            }
        }

        return errorMsg;
    }

    public List <Sensor> querySensorProjectByList(SensorPage page) {
        int rows = dao.getInfoByListCount(page);
        page.getPager().setRowCount(rows);
        List <Sensor> list = dao.querySensorProjectList(page);
        return list;
    }


    public void deleteSensorTest(Sensor sensor) {
        testDao.deleteByPrimaryKey(sensor.getId());
    }

    public List <String> getNoTypeInSensors(SensorPage page) throws Exception {
        List <String> list = new ArrayList <String>();
        page.setStatus(ReportConstants.SensorStatus.NO_AVALIABLE);
        page.setPageEnabled(false);
        if (page.getQ() != null && !page.getQ().trim().isEmpty()) {
            String strQ = URLDecoder.decode(page.getQ(), "UTF-8") + ReportConstants.Punctuation.SPACE;
            String[] skey = strQ.split(ReportConstants.Punctuation.COLON);
            if (skey[0].trim().isEmpty()) {
                return list;
            }
            String q = skey[0].trim();
            for (int i = 1; i < skey.length - 1; i++) {
                if (skey[i].trim().isEmpty() && !skey[i + 1].trim().isEmpty()) {
                    return list;
                }
                if (skey[i].trim().isEmpty()) {
                    continue;
                }
                q = q + ReportConstants.Punctuation.COLON + skey[i].trim();
                if (i == skey.length - 2 && !skey[i + 1].trim().isEmpty()) {
                    q = strQ;
                }
            }

            page.setQ(q.trim());
        }
        List <Sensor> sensors = dao.querNoTypeInSensors(page);
        if (sensors == null) {
            return list;
        }
        for (Sensor sensor : sensors) {
            list.add(sensor.getSensorMac());
        }
        return list;
    }

    public SensorDetailVM getSensorDetail(SensorPage page) {
        page.setStatus(ReportConstants.SensorStatus.AVALIABLE);
        Sensor sensor = queryBySingle(page);
        SensorDetailVM sensorDetailVM = sensorMapper.sensorToSensorDetailVM(sensor);
        //取出今天及往前7天的日期
        List <Date> dates = new ArrayList <>();
        Date currentDate = new Date();
        for (int i = 0; i < 30; i++) {
            Date date = DateUtil.addDay2Date(-i, currentDate);
            dates.add(date);
        }

        //探针mac数
        sensorDetailVM = macs(sensorDetailVM, dates);

        //探针log数
        sensorDetailVM = logs(sensorDetailVM, dates);
        return sensorDetailVM;
    }

    public List <SensorMinRssiVM> getSensorMacList(SensorPage page) {
        page.setStatus(ReportConstants.SensorStatus.AVALIABLE);
        Sensor sensor = queryBySingle(page);
        String macPut = "SCAN_SENSOR" + ReportConstants.Punctuation.THE_UNDERLINE + sensor.getSensorMac();
        String macGet = "SENSOR" + ReportConstants.Punctuation.THE_UNDERLINE + sensor.getSensorMac() + "*";
        List <SensorMinRssiVM> json = new ArrayList <>();
//        redisCacheUtil.set(macPut,0,10L, TimeUnit.MINUTES);
        redisStringTemplate.opsForValue().set(macPut, 0, 10L, TimeUnit.MINUTES);
//        Collection<String> set =  redisCacheUtil.keys(macGet);
        Set <String> set = redisStringTemplate.keys(macGet);
        if (set != null && !set.isEmpty()) {
            for (String key : set) {
                String[] str = key.split(ReportConstants.Punctuation.THE_UNDERLINE);
                SensorMinRssiVM vm = new SensorMinRssiVM();
                vm.setId(str[2].hashCode());
                vm.setSensorMac(str[2]);
                vm.setMinRssi(str[3]);
                json.add(vm);
            }
        }
        return json;
    }

}

