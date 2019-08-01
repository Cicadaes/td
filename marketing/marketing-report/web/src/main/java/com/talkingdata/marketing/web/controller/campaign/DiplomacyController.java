package com.talkingdata.marketing.web.controller.campaign;

import com.talkingdata.marketing.core.service.campaign.DiplomacyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * @author chunyan.ji
 * @create 2017-05-10-下午4:22
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/diplomacy")
public class DiplomacyController {

    private static final Logger logger = LoggerFactory.getLogger(DiplomacyController.class);

    @Autowired
    private DiplomacyService diplomacyService;

    @RequestMapping(value = "/funnelIndexDefinition", method = GET)
    @ResponseBody
    public String queryFunnelIndexDefinition() throws Exception {
        return diplomacyService.getAllFunnelIndexDefinition();
    }

    @RequestMapping(value = "/push/log", method = GET)
    @ResponseBody
    public String generatePushLog(Integer[] ids) throws Exception {
        diplomacyService.createPushLog(ids);
        return "通啦";
    }

    //    @RequestMapping(value = "/robot/work", method = DELETE)
    //    @ResponseBody
    //    public String clean() throws Exception {
    //        cleaningRobot.execute(null);
    //        return "完毕";
    //    }

    @RequestMapping(value = "/generate/sengmentMetric", method = DELETE)
    @ResponseBody
    public String generate() throws Exception {
        return "完毕";
    }

}
