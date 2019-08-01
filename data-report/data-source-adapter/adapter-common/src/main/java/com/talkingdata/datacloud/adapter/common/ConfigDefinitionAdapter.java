package com.talkingdata.datacloud.adapter.common;

/**
 * Created by yangruobin on 2017/5/4.
 */
public abstract class ConfigDefinitionAdapter extends AbstractAdapter{
//    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionAdapter.class);
//    //渲染面板中table的Code约定值
//    protected static final String tableCode="tableName";
//    //渲染面板中Fields的Code约定值
//    protected static final Map<String,String>fieldsMap=new HashMap<>();
//    //渲染面板中日期范围的字段值
//    protected static final DateBean dateBean=new DateBean("date","create_dt");
//
//    static {
//        fieldsMap.put(DIMENSIONCODE,"varchar");
//        fieldsMap.put(MEASURE,"int");
//    }
//
//    public static class DateBean{
//        private String key;
//        private String value;
//        public DateBean(String key,String value){
//            this.key=key;
//            this.value=value;
//        }
//
//        public String getKey() {
//            return key;
//        }
//
//        public String getValue() {
//            return value;
//        }
//    }
//
//    private DriverManagerDataSource getConfigDefinitionDBConn(){
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        File file=new File(this.getClass().getResource("/").getPath()+"jdbc.properties");
//        logger.info(file.getAbsolutePath());
//        Map jdbcMap=LoadPropertiesUtil.loadProperties(this.getClass().getResource("/").getPath()+"jdbc.properties");
//        dataSource.setDriverClassName((String) jdbcMap.get("jdbc_driverClassName"));
//        dataSource.setUrl((String) jdbcMap.get("jdbc_url_visual"));
//        dataSource.setUsername((String) jdbcMap.get("jdbc_username_visual"));
//        dataSource.setPassword((String) jdbcMap.get("jdbc_password_visual"));
//        return dataSource;
//    }
//
//    /**
//     * 获取Definition
//     *
//     * @param
//     * @return
//     */
//    @Override
//    public ConfigDefinition getConfigDefinition(Integer id) {
//        return getConfigDefinition(id,null);
//    }
//
//    private ConfigDefinition getConfigDefinition(Integer id,Map<String, String> defaultValueMap) {
//        DriverManagerDataSource dataSource = getConfigDefinitionDBConn();
//        JdbcTemplate jdbcTemplate;
//        try {
//            jdbcTemplate = new JdbcTemplate();
//            jdbcTemplate.setDataSource(dataSource);
//
//
//            String sql = "SELECT id,name FROM TD_DC_CONFIG_DEFINITION WHERE id="+id;
//            List<Map<String, Object>> res = jdbcTemplate.queryForList(sql);
//            if(res.size()==0)return null;
//            Map map=res.get(0);
//            ConfigDefinition configDefinition=new ConfigDefinition();
//            configDefinition.setId(((Long)map.get("id")).intValue());
//            configDefinition.setName((String) map.get("name"));
//            configDefinition.setConfigDefinitionFieldList(queryFieldByConfigDefinitionId(jdbcTemplate,configDefinition.getId(),null,defaultValueMap));
//            return configDefinition;
//        } catch (Exception e) {
//            logger.error("queryForList exception:",e);
//        } finally {
//            try {
//                if (dataSource != null) {
//                    dataSource.getConnection().close();
//                }
//            } catch (Exception e) {
//                logger.error("close queryForList dataSource exception:", e);
//            }
//        }
//        return null;
//    }
//
//    //通过configDefinitionId和parentId递归查询configDefinitionField
//    private List<ConfigDefinitionField> queryFieldByConfigDefinitionId(JdbcTemplate jdbcTemplate,Integer configDefinitionId, Integer parentId, Map<String, String> defaultValueMap){
//        String columnList="id,parent_id,field_group_name,field_group_enable,field_tab_lock,field_tab_name,name,code,value_type," +
//                "default_value,option_values,requried,min_value,max_value,verify_rule,verify_group_name,verify_group_rule,help_info,view_type,icon_class," +
//                "view_meta_data";
//        List<ConfigDefinitionField> configDefinitionFieldList;
//        if(parentId==null) {
//            String fieldSql = "SELECT " + columnList + " FROM TD_DC_CONFIG_DEFINITION_FIELD WHERE config_definition_id=" + configDefinitionId + " AND parent_id is null";
//            List<Map<String, Object>> fieldRes = jdbcTemplate.queryForList(fieldSql);
//            configDefinitionFieldList=buildConfigDefinitionFieldList(fieldRes,defaultValueMap);
//            for(ConfigDefinitionField configDefinitionField:configDefinitionFieldList){
//                List<ConfigDefinitionField> childConfigDefinitionFieldList=queryFieldByConfigDefinitionId(jdbcTemplate,configDefinitionId,configDefinitionField.getId(),defaultValueMap);
//                configDefinitionField.setChildFieldList(childConfigDefinitionFieldList);
//            }
//        }else{
//            String fieldSql = "SELECT " + columnList + " FROM TD_DC_CONFIG_DEFINITION_FIELD WHERE config_definition_id=" + configDefinitionId + " AND parent_id = "+parentId;
//            List<Map<String, Object>> fieldRes = jdbcTemplate.queryForList(fieldSql);
//            configDefinitionFieldList=buildConfigDefinitionFieldList(fieldRes,defaultValueMap);
//            for(ConfigDefinitionField configDefinitionField:configDefinitionFieldList){
//                List<ConfigDefinitionField> childConfigDefinitionFieldList=queryFieldByConfigDefinitionId(jdbcTemplate,configDefinitionId,configDefinitionField.getId(),defaultValueMap);
//                configDefinitionField.setChildFieldList(childConfigDefinitionFieldList);
//            }
//        }
//        return configDefinitionFieldList;
//    }
//    private List<ConfigDefinitionField> buildConfigDefinitionFieldList(List<Map<String, Object>> fieldRes,Map<String, String> defaultValueMap){
//        List<ConfigDefinitionField> configDefinitionFieldList=new ArrayList<>();
//        for(Map fieldMap:fieldRes){
//            configDefinitionFieldList.add(buildConfigDefinitionField(fieldMap,defaultValueMap));
//        }
//        return configDefinitionFieldList;
//    }
//    private ConfigDefinitionField buildConfigDefinitionField(Map<String, Object> fieldMap,Map<String, String> defaultValueMap){
//        ConfigDefinitionField configDefinitionField=new ConfigDefinitionField();
//        configDefinitionField.setId(((Long)fieldMap.get("id")).intValue());
//        configDefinitionField.setParentId(fieldMap.get("parent_id")==null?null:((Long)fieldMap.get("parent_id")).intValue());
//        configDefinitionField.setFieldTabName((String)fieldMap.get("field_tab_name"));
////            configDefinitionField.setFieldTabLock((fieldMap.get("field_tab_lock")==null?null:(Long)fieldMap.get("field_tab_lock")).intValue());
//        configDefinitionField.setFieldGroupName((String)fieldMap.get("field_group_name"));
//        configDefinitionField.setFieldGroupEnable(fieldMap.get("field_group_enable")==null?null:((Long)fieldMap.get("field_group_enable")).intValue());
//        configDefinitionField.setName((String)fieldMap.get("name"));
//        configDefinitionField.setCode((String)fieldMap.get("code"));
//        configDefinitionField.setValueType(fieldMap.get("value_type")==null?null:((Long)fieldMap.get("value_type")).intValue());
//        configDefinitionField.setDefaultValue((String)fieldMap.get("default_value"));
//        configDefinitionField.setRequried((fieldMap.get("requried")==null?null:(Long)fieldMap.get("requried")).intValue());
//        configDefinitionField.setMinValue((String)fieldMap.get("min_value"));
//        configDefinitionField.setMaxValue((String)fieldMap.get("max_value"));
//        configDefinitionField.setVerifyRule((String)fieldMap.get("verify_rule"));
//        configDefinitionField.setVerifyGroupName((String)fieldMap.get("verify_group_name"));
//        configDefinitionField.setVerifyGroupRule((String)fieldMap.get("verify_group_rule"));
//        configDefinitionField.setHelpInfo((String)fieldMap.get("help_info"));
//        configDefinitionField.setViewType(fieldMap.get("view_type")==null?null:((Long)fieldMap.get("view_type")).intValue());
//        configDefinitionField.setIconClass((String)fieldMap.get("icon_class"));
//        configDefinitionField.setViewMetaData((String)fieldMap.get("view_meta_data"));
//        if(defaultValueMap!=null&&defaultValueMap.containsKey(configDefinitionField.getCode())){
//            String optionValues=defaultValueMap.get(configDefinitionField.getCode());
//            String defaultValue;
//            if(configDefinitionField.getCode().equals(dateBean.getKey())){
//                defaultValue=optionValues;
//            }else {
//                defaultValue =optionValues.split(",")[0];
//            }
//            configDefinitionField.setDefaultValue(defaultValue);
//            configDefinitionField.setOptionValues(optionValues);
//        }
//        return configDefinitionField;
//    }
//
//    /**
//     * 获取数据源带有默认值的Defintion
//     *
//     * @param
//     * @return
//     */
//    @Override
//    public ConfigDefinition getConfigDefinitionWithDefaultValue(List<OperatorParameter> parameters){
//        Map<String, String> defaultValueMap=getDefaultDataSourceMetadata(parameters);
//        String id= ParamterTools.getStringParameter("id", parameters);
//        return getConfigDefinition(Integer.parseInt(id),defaultValueMap);
//    }
//
//    @Override
//    public List<String> getOptionItemDictionary(List<OperatorParameter> parameters, String key) {
//        switch (key){
//            case "sourceList": return viewSourceList(parameters);
//            case "fieldList": return viewFieldList(parameters);
//            default: return new ArrayList<>();
//        }
//    }
//
//    @Override
//    public Object findData(QueryParameter queryParameter) {
//        return null;
//    }
}
