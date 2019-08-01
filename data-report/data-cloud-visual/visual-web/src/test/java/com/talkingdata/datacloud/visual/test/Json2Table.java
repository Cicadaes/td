package com.talkingdata.datacloud.visual.test;

import com.talkingdata.datacloud.visual.dao.report.AdapterAttachmentDao;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionDao;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionFieldDao;
import com.talkingdata.datacloud.visual.entity.report.AdapterAttachment;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import com.talkingdata.datacloud.visual.service.report.ConfigDefinitionService;
import com.talkingdata.datacloud.visual.util.DataSourceHelper;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import com.talkingdata.datacloud.visual.vo.DataSourceDefinition;
import com.talkingdata.datacloud.visual.vo.StyleDefinition;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.*;

/**
 * Created by Administrator on 2017/4/5 0005.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mybatis.xml","classpath:conf/spring/applicationContext.xml"})
public class Json2Table {
    @Autowired
    private ConfigDefinitionService configDefinitionService;
    @Autowired
    private ConfigDefinitionDao configDefinitionDao;
    @Autowired
    private ConfigDefinitionFieldDao configDefinitionFieldDao;
    @Autowired
    private AdapterAttachmentDao adapterAttachmentDao;

    @Test
    public void updateBuilder() throws Exception {

        String adapterPath;
        String builderName;
        String jsonStr;
        int i=2;
        switch(i)
        {
            case 1:
                adapterPath="kylin-datasource-adapter";
                builderName="kylinAdapter";
                jsonStr = readContent("/Users/yangruobin/ideagit/data-report/data-source-adapter/"+adapterPath+"/src/main/resources/adapter-definition.json");
                break;
            case 2:
                adapterPath="query-engine-datasource-adapter";
                builderName="queryEngineAdapter";
                jsonStr = readContent("/Users/yangruobin/ideagit/data-report/data-source-adapter/"+adapterPath+"/src/main/resources/adapter-definition.json");
                break;
            case 3:
                adapterPath="query-engine-datasource-adapter";
                builderName="queryEngineAdapter";
                jsonStr = readContent("/Users/yangruobin/ideagit/data-report/data-source-adapter/"+adapterPath+"/src/main/resources/adapter-definition.json");
                break;
            default:
                adapterPath="mysql-datasource-adapter";
                builderName="mysqlAdapter";
                jsonStr = readContent("/Users/yangruobin/ideagit/data-report/data-source-adapter/"+adapterPath+"/src/main/resources/adapter-definition.json");
                break;
        }

        ConfigDefinition oldConfigDefinition =configDefinitionDao.selectByConfigDefinitionName(builderName);
        DataSourceDefinition dataSourceDefinition = JSONUtils.readValueToBean(jsonStr, DataSourceDefinition.class);
        ConfigDefinition configDefinition = DataSourceHelper.dataSourceDefinition2ConfigDefinition(dataSourceDefinition);
//        System.out.println(dataSourceDefinition.getId());
        configDefinition.setName(builderName);
        configDefinition.setCreator("开发测试");
        configDefinition.setCreateBy("a");
        if (oldConfigDefinition == null) {
            configDefinitionService.insertDefinition(configDefinition);
        }else {
            configDefinition.setId(oldConfigDefinition.getId());
            configDefinitionService.updateDefinition(configDefinition);
        }
    }


    @Test
    public void updateJar() throws Exception {
        File file;
        Integer adapterId;
        String adapterName;
        Integer adapterAttachmentId;
        int i=3;
        switch(i) {
            case 1:
                file =new File("/Users/yangruobin/ideagit/data-report/data-source-adapter/kylin-datasource-adapter/target/kylin-datasource-adapter-0.0.1-SNAPSHOT.jar");
                adapterId=20;
                adapterName="kylin-datasource-adapter-0.0.1-SNAPSHOT.jar";
                adapterAttachmentId=28;
                break;
            case 2:
                file =new File("/Users/yangruobin/ideagit/data-report/data-source-adapter/query-engine-datasource-adapter/target/query-engine-datasource-adapter-0.0.1-SNAPSHOT.jar");
                adapterId=21;
                adapterName="query-engine-datasource-adapter-0.0.1-SNAPSHOT.jar";
                adapterAttachmentId=29;
            case 3:
//                file =new File("/Users/yangruobin/ideagit/data-report/data-source-adapter/bestseller-datasource-adapter/target/bestseller-datasource-adapter-0.0.1-SNAPSHOT.jar");
                file =new File("D:/idea_wks/data-report/data-source-adapter/bestseller-datasource-adapter/target/bestseller-datasource-adapter-0.0.1-SNAPSHOT.jar");
                adapterId=22;
                adapterName="bestseller-datasource-adapter-0.0.1-SNAPSHOT.jar";
                adapterAttachmentId=30;
                break;
            case 4:
                file =new File("/Users/yangruobin/ideagit/data-report/data-source-adapter/bestseller-user-datasource-adapter/target/bestseller-user-datasource-adapter-0.0.1-SNAPSHOT.jar");
                adapterId=23;
                adapterName="bestseller-user-datasource-adapter-0.0.1-SNAPSHOT.jar";
                adapterAttachmentId=31;
                break;
            default:
                file =new File("/Users/yangruobin/ideagit/data-report/data-source-adapter/mysql-datasource-adapter/target/mysql-datasource-adapter-0.0.1-SNAPSHOT.jar");
                adapterId=19;
                adapterName="mysql-datasource-adapter-0.0.1-SNAPSHOT.jar";
                adapterAttachmentId=27;
        }
//

        FileInputStream inputStream=new FileInputStream(file);
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte [] buffer = new byte[3];
        int len = 0;
        while( (len = inputStream.read(buffer)) != -1){
            outStream.write(buffer, 0, len);
        }
        byte [] data = outStream.toByteArray();

        AdapterAttachment adapterAttachment=new AdapterAttachment();
        adapterAttachment.setId(adapterAttachmentId);
        adapterAttachment.setAdapterId(adapterId);
        adapterAttachment.setName(adapterName);
        adapterAttachment.setType(1);
        adapterAttachment.setData(data);
        adapterAttachmentDao.updateByPrimaryKey(adapterAttachment);

    }

    @Test
    public void styleJson2Table() throws Exception {
//        String[]jsonArr={"饼图","地图","线图","条图","柱图","面积图","概览","矩形","圆形","文字","时间","表格","图片"};
//        String[]jsonArr={"下拉框过滤器","横向多段条图","四象限图","带下拉框时序图","组合概览","销售树概览"};
        String[]jsonArr={"下拉框过滤器"};
        for(String txtName:jsonArr) {
            ConfigDefinition oldConfigDefinition = configDefinitionDao.selectByConfigDefinitionName(txtName);

            String jsonStr = readContent("/Users/yangruobin/ideagit/data-report/data-cloud-visual/visual-web/src/test/resources/" + txtName + ".json");
            StyleDefinition styleDefinition = JSONUtils.readValueToBean(jsonStr, StyleDefinition.class);
            ConfigDefinition configDefinition = DataSourceHelper.styleDefinition2ConfigDefinition(styleDefinition);
            configDefinition.setCreator("开发测试");
            configDefinition.setCreateBy("a");
            if (oldConfigDefinition == null) {
                configDefinitionService.insertDefinition(configDefinition);
            }else {
                configDefinition.setId(oldConfigDefinition.getId());
                configDefinitionService.updateDefinition(configDefinition);
            }
        }
    }


    public static String readContent(String fileName) {
        StringBuffer buffer = new StringBuffer();
        try {
            BufferedReader reader = new BufferedReader(new java.io.FileReader(fileName));
            String line = null;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        } catch (IOException ioexception) {
            throw new IllegalStateException(ioexception);
        }
        return buffer.toString();
    }

}
