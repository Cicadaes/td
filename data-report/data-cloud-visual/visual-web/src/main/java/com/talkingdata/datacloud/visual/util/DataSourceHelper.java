package com.talkingdata.datacloud.visual.util;

import com.talkingdata.datacloud.ApplicationContextManager;
import com.talkingdata.datacloud.adapter.common.AbstractAdapter;
import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.visual.entity.report.*;
import com.talkingdata.datacloud.visual.service.report.AdapterService;
import com.talkingdata.datacloud.visual.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangruobin on 2017/4/28.
 */
public class DataSourceHelper {
    private static final Logger logger = LoggerFactory.getLogger(DataSourceHelper.class);
    private static AdapterService adapterService = null;
    static {
        try{
            adapterService=ApplicationContextManager.getBean(AdapterService.class);
        }catch (Exception e){
            logger.error("DataSourceHelper初始化adapterService错误",e);
        }
    }

    public static IDataSourceAdapter findAdapter(DataSourceConnection dataSourceConnection) throws Exception {
        return findAdapterByAdapterId(dataSourceConnection.getAdapterId());
    }

    public static IDataSourceAdapter findAdapterByAdapterId(Integer adapterId) throws Exception {
        Adapter adapter = adapterService.selectAdapterAndAttachment(adapterId);
        IDataSourceAdapter adapterDataSource = getNewObject(adapter);
        return adapterDataSource;
    }
    public static IDataSourceAdapter getNewObject(Adapter adapter) throws Exception{
        String className = adapter.getImplClass();
        IDataSourceAdapter adapterDataSource;
        try {
            adapterDataSource= (IDataSourceAdapter)Class.forName(className).newInstance();
        }catch (ClassNotFoundException e){
            logger.info("第一次未找到"+className+"，正在加载");
            AdapterAttachment adapterAttachment=adapter.getMainAttachment();
            File file=new File(adapterAttachment.getName());
            FileOutputStream fileOutputStream=new FileOutputStream(file);
            fileOutputStream.write((byte[]) adapterAttachment.getData());
            fileOutputStream.flush();
            fileOutputStream.close();
//        IDataSourceAdapter adapterDataSource = (IDataSourceAdapter) DataCloudJarClassLoader.loadClass(file, className).newInstance();
            loadJarFile(file);
            adapterDataSource = (AbstractAdapter)Class.forName(className).newInstance();
        }
        DataSourceProxy dataSourceProxy=new DataSourceProxy(adapterDataSource);
        return dataSourceProxy;
//        URL url = new URL("file:"+"/Users/yangruobin/ideagit/data-report/" +
//                "data-source-adapter/mysql-datasource-adapter/target/" +
//                "mysql-datasource-adapter-0.0.1-SNAPSHOT.jar");
//        URLClassLoader myClassLoader = new URLClassLoader(new URL[] { url }, Thread.currentThread()
//                .getContextClassLoader());
//        Class<?> clazz = myClassLoader.loadClass(className);
//        IDataSourceAdapter adapter=(IDataSourceAdapter)clazz.newInstance();
//        System.out.print("加载后"+adapter.getDataSourceMetadata().toString());
//        URLClassLoader myClassLoader1 = new URLClassLoader(new URL[] { url}, Thread.currentThread()
//                .getContextClassLoader());
//        ClassLoaderUtil.releaseLoader(myClassLoader1);
//
//        clazz = myClassLoader1.loadClass(className);
//        IDataSourceAdapter adapter1=(IDataSourceAdapter)clazz.newInstance();
//        return  (IDataSourceAdapter) clazz.newInstance();
    }
    public static final void loadJarFile(File file) {
        try {
            Method addURL = URLClassLoader.class
                    .getDeclaredMethod("addURL", new Class[] { URL.class });
            URLClassLoader system = (URLClassLoader) DataSourceHelper.class.getClassLoader();
            addURL.setAccessible(true);
            addURL.invoke(system, new Object[] { file.toURI().toURL() });
            logger.info("加载JAR包：" + file.getAbsolutePath());
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }


    public static DataSourceDefinition configDefinition2DataSourceDefinition(ConfigDefinition configDefinition) throws Exception{
        DataSourceDefinition dataSourceDefinition = new DataSourceDefinition();
        dataSourceDefinition.setId(configDefinition.getId());
        dataSourceDefinition.setName(configDefinition.getName());
        dataSourceDefinition.setDataSourceView(configDefinitionFiledList2View(configDefinition.getConfigDefinitionFieldList()));
        return dataSourceDefinition;
    }

    public static ConfigDefinition dataSourceDefinition2ConfigDefinition(DataSourceDefinition dataSourceDefinition) throws Exception{
        ConfigDefinition configDefinition = new ConfigDefinition();
        configDefinition.setId(dataSourceDefinition.getId());
        configDefinition.setName(dataSourceDefinition.getName());
        configDefinition.setType(dataSourceDefinition.getType());
        configDefinition.setConfigDefinitionFieldList(view2ConfigDefinitionFiledList(dataSourceDefinition.getDataSourceView()));
        return configDefinition;
    }


    public static ConfigDefinition styleDefinition2ConfigDefinition(StyleDefinition styleDefinition)throws Exception{
        ConfigDefinition configDefinition=new ConfigDefinition();
        configDefinition.setId(styleDefinition.getId());
        configDefinition.setName(styleDefinition.getName());
        configDefinition.setDescription(styleDefinition.getDescription());
        configDefinition.setCode(styleDefinition.getType()+"");
        configDefinition.setGroupId(styleDefinition.getGroupId());
        configDefinition.setOrderNum(styleDefinition.getOrderNum());
        configDefinition.setConfigDefinitionFieldList(view2ConfigDefinitionFiledList(styleDefinition.getView()));
        configDefinition.setType(2);
        return configDefinition;
    }

    public static DataSourceDefinition dbDataSource2DataSourceDefinition(ConfigDefinition configDefinition) throws Exception{
        DataSourceDefinition dataSourceDefinition = configDefinition2DataSourceDefinition(configDefinition);
        dataSourceDefinition.setId(configDefinition.getId());
        dataSourceDefinition.setName(configDefinition.getName());
        return dataSourceDefinition;
    }


    //从后端表转换为前端JSON格式，其中考虑到FieldTab>FieldGroup>Field的层次关系
    public static View configDefinitionFiledList2View(List<ConfigDefinitionField> configDefinitionFieldList) throws Exception{
        Map<String, FieldTabExtend> fieldTabExtendHashMap = new HashMap<String, FieldTabExtend>();
        for (ConfigDefinitionField configDefinitionField : configDefinitionFieldList) {
            FieldTabExtend fieldTabExtend = null;
            String fieldTabKey = configDefinitionField.getFieldTabName() == null ? "" : configDefinitionField.getFieldTabName();

            if (fieldTabExtendHashMap.containsKey(fieldTabKey)) {
                fieldTabExtend = fieldTabExtendHashMap.get(fieldTabKey);
            } else {
                fieldTabExtend = new FieldTabExtend();
                fieldTabExtendHashMap.put(fieldTabKey, fieldTabExtend);
                fieldTabExtend.getFieldTab().setName(configDefinitionField.getFieldTabName());

            }
            String fieldGroupKey = configDefinitionField.getFieldGroupName() == null ? "" : configDefinitionField.getFieldGroupName();
            FieldGroup fieldGroup = null;
            if (fieldTabExtend.getFieldGroupMap().containsKey(fieldGroupKey)) {
                fieldGroup = fieldTabExtend.getFieldGroupMap().get(fieldGroupKey);
            } else {
                fieldGroup = new FieldGroup();
                fieldGroup.setName(configDefinitionField.getFieldGroupName());
                fieldTabExtend.putFieldGroupMap(fieldGroupKey, fieldGroup);
            }

            fieldGroup.getFields().add(configDefinitionFiled2Field(configDefinitionField));
        }
        List<FieldTab> fieldTabList = new ArrayList<FieldTab>();
        for (FieldTabExtend tabExtend : fieldTabExtendHashMap.values()) {
            fieldTabList.add(tabExtend.getFieldTab());
        }
        View view = new View();
        view.setFieldTabs(fieldTabList);
        return view;
    }


    static class FieldTabExtend {
        private FieldTab fieldTab = new FieldTab();

        public FieldTab getFieldTab() {
            return fieldTab;
        }

        public void setFieldTab(FieldTab fieldTab) {
            this.fieldTab = fieldTab;
        }

        private Map<String, FieldGroup> fieldGroupMap = new HashMap<String, FieldGroup>();

        public Map<String, FieldGroup> getFieldGroupMap() {
            return fieldGroupMap;
        }

        public void putFieldGroupMap(String fieldGroupName, FieldGroup fieldGroup) {
            getFieldGroupMap().put(fieldGroupName, fieldGroup);
            fieldTab.getFieldGroups().add(fieldGroup);
        }
    }

    public static List<ConfigDefinitionField> view2ConfigDefinitionFiledList(View view) throws Exception{
        List<ConfigDefinitionField> configDefinitionFieldList = new ArrayList<>();

        List<FieldTab> fieldTabList = view.getFieldTabs();
        for (FieldTab fieldTab : fieldTabList) {
            List<FieldGroup> fieldGroupList = fieldTab.getFieldGroups();
            for (FieldGroup fieldGroup : fieldGroupList) {
                List<Field> fieldList = fieldGroup.getFields();
                for (Field field : fieldList) {
                    ConfigDefinitionField configDefinitionField = field2ConfigDefinitionFiled(field,fieldGroup.getName(),fieldTab.getName());
                    configDefinitionFieldList.add(configDefinitionField);
                }
            }
        }
        return configDefinitionFieldList;
    }

    public static Field configDefinitionFiled2Field(ConfigDefinitionField configDefinitionField) throws Exception{
        Field field = new Field();
        Object defaultValue=conversionObjectByValueType(configDefinitionField.getDefaultValue(),configDefinitionField.getValueType());
        Object optionValue = conversionString2Json(configDefinitionField.getOptionValues());

        field.setId(configDefinitionField.getId());
        field.setName(configDefinitionField.getName());
        field.setFieldAliasName(configDefinitionField.getFieldAliasName());
        field.setCode(configDefinitionField.getCode());
        field.setValue(defaultValue);
        field.setValueType(configDefinitionField.getValueType());
        field.setMultipleMaxNumber(configDefinitionField.getMultipleMaxNumber());
        field.setDefaultValue(defaultValue);
        field.setOptionValues(optionValue);
        field.setRequried(configDefinitionField.getRequried());
        field.setMaxValue(configDefinitionField.getMaxValue());
        field.setMinValue(configDefinitionField.getMinValue());
        field.setVerifyRule(configDefinitionField.getVerifyRule());
        field.setViewType(configDefinitionField.getViewType());
        field.setDescription(configDefinitionField.getDescription());
        field.setViewMetaData(JSONUtils.readValueToMap(configDefinitionField.getViewMetaData()));
        field.setIconClass(configDefinitionField.getIconClass());
        for (ConfigDefinitionField childField : configDefinitionField.getChildFieldList()) {
            field.getChildrenFields().add(configDefinitionFiled2Field(childField));
        }
        return field;
    }

    public static ConfigDefinitionField field2ConfigDefinitionFiled(Field field,String fieldGroupName,String fieldTabName) throws Exception{
        ConfigDefinitionField configDefinitionField = new ConfigDefinitionField();
        configDefinitionField.setId(field.getId());
        configDefinitionField.setName(field.getName());
        configDefinitionField.setFieldAliasName(field.getFieldAliasName());
        configDefinitionField.setCode(field.getCode());
        configDefinitionField.setValueType(field.getValueType());
        configDefinitionField.setMultipleMaxNumber(field.getMultipleMaxNumber());
        configDefinitionField.setDefaultValue(conversionStringByValueType(field.getDefaultValue(),field.getValueType()));
        configDefinitionField.setOptionValues(conversionList(field.getOptionValues()));
        configDefinitionField.setRequried(field.getRequried());
        configDefinitionField.setMaxValue(field.getMaxValue());
        configDefinitionField.setMinValue(field.getMinValue());
        configDefinitionField.setVerifyRule(field.getVerifyRule());
        configDefinitionField.setViewType(field.getViewType());
        configDefinitionField.setDescription(field.getDescription());
        configDefinitionField.setIconClass(field.getIconClass());
        configDefinitionField.setFieldGroupName(fieldGroupName);
        configDefinitionField.setFieldTabName(fieldTabName);
        configDefinitionField.setViewMetaData(JSONUtils.writeValueAsString(field.getViewMetaData()));
        for(Field childField:field.getChildrenFields()){
            configDefinitionField.getChildFieldList().add(field2ConfigDefinitionFiled(childField,fieldGroupName,fieldTabName));
        }
        return configDefinitionField;
    }

    private static String conversionList(Object value)throws Exception{
        if(value==null||"".equals(value)){
            return null;
        }
        if(value instanceof String){
            return (String) value;
        }
        return JSONUtils.writeValueAsString(value);
    }



    private static Object conversionString2Json(String value)throws Exception{
        Object conversionValue;
        if(value==null||"".equals(value)){
            return null;
        }
        conversionValue=JSONUtils.readValueToBean(value,List.class);
        return conversionValue;
    }

    private static String conversionStringByValueType(Object value,Integer type)throws Exception{
        String conversionValue=null;
        if(value==null||"".equals(value)){
            return conversionValue;
        }
        switch (type){
            case 1:
                conversionValue=(String)value;
                break;
            case 6:
                conversionValue=JSONUtils.writeValueAsString(value);
                break;
            case 8:
                conversionValue=JSONUtils.writeValueAsString(value);
                break;
            case 9:
                conversionValue=Boolean.toString((Boolean)value);
                break;
            default:
                conversionValue=(String)value;
        }
        return conversionValue;
    }


    private static Object conversionObjectByValueType(String value,Integer type)throws Exception{
        Object conversionValue=null;
        if(value==null||"".equals(value)){
            return conversionValue;
        }
        switch (type){
            case 1:
                conversionValue=value;
                break;
            case 6:
                conversionValue=JSONUtils.readValueToBean(value,List.class);
                break;
            case 8:
                conversionValue=JSONUtils.readValueToMap(value);
                break;
            case 9:
                conversionValue=Boolean.valueOf(value);
                break;
            default:
                conversionValue=value;
        }
        return conversionValue;
    }

    public static StyleDefinition configDefinition2StyleDefinition(ConfigDefinition configDefinition) throws Exception{
        StyleDefinition styleDefinition=new StyleDefinition();
        styleDefinition.setId(configDefinition.getId());
        styleDefinition.setName(configDefinition.getName());
        styleDefinition.setDescription(configDefinition.getDescription());
        styleDefinition.setType(Integer.parseInt(configDefinition.getCode()));
        styleDefinition.setIconPath("/report/chartIcons/");
        styleDefinition.setGroupId(configDefinition.getGroupId());
        styleDefinition.setView(configDefinitionFiledList2View(configDefinition.getConfigDefinitionFieldList()));
        return styleDefinition;
    }

    public static List<StyleDefinition> configDefinitionList2StyleDefinitionList(List<ConfigDefinition> configDefinitionList) throws Exception{
        List<StyleDefinition> styleDefinitionList=new ArrayList<StyleDefinition>();
        for(ConfigDefinition configDefinition:configDefinitionList){
            styleDefinitionList.add(configDefinition2StyleDefinition(configDefinition));
        }
        return styleDefinitionList;
    }

//    public static List<com.talkingdata.datacloud.visual.vo.DataSource> buildVoDataSource(List<DataSource> dataSourceList) throws Exception {
//        List<com.talkingdata.datacloud.visual.vo.DataSource> voDataSourceList=new ArrayList<>();
//        StringBuilder allDataSourceSb=new StringBuilder();
//        for (DataSource dataSource : dataSourceList) {
//            voDataSourceList.add(buildVoDataSource(dataSource));
//            allDataSourceSb.append("{\"id\":"+dataSource.getId()+",\"name\":\""+dataSource.getName()+"\"},");
//        }
//
//
//        //拼装dataSource下拉列表中的值
//        String optionValues="["+allDataSourceSb.toString().substring(0,allDataSourceSb.toString().length()-1)+"]";
//        for(com.talkingdata.datacloud.visual.vo.DataSource voDataSource:voDataSourceList){
//            for(FieldTab fieldTab:voDataSource.getDataSourceDefinition().getDataSourceView().getFieldTabs()){
//                for(FieldGroup fieldGroup:fieldTab.getFieldGroups()){
//                    for(Field field:fieldGroup.getFields()){
//                        if(field.getCode().equals(DefinitionCodeType.DATASOURCE_CODE)){
//                            field.setDefaultValue("[{\"id\":"+voDataSource.getDataSourceId()+",\"name\":\""+voDataSource.getDataSourceName()+"\"}]");
//                            field.setValue("[{\"id\":"+voDataSource.getDataSourceId()+",\"name\":\""+voDataSource.getDataSourceName()+"\"}]");
//                            field.setOptionValues(optionValues);
//                        }
//                    }
//                }
//            }
//        }
//        return voDataSourceList;
//    }

//    public static com.talkingdata.datacloud.visual.vo.DataSource buildVoDataSource(DataSource dataSource) throws Exception {
//        com.talkingdata.datacloud.visual.vo.DataSource voDataSource=new com.talkingdata.datacloud.visual.vo.DataSource();
//        voDataSource.setDataSourceId(dataSource.getId());
//        voDataSource.setDataSourceName(dataSource.getName());
//        voDataSource.setDataSourceDefinition(dbDataSource2DataSourceDefinition(dataSource.getConfigDefinition()));
//        return voDataSource;
//    }

//    public static List<DataSource> buildDataSource(List<DataSource> dataSourceList) throws Exception {
//        for (DataSource dataSource : dataSourceList) {
//            buildDataSource(dataSource);
//        }
//        return dataSourceList;
//    }

//    public static DataSource buildDataSource(DataSource dataSource) throws Exception {
//        ConfigDefinition configDefinition = buildDataSourceConfigDefinition(dataSource);
//        dataSource.setConfigDefinition(configDefinition);
//        return dataSource;
//    }

//    public static ConfigDefinition buildDataSourceConfigDefinition(DataSource dataSource) throws Exception {
//        List<OperatorParameter> operatorParameters = getParameters(dataSource);
//        //获取adapter
//        IDataSourceAdapter adapter = findAdapter(dataSource);
//        return buildConfigDefinitionByAdapterConfigDefinition(adapter.getConfigDefinitionWithDefaultValue(operatorParameters));
//    }


//    private static List<OperatorParameter> getParameters(DataSource dataSource) throws Exception {
//        //初始化数据源参数
//        String params = dataSource.getParams();
//        JSONObject jsonObject = JSONObject.parseObject(params);
//        Object[] keySet = jsonObject.keySet().toArray();
//        List<OperatorParameter> operatorParameters = new ArrayList<>();
//        for (int i = 0; i < keySet.length; i++) {
//            OperatorParameter operatorParameter = new OperatorParameter();
//            operatorParameter.setCode(keySet[i].toString());
//            operatorParameter.setName(keySet[i].toString());
//            operatorParameter.setValue(jsonObject.getString(keySet[i].toString()));
//            operatorParameters.add(operatorParameter);
//        }
//
//        OperatorParameter operatorParameter = new OperatorParameter();
//        operatorParameter.setCode("id");
//        operatorParameter.setName(dataSource.getConfigDefinitionId()+"");
//        operatorParameter.setValue(dataSource.getConfigDefinitionId()+"");
//        operatorParameters.add(operatorParameter);
//
//        return operatorParameters;
//    }

//    public static List<DataSourceDefinition> configDefinitionList2DataSourceDefinitionList(List<ConfigDefinition> configDefinitionList) {
//        List<DataSourceDefinition> dataSourceDefinitionList = new ArrayList<DataSourceDefinition>();
//        for (ConfigDefinition configDefinition : configDefinitionList) {
//            dataSourceDefinitionList.add(configDefinition2DataSourceDefinition(configDefinition));
//        }
//        return dataSourceDefinitionList;
//    }


//
//    public static ConfigDefinition buildConfigDefinitionByAdapterConfigDefinition(
//            com.talkingdata.datacloud.adapter.entity.ConfigDefinition adapterConfigDefinition) {
//        ConfigDefinition configDefinition = new ConfigDefinition();
//        configDefinition.setId(adapterConfigDefinition.getId());
//        configDefinition.setName(adapterConfigDefinition.getName());
//        configDefinition.setCode(adapterConfigDefinition.getCode());
//        configDefinition.setVersion(adapterConfigDefinition.getVersion());
//        configDefinition.setType(adapterConfigDefinition.getType());
//        configDefinition.setStatus(adapterConfigDefinition.getStatus());
//        configDefinition.setDiagramName(adapterConfigDefinition.getDiagramName());
//        configDefinition.setDeveloper(adapterConfigDefinition.getDeveloper());
//        configDefinition.setImplClass(adapterConfigDefinition.getImplClass());
//        configDefinition.setDescription(adapterConfigDefinition.getDescription());
//        configDefinition.setTenantId(adapterConfigDefinition.getTenantId());
//        configDefinition.setCreator(adapterConfigDefinition.getCreator());
//        configDefinition.setCreateBy(adapterConfigDefinition.getCreateBy());
//        configDefinition.setCreateTime(adapterConfigDefinition.getCreateTime());
//        configDefinition.setUpdater(adapterConfigDefinition.getUpdater());
//        configDefinition.setUpdateBy(adapterConfigDefinition.getUpdateBy());
//        configDefinition.setUpdateTime(adapterConfigDefinition.getUpdateTime());
//        configDefinition.setConfigDefinitionFieldList(buildConfigDefinitionFieldList(adapterConfigDefinition.getConfigDefinitionFieldList()));
//        return configDefinition;
//    }

//    public static DataSourceDefinition buildDataSourceDefinitionByAdapterConfigDefinition(
//            com.talkingdata.datacloud.adapter.entity.ConfigDefinition adapterConfigDefinition) {
//        ConfigDefinition configDefinition=buildConfigDefinitionByAdapterConfigDefinition(adapterConfigDefinition);
//        return dbDataSource2DataSourceDefinition(configDefinition);
//    }

//    private static List<ConfigDefinitionField> buildConfigDefinitionFieldList(
//            List<com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField> adapterConfigDefinitionFieldList) {
//        List<ConfigDefinitionField> configDefinitionFieldList = new ArrayList<>();
//        for (com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField adapterConfigDefinitionField : adapterConfigDefinitionFieldList) {
//            configDefinitionFieldList.add(buildConfigDefinitionFieldByAdapterConfigDefinitionField(adapterConfigDefinitionField));
//        }
//        return configDefinitionFieldList;
//    }
//
//    public static ConfigDefinitionField buildConfigDefinitionFieldByAdapterConfigDefinitionField(
//            com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField adapterCnfigDefinitionField) {
//        ConfigDefinitionField configDefinitionField = new ConfigDefinitionField();
//        configDefinitionField.setId(adapterCnfigDefinitionField.getId());
//        configDefinitionField.setConfigDefinitionId(adapterCnfigDefinitionField.getConfigDefinitionId());
//        configDefinitionField.setParentId(adapterCnfigDefinitionField.getParentId());
//        configDefinitionField.setFieldGroupName(adapterCnfigDefinitionField.getFieldGroupName());
//        configDefinitionField.setFieldGroupEnable(adapterCnfigDefinitionField.getFieldGroupEnable());
//        configDefinitionField.setFieldTabLock(adapterCnfigDefinitionField.getFieldTabLock());
//        configDefinitionField.setFieldTabName(adapterCnfigDefinitionField.getFieldTabName());
//        configDefinitionField.setName(adapterCnfigDefinitionField.getName());
//        configDefinitionField.setCode(adapterCnfigDefinitionField.getCode());
//        configDefinitionField.setValueType(adapterCnfigDefinitionField.getValueType());
//        configDefinitionField.setDefaultValue(adapterCnfigDefinitionField.getDefaultValue());
//        configDefinitionField.setOptionValues(adapterCnfigDefinitionField.getOptionValues());
//        configDefinitionField.setRequried(adapterCnfigDefinitionField.getRequried());
//        configDefinitionField.setMinValue(adapterCnfigDefinitionField.getMinValue());
//        configDefinitionField.setMaxValue(adapterCnfigDefinitionField.getMaxValue());
//        configDefinitionField.setVerifyRule(adapterCnfigDefinitionField.getVerifyRule());
//        configDefinitionField.setVerifyGroupName(adapterCnfigDefinitionField.getVerifyGroupName());
//        configDefinitionField.setVerifyGroupRule(adapterCnfigDefinitionField.getVerifyGroupRule());
//        configDefinitionField.setHelpInfo(adapterCnfigDefinitionField.getHelpInfo());
//        configDefinitionField.setViewType(adapterCnfigDefinitionField.getViewType());
//        configDefinitionField.setIconClass(adapterCnfigDefinitionField.getIconClass());
//        configDefinitionField.setDescription(adapterCnfigDefinitionField.getDescription());
//        configDefinitionField.setTenantId(adapterCnfigDefinitionField.getTenantId());
//        configDefinitionField.setCreator(adapterCnfigDefinitionField.getCreator());
//        configDefinitionField.setCreateBy(adapterCnfigDefinitionField.getCreateBy());
//        configDefinitionField.setCreateTime(adapterCnfigDefinitionField.getCreateTime());
//        configDefinitionField.setUpdateBy(adapterCnfigDefinitionField.getUpdateBy());
//        configDefinitionField.setUpdater(adapterCnfigDefinitionField.getUpdater());
//        configDefinitionField.setUpdateTime(adapterCnfigDefinitionField.getUpdateTime());
//        configDefinitionField.setViewMetaData(adapterCnfigDefinitionField.getViewMetaData());
//        configDefinitionField.setChildFieldList(buildConfigDefinitionFieldList(adapterCnfigDefinitionField.getChildFieldList()));
//        return configDefinitionField;
//
//    }

//    public static com.talkingdata.datacloud.adapter.entity.ConfigDefinition buildAdapterConfigDefinition(
//            ConfigDefinition adapterConfigDefinition) {
//        com.talkingdata.datacloud.adapter.entity.ConfigDefinition configDefinition = new com.talkingdata.datacloud.adapter.entity.ConfigDefinition();
//        configDefinition.setId(adapterConfigDefinition.getId());
//        configDefinition.setName(adapterConfigDefinition.getName());
//        configDefinition.setCode(adapterConfigDefinition.getCode());
//        configDefinition.setVersion(adapterConfigDefinition.getVersion());
//        configDefinition.setType(adapterConfigDefinition.getType());
//        configDefinition.setStatus(adapterConfigDefinition.getStatus());
//        configDefinition.setDiagramName(adapterConfigDefinition.getDiagramName());
//        configDefinition.setDeveloper(adapterConfigDefinition.getDeveloper());
//        configDefinition.setImplClass(adapterConfigDefinition.getImplClass());
//        configDefinition.setDescription(adapterConfigDefinition.getDescription());
//        configDefinition.setTenantId(adapterConfigDefinition.getTenantId());
//        configDefinition.setCreator(adapterConfigDefinition.getCreator());
//        configDefinition.setCreateBy(adapterConfigDefinition.getCreateBy());
//        configDefinition.setCreateTime(adapterConfigDefinition.getCreateTime());
//        configDefinition.setUpdater(adapterConfigDefinition.getUpdater());
//        configDefinition.setUpdateBy(adapterConfigDefinition.getUpdateBy());
//        configDefinition.setUpdateTime(adapterConfigDefinition.getUpdateTime());
//        configDefinition.setConfigDefinitionFieldList(buildAdapterConfigDefinitionFieldList(adapterConfigDefinition.getConfigDefinitionFieldList()));
//        return configDefinition;
//    }
//
//    public static List<com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField> buildAdapterConfigDefinitionFieldList(
//            List<ConfigDefinitionField> configDefinitionFieldList) {
//        List<com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField> adapterCnfigDefinitionFieldList = new ArrayList<>();
//        for (ConfigDefinitionField configDefinitionField : configDefinitionFieldList) {
//            adapterCnfigDefinitionFieldList.add(buildAdapterConfigDefinitionField(configDefinitionField));
//        }
//        return adapterCnfigDefinitionFieldList;
//    }

//    public static com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField buildAdapterConfigDefinitionField(ConfigDefinitionField configDefinitionField) {
//        com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField adapterCnfigDefinitionField = new com.talkingdata.datacloud.adapter.entity.ConfigDefinitionField();
//        adapterCnfigDefinitionField.setId(configDefinitionField.getId());
//        adapterCnfigDefinitionField.setConfigDefinitionId(configDefinitionField.getConfigDefinitionId());
//        adapterCnfigDefinitionField.setParentId(configDefinitionField.getParentId());
//        adapterCnfigDefinitionField.setFieldGroupName(configDefinitionField.getFieldGroupName());
//        adapterCnfigDefinitionField.setFieldGroupEnable(configDefinitionField.getFieldGroupEnable());
//        adapterCnfigDefinitionField.setFieldTabLock(configDefinitionField.getFieldTabLock());
//        adapterCnfigDefinitionField.setFieldTabName(configDefinitionField.getFieldTabName());
//        adapterCnfigDefinitionField.setName(configDefinitionField.getName());
//        adapterCnfigDefinitionField.setCode(configDefinitionField.getCode());
//        adapterCnfigDefinitionField.setValueType(configDefinitionField.getValueType());
//        adapterCnfigDefinitionField.setDefaultValue(configDefinitionField.getDefaultValue());
//        adapterCnfigDefinitionField.setOptionValues(configDefinitionField.getOptionValues());
//        adapterCnfigDefinitionField.setRequried(configDefinitionField.getRequried());
//        adapterCnfigDefinitionField.setMinValue(configDefinitionField.getMinValue());
//        adapterCnfigDefinitionField.setMaxValue(configDefinitionField.getMaxValue());
//        adapterCnfigDefinitionField.setVerifyRule(configDefinitionField.getVerifyRule());
//        adapterCnfigDefinitionField.setVerifyGroupName(configDefinitionField.getVerifyGroupName());
//        adapterCnfigDefinitionField.setVerifyGroupRule(configDefinitionField.getVerifyGroupRule());
//        adapterCnfigDefinitionField.setHelpInfo(configDefinitionField.getHelpInfo());
//        adapterCnfigDefinitionField.setViewType(configDefinitionField.getViewType());
//        adapterCnfigDefinitionField.setIconClass(configDefinitionField.getIconClass());
//        adapterCnfigDefinitionField.setDescription(configDefinitionField.getDescription());
//        adapterCnfigDefinitionField.setTenantId(configDefinitionField.getTenantId());
//        adapterCnfigDefinitionField.setCreator(configDefinitionField.getCreator());
//        adapterCnfigDefinitionField.setCreateBy(configDefinitionField.getCreateBy());
//        adapterCnfigDefinitionField.setCreateTime(configDefinitionField.getCreateTime());
//        adapterCnfigDefinitionField.setUpdateBy(configDefinitionField.getUpdateBy());
//        adapterCnfigDefinitionField.setUpdater(configDefinitionField.getUpdater());
//        adapterCnfigDefinitionField.setUpdateTime(configDefinitionField.getUpdateTime());
//        adapterCnfigDefinitionField.setViewMetaData(configDefinitionField.getViewMetaData());
//        return adapterCnfigDefinitionField;
//
//    }

//    public static List<DataSourceDefinition> dbDataSourceList2DataSourceDefinitionList(List<DataSource> dataSourceList) {
//        List<DataSourceDefinition> dataSourceDefinitionList = new ArrayList<DataSourceDefinition>();
//        for (DataSource dataSource : dataSourceList) {
//            dataSourceDefinitionList.add(dbDataSource2DataSourceDefinition(dataSource.getConfigDefinition()));
//        }
//        return dataSourceDefinitionList;
//    }


//    public static DataSourceDefinition adapterDefinition2DataSourceDefinition(com.talkingdata.datacloud.visual.entity.report.ConfigDefinition configDefinition){
//        DataSourceDefinition dataSourceDefinition=new DataSourceDefinition();
//        BasicInfo dataSourceBasicInfo =new BasicInfo();
//        dataSourceDefinition.setDataSourceBasicInfo(dataSourceBasicInfo);
//        DataSourceConnectionVo dataSourceImpl=new DataSourceConnectionVo();
//        dataSourceDefinition.setDataSourceImpl(dataSourceImpl);
//        dataSourceDefinition.setId(configDefinition.getId());
//        dataSourceBasicInfo.setName(configDefinition.getName());
//        dataSourceBasicInfo.setCode(configDefinition.getCode());
//        dataSourceBasicInfo.setVersion(configDefinition.getVersion());
//        dataSourceDefinition.setType(configDefinition.getType());
//        dataSourceBasicInfo.setDeveloper(configDefinition.getDeveloper());
//        dataSourceImpl.setImplClass(configDefinition.getImplClass());
//        dataSourceBasicInfo.setDescription(configDefinition.getDescription());
//
//        dataSourceDefinition.setDataSourceView(View.adapterDefinitionFiledList2View(configDefinition.getConfigDefinitionFields()));
//        return dataSourceDefinition;
//    }

//    public static List<ConfigDefinition> styleDefinitionList2ConfigDefinitionList(List<StyleDefinition> styleDefinitionList){
//        List<ConfigDefinition> configDefinitionList=new ArrayList<>();
//        for(StyleDefinition styleDefinition:styleDefinitionList){
//            configDefinitionList.add(styleDefinition2ConfigDefinition(styleDefinition));
//        }
//        return configDefinitionList;
//    }



}
