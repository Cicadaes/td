package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.SegmentConstant.SegmentStatusConstant;
import com.talkingdata.marketing.core.dao.campaign.CampaignLaunchUnitDao;
import com.talkingdata.marketing.core.dao.campaign.SegmentDao;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.dto.EffectDetailDto;
import com.talkingdata.marketing.core.entity.dto.EffectItemDto;
import com.talkingdata.marketing.core.entity.dto.EffectOverviewDto;
import com.talkingdata.marketing.core.entity.dto.EffectSegmentDto;
import com.talkingdata.marketing.core.entity.dto.EffectTrendDto;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeDetail;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.page.campaign.CampaignLaunchUnitPage;
import com.talkingdata.marketing.core.page.campaign.SegmentPage;
import com.talkingdata.marketing.core.service.admin.CampaignTargetDefinitionService;
import com.talkingdata.marketing.core.service.admin.ChannelDefinitionService;
import com.talkingdata.marketing.core.service.common.EffectTarget;
import com.talkingdata.marketing.core.util.CommonUtil;
import com.talkingdata.marketing.core.util.ExcelUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The type Effect service.
 * @author xiaoming.kang
 */
@Service("effectService")
public class EffectService {
    @Autowired
    private CampaignTargetConfigService campaignTargetConfigService;
    @Autowired
    private SegmentDao segmentDao;
    @Autowired
    private CampaignLaunchUnitDao campaignLaunchUnitDao;
    @Autowired
    private UserCloudApi userCloudApi;
    @Autowired
    private CampaignTargetDefinitionService campaignTargetDefinitionService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;
    @Autowired
    private SegmentService segmentService;
    @Autowired
    private ChannelDefinitionService channelDefinitionService;

    /**
     * Gets overview.
     *
     * @param campaignId  the campaign id
     * @param segmentList the segment list
     * @return the overview
     * @throws Exception the exception
     */
    public List<EffectOverviewDto> getOverview(Integer campaignId, List<Integer> segmentList) throws Exception {
        List<CampaignTargetConfig> campaignTargetConfigList = findTargetConfigByCampaign(campaignId);

        List<EffectOverviewDto> itemList = new ArrayList();
        EffectTarget effectTarget = initEffectTarget(campaignTargetConfigList);
        List<Integer> campaignIds = new ArrayList();
        campaignIds.add(campaignId);
        effectTarget.initCampaignTargetCubeList(campaignIds);
        if (segmentList != null && segmentList.size() >0) {
            effectTarget.initSegmentTargetCubeList(segmentList);
        }
        for (CampaignTargetConfig config: campaignTargetConfigList) {
            EffectOverviewDto effectOverviewDto = new EffectOverviewDto();
            effectOverviewDto.setTargetConfigId(config.getId());
            effectOverviewDto.setName(config.getName());
            effectOverviewDto.setValue(config.getValue());
            effectOverviewDto.setActualValue(effectTarget.getCampaignVal(campaignId, config.getId()));

            if (segmentList != null && segmentList.size() > 0) {
                effectOverviewDto.setSubActualValue(getSubSegmentEffect(effectTarget,segmentList,config));
            }
            itemList.add(effectOverviewDto);
        }
        return itemList;
    }

    private Long getSubSegmentEffect(EffectTarget effectTarget,List<Integer> segmentList,CampaignTargetConfig config) {
        Long val = 0L;
        for (Integer segmentId:segmentList) {
            val += effectTarget.getSegmentVal(segmentId,config.getId());
        }
        return val;
    }

    /**
     * Gets trend.
     *
     * @param configId    the config id
     * @param campaignId  the campaign id
     * @param segmentList the segment list
     * @return the trend
     * @throws Exception the exception
     */
    public List<EffectTrendDto> getTrend(Integer configId, Integer campaignId, List<Integer> segmentList) throws Exception {
        CampaignTargetConfig campaignTargetConfig = campaignTargetConfigService.selectByPrimaryKey(configId);
        List<EffectTrendDto> effectTrendDtoList = new ArrayList();
        if (campaignTargetConfig == null) {
            return effectTrendDtoList;
        }

        List<CampaignTargetConfig> campaignTargetConfigList = new ArrayList();
        campaignTargetConfigList.add(campaignTargetConfig);
        EffectTarget effectTarget = initEffectTarget(campaignTargetConfigList);
        List<Integer> campaignIds = new ArrayList();
        campaignIds.add(campaignId);
        effectTarget.initCampaignTargetCubeList(campaignIds);

        CubeDetail cubeDetail = effectTarget.getCubeDetailByTargetId(campaignTargetConfig.getId());
        if (cubeDetail == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.USER_CLOUD_CUBE_NOT_EXIST);
        }

