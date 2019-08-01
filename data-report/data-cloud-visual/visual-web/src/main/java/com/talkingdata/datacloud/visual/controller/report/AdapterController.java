package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.Adapter;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.page.report.AdapterPage;
import com.talkingdata.datacloud.visual.service.report.AdapterService;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionService;
import com.talkingdata.datacloud.visual.util.*;
import com.talkingdata.datacloud.visual.vo.DataSourceDefinition;
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
public class AdapterController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(AdapterController.class);

    @Autowired
    private AdapterService adapterService;
    @Autowired
    private ConfigDefinitionService configDefinitionService;

    /**
     * 获取数据源类型
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceTypes", method = GET)
    @ResponseBody
    public List<Adapter> queryDataSourceConnector() throws Exception {
        AdapterPage adapterPage=new AdapterPage();
        adapterPage.setPageSize(100);
        List<Adapter> adapterList= adapterService.queryByList(adapterPage);

        return adapterList;
    }

    /**
     * 增加数据源类型
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/adapters", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Adapter create(@RequestBody Adapter adapter) throws Exception {
        if(!checkAdapter(adapter)){
            return null;
        }
        int count=adapterService.insert(adapter);
        if(count==0){
            return null;
        }
        return adapter;
    }

    /**
     * 增加数据源类型JAR包
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/adapterJars", method = POST, consumes = MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public Map<String, Object> createAdapterJars(@RequestParam("adapterName") String adapterName,
                                     @RequestParam("mainJar") MultipartFile mainJar,
                                     @RequestParam("dependencyJars") MultipartFile[] dependencyJars) throws Exception {
        Adapter adapter=AdapterHelper.buildAdapter(adapterName,mainJar,dependencyJars);

        String builderJson= JarFileUtils.readContent(mainJar,"builder-definition.json");
        DataSourceDefinition dataSourceDefinition = JSONUtils.readValueToBean(builderJson, DataSourceDefinition.class);
        ConfigDefinition dataSourceConfigDefinition= DataSourceHelper.dataSourceDefinition2ConfigDefinition(dataSourceDefinition);
        boolean result=false;
        if(checkAdapter(adapter)){
            result=adapterService.saveAdapterAndDataSourceConfigDefinition(adapter,dataSourceConfigDefinition);
        }

        if(result){
            return Msg.getSuccessMessage("保存成功");
        }else{
            return Msg.getSuccessMessage("保存失败");
        }
    }

    @RequestMapping(value = "/adapters", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> update(@RequestBody Adapter adapter) throws Exception {
        if(!checkAdapter(adapter)){
            return Msg.getFailureMessage("校验失败导致更新失败");
        }
        int count=adapterService.updateByPrimaryKeySelective(adapter);
        if(count==0)return Msg.getFailureMessage("更新失败");
        return Msg.getFailureMessage("更新成功");
    }

    @RequestMapping(value = "/adapters/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        adapterService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_ADAPTER where id = {}", id);
    }
    //校验数据源类型参数是否合法
    private boolean checkAdapter(Adapter adapter) throws Exception{
        //configDefinitionId和implClass不能为空
        if(adapter.getImplClass()==null){

            return false;
        }
//        //判断configDefinitionId是否在TD_DC_CONFIG_DEFINITION中存在，不存在则错误
//        ConfigDefinitionPage configDefinitionPage=new ConfigDefinitionPage();
//        configDefinitionPage.setId(adapter.getConfigDefinitionId());
//        int count=configDefinitionService.queryByCount(configDefinitionPage);
//        if(count!=1){
//            return false;
//        }
        //判断是否有implClass中的实现类是否存在
//        try {
//            Class implClass = Class.forName(adapter.getImplClass());
//        } catch (ClassNotFoundException e) {
//            logger.error("此类"+adapter.getImplClass()+"不存在");
//            return false;
//        }
        return true;
    }

    @RequestMapping(value = "/adapters", method = GET)
    @ResponseBody
    public List<Adapter> query(AdapterPage page) throws Exception {
        page.setOrderBy(Adapter.fieldToColumn(page.getOrderBy()));
        return adapterService.queryByList(page);
    }

    /**
     * 获取数据源类型列表页信息(分页)
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/adapters/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(AdapterPage page) throws Exception {
        page.setOrderBy(Adapter.fieldToColumn(page.getOrderBy()));
        List<Adapter> rows = adapterService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }
    /**
     * 获取数据源类型配置渲染信息
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/adapters/{id}", method = GET)
    @ResponseBody
    public DataSourceDefinition find(@PathVariable Integer id) throws Exception {
        ConfigDefinition configDefinition=configDefinitionService.queryByAdapterId(id);
        return DataSourceHelper.dbDataSource2DataSourceDefinition(configDefinition);
    }

}
