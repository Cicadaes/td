package com.talkingdata.datacloud.visual.util.custom;

import com.talkingdata.datacloud.visual.entity.custom.Custom;
import com.talkingdata.datacloud.visual.entity.report.VisualReport;
import com.talkingdata.datacloud.visual.enums.ReportTypeEnum;
import com.talkingdata.datacloud.visual.page.custom.CustomPage;
import com.talkingdata.datacloud.visual.page.report.VisualReportPage;
import org.apache.commons.beanutils.BeanUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/16 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CustomUtil {

    public static VisualReportPage transPage(CustomPage customPage) throws Exception{
        if (customPage == null) {
            return null;
        }
        VisualReportPage page = new VisualReportPage();
        if (customPage.getId() != null) {
            page.setId(customPage.getId().toString());
        }
        page.setBackgroundColor(customPage.getBgColor());
        BeanUtils.copyProperties(page, customPage);
        if (customPage.getCreateTime() != null) {
            page.setCreateTime(customPage.getCreateTime().toString());
        }
        //todo: 排序字段需要特殊处理,两张表字段不同
        return page;
    }

    public static VisualReport transReport(Custom custom) throws Exception{
        if (custom == null) {
            return null;
        }
        VisualReport report = new VisualReport();
        BeanUtils.copyProperties(report, custom);
        report.setType(ReportTypeEnum.CUSTOM.getValue());
        report.setBackgroundColor(custom.getBgColor());
        return report;
    }

    public static Custom transCustom(VisualReport report) throws Exception{
        if (report == null) {
            return null;
        }
        Custom custom = new Custom();
        BeanUtils.copyProperties(custom, report);
        custom.setBgColor(report.getBackgroundColor());
        return custom;
    }

    public static List<Custom> transReportList(List<VisualReport> visualReports) throws Exception{
        if (visualReports == null || visualReports.size() == 0) {
            return null;
        }
        List<Custom> customs = new ArrayList<>();
        for (VisualReport report : visualReports) {
            Custom custom = new Custom();
            BeanUtils.copyProperties(custom, report);
            custom.setBgColor(report.getBackgroundColor());
            customs.add(custom);
        }
        return customs;
    }

}
