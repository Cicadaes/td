package com.talkingdata.datacloud.visual.util.custom;

import com.talkingdata.datacloud.visual.entity.custom.Page;
import com.talkingdata.datacloud.visual.entity.custom.ReportGroup;
import com.talkingdata.datacloud.visual.entity.report.VisualChartGroup;
import com.talkingdata.datacloud.visual.entity.report.VisualPage;
import org.apache.commons.beanutils.BeanUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/17 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PageUtil {
    public static Page transPage(VisualPage visualPage) throws Exception {
        Page page = new Page();
        //同名及类型相同的属性会自动赋值
        BeanUtils.copyProperties(page, visualPage);
        page.setBgImg(visualPage.getBackgroundImage());
        page.setCustomId(visualPage.getId());
        page.setCustomWH(visualPage.getIsCustom());
        page.setIndex(visualPage.getZIndex());
        page.setBgColor(visualPage.getBackgroundColor());
        return page;
    }

    public static VisualPage transVisualPage(Page page) throws Exception {
        VisualPage visualPage = new VisualPage();
        //同名及类型相同的属性会自动赋值
        BeanUtils.copyProperties(visualPage, page);
        visualPage.setBackgroundColor(page.getBgColor());
        visualPage.setBackgroundImage(page.getBgImg());
        visualPage.setIsCustom(page.getCustomWH());
        visualPage.setZIndex(page.getIndex());
        visualPage.setId(page.getCustomId());
        return visualPage;
    }

    public static List<Page> transPages(List<VisualPage> visualPages) throws Exception {
        if (visualPages == null || visualPages.size() == 0) {
            return null;
        }
        List<Page> pageList = new ArrayList<>();
        for (VisualPage visualPage : visualPages) {
            pageList.add(PageUtil.transPage(visualPage));
        }
        return pageList;
    }

    public static ReportGroup transGroup(VisualChartGroup group) {
        ReportGroup reportGroup = new ReportGroup();
        reportGroup.setReportId(group.getChartIds());
        reportGroup.setPageId(group.getPageId());
        return reportGroup;
    }

    public static List<ReportGroup> transGroups(List<VisualChartGroup> groups) {
        List<ReportGroup> reportGroups = new ArrayList<>();
        for (VisualChartGroup group : groups) {
            reportGroups.add(transGroup(group));
        }
        return reportGroups;
    }
}
