package com.talkingdata.datacloud.visual.util;

import com.talkingdata.datacloud.visual.entity.report.Adapter;
import com.talkingdata.datacloud.visual.entity.report.AdapterAttachment;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionField;
import com.talkingdata.datacloud.visual.vo.DataSourceDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Created by yangruobin on 2017/5/4.
 */
public class AdapterHelper {
    private static final Logger logger = LoggerFactory.getLogger(AdapterHelper.class);
    public static Adapter buildAdapter(String adapterName, MultipartFile mainJar, MultipartFile[] dependencyJars)throws Exception {
        Adapter adapter=new Adapter();
        adapter.setName(adapterName);
        //增加adapter的渲染面板
        String adapterJson=JarFileUtils.readContent(mainJar,"adapter-definition.json");
        DataSourceDefinition dataSourceDefinition = JSONUtils.readValueToBean(adapterJson, DataSourceDefinition.class);
        ConfigDefinition configDefinition=DataSourceHelper.dataSourceDefinition2ConfigDefinition(dataSourceDefinition);
        adapter.setConfigDefinition(configDefinition);
        //添加adapter的jar包和依赖jar包
        AdapterAttachment adapterAttachment=buildAdapterAttachment(mainJar,1);
        for(MultipartFile dependencyJar:dependencyJars){
            adapterAttachment.getDependencyAttachmentList().add(buildAdapterAttachment(dependencyJar,2));
        }
        adapter.setMainAttachment(adapterAttachment);
        //添加adapter实现类
        String implementationClass=JarFileUtils.getManfestAttributes(mainJar,"implementation-class");

        adapter.setImplClass(implementationClass);
        return adapter;
    }

    public static AdapterAttachment buildAdapterAttachment(MultipartFile jarFile,Integer type)throws Exception{
        AdapterAttachment adapterAttachment=new AdapterAttachment();
        adapterAttachment.setName(jarFile.getOriginalFilename());
        adapterAttachment.setData(jarFile.getBytes());
        adapterAttachment.setType(type);
        adapterAttachment.setSize(jarFile.getSize()+"");
        return adapterAttachment;
    }


    /**
     * 检验dataSource的params是否与configDefinitionField对应
     * @param
     * @return
     * @throws Exception
     */
    public static boolean checkParameters(String dataSource, List<ConfigDefinitionField> configDefinitionFieldList){
        boolean result=false;
        if(configDefinitionFieldList.size()==0){
            logger.error("数据源渲染面板控件个数为0");
            return result;
        }
        if(dataSource==null||"".equals(dataSource)){
            logger.error("数据源连接配置不能为空");
            return result;
        }
        try{
            Map<String,Object> dataSourceMap= JSONUtils.readValueToMap(dataSource);
            for(String key:dataSourceMap.keySet()){
                boolean matching=false;
                for(ConfigDefinitionField configDefinitionField:configDefinitionFieldList){
                    if(key.equals(configDefinitionField.getCode())){
                        matching=true;
                        innerValidParamter(dataSourceMap.get(key),configDefinitionField);
                        break;
                    }
                }
                if(!matching){
                    return result;
                }
            }
            result = true;
        }catch (Exception e){
            logger.error("数据源校验失败",e);
        }
        return result;

    }


    protected static ValidateResult innerValidParamter(Object objectValue, ConfigDefinitionField configDefinitionField) {
        //参数不存在则只需要判断是否为必填
        if (objectValue == null) {
            if (configDefinitionField.getRequried()==1) {
                return ValidateResult.failed(configDefinitionField.getName(),"该参数不存在于值列表");
            }
        } else {
            if(configDefinitionField.getRequried()==1) {

                //处理空字符串
                if (objectValue instanceof String) {
                    String value = (String) objectValue;
                    if ("".equals(value.trim())) {
                        return ValidateResult.failed(configDefinitionField.getName(),"不能为空");
                    }
                }
                if(objectValue instanceof List){
                    List value = (List) objectValue;
                    if (value.size()==0) {
                        return ValidateResult.failed(configDefinitionField.getName(),"不能为空");
                    }
                }
            }
            if (!inEnumValues(configDefinitionField, objectValue)) {
                return ValidateResult.failed(configDefinitionField.getName() , "需要在可选值范围内");
            }
        }
        return ValidateResult.success();
    }

    protected static boolean inEnumValues(ConfigDefinitionField configDefinitionField, Object objectValue) {
        if (isEmpty(configDefinitionField.getOptionValues())) {
            return true;
        }
        if (objectValue != null) {
            return Arrays.asList(configDefinitionField.getOptionValues().split(",")).contains(objectValue);
        }
        return false;
    }

    protected static boolean isEmpty(String str) {
        return str == null || str.length() == 0 || str.equals("null");
    }
}
