package com.talkingdata.marketing.core.service.common;

import com.talkingdata.marketing.core.entity.admin.CampaignTargetDefinition;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.entity.dto.EffectCampaignTargetCube;
import com.talkingdata.marketing.core.entity.dto.EffectSegmentTargetCube;
import com.talkingdata.marketing.core.entity.dto.EffectUnitTargetCube;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.cube.CubeDetail;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.service.admin.CampaignTargetDefinitionService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The type Effect target.
 * @author xiaoming.kang
 */
public class EffectTarget {

    private static final Logger logger = LoggerFactory.getLogger(UserCloudApi.class);

    private UserCloudApi userCloudApi;

    private CampaignTargetDefinitionService campaignTargetDefinitionService;

    private List<CampaignTargetConfig> campaignTargetConfigList;

    private Map<Integer, CubeDetail> configCubeMapper;

    private List<EffectCampaignTargetCube> effectCampaignTargetCubeList;

    private List<EffectUnitTargetCube> effectUnitTargetCubeList;

    private List<EffectSegmentTargetCube> effectSegmentTargetCubeList;


    /**
     * Instantiates a new Effect target.
     *
     * @param campaignTargetConfigList        the campaign target config list
     * @param userCloudApi                    the user cloud api
     * @param campaignTargetDefinitionService the campaign target definition service
     * @throws Exception the exception
     */
    public EffectTarget(List<CampaignTargetConfig> campaignTargetConfigList,UserCloudApi userCloudApi, CampaignTargetDefinitionService campaignTargetDefinitionService) throws Exception{
        this.campaignTargetConfigList = campaignTargetConfigList;
        this.campaignTargetDefinitionService = campaignTargetDefinitionService;
        this.userCloudApi = userCloudApi;
        this.configCubeMapper = getConfigCubeMapping();
    }

    /**
     * Init campaign target cube list.
     *
     * @param campaignIds the campaign ids
     * @throws Exception the exception
     */
    public void initCampaignTargetCubeList(List<Integer> campaignIds) throws Exception {
        this.effectCampaignTargetCubeList = getCampaignEffect(campaignIds);
    }

    /**
     * Init unit target cube list.
     *
     * @param units the units
     * @throws Exception the exception
     */
    public void initUnitTargetCubeList(List<Integer> units) throws Exception{
        this.effectUnitTargetCubeList = getUnitEffect(units);
    }

    /**
     * Init unit target cube list.
     *
     * @param unitIdMap the unit id map
     * @throws Exception the exception
     */
    public void initUnitTargetCubeList(Map <Integer, List <Integer>> unitIdMap) throws Exception{
        this.effectUnitTargetCubeList = getUnitEffect(unitIdMap);
    }

    /**
     * Init segment target cube list.
     *
     * @param segments the segments
     * @throws Exception the exception
     */
    public void initSegmentTargetCubeList(List<Integer> segments) throws Exception{
        this.effectSegmentTargetCubeList = getSegmentEffectByList(segments);
    }

    /**
     * Gets cube detail by target id.
     *
     * @param targetId the target id
     * @return the cube detail by target id
     */
    public CubeDetail getCubeDetailByTargetId(Integer targetId) {
        return configCubeMapper.get(targetId);
    }

