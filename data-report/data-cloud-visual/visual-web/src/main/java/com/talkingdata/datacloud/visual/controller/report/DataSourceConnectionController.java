package com.talkingdata.datacloud.visual.controller.report;

import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.Adapter;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import com.talkingdata.datacloud.visual.page.report.DataSourceConnectionPage;
import com.talkingdata.datacloud.visual.service.report.AdapterService;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionService;
import com.talkingdata.datacloud.visual.service.report.DataSourceConnectionService;
import com.talkingdata.datacloud.visual.service.report.PrivilegeService;
import com.talkingdata.datacloud.visual.util.AdapterHelper;
import com.talkingdata.datacloud.visual.util.DataSourceHelper;
import com.talkingdata.datacloud.visual.util.Msg;
import com.talkingdata.datacloud.visual.vo.DataSourceConnectionVo;
import com.tendcloud.enterprise.um.umic.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping("/report")
public class DataSourceConnectionController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConnectionController.class);

    @Autowired
    private DataSourceConnectionService dataSourceConnectionService;
    @Autowired
    private AdapterService adapterService;
    @Autowired
    private ConfigDefinitionService configDefinitionService;
    @Autowired
    private PrivilegeService privilegeService;

    @RequestMapping(value = "/dataSourceConnections", method = GET)
    @ResponseBody
    public List<DataSourceConnection> query(DataSourceConnectionPage page) throws Exception {
        page.setOrderBy(DataSourceConnection.fieldToColumn(page.getOrderBy()));
        return dataSourceConnectionService.queryByList(page);
    }

    @RequestMapping(value = "/dataSourceConnections/rows", method = GET)
    @ResponseBody
    public Map<String, Object> queryRows(DataSourceConnectionPage page) throws Exception {
        page.setOrderBy(DataSourceConnection.fieldToColumn(page.getOrderBy()));
        List<DataSourceConnection> rows = dataSourceConnectionService.queryByList(page);
        return getGridData(page.getPager().getRowCount(), rows);
    }

    @RequestMapping(value = "/dataSourceConnections/{id}", method = GET)
    @ResponseBody
    public DataSourceConnection find(@PathVariable Integer id) throws Exception {
        return dataSourceConnectionService.selectByPrimaryKey(id);
    }

    /**
     * 测试数据源连接信息
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/test", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> testConnection(@RequestBody DataSourceConnection dataSourceConnection) throws Exception {
        if(checkParameters(dataSourceConnection)){
            IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSourceConnection);
            if(adapter.testConnection(dataSourceConnection.getParams())){
                return Msg.getSuccessMessage("连接成功");
            }
            return Msg.getFailureMessage("连接失败");
        }
        return Msg.getFailureMessage("参数配置失败");
    }

    /**
     * 创建数据源连接信息
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections", method = POST, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> create(HttpServletRequest request, @RequestBody DataSourceConnection dataSourceConnection) throws Exception {
        String checkResult=checkDataSourceConnectionName(dataSourceConnection);
        if(checkResult!=null){
            return Msg.getFailureMessage(checkResult);
        }
        User user = privilegeService.getUserByRequest(request);
        if(checkParameters(dataSourceConnection)){
            dataSourceConnection.setCreator(user.getName());
            dataSourceConnection.setCreateBy(user.getUmid());
            dataSourceConnection.setUpdater(user.getName());
            dataSourceConnection.setUpdateBy(user.getUmid());
            dataSourceConnectionService.insert(dataSourceConnection);
            return Msg.getSuccessData(dataSourceConnection.getId());
        }
        return Msg.getFailureMessage("保存失败");
    }

    /***/
    private boolean checkParameters(DataSourceConnection dataSourceConnection) throws Exception {
        //初始化数据源参数
        Adapter adapter=adapterService.selectByPrimaryKey(dataSourceConnection.getAdapterId());
        //获取数据源配置渲染面板参数
        ConfigDefinition configDefinition= configDefinitionService.queryById(adapter.getConfigDefinitionId());

        return AdapterHelper.checkParameters(dataSourceConnection.getParams(),configDefinition.getConfigDefinitionFieldList());
    }

    private String checkDataSourceConnectionName(DataSourceConnection dataSourceConnection)throws Exception{
        String checkResult=null;
        if(dataSourceConnection.getName()==null||"".equals(dataSourceConnection.getName())){
            checkResult = "数据源连接信息名称不能为空";
        }else if(dataSourceConnection.getName().length()>255){
            checkResult = "数据源连接信息名称不能超过225个字符";
        }else if(dataSourceConnection.getName().matches(".*[\\\\/:\\*\\?<>|].*")){
            checkResult = "数据源连接信息名称不能包含特殊字符（\\/:*?<>|）";
        }else if(isDuplicationName(dataSourceConnection)){
            checkResult = "存在名称为'"+dataSourceConnection.getName()+"'的数据源连接信息，请修改数据源连接信息名称";
        }
        return checkResult;
    }


    private boolean isDuplicationName(DataSourceConnection dataSourceConnection)throws Exception{
        DataSourceConnectionPage dataSourceConnectionPage=new DataSourceConnectionPage();
        dataSourceConnectionPage.setName(dataSourceConnection.getName());
        if(dataSourceConnection.getId()!=null){
            dataSourceConnectionPage.setId(dataSourceConnection.getId());
            dataSourceConnectionPage.setIdOperator("<>");
        }
        int i=dataSourceConnectionService.queryByCount(dataSourceConnectionPage);
        return i>=1;
    }

    /**
     * 获取表名
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/{id}/tables", method = GET)
    @ResponseBody
    public Map<String, Object> findSourceList(@PathVariable Integer id) throws Exception {
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(id);
        //获取adapter
        IDataSourceAdapter adapterDataSource = DataSourceHelper.findAdapterByAdapterId(dataSourceConnection.getAdapterId());
        boolean result=adapterDataSource.testConnection(dataSourceConnection.getParams());
        if(!result){
            return Msg.getFailureMessage("数据源配置无法连接数据源");
        }
        //通过Adapter获取字典值
        List<String> sources=adapterDataSource.viewSourceList(dataSourceConnection.getParams());

        return Msg.getSuccessData(sources);
    }

    /**
     * 获取视图
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/{id}/views", method = GET)
    @ResponseBody
    public Map<String, Object> findViewList(@PathVariable Integer id) throws Exception {
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(id);
        //获取adapter
        IDataSourceAdapter adapterDataSource = DataSourceHelper.findAdapterByAdapterId(dataSourceConnection.getAdapterId());
        boolean result=adapterDataSource.testConnection(dataSourceConnection.getParams());
        if(!result){
            return Msg.getFailureMessage("数据源配置无法连接数据源");
        }
        //通过Adapter获取字典值
        List<String> sources=adapterDataSource.getViewList(dataSourceConnection.getParams());

        return Msg.getSuccessData(sources);
    }

    /**
     * 获取查询语句
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/querySql", method = POST)
    @ResponseBody
    public Map<String,Object> getQuerySql(@RequestBody DataSourceConnectionVo dataSourceConnectionVo) throws Exception {
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(dataSourceConnectionVo.getId());
        //获取adapter
        IDataSourceAdapter adapterDataSource = DataSourceHelper.findAdapterByAdapterId(dataSourceConnection.getAdapterId());
        //通过Adapter获取查询语句
        String querySql = adapterDataSource.getQuerySql(dataSourceConnection.getParams(),dataSourceConnectionVo.getTableName());
        return Msg.getSuccessData(querySql);
    }

    /**
     * 校验sql语句语法
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/validateSql", method = POST)
    @ResponseBody
    public Map<String, Object> validateSQL(@RequestBody DataSourceConnectionVo dataSourceConnectionVo) throws Exception {
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(dataSourceConnectionVo.getId());
        //获取adapter
        IDataSourceAdapter adapterDataSource = DataSourceHelper.findAdapterByAdapterId(dataSourceConnection.getAdapterId());
        DataPreviewPage dataPreviewPage=new DataPreviewPage();
        dataPreviewPage.setDataSourceConnectionInfo(dataSourceConnection.getParams());
        dataPreviewPage.setQuerySql(dataSourceConnectionVo.getQuerySql());
        dataPreviewPage.setPageSize(1);
        //通过Adapter获取查询语句
        return adapterDataSource.viewDataSourceDataList(dataPreviewPage);
    }

    @RequestMapping(value = "/dataSourceConnections", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> update(HttpServletRequest request, @RequestBody DataSourceConnection dataSourceConnection) throws Exception {
        String checkResult=checkDataSourceConnectionName(dataSourceConnection);
        if(checkResult!=null){
            return Msg.getFailureMessage(checkResult);
        }
        User user = privilegeService.getUserByRequest(request);
        if(checkParameters(dataSourceConnection)){
            dataSourceConnection.setUpdater(user.getName());
            dataSourceConnection.setUpdateBy(user.getUmid());
            int success=dataSourceConnectionService.updateByPrimaryKeySelective(dataSourceConnection);
            if(success==1){
                return Msg.getSuccessMessage("修改成功");
            }
        }
        return Msg.getFailureMessage("修改失败");

    }

    /**
     * 获取预览数据
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/previewData", method = POST)
    @ResponseBody
    public Map<String, Object> findPreviewDataList(@RequestBody DataPreviewPage dataPreviewPage) throws Exception {
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(dataPreviewPage.getId());
        //获取adapter
        IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSourceConnection);
        dataPreviewPage.setDataSourceConnectionInfo(dataSourceConnection.getParams());
        //通过Adapter获取预览数据
        return adapter.viewDataSourceDataList(dataPreviewPage);
    }

    /**
     * 获取预览数据
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/dataSourceConnections/previewMetaData", method = POST)
    @ResponseBody
    public List<Map<String, Object>> findPreviewMetaDataList(@RequestBody DataSourceConnectionVo dataSourceConnectionVo) throws Exception {
        DataSourceConnection dataSourceConnection=dataSourceConnectionService.selectByPrimaryKey(dataSourceConnectionVo.getId());
        //获取adapter
        IDataSourceAdapter adapter = DataSourceHelper.findAdapter(dataSourceConnection);
        //通过Adapter获取预览数据
        return adapter.viewMetadataPropertiesList(dataSourceConnection.getParams(),dataSourceConnectionVo.getQuerySql());
    }

    @RequestMapping(value = "/dataSourceConnections/{id}", method = DELETE)
    @ResponseBody
    public void delete(@PathVariable Integer id) throws Exception {
        dataSourceConnectionService.deleteByPrimaryKey(id);
        logger.info("delete from TD_DC_VISUAL_DATA_SOURCE_INFO where id = {}", id);
    }

}