        if (segmentList.size() == 0) {
            Map<String, Long> campaignTrend = userCloudApi.getTrendByCampaignApi(cubeDetail, campaignId);
            EffectTrendDto trend = buildCampaignEffectDto(campaignTargetConfig, effectTarget, campaignId);
            trend.setItem(campaignTrend);
            effectTrendDtoList.add(trend);
            return effectTrendDtoList;
        }

        List<Segment> segments = segmentDao.queryByIds(segmentList);
        for (Segment s:segments) {
            EffectTrendDto trend = buildCampaignEffectDto(campaignTargetConfig, effectTarget, campaignId);
            trend.setItem(userCloudApi.getTrendBySegmentApi(cubeDetail, s.getId()));
            trend.setSegmentName(s.getName());
            effectTrendDtoList.add(trend);
        }
        return effectTrendDtoList;
    }

    private EffectTrendDto buildCampaignEffectDto(CampaignTargetConfig campaignTargetConfig, EffectTarget effectTarget, Integer campaignId) {
        EffectTrendDto effectTrendDto = new EffectTrendDto();
        effectTrendDto.setName(campaignTargetConfig.getName());
        effectTrendDto.setValue(campaignTargetConfig.getValue());
        effectTrendDto.setActualValue(effectTarget.getCampaignVal(campaignId, campaignTargetConfig.getId()));
        return effectTrendDto;
    }

    private List<CampaignTargetConfig> findTargetConfigByCampaign(Integer campaignId) throws Exception{
        return campaignTargetConfigService.findByCampaignId(campaignId);
    }

    private List<CampaignLaunchUnit> findUnitListByCampaign(Integer campaignId) {
        CampaignLaunchUnitPage campaignLaunchUnitPage = new CampaignLaunchUnitPage();
        campaignLaunchUnitPage.setCampaignId(campaignId.toString());
        campaignLaunchUnitPage.setPageSize(Integer.MAX_VALUE);
        campaignLaunchUnitPage.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.NORMAL));
        return campaignLaunchUnitDao.queryByList(campaignLaunchUnitPage);
    }

    private List<Segment> findSegmentListByCampaign(Integer campaignId) {
        List<Integer> statusList = new ArrayList();
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_FINISH);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_LOOP);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_FAIL);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_PAUSE);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_WAITING);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_PROGRESS);
        return segmentDao.findByStatusAndCampaign(campaignId, statusList);
    }

    /**
     * Gets effect detail.
     *
     * @param campaignId the campaign id
     * @return the effect detail
     * @throws Exception the exception
     */
    public List<EffectDetailDto> getEffectDetail(Integer campaignId) throws Exception{
        List <EffectDetailDto> effectDetailDtoList = new ArrayList();

        List <CampaignTargetConfig> campaignTargetConfigList = findTargetConfigByCampaign(campaignId);
        if (campaignTargetConfigList == null) {
            return effectDetailDtoList;
        }

        List <CampaignLaunchUnit> campaignLaunchUnitList = findUnitListByCampaign(campaignId);
        if (campaignLaunchUnitList == null) {
            return effectDetailDtoList;
        }

        List <Segment> segmentList = findSegmentListByCampaign(campaignId);
        if (segmentList == null) {
            return effectDetailDtoList;
        }

        List <Integer> unitIdList = getUnitIds(campaignLaunchUnitList);
        List <Integer> segmentIdList = getSegmentIds(segmentList);

        EffectTarget effectTarget = initEffectTarget(campaignTargetConfigList);
        List <Integer> campaignIds = new ArrayList();
        campaignIds.add(campaignId);
        effectTarget.initCampaignTargetCubeList(campaignIds);

        Map<Integer, List<Integer>> unitIdMap = new HashMap<>(16);
        for (Integer unitId : unitIdList) {

            SegmentPage segmentPage = new SegmentPage();
            segmentPage.setCampaignLaunchUnitId(unitId + "");
            List <Segment> segments = segmentService.queryByList(segmentPage);
            List <Integer> segmentIds = new ArrayList <>();
            for (Segment segment : segments) {
                segmentIds.add(segment.getId());
            }
            unitIdMap.put(unitId, segmentIds);
        }

        effectTarget.initUnitTargetCubeList(unitIdMap);
        effectTarget.initSegmentTargetCubeList(segmentIdList);

        for (CampaignLaunchUnit campaignLaunchUnit:campaignLaunchUnitList) {
            EffectDetailDto effectDetailDto = new EffectDetailDto();
            List<EffectItemDto> unitOverview = buildUnitEffect(effectTarget, campaignTargetConfigList, campaignLaunchUnit.getId());
            effectDetailDto.setUnitOverview(unitOverview);
            effectDetailDto.setCrowdName(campaignLaunchUnit.getCrowdName());
            List<Segment> subSegmentList = new ArrayList();
            boolean flag = false;
            for (Segment segment:segmentList) {
                // 去除草稿状态的投放
                if (segment.getCampaignLaunchUnitId().equals(campaignLaunchUnit.getId())
                        && segment.getStatus() != SegmentStatusConstant.SEGMENT_STATUS_DRAFT) {
                    subSegmentList.add(segment);
                    flag = true;
                }
            }
            if(flag) {
                effectDetailDto.setSegments(buildSegmentEffect(effectTarget, campaignTargetConfigList, subSegmentList));
                effectDetailDtoList.add(effectDetailDto);
            }
        }
        return effectDetailDtoList;
    }

    private List<Integer> getUnitIds(List<CampaignLaunchUnit> campaignLaunchUnitList) {
        List<Integer> ids = new ArrayList();
        for (CampaignLaunchUnit campaignLaunchUnit : campaignLaunchUnitList) {
            ids.add(campaignLaunchUnit.getId());
        }
        return ids;
    }

    private List<Integer> getSegmentIds(List<Segment> segmentList) {
        List<Integer> ids = new ArrayList();
        for (Segment segment : segmentList) {
            ids.add(segment.getId());
        }
        return ids;
    }

    private List<EffectSegmentDto> buildSegmentEffect(EffectTarget effectTarget, List<CampaignTargetConfig> campaignTargetList, List<Segment> segmentList) {
        List<EffectSegmentDto> effectSegmentDtoList = new ArrayList();
        for (Segment s : segmentList) {
            EffectSegmentDto effectSegmentDto = new EffectSegmentDto();
            effectSegmentDto.setSegmentId(s.getId());
            effectSegmentDto.setSegmentName(s.getName());
            ChannelDefinition channelDefinition = new ChannelDefinition();
            try {
                channelDefinition = channelDefinitionService.selectByPrimaryKey(s.getChannelDefinitionId());
            } catch (Exception e) {
                e.printStackTrace();
            }
            effectSegmentDto.setChannelDefinitionId(channelDefinition.getChannelType());
            effectSegmentDto.setItems(getSegmentActual(effectTarget, campaignTargetList, s.getId()));
            effectSegmentDtoList.add(effectSegmentDto);
        }
        return effectSegmentDtoList;
    }

    private List<EffectItemDto> getSegmentActual(EffectTarget effectTarget, List<CampaignTargetConfig> campaignTargetList, Integer segmentId) {
        List<EffectItemDto> effectItemDtoList = new ArrayList();
        for (CampaignTargetConfig campaignTargetConfig : campaignTargetList) {
            EffectItemDto effectItemDto = new EffectItemDto();
            effectItemDto.setName(campaignTargetConfig.getName());
            effectItemDto.setTargetConfigId(campaignTargetConfig.getId());

            effectItemDto.setExpect(campaignTargetConfig.getValue());
            effectItemDto.setActualValue(effectTarget.getSegmentVal(segmentId, campaignTargetConfig.getId()));
            effectItemDto.setTotalActualValue(effectTarget.getCampaignVal(campaignTargetConfig.getCampaignId(), campaignTargetConfig.getId()));
            effectItemDtoList.add(effectItemDto);
        }
        return effectItemDtoList;
    }

    private List<EffectItemDto> buildUnitEffect(EffectTarget effectTarget, List<CampaignTargetConfig> campaignTargetList, Integer unitId) throws Exception{
        List<EffectItemDto> effectItemDtoList = new ArrayList();
        for (CampaignTargetConfig campaignTargetConfig : campaignTargetList) {
            EffectItemDto effectItemDto = new EffectItemDto();
            effectItemDto.setName(campaignTargetConfig.getName());
            effectItemDto.setTargetConfigId(campaignTargetConfig.getId());
            effectItemDto.setExpect(campaignTargetConfig.getValue());

            effectItemDto.setActualValue(effectTarget.getUnitVal(unitId, campaignTargetConfig.getId()));
            effectItemDto.setTotalActualValue(effectTarget.getCampaignVal(campaignTargetConfig.getCampaignId(), campaignTargetConfig.getId()));
            effectItemDtoList.add(effectItemDto);
        }
        return effectItemDtoList;
    }

    private EffectTarget initEffectTarget(List<CampaignTargetConfig> campaignTargetList) throws Exception{
        return new EffectTarget(campaignTargetList, userCloudApi, campaignTargetDefinitionService);
    }

    /**
     * Generate detail excel input stream.
     *
     * @param campaignId the campaign id
     * @return the input stream
     * @throws Exception the exception
     */
    public InputStream generateDetailExcel(Integer campaignId) throws Exception{

        List<EffectOverviewDto> effectOverviewDtoList = getOverview(campaignId, null);
        HSSFWorkbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet("Sheet1");
        List<EffectDetailDto> effectDetailDtoList = getEffectDetail(campaignId);
        writeExcelHeader(effectOverviewDtoList, sheet, 0);
        writeExcelBody(effectDetailDtoList, sheet, 1);

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        wb.write(bos);
        byte[] content = bos.toByteArray();
        return new ByteArrayInputStream(content);
    }

    private void writeExcelHeader(List<EffectOverviewDto> effectOverviewDtoList,Sheet sheet, int yIndex) throws Exception {
        List<String> arr = new ArrayList();
        arr.add("投放单元");
        arr.add("投放名称");
        for (int i=0;i<effectOverviewDtoList.size();i++) {
            EffectOverviewDto overviewDto = effectOverviewDtoList.get(i);
            String name = overviewDto.getName();
            arr.add(String.format("%s贡献值",name));
            arr.add(String.format("%s贡献率",name));
        }
        ExcelUtil.writeRow(arr, sheet, yIndex);
    }

    private void writeExcelBody(List<EffectDetailDto> effectDetailDtoList,Sheet sheet, int yIndex) throws Exception{
        for (EffectDetailDto effectDetailDto:effectDetailDtoList) {
            String crowdName = effectDetailDto.getCrowdName();

            List<EffectSegmentDto> effectSegmentDtoList = effectDetailDto.getSegments();
            for (EffectSegmentDto effectSegmentDto : effectSegmentDtoList) {
                List<String> rowItem = buildExcelRows(crowdName, effectSegmentDto);
                ExcelUtil.writeRow(rowItem, sheet, yIndex);
                yIndex++;
            }
            ExcelUtil.writeRow(buildUnitOverviewRows(crowdName, effectDetailDto.getUnitOverview()), sheet, yIndex);
            yIndex++;
            int firstRow = yIndex-effectSegmentDtoList.size()-1;
            int lastRow = yIndex-1;
            ExcelUtil.mergeRegion(sheet, firstRow, lastRow, 0, 0);
        }
    }

    private List<String> buildUnitOverviewRows(String crowdName, List<EffectItemDto> effectItemDtoList) {
        List<String> arr = new ArrayList();
        arr.add(crowdName);
        arr.add("总计：");
        for (EffectItemDto effectItemDto:effectItemDtoList) {
            arr.add(String.valueOf(effectItemDto.getActualValue()));
            arr.add(buildContributePercent(effectItemDto));
        }
        return arr;
    }

    private List<String> buildExcelRows(String crowdName, EffectSegmentDto effectSegmentDto) {
        List<EffectItemDto> effectItemDtoList = effectSegmentDto.getItems();
        List<String> arr = new ArrayList();
        arr.add(crowdName);
        arr.add(effectSegmentDto.getSegmentName());
        for (EffectItemDto effectItemDto:effectItemDtoList) {
            arr.add(String.valueOf(effectItemDto.getActualValue()));
            arr.add(buildContributePercent(effectItemDto));
        }
        return arr;
    }

    private String buildContributePercent(EffectItemDto effectItemDto) {
        BigDecimal percent = new BigDecimal("0.00");
        if (effectItemDto.getTotalActualValue() != 0) {
            percent = CommonUtil.getPercent(effectItemDto.getActualValue(), effectItemDto.getTotalActualValue());
        }
        return String.format("%s%%", percent);
    }
}