    private Map<Integer, CubeDetail> getConfigCubeMapping() throws Exception{
        //List<Integer> idList= getDefinitionIdList(campaignTargetConfigList);
        List<Integer> idList = new ArrayList<>(campaignTargetConfigList.stream().map(object -> object.getTargetDefinitionId()).collect(Collectors.toSet()));
        Map<Integer, CubeDetail> cubeMapping = new HashMap(16);
        if (idList.size() == 0) {
            return cubeMapping;
        }
        List<CampaignTargetDefinition> targetDefinitionList = getTargetDefinitionByIds(idList);
        //缓存cubeDetail，如果发现内存已经存在，不需要再发起rest请求。
        Map<Integer, CubeDetail> indexCubeDetailMapper = new HashMap(16);
        for (CampaignTargetConfig config : campaignTargetConfigList) {
            for (CampaignTargetDefinition targetDefinition : targetDefinitionList) {
                if (targetDefinition.getId().equals(config.getTargetDefinitionId())) {
                    try {
                        if (indexCubeDetailMapper.containsKey(targetDefinition.getIndexId())) {
                            // 如果key存在，但是缓存不是null值
                            if (indexCubeDetailMapper.get(targetDefinition.getIndexId()) != null) {
                                cubeMapping.put(config.getId(), indexCubeDetailMapper.get(targetDefinition.getIndexId()));
                            }
                        } else {
                            CubeDetail cubeDetail = userCloudApi.getCubeDetailApi(targetDefinition.getIndexId());
                            if (cubeDetail != null) {
                                cubeMapping.put(config.getId(), cubeDetail);
                                indexCubeDetailMapper.put(targetDefinition.getIndexId(), cubeDetail);
                            }
                        }
                    } catch (Exception e) {
                        //缓存空
                        indexCubeDetailMapper.put(targetDefinition.getIndexId(), null);
                        logger.error("get cube detail err:",e);
                    }
                    break;
                }
            }
        }
        return cubeMapping;
    }

    @Deprecated     //重复的id并没有过滤掉.
    /**
     *
     */
    private List<Integer> getDefinitionIdList(List<CampaignTargetConfig> campaignTargetConfigList) {
        List<Integer> result = new ArrayList<>();
        for (CampaignTargetConfig param : campaignTargetConfigList) {
            result.add(param.getTargetDefinitionId());
        }
        return result;
    }

    private List<CampaignTargetDefinition> getTargetDefinitionByIds(List<Integer> ids) {
        return campaignTargetDefinitionService.getByIds(ids);
    }

    private List<EffectSegmentTargetCube> getSegmentEffectByList(List<Integer> segmentIdList) throws Exception {
        List<EffectSegmentTargetCube> effectSegmentTargetCubeList = new ArrayList();
        for (Map.Entry<Integer, CubeDetail> entry : configCubeMapper.entrySet()) {
            Map<String, Long> segmentMap = userCloudApi.getSegmentEffectApi(entry.getValue(), segmentIdList);

            for (Map.Entry<String, Long> m : segmentMap.entrySet()) {
                EffectSegmentTargetCube effectSegmentTargetCube = new EffectSegmentTargetCube();
                effectSegmentTargetCube.setTargetId(entry.getKey());
                effectSegmentTargetCube.setSegmentId(Integer.parseInt(m.getKey()));
                effectSegmentTargetCube.setVal(m.getValue());
                effectSegmentTargetCubeList.add(effectSegmentTargetCube);
            }
        }
        return effectSegmentTargetCubeList;
    }

    private List<EffectCampaignTargetCube> getCampaignEffect(List<Integer> campaignIds) throws Exception{
        List<EffectCampaignTargetCube> effectCampaignTargetCubeList = new ArrayList();
        //缓存查询结果，同一个cube，保证结果只查一次
        Map<Integer, Map<String, Long>> indexResultMapper = new HashMap(16);
        for (Map.Entry<Integer, CubeDetail> entry : configCubeMapper.entrySet()) {
            Map<String, Long> campaignMap;
            if (!indexResultMapper.containsKey(entry.getValue().getCubeInfo().getCubeId())) {
                campaignMap = userCloudApi.getEffectApi(entry.getValue(), campaignIds);
                indexResultMapper.put(entry.getValue().getCubeInfo().getCubeId(), campaignMap);
            } else {
                campaignMap = indexResultMapper.get(entry.getValue().getCubeInfo().getCubeId());
            }
            if (campaignMap == null) {
                continue;
            }
            for (Map.Entry<String, Long> m : campaignMap.entrySet()) {
                EffectCampaignTargetCube effectCampaignTargetCube = new EffectCampaignTargetCube();
                effectCampaignTargetCube.setTargetId(entry.getKey());
                effectCampaignTargetCube.setCampaignId(Integer.parseInt(m.getKey()));
                effectCampaignTargetCube.setVal(m.getValue());
                effectCampaignTargetCubeList.add(effectCampaignTargetCube);
            }
        }
        return effectCampaignTargetCubeList;
    }

