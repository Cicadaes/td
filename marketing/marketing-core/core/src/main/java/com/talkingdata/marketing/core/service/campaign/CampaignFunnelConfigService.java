package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.dto.*;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.middleware.FunnelApi;
import com.talkingdata.marketing.core.page.admin.FunnelStepDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.CampaignFunnelConfigPage;
import com.talkingdata.marketing.core.service.admin.FunnelStepConditionDefinitionService;
import com.talkingdata.marketing.core.service.admin.FunnelStepDefinitionService;
import com.talkingdata.marketing.core.util.CommonUtil;
import com.talkingdata.marketing.core.util.ExcelUtil;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.CampaignFunnelConfigDao;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;
import org.springframework.util.Assert;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_FUNNEL_CONFIG CampaignFunnelConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("campaignFunnelConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CampaignFunnelConfigService extends BaseService<CampaignFunnelConfig, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CampaignFunnelConfigService.class);

    @Autowired
    private CampaignFunnelConfigDao dao;

    @Autowired
    private CampaignService campaignService;

    @Override
    public CampaignFunnelConfigDao getDao() {
        return dao;
    }

    @Autowired
    private CrowdService crowdService;

    @Autowired
    private FunnelApi funnelApi;

    @Autowired
    private FunnelStepDefinitionService funnelStepDefinitionService;

    @Autowired
    private FunnelStepConditionDefinitionService funnelStepConditionDefinitionService;

    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * Sets default flag.
     *
     * @param sourceId the source id
     * @param destId   the dest id
     * @return the default flag
     * @throws Exception the exception
     */
    public String setDefaultFlag(final Integer sourceId, final Integer destId) throws Exception {
        if (sourceId != 0) {
            CampaignFunnelConfig source = new CampaignFunnelConfig();
            source.setId(sourceId);
            source.setDefaultFlag(0);
            updateByPrimaryKeySelective(source);
        }
        if (destId != 0) {
            CampaignFunnelConfig dest = new CampaignFunnelConfig();
            dest.setId(destId);
            dest.setDefaultFlag(1);
            updateByPrimaryKeySelective(dest);
        }
        return "success";
    }

    /**
     * Gets funnel convert overview.
     *
     * @param crowdIds the crowd ids
     * @param funnelId the funnel id
     * @return the funnel convert overview
     * @throws Exception the exception
     */
    public List<FunnelConvertOverview> getFunnelConvertOverview(final List<Integer> crowdIds, final Integer funnelId) throws Exception {
        List<FunnelStepDefinition> steps = getFunnelStep(funnelId);
        if (steps.isEmpty()) {
            return Collections.EMPTY_LIST;
        }
        List<FunnelStepConditionDefinition> conditions = getFunnelEvent(getStepIds(steps));
        return getConvertOverview(steps, crowdIds, conditions);
    }

    /**
     * Gets event convert trend.
     *
     * @param campaignId  the campaign id
     * @param crowdIds    the crowd ids
     * @param eventIds    the event ids
     * @param granularity the granularity
     * @return the event convert trend
     * @throws Exception the exception
     */
    public List<FunnelTrendDto> getEventConvertTrend(Integer campaignId, List<Integer> crowdIds, List<String> eventIds, String granularity) throws Exception{
        Campaign campaign = campaignService.selectByPrimaryKey(campaignId);
        if (campaign == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_CONFIG_CAMPAIGN_NOT_EXIST);
        }
        int dateTp = parseGranularity(granularity);
        List<FunnelTrendDto> trendDtoList = new ArrayList();
        if (crowdIds.isEmpty()) {
            FunnelTrendDto funnelTrendDto = new FunnelTrendDto();
            funnelTrendDto.setItems(funnelApi.getConvertTrend(campaign.getStartTime(), campaign.getEndTime(), dateTp, eventIds));
            trendDtoList.add(funnelTrendDto);
            return trendDtoList;
        }
        List<Crowd> crowds = getSortedCrowdByIds(crowdIds);
        for (Crowd c : crowds) {
            FunnelTrendDto funnelTrendDto = new FunnelTrendDto();
            funnelTrendDto.setCrowdName(c.getRefName());
            funnelTrendDto.setItems(funnelApi.getCrowdConvertTrend(campaign.getStartTime(), campaign.getEndTime(), dateTp, eventIds, c.getRefId()));
            trendDtoList.add(funnelTrendDto);
        }
        return trendDtoList;
    }

    /**
     * Gets event finish trend.
     *
     * @param campaignId  the campaign id
     * @param crowdIds    the crowd ids
     * @param eventId     the event id
     * @param granularity the granularity
     * @return the event finish trend
     * @throws Exception the exception
     */
    public List<EventDateDetailDto> getEventFinishTrend(Integer campaignId, List<Integer> crowdIds, String eventId, String granularity) throws Exception{
        Campaign campaign = campaignService.selectByPrimaryKey(campaignId);
        if (campaign == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FUNNEL_CONFIG_CAMPAIGN_NOT_EXIST);
        }
        int dateTp = parseGranularity(granularity);
        List<EventDateDetailDto> eventDateDetailDtoList = new ArrayList();
        if (crowdIds.isEmpty()) {
            EventDateDetailDto eventDateDetailDto = new EventDateDetailDto();
            eventDateDetailDto.setItems(funnelApi.getEventFinishTrend(campaign.getStartTime(), campaign.getEndTime(), dateTp, eventId));
            eventDateDetailDtoList.add(eventDateDetailDto);
            return eventDateDetailDtoList;
        }
        List<Crowd> crowds = getSortedCrowdByIds(crowdIds);
        for (Crowd c : crowds) {
            EventDateDetailDto eventDateDetailDto = new EventDateDetailDto();
            eventDateDetailDto.setCrowdName(c.getRefName());
            eventDateDetailDto.setItems(funnelApi.getCrowdEventFinishTrend(campaign.getStartTime(), campaign.getEndTime(), dateTp, eventId, c.getRefId()));
            eventDateDetailDtoList.add(eventDateDetailDto);
        }
        return eventDateDetailDtoList;
    }

    private int parseGranularity(String granularity) throws Exception{
        String monthGranularity = "month";
        String weekGranularity = "week";
        int dateTp = Calendar.DAY_OF_YEAR;
        if (monthGranularity.equals(granularity)) {
            dateTp = Calendar.MONTH;
        }
        if (weekGranularity.equals(granularity)) {
            dateTp = Calendar.WEEK_OF_YEAR;
        }
        return dateTp;
    }

    /**
     * Gets funnel detail.
     *
     * @param crowdIds the crowd ids
     * @param funnelId the funnel id
     * @param offset   the offset
     * @param limit    the limit
     * @return the funnel detail
     * @throws Exception the exception
     */
    public FunnelDetailPage getFunnelDetail(List<Integer> crowdIds, Integer funnelId, Integer offset, Integer limit) throws Exception{
        List<FunnelStepDefinition> steps = getFunnelStep(funnelId);
        List<FunnelStepConditionDefinition> conditions = getFunnelEvent(getStepIds(steps));
        FunnelDetailPage funnelDetailPage = new FunnelDetailPage();
        if (conditions.isEmpty()) {
            funnelDetailPage.setTotal(0);
            funnelDetailPage.setData(Collections.emptyList());
            return funnelDetailPage;
        }
        List<String> headers = buildHeader(steps, conditions);
        List<List<String>> table = new ArrayList();
        table.add(headers);
        List<List<String>> body = buildFunnelBody(conditions, crowdIds);

        funnelDetailPage.setTotal(body.size());
        if (body.size() <= offset) {
            funnelDetailPage.setData(table);
            return funnelDetailPage;
        }
        int toSize = (offset + limit) > body.size() ? body.size() : (offset + limit);
        List<List<String>> subList = body.subList(offset, toSize);
        table.addAll(subList);
        funnelDetailPage.setData(table);
        return funnelDetailPage;
    }

    /**
     * Build funnel detail funnel detail page.
     *
     * @param crowdIds the crowd ids
     * @param funnelId the funnel id
     * @param offset   the offset
     * @param limit    the limit
     * @return the funnel detail page
     * @throws Exception the exception
     */
    public FunnelDetailPage buildFunnelDetail(List<Integer> crowdIds, Integer funnelId, Integer offset, Integer limit) throws Exception {
        FunnelDetailPage funnelDetailPage = getFunnelDetail(crowdIds, funnelId, offset, limit);
        List<List<String>> data = funnelDetailPage.getData();
        if (data.size() <= 1) {
            return funnelDetailPage;
        }
        for (int row=1;row<data.size();row++) {
            List<String> r = data.get(row);
            for (int column=1;column<r.size();column++) {
                String[] temp = r.get(column).split("\\|");
                if (temp.length <= 1) {
                    logger.error("bug:split funnel detail cell length less than 2");
                    continue;
                }
                String convertVal = CommonUtil.spotInsertChar(temp[0].trim(), 3, ',');
                r.set(column, convertVal);
            }
        }
        return funnelDetailPage;
     }

    /**
     * Download funnel detail input stream.
     *
     * @param crowdIds the crowd ids
     * @param funnelId the funnel id
     * @return the input stream
     * @throws Exception the exception
     */
    public InputStream downloadFunnelDetail(List<Integer> crowdIds, Integer funnelId) throws Exception{
        HSSFWorkbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet("Sheet1");
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        if (funnelId == -1) {
            wb.write(bos);
            byte[] content = bos.toByteArray();
            return new ByteArrayInputStream(content);
        }
        FunnelDetailPage detail = getFunnelDetail(crowdIds, funnelId, 0, Integer.MAX_VALUE);
        int yIndex = 0;
        List<List<String>> funnelExcelData = buildFunnelExcel(detail.getData());
        for (List<String> row : funnelExcelData) {
            ExcelUtil.writeRow(row, sheet, yIndex);
            yIndex++;
        }
        wb.write(bos);
        byte[] content = bos.toByteArray();
        return new ByteArrayInputStream(content);
    }

    private List<List<String>> buildFunnelExcel(List<List<String>> rows) {
        List<List<String>> excelStruct = new ArrayList();
        for (int i=0;i<rows.size();i++) {
            if (i==0) {
                //build excel header
                excelStruct.add(buildFunnelExcelHeader(rows.get(i)));
            } else {
                // build excel body
                excelStruct.add(buildFunnelExcelBody(rows.get(i)));
            }
        }
        return excelStruct;
    }

    private List<String> buildFunnelExcelHeader(List<String> rows) {
        List<String> excelHeader = new ArrayList();
        if (rows.size() <= 1) {
            return rows;
        }
        excelHeader.add(rows.get(0));
        for (int i=1;i<rows.size();i++) {
            excelHeader.add(String.format("%s用户数",rows.get(i)));
        }
        return excelHeader;
    }

    private List<String> buildFunnelExcelBody(List<String> rows) {
        List<String> excelBody = new ArrayList();
        if (rows.size() <= 1) {
            return excelBody;
        }
        excelBody.add(rows.get(0));
        for (int i=1;i<rows.size();i++) {
            String[] temp = rows.get(i).split("\\|");
            if (temp.length <= 1) {
                logger.error("bug:split funnel detail cell length less than 2");
                continue;
            }
            excelBody.add(temp[0].trim());
        }
        return excelBody;
    }

    private List<String> buildHeader(List<FunnelStepDefinition> steps, List<FunnelStepConditionDefinition> conditions) {
        List<String> headers = new ArrayList();
        headers.add("日期");
        Map<Integer, String> eventFunnelNameMapper = buildEventFunnelNameMapper(steps);
        for (FunnelStepConditionDefinition d : conditions) {
            headers.add(eventFunnelNameMapper.get(d.getFunnelStepDefinitionId()));
        }
        return headers;
    }

    private Map<Integer, String> buildEventFunnelNameMapper(List<FunnelStepDefinition> steps) {
        Map<Integer, String> mapper = new HashMap(16);
        for (FunnelStepDefinition stepDefinition : steps) {
            mapper.put(stepDefinition.getId(), stepDefinition.getName());
        }
        return mapper;
    }

    private List<List<String>> buildFunnelBody(List<FunnelStepConditionDefinition> conditions, List<Integer> crowdIds) throws Exception{
        if (crowdIds.isEmpty()) {
            return funnelApi.getFunnelDetail(conditions);
        }
        List<Crowd> crowds = getSortedCrowdByIds(crowdIds);
        int funnelCrowdsSize = 2;
        if (crowds.size() != funnelCrowdsSize) {
            return new ArrayList();
        }
        List<List<String>> column = new ArrayList();
        List<List<String>> crowd1FunnelList = funnelApi.getCrowdFunnelDetail(conditions, crowds.get(0).getRefId());
        List<List<String>> crowd2FunnelList = funnelApi.getCrowdFunnelDetail(conditions, crowds.get(1).getRefId());

        if (crowd1FunnelList.size() != crowd2FunnelList.size()) {
            logger.error("the crowd date length is not equal");
            return new ArrayList();
        }
        for (int i=0;i<crowd1FunnelList.size();i++) {
            column.add(crowd1FunnelList.get(i));
            column.add(crowd2FunnelList.get(i));
        }
        return column;
    }

    private List<FunnelConvertOverview> getConvertOverview(List<FunnelStepDefinition> steps, final List<Integer> crowdIds, final List<FunnelStepConditionDefinition> conditions) throws Exception {
        List<FunnelConvertOverview> overviews = new ArrayList();
        if (crowdIds.isEmpty()) {
            List<FunnelConvertOverviewEventStepItem> items = funnelApi.getConvertOverview(steps, conditions);
            FunnelConvertOverview overview = new FunnelConvertOverview();
            overview.setFunnelConvertOverviewEventStepItem(items);
            overviews.add(overview);
            return overviews;
        }
        List<Crowd> crowds = getSortedCrowdByIds(crowdIds);
        for (Crowd crowd : crowds) {
            FunnelConvertOverview funnelConvertOverview = new FunnelConvertOverview();
            funnelConvertOverview.setCrowdId(crowd.getId());
            funnelConvertOverview.setCrowdName(crowd.getRefName());
            List<FunnelConvertOverviewEventStepItem> items = funnelApi.getCrowdConvertOverview(steps, conditions, crowd.getRefId());
            funnelConvertOverview.setFunnelConvertOverviewEventStepItem(items);
            overviews.add(funnelConvertOverview);
        }
        return overviews == null ? Collections.EMPTY_LIST : overviews;
    }

    private List<Integer> getStepIds(final List<FunnelStepDefinition> params) {
        List<Integer> result = new ArrayList<>();
        for (FunnelStepDefinition param : params) {
            result.add(param.getId());
        }
        return result;
    }

    private List<FunnelStepDefinition> getFunnelStep(final Integer funnelId) throws Exception {
        FunnelStepDefinitionPage page = new FunnelStepDefinitionPage();
        page.setFunnelDefinitionId(String.valueOf(funnelId));
        List<FunnelStepDefinition> result = funnelStepDefinitionService.queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private List<FunnelStepConditionDefinition> getFunnelEvent(final List<Integer> stepIds) throws Exception {
        List<FunnelStepConditionDefinition> result = funnelStepConditionDefinitionService.selectByIds(stepIds);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**按照人群id列表的顺序返回人群列表
     *
     * @param crowdIds
     * @return
     * @throws Exception
     */
    private List<Crowd> getSortedCrowdByIds(final List<Integer> crowdIds) throws Exception {
        List<Crowd> crowdList = crowdService.selectByIds(crowdIds);
        Map<Integer, Crowd> m = new HashMap(16);
        for (Crowd crowd: crowdList) {
            m.put(crowd.getId(), crowd);
        }
        List<Crowd> sortedCrowdList = new ArrayList();
        for (Integer crowdId:crowdIds) {
            if (m.get(crowdId) != null) {
                sortedCrowdList.add(m.get(crowdId));
            }
        }
        return sortedCrowdList;
    }

    /**
     * List by campaign id and name list.
     *
     * @param campaignId the campaign id
     * @param funnelName the funnel name
     * @return the list
     * @throws Exception the exception
     */
    public List<CampaignFunnelConfig> listByCampaignIdAndName(Integer campaignId, String funnelName) throws Exception {
        CampaignFunnelConfigPage page = new CampaignFunnelConfigPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setFunnelName(funnelName);
        List<CampaignFunnelConfig> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     * @throws Exception the exception
     */
    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    /**
     * List by ids list.
     *
     * @param ids the ids
     * @return the list
     * @throws Exception the exception
     */
    public List<CampaignFunnelConfig> listByIds(List<Integer> ids) throws Exception {
        List<CampaignFunnelConfig> result = getDao().selectByPrimaryKeys(ids);
        return result == null ? Collections.EMPTY_LIST : result;
    }

}
