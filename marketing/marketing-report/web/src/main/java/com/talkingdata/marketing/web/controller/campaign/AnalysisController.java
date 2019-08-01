package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.marketing.core.entity.dto.AnalysisItemDto;
import com.talkingdata.marketing.core.service.campaign.AnalysisService;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author chunyan.ji
 */
@RestController
@RequestMapping(value = "/campaign")
@Api(tags = "效果分析")
public class AnalysisController {

    /**
     * 日志
     */
    private static final Logger logger = LoggerFactory.getLogger(AnalysisController.class);

    @Autowired
    private AnalysisService analysisService;

    /**
     * curl localhost:1111/campaign/analysis/code/code?campaignId=122\&begin=2017-05-04\&end=2017-05-07
     */
    @RequestMapping(value = "/analysis/code/{code}", method = RequestMethod.GET)
    @ResponseBody
    public Long getActualValue(@RequestParam Integer campaignId, @PathVariable Integer code, @RequestParam String begin, @RequestParam String end) throws Exception{
        logger.info("效果分析查询,活动ID:{} CubeCode:{} 开始日期:{} 结束日期{}", campaignId, code, begin, end);
        return analysisService.getActualValue(campaignId, code, begin, end);
    }

    /**
     * curl localhost:1111/campaign/analysis/code/code/trend?campaignId=122\&begin=2017-05-04\&end=2017-05-07
     */
    @RequestMapping(value = "/analysis/code/{code}/trend", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Long> getTrend(@RequestParam Integer campaignId, @PathVariable Integer code, @RequestParam String begin, @RequestParam String end) throws Exception{
        return analysisService.getTrend(campaignId, code, begin, end);
    }

    /**
     * curl localhost:1111/campaign/analysis/code/segment_id/count?campaignId=122
     */
    @RequestMapping(value = "/analysis/code/{code}/count", method = RequestMethod.GET)
    @ResponseBody
    public Integer getCount(@RequestParam Integer campaignId, @PathVariable Integer code) throws Exception{
        return analysisService.getAnalysisCount(campaignId, code);
    }

    /**
     * curl localhost:1111/campaign/analysis/code/segment_id/comparing?campaignId=122
     */
    @RequestMapping(value = "/analysis/code/{code}/comparing", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, List<AnalysisItemDto>> getComparingTrend(@RequestParam Integer campaignId, @PathVariable Integer code, @RequestParam String begin, @RequestParam String end, @RequestParam Integer topN) throws Exception{
        return analysisService.getComparingTrend(campaignId, code, begin, end, topN);
    }

    /**
     * curl localhost:1111/campaign/analysis/code/segment_id/chart?campaignId=122
     */
    @RequestMapping(value = "/analysis/code/{code}/chart", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Long> getChart(@RequestParam Integer campaignId, @PathVariable Integer code, @RequestParam String begin, @RequestParam String end) throws Exception {
        return analysisService.getChart(campaignId, code, begin, end);
    }



}
