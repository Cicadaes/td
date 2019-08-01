package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.common.util.MailUtil;
import td.enterprise.common.util.StringUtil;
import td.enterprise.dao.DO.SensorDO;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.SensorDao;
import td.enterprise.entity.*;
import td.enterprise.page.ChangeLogPage;
import td.enterprise.page.InstallInfoPage;
import td.enterprise.page.SensorPage;
import td.enterprise.page.mapper.SensorMapper;
import td.enterprise.service.manager.ParamService;
import td.enterprise.service.manager.SysAuditLogService;
import td.enterprise.web.util.JsonUtils;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.SensorAccountVM;
import td.enterprise.web.vm.SensorChangeLogVM;
import td.enterprise.web.vm.SensorDetailVM;
import td.enterprise.web.vm.SensorInfoVM;
import td.olap.query.WiFiAnalyticsQuerService;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * <br>
 * <b>功能：</b>MailService<br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service
@Slf4j
public class MailService extends BaseService <Sensor> {

    @Autowired
    private SensorDao dao;

    public SensorDao getDao() {
        return dao;
    }

    @Async
    public void sendSensorRssiEmail(Sensor oldSensor, Sensor sensor, User user, Param emailParam, int type) throws Exception {
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowtime = simpleDateFormat.format(date);
        String paramValue = emailParam.getParamValue();
        String mailTitle = "";
        String context = "";
        if (type == 1) {
            mailTitle = "探针所在项目被修改";
            context = "探针[所在项目]修改,探针id为" + sensor.getId() + ",Mac=" + sensor.getSensorMac() + ",于" + nowtime + ",被UMID=" + user.getUmid() + "的用户，修改。原值为" + oldSensor.getProjectId() + ",现在为" + sensor.getProjectId();
        } else if (type == 2) {
            mailTitle = "探针信号强度被修改";
            context = "探针[信号强度被]修改,探针id为" + sensor.getId() + ",Mac=" + sensor.getSensorMac() + ",于" + nowtime + ",被UMID=" + user.getUmid() + "的用户，修改。原值为" + oldSensor.getMinRssi() + ",现在为" + sensor.getMinRssi();
        }
        String[] recipientArr = paramValue.split(",");
        MailUtil.sendMail(mailTitle, context, recipientArr);
    }

}

