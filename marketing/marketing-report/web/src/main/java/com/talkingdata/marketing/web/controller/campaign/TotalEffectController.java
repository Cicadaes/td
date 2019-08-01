package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.enterprise.base.web.BaseController;
import com.talkingdata.marketing.core.entity.dto.EffectDetailDto;
import com.talkingdata.marketing.core.entity.dto.EffectOverviewDto;
import com.talkingdata.marketing.core.entity.dto.EffectTrendDto;
import com.talkingdata.marketing.core.service.campaign.EffectService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.List;

/**
 * @author chunyan.ji
 */
@RestController
@RequestMapping(value = "/campaign")
@Api(tags = "总体概览")
public class TotalEffectController  extends BaseController {
    @Autowired
    private EffectService effectService;

    /**
     * curl localhost:1111/campaign/effect/overview?campaignId=12112\&segments=1,2,3
     */
    @RequestMapping(value = "/effect/overview", method = RequestMethod.GET)
    @ResponseBody
    public List<EffectOverviewDto> overview(@RequestParam Integer campaignId, @RequestParam List<Integer> segments) throws Exception{
        return effectService.getOverview(campaignId,segments);
    }

    @RequestMapping(value = "/effect/campaign/{campaignId}/config/{configId}/trend", method = RequestMethod.GET)
    @ResponseBody
    public List<EffectTrendDto> getTrend(@PathVariable Integer configId, @PathVariable Integer campaignId, @RequestParam List<Integer> segments) throws Exception {
        return effectService.getTrend(configId, campaignId, segments);
    }

    @RequestMapping(value = "/effect/campaign/{campaignId}/detail", method = RequestMethod.GET)
    @ResponseBody
    public List<EffectDetailDto> getEffectDetail(@PathVariable Integer campaignId) throws Exception {
        return effectService.getEffectDetail(campaignId);
    }

    @RequestMapping(value = "/effect/campaign/{campaignId}/detail/download", method = RequestMethod.GET)
    public void downloadEffectDetail(HttpServletResponse res, @PathVariable Integer campaignId, @RequestParam String campaignName) throws Exception{
        InputStream is = effectService.generateDetailExcel(campaignId);
        String fileName = campaignName + "_投放目标贡献详情表.xls";
        download(res, is, fileName);
    }
}
