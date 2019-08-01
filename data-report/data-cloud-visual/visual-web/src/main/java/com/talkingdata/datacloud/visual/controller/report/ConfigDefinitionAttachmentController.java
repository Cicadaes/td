package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionAttachment;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionAttachmentPage;
import com.talkingdata.datacloud.visual.page.report.ConfigDefinitionPage;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionAttachmentService;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionService;
import com.talkingdata.datacloud.visual.util.Msg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping("/report")
public class ConfigDefinitionAttachmentController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionAttachmentController.class);

    @Autowired
    private ConfigDefinitionAttachmentService configDefinitionAttachmentService;
    @Autowired
    private ConfigDefinitionService configDefinitionService;

    /**
     * 获取图表的ICON
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartIcons/{id}", method = GET,produces ="image/svg+xml; charset=UTF-8")
    @ResponseBody
    public String getChartIcon(@PathVariable Integer id,@RequestParam Integer type) throws Exception {
        ConfigDefinitionAttachmentPage configDefinitionAttachmentPage =new ConfigDefinitionAttachmentPage();
        configDefinitionAttachmentPage.setConfigDefinitionId(id);
        configDefinitionAttachmentPage.setType(type);
        ConfigDefinitionAttachment configDefinitionAttachment=configDefinitionAttachmentService.queryBySingle(configDefinitionAttachmentPage);
        if(configDefinitionAttachment==null)return null;
        byte[] iconBytes = (byte[]) configDefinitionAttachment.getData();
        return new String(iconBytes);
    }

    /**
     * 保存某个图表的ICON
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartDifinetionIcons", method = POST, consumes = MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public Map<String, Object>  createChartIcon(@RequestParam("typeId") Integer typeId,
                                                @RequestParam("chartIcon") MultipartFile chartIcon) throws Exception {
        ConfigDefinitionPage configDefinitionPage=new ConfigDefinitionPage();
        configDefinitionPage.setCode(typeId+"");
        ConfigDefinition configDefinition=configDefinitionService.queryBySingle(configDefinitionPage);
        ConfigDefinitionAttachment configDefinitionAttachment=new ConfigDefinitionAttachment();
        configDefinitionAttachment.setConfigDefinitionId(configDefinition.getId());
        configDefinitionAttachment.setName(chartIcon.getOriginalFilename());
        configDefinitionAttachment.setData(chartIcon.getBytes());

        ConfigDefinitionAttachmentPage configDefinitionAttachmentPage=new ConfigDefinitionAttachmentPage();
        configDefinitionAttachmentPage.setConfigDefinitionId(configDefinition.getId());
        ConfigDefinitionAttachment old = configDefinitionAttachmentService.queryBySingle(configDefinitionAttachmentPage);
        int count;
        if(old==null){
            count=configDefinitionAttachmentService.insert(configDefinitionAttachment);
        }else {
            configDefinitionAttachment.setId(old.getId());
            count=configDefinitionAttachmentService.updateByPrimaryKey(configDefinitionAttachment);
        }
        if(count>0){
            return Msg.getSuccessMessage("保存成功");
        }else{
            return Msg.getSuccessMessage("保存失败");
        }
    }

    /**
     * 保存某个图表或者图表分类的ICON
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/chartcons", method = POST, consumes = MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public Map<String, Object>  createChartCateGroupIcon(@RequestParam("parentId") Integer parentId,
                                                @RequestParam("iconType") Integer iconType,
                                                @RequestParam("chartIcon") MultipartFile chartIcon) throws Exception {

        ConfigDefinitionAttachment configDefinitionAttachment=new ConfigDefinitionAttachment();
        configDefinitionAttachment.setConfigDefinitionId(parentId);
        configDefinitionAttachment.setType(iconType);
        configDefinitionAttachment.setName(chartIcon.getOriginalFilename());
        configDefinitionAttachment.setData(chartIcon.getBytes());

        ConfigDefinitionAttachmentPage configDefinitionAttachmentPage=new ConfigDefinitionAttachmentPage();
        configDefinitionAttachmentPage.setConfigDefinitionId(parentId);
        ConfigDefinitionAttachment old = configDefinitionAttachmentService.queryBySingle(configDefinitionAttachmentPage);
        int count;
        if(old==null){
            count=configDefinitionAttachmentService.insert(configDefinitionAttachment);
        }else {
            configDefinitionAttachment.setId(old.getId());
            count=configDefinitionAttachmentService.updateByPrimaryKey(configDefinitionAttachment);
        }
        if(count>0){
            return Msg.getSuccessMessage("保存成功");
        }else{
            return Msg.getSuccessMessage("保存失败");
        }
    }

    @RequestMapping(value = "/configDefinitionAttachments", method = GET)
    @ResponseBody
    public List<ConfigDefinitionAttachment> query(ConfigDefinitionAttachmentPage page) throws Exception {
        page.setOrderBy(ConfigDefinitionAttachment.fieldToColumn(page.getOrderBy()));
        return configDefinitionAttachmentService.queryByList(page);
    }

    @RequestMapping(value = "/configDefinitionAttachments/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(ConfigDefinitionAttachmentPage page) throws Exception {
        page.setOrderBy(ConfigDefinitionAttachment.fieldToColumn(page.getOrderBy()));
        List<ConfigDefinitionAttachment> rows = configDefinitionAttachmentService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/configDefinitionAttachments/{id}", method = GET)
    @ResponseBody
    public ConfigDefinitionAttachment find(@PathVariable Integer id) throws Exception {
        return configDefinitionAttachmentService.selectByPrimaryKey(id);
    }

    @RequestMapping(value = "/configDefinitionAttachments", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ConfigDefinitionAttachment create(@RequestBody ConfigDefinitionAttachment configDefinitionAttachment) throws Exception {
        configDefinitionAttachmentService.insert(configDefinitionAttachment);
        return configDefinitionAttachment;
    }



    @RequestMapping(value = "/configDefinitionAttachments", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public void update(@RequestBody ConfigDefinitionAttachment configDefinitionAttachment) throws Exception {
        configDefinitionAttachmentService.updateByPrimaryKeySelective(configDefinitionAttachment);
    }

    @RequestMapping(value = "/configDefinitionAttachments/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        configDefinitionAttachmentService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_CONFIG_DEFINITION_ATTACHMENT where id = {}", id);
    }

}
