package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionCategroup;
import com.talkingdata.datacloud.visual.entity.report.DataSource;
import com.talkingdata.datacloud.visual.page.report.DataSourcePage;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionAttachmentService;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionCategroupService;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionService;
import com.talkingdata.datacloud.visual.service.report.DataSourceService;
import com.talkingdata.datacloud.visual.util.ChartHelper;
import com.talkingdata.datacloud.visual.util.DataSourceHelper;
import com.talkingdata.datacloud.visual.util.Msg;
import com.talkingdata.datacloud.visual.vo.StyleDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * Created by yangruobin on 2017/4/7.
 */
@Controller
@RequestMapping("/report")
public class ChartStyleDefinitionController {
    private static final Logger logger = LoggerFactory.getLogger(ChartStyleDefinitionController.class);

    @Autowired
    private ConfigDefinitionService configDefinitionService;
    @Autowired
    private DataSourceService dataSourceService;
    @Autowired
    private ConfigDefinitionCategroupService configDefinitionCategroupService;

    @Autowired
    private ConfigDefinitionAttachmentService configDefinitionAttachmentService;

    /**
     * 获取图表列表信息
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartStyleConfigDefinitions", method = GET)
    @ResponseBody
    public List<StyleDefinition> query() throws Exception {
        List<ConfigDefinition> configDefinitionList=configDefinitionService.queryByType(2);
        List<StyleDefinition> styleDefinitionList= DataSourceHelper.configDefinitionList2StyleDefinitionList(configDefinitionList);

        DataSourcePage page=new DataSourcePage();
        page.setPageSize(1000);
        List<DataSource> dataSourceList=dataSourceService.queryByList(page);

        ChartHelper.fillVoChart(styleDefinitionList,dataSourceList);

        return styleDefinitionList;
    }

    /**
     * 获取分类组图表列表信息
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartStyleConfigDefinitions/chartCateGroup/{id}", method = GET)
    @ResponseBody
    public Map<String,Object> queryByGroupId(@PathVariable Integer id) throws Exception {
        ConfigDefinitionCategroup configDefinitionCategroup=configDefinitionCategroupService.selectByPrimaryKey(id);

        List<ConfigDefinition> configDefinitionList=configDefinitionService.queryByGroupId(id);
        List<StyleDefinition> styleDefinitionList= DataSourceHelper.configDefinitionList2StyleDefinitionList(configDefinitionList);

        DataSourcePage page=new DataSourcePage();
        page.setPageSize(1000);
        List<DataSource> dataSourceList=dataSourceService.queryByList(page);

        ChartHelper.fillVoChart(styleDefinitionList,dataSourceList);

        Map<String,Object> result=new HashMap<>();
        result.put("title",configDefinitionCategroup.getGroupName());
        result.put("data",styleDefinitionList);

        return result;
    }

    /**
     * 获取某个图表的渲染信息
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartStyleConfigDefinitions/{id}", method = GET)
    @ResponseBody
    public StyleDefinition query(@PathVariable Integer id) throws Exception {
        ConfigDefinition configDefinition=configDefinitionService.queryById(id);
        return DataSourceHelper.configDefinition2StyleDefinition(configDefinition);
    }

    /**
     * 保存图表的渲染信息
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartStyleConfigDefinitions",  method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> update(HttpServletRequest request, @RequestBody StyleDefinition styleDefinition) throws Exception {
        if(styleDefinition.getId()==null){
            Map resultMap= Msg.getFailureMessage("ID不能为空");
            return resultMap;
        }
        ConfigDefinition oldConfigDefinition=configDefinitionService.selectByPrimaryKey(styleDefinition.getId());
        if(oldConfigDefinition==null){
            Map resultMap= Msg.getFailureMessage("ID在数据库中不存在");
            return resultMap;
        }
        ConfigDefinition configDefinition = DataSourceHelper.styleDefinition2ConfigDefinition(styleDefinition);
        configDefinitionService.updateDefinition(configDefinition);
        Map resultMap= Msg.getSuccessMessage("修改成功");
        return resultMap;
    }

    /**
     * 保存图表的渲染信息
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartStyleConfigDefinitions",  method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public int create(HttpServletRequest request, @RequestBody StyleDefinition styleDefinition) throws Exception {
        styleDefinition.setId(null);
        ConfigDefinition configDefinition = DataSourceHelper.styleDefinition2ConfigDefinition(styleDefinition);
        configDefinitionService.insertDefinition(configDefinition);
        return configDefinition.getId();
    }
}