    private List<EffectUnitTargetCube> getUnitEffect(List<Integer> unitIdList) throws Exception{
        List<EffectUnitTargetCube> effectUnitTargetCubeList = new ArrayList();
        for (Map.Entry<Integer, CubeDetail> entry : configCubeMapper.entrySet()) {
            Map<String, Long> unitMap = userCloudApi.getUnitEffectApi(entry.getValue(), unitIdList);

            for (Map.Entry<String, Long> m : unitMap.entrySet()) {
                EffectUnitTargetCube effectUnitTargetCube = new EffectUnitTargetCube();
                effectUnitTargetCube.setTargetId(entry.getKey());
                effectUnitTargetCube.setUnitId(Integer.parseInt(m.getKey()));
                effectUnitTargetCube.setVal(m.getValue());
                effectUnitTargetCubeList.add(effectUnitTargetCube);
            }
        }
        return effectUnitTargetCubeList;
    }
    private List<EffectUnitTargetCube> getUnitEffect(Map <Integer, List <Integer>> unitIdMap) throws Exception{
        List <EffectUnitTargetCube> effectUnitTargetCubes = new ArrayList <>();
        for (Map.Entry<Integer, CubeDetail> entry : configCubeMapper.entrySet()) {
            for (Map.Entry <Integer, List <Integer>> integerListEntry : unitIdMap.entrySet()) {
                Map <String, Long> unitMap = userCloudApi.getUnitEffectApiBySegments(entry.getValue(), integerListEntry.getValue());
                EffectUnitTargetCube effectUnitTargetCube = new EffectUnitTargetCube();
                effectUnitTargetCube.setTargetId(entry.getKey());
                effectUnitTargetCube.setUnitId(integerListEntry.getKey());
                Long value = 0L;
                for (Map.Entry <String, Long> m : unitMap.entrySet()) {
                    value += m.getValue();
                }
                effectUnitTargetCube.setVal(value);
                effectUnitTargetCubes.add(effectUnitTargetCube);
            }
        }
        return effectUnitTargetCubes;
    }

    /**
     * Gets campaign val.
     *
     * @param campaignId the campaign id
     * @param configId   the config id
     * @return the campaign val
     */
    public Long getCampaignVal(Integer campaignId, Integer configId) {
        if (effectCampaignTargetCubeList == null) {
            return 0L;
        }
        for (EffectCampaignTargetCube effectCampaignTargetCube : effectCampaignTargetCubeList) {
            if (campaignId.equals(effectCampaignTargetCube.getCampaignId()) && configId.equals(effectCampaignTargetCube.getTargetId())) {
                return effectCampaignTargetCube.getVal();
            }
        }
        return 0L;
    }

    /**
     * Gets unit val.
     *
     * @param unitId   the unit id
     * @param configId the config id
     * @return the unit val
     */
    public Long getUnitVal(Integer unitId, Integer configId) {
        if (effectUnitTargetCubeList == null) {
            return 0L;
        }
        for (EffectUnitTargetCube effectUnitTargetCube : effectUnitTargetCubeList) {
            if (unitId.equals(effectUnitTargetCube.getUnitId()) && configId.equals(effectUnitTargetCube.getTargetId())) {
                return effectUnitTargetCube.getVal();
            }
        }
        return 0L;
    }

    /**
     * Gets segment val.
     *
     * @param segmentId the segment id
     * @param configId  the config id
     * @return the segment val
     */
    public Long getSegmentVal(Integer segmentId, Integer configId) {
        if (effectSegmentTargetCubeList == null) {
            return 0L;
        }
        for (EffectSegmentTargetCube effectSegmentTargetCube : effectSegmentTargetCubeList) {
            if (segmentId.equals(effectSegmentTargetCube.getSegmentId()) && configId.equals(effectSegmentTargetCube.getTargetId())) {
                return effectSegmentTargetCube.getVal();
            }
        }
        return 0L;
    }

}
