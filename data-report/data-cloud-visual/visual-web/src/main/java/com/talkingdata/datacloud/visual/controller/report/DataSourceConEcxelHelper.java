package com.talkingdata.datacloud.visual.controller.report;

import com.google.gson.*;
import com.talkingdata.datacloud.adapter.common.IDataSourceAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.adapter.entity.Filter;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import com.talkingdata.datacloud.base.web.BaseController;
import com.talkingdata.datacloud.visual.entity.report.DataSource;
import com.talkingdata.datacloud.visual.entity.report.DataSourceConnection;
import com.talkingdata.datacloud.visual.entity.report.DataSourceMetadata;
import com.talkingdata.datacloud.visual.entity.report.Report;
import com.talkingdata.datacloud.visual.page.report.DataSourceMetadataPage;
import com.talkingdata.datacloud.visual.page.report.DataSourcePage;
import com.talkingdata.datacloud.visual.service.report.DataSourceConnectionService;
import com.talkingdata.datacloud.visual.service.report.DataSourceService;
import com.talkingdata.datacloud.visual.service.report.PrivilegeService;
import com.talkingdata.datacloud.visual.util.DataSourceHelper;
import com.talkingdata.datacloud.visual.util.ExcelUtils;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import com.talkingdata.datacloud.visual.util.Msg;
import com.talkingdata.datacloud.visual.util.excel.ExcelUtil;
import com.talkingdata.datacloud.visual.util.excel.ExportExcelType;
import com.talkingdata.datacloud.visual.util.excel.ExportExcelUtil;
import com.talkingdata.datacloud.visual.util.excel.ExportVM;
import com.talkingdata.datacloud.visual.vo.DownloadQueryParameter;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.univocity.parsers.csv.CsvWriter;
import com.univocity.parsers.csv.CsvWriterSettings;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.*;


public class DataSourceConEcxelHelper {

    /**
     * 集团概览_运营概览_客流指标
     * @param exportFolder
     * @param uuid
     * @param source
     * @throws Exception
     */
    public static void groupOperationPassengerFlowIndicators(String exportFolder,String uuid,String source,String indicator) throws Exception {

        Map<String,String> keyMaps=new HashMap<String,String>();
        keyMaps.put("front_users".toUpperCase(),"周边客流");
        keyMaps.put("active_users".toUpperCase(),"入店客流");
        keyMaps.put("active_new_users".toUpperCase(),"入店新客");
        keyMaps.put("active_old_users".toUpperCase(),"入店老客");
        keyMaps.put("stay_users".toUpperCase(),"停留客流");
        keyMaps.put("jump_users".toUpperCase(),"跳出客流");
        keyMaps.put("ROUND(sum(active_users)/sum(front_users)*100,1)".toUpperCase(),"入店率");
        keyMaps.put("ROUND(sum(jump_users)/sum(active_users)*100,1)".toUpperCase(),"跳出率");
        keyMaps.put("ROUND(sum(stay_users)/sum(active_users)*100,1)".toUpperCase(),"停留率");
        keyMaps.put("member_count".toUpperCase(),"手机号认证数");
        keyMaps.put("potential_count".toUpperCase(),"微信认证数");
        keyMaps.put("round(sum(active_duration)/sum(active_times),1)".toUpperCase(),"入店平均停留时长");
        keyMaps.put("high_stay_users".toUpperCase(),"高活跃客流");
        keyMaps.put("middle_stay_users".toUpperCase(),"中活跃客流");
        keyMaps.put("low_stay_users".toUpperCase(),"低活跃客流");
        keyMaps.put("sleep_stay_users".toUpperCase(),"沉睡客流");

        keyMaps.put("sales_amount".toUpperCase(),"销售金额");
        keyMaps.put("vip_sales_amount".toUpperCase(),"会员销售金额");
        keyMaps.put("non_vip_sales_amount".toUpperCase(),"非会员销售金额");
        keyMaps.put("order_count".toUpperCase(),"订单数");
        keyMaps.put("vip_order_count".toUpperCase(),"会员订单数");
        keyMaps.put("non_vip_order_count".toUpperCase(),"非会员订单数");
        keyMaps.put("ROUND(sum(sales_count)/sum(order_count),1)".toUpperCase(),"IPC");
        keyMaps.put("ROUND(sum(sales_amount)/sum(order_count),1)".toUpperCase(),"VPC");
        keyMaps.put("ROUND(sum(vip_sales_amount)/sum(vip_order_count),1)".toUpperCase(),"会员VPC");
        keyMaps.put("ROUND(sum(non_vip_sales_amount)/sum(non_vip_order_count),1)".toUpperCase(),"非会员VPC");
        keyMaps.put("sales_count".toUpperCase(),"销件数");
        keyMaps.put("ROUND(sum(sales_amount)/sum(sales_count),1)".toUpperCase(),"件单价");
        keyMaps.put("ROUND(sum(order_count_gt1)/sum(order_count)*100,1)".toUpperCase(),"关联销售订单占比");
        keyMaps.put("ROUND(sum(vip_order_count_gt1)/sum(vip_order_count)*100,1)".toUpperCase(),"会员关联销售订单占比");
        keyMaps.put("ROUND(sum(non_vip_order_count_gt1)/sum(non_vip_order_count)*100,1)".toUpperCase(),"非会员关联销售订单占比");

        JsonParser parser = new JsonParser(); // 创建JSON解析器
        JsonArray arrs = (JsonArray)parser.parse(source);  //将json字符串转换成JsonElement

        List<String> keys = new ArrayList<String>();
        JsonObject onObject =arrs.get(0).getAsJsonObject();
        Set<Map.Entry<String,JsonElement>> set = onObject.entrySet();
        for(Map.Entry<String,JsonElement> tmp:set){
            if(!"brand".equals(tmp.getKey())&&!"project_name".equals(tmp.getKey())){
                keys.add(tmp.getKey());
            }
        }

        TreeSet<String> treeSet = new TreeSet<>();
        for (int i = 0; i < arrs.size()&&i<20; i++) {
            treeSet.add(arrs.get(i).getAsJsonObject().get("name").getAsString());
        }

        Resource res =  new ClassPathResource("excelTemplate/集团概览_运营概览_客流指标.xls");
        InputStream is = null;
        try {
            is = res.getInputStream();

            HSSFWorkbook wb = new HSSFWorkbook(is);
            //读取了模板内所有sheet内容
            HSSFSheet sheet = wb.getSheetAt(0);

            sheet.getRow(0).createCell(1);
            sheet.getRow(0).getCell(1).setCellValue(keyMaps.get(indicator.toUpperCase()));

            sheet.getRow(2).createCell(0);
            sheet.getRow(2).getCell(0).setCellValue("日期");

            int treeSetindex=0;
            for(String tmp:treeSet){
                treeSetindex++;
                sheet.getRow(2).createCell(treeSetindex);
                sheet.getRow(2).getCell(treeSetindex).setCellValue(tmp);
            }

            String currentDate= arrs.get(0).getAsJsonObject().get("date").getAsString();
            int tmpRowIndex=3;
            int tmpCellIndex=1;

            sheet.createRow(3);
            sheet.getRow(3).createCell(0);
            sheet.getRow(3).getCell(0).setCellValue(arrs.get(0).getAsJsonObject().get("date").getAsString());
            for (int i = 0; i < arrs.size(); i++) {
                if(currentDate.equals(arrs.get(i).getAsJsonObject().get("date").getAsString())){
                    sheet.getRow(tmpRowIndex).createCell(tmpCellIndex);
                    sheet.getRow(tmpRowIndex).getCell(tmpCellIndex).setCellValue(arrs.get(i).getAsJsonObject().get("value").getAsString());
                    tmpCellIndex++;

                }else{
                    currentDate= arrs.get(i).getAsJsonObject().get("date").getAsString();

                    tmpRowIndex++;
                    sheet.createRow(tmpRowIndex);
                    sheet.getRow(tmpRowIndex).createCell(0);
                    sheet.getRow(tmpRowIndex).getCell(0).setCellValue(arrs.get(i).getAsJsonObject().get("date").getAsString());

                    tmpCellIndex=1;
                    sheet.getRow(tmpRowIndex).createCell(tmpCellIndex);
                    sheet.getRow(tmpRowIndex).getCell(tmpCellIndex).setCellValue(arrs.get(i).getAsJsonObject().get("value").getAsString());
                    tmpCellIndex++;
                }
            }

            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }

    /**
     * 集团概览 四象限分布下载
     * @param exportFolder
     * @param uuid
     * @param source
     * @throws Exception
     */
    public static void groupFourGuadrant(String exportFolder,String uuid,String source) throws Exception {
        Map<String,String> keyMaps=new HashMap<String,String>();
        keyMaps.put("front_users".toUpperCase(),"周边客流");
        keyMaps.put("active_users".toUpperCase(),"入店客流");
        keyMaps.put("stay_users".toUpperCase(),"停留客流");
        keyMaps.put("member_count".toUpperCase(),"会员到访数");
        keyMaps.put("potential_count".toUpperCase(),"微信认证数");
        keyMaps.put("round(sum(visit_cycle)/sum(active_old_users),1)".toUpperCase(),"到访周期");

        keyMaps.put("ROUND(SUM(active_new_users)/SUM(active_users)*100,1)".toUpperCase(),"新客占比");
        keyMaps.put("ROUND(SUM(active_old_users)/SUM(active_users)*100,1)".toUpperCase(),"老客占比");
        keyMaps.put("ROUND(SUM(high_active_users)/SUM(active_users)*100,1)".toUpperCase(),"高活跃客占比");
        keyMaps.put("ROUND(SUM(middle_active_users)/SUM(active_users)*100,1)".toUpperCase(),"中活跃客占比");
        keyMaps.put("ROUND(SUM(low_active_users)/SUM(active_users)*100,1)".toUpperCase(),"低活跃客占比");
        keyMaps.put("ROUND(SUM(sleep_active_users)/SUM(active_users)*100,1)".toUpperCase(),"沉睡客占比");

        keyMaps.put("ROUND(SUM(active_duration)/SUM(active_times)*100,1)".toUpperCase(),"入店平均停留时长");
        keyMaps.put("ROUND(SUM(active_users)/SUM(front_users)*100,1)".toUpperCase(),"入店率");
        keyMaps.put("ROUND(SUM(stay_users)/SUM(active_users)*100,1)".toUpperCase(),"停留率");
        keyMaps.put("ROUND(SUM(jump_users)/SUM(active_users)*100,1)".toUpperCase(),"跳出率");

        keyMaps.put("sales_amount".toUpperCase(),"销售金额");
        keyMaps.put("order_count".toUpperCase(),"订单数");
        keyMaps.put("ROUND(SUM(sales_amount)/SUM(order_count),1)".toUpperCase(),"VPC");
        keyMaps.put("sales_count".toUpperCase(),"销件数");


        JsonParser parser = new JsonParser(); // 创建JSON解析器
        JsonArray arrs = (JsonArray)parser.parse(source);  //将json字符串转换成JsonElement

        List<String> keys = new ArrayList<String>();
        JsonObject onObject =arrs.get(0).getAsJsonObject();
        Set<Map.Entry<String,JsonElement>> set = onObject.entrySet();
        for(Map.Entry<String,JsonElement> tmp:set){
            if(!"brand".equals(tmp.getKey())&&!"project_name".equals(tmp.getKey())){
                keys.add(tmp.getKey());
            }
        }

        Resource res =  new ClassPathResource("excelTemplate/集团概览_四象限分布.xls");
        InputStream is = null;
        try {
            is = res.getInputStream();

            HSSFWorkbook wb = new HSSFWorkbook(is);
            //读取了模板内所有sheet内容
            HSSFSheet sheet = wb.getSheetAt(0);

            sheet.getRow(0).getCell(0).setCellValue("品牌");
            sheet.getRow(0).getCell(1).setCellValue("大区");
            for(int k=0;k<keys.size();k++){
                sheet.getRow(0).getCell(2+k).setCellValue(keyMaps.get(keys.get(k).toUpperCase()));
            }

            for (int i = 0; i < arrs.size(); i++) {
                sheet.createRow(1+i);
                sheet.getRow(i+1).createCell(0);
                sheet.getRow(i+1).createCell(1);
                sheet.getRow(i+1).getCell(0).setCellValue(arrs.get(i).getAsJsonObject().get("brand").getAsString());
                sheet.getRow(i+1).getCell(1).setCellValue(arrs.get(i).getAsJsonObject().get("project_name").getAsString());
                for(int k=0;k<keys.size();k++){
                    sheet.getRow(i+1).createCell(2+k);
                    sheet.getRow(i+1).getCell(2+k).setCellValue(arrs.get(i).getAsJsonObject().get(keys.get(k)).getAsString());
                }
            }

            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }

    /**
     * 集团概览 指标概览下载
     * @param exportFolder
     * @param uuid
     * @param source
     * @throws Exception
     */
    public static void groupIndicators(String exportFolder,String uuid,String source)throws Exception{
            JsonParser parser = new JsonParser(); // 创建JSON解析器
            JsonObject object = (JsonObject)parser.parse(source);  //将json字符串转换成JsonElement

            JsonObject object1 = object.get("实时入店客流").getAsJsonObject();
            JsonObject object2 = object.get("今日累计入店客流").getAsJsonObject();
            JsonObject object3 = object.get("近7日入店客流").getAsJsonObject();
            JsonObject object4 = object.get("近7日高活跃客流占比").getAsJsonObject();

            JsonArray project1 = object1.get("project").getAsJsonArray();
            JsonArray project2 = object2.get("project").getAsJsonArray();
            JsonArray project3 = object3.get("project").getAsJsonArray();
            JsonArray project4 = object4.get("project").getAsJsonArray();

            Resource res =  new ClassPathResource("excelTemplate/集团概览_指标概览.xls");
            InputStream is = null;
            try {
                is = res.getInputStream();

                HSSFWorkbook wb = new HSSFWorkbook(is);
                //读取了模板内所有sheet内容
                HSSFSheet sheet = wb.getSheetAt(0);

                // 实时入店客流
                sheet.getRow(1).getCell(0).setCellValue(object1.get("total").getAsJsonObject().get("total").getAsInt());
                sheet.getRow(1).getCell(1).setCellValue(object1.get("total").getAsJsonObject().get("time").getAsString());
                sheet.getRow(2).getCell(0).setCellValue(object1.get("before").getAsJsonObject().get("before_total").getAsInt());
                sheet.getRow(2).getCell(1).setCellValue(object1.get("before").getAsJsonObject().get("before_time").getAsString());

                // 今日累计入店客流
                sheet.getRow(1).getCell(4).setCellValue(object2.get("total").getAsJsonObject().get("total").getAsInt());
                sheet.getRow(1).getCell(5).setCellValue(object2.get("total").getAsJsonObject().get("time").getAsString());
                sheet.getRow(2).getCell(4).setCellValue(object2.get("before").getAsJsonObject().get("before_total").getAsInt());
                sheet.getRow(2).getCell(5).setCellValue(object2.get("before").getAsJsonObject().get("before_time").getAsString());

                // 近7日入店客流
                sheet.getRow(1).getCell(8).setCellValue(object3.get("total").getAsJsonObject().get("total").getAsInt());
                sheet.getRow(1).getCell(9).setCellValue(object3.get("total").getAsJsonObject().get("time").getAsString());
                sheet.getRow(2).getCell(8).setCellValue(object3.get("before").getAsJsonObject().get("before_total").getAsInt());
                sheet.getRow(2).getCell(9).setCellValue(object3.get("before").getAsJsonObject().get("before_time").getAsString());

                //近7日高活跃客流占比
                sheet.getRow(1).getCell(12).setCellValue(object4.get("total").getAsJsonObject().get("total").getAsString());
                sheet.getRow(1).getCell(13).setCellValue(object4.get("total").getAsJsonObject().get("time").getAsString());
                sheet.getRow(2).getCell(12).setCellValue(object4.get("before").getAsJsonObject().get("before_total").getAsString());
                sheet.getRow(2).getCell(13).setCellValue(object4.get("before").getAsJsonObject().get("before_time").getAsString());

                for (int i = 0; i < project1.size(); i++) {
                    sheet.getRow(i+4).getCell(0).setCellValue(project1.get(i).getAsJsonObject().get("project_name").getAsString());
                    sheet.getRow(i+4).getCell(1).setCellValue(project1.get(i).getAsJsonObject().get("project_count").getAsInt());
                    sheet.getRow(i+4).getCell(2).setCellValue(project1.get(i).getAsJsonObject().get("percentage").getAsString());

                    sheet.getRow(i+4).getCell(4).setCellValue(project2.get(i).getAsJsonObject().get("project_name").getAsString());
                    sheet.getRow(i+4).getCell(5).setCellValue(project2.get(i).getAsJsonObject().get("project_count").getAsInt());
                    sheet.getRow(i+4).getCell(6).setCellValue(project2.get(i).getAsJsonObject().get("percentage").getAsString());

                    sheet.getRow(i+4).getCell(8).setCellValue(project3.get(i).getAsJsonObject().get("project_name").getAsString());
                    sheet.getRow(i+4).getCell(9).setCellValue(project3.get(i).getAsJsonObject().get("project_count").getAsInt());
                    sheet.getRow(i+4).getCell(10).setCellValue(project3.get(i).getAsJsonObject().get("percentage").getAsString());

                    sheet.getRow(i+4).getCell(12).setCellValue(project4.get(i).getAsJsonObject().get("project_name").getAsString());
                    sheet.getRow(i+4).getCell(13).setCellValue(project4.get(i).getAsJsonObject().get("project_count").getAsString());
                }
                ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));
            } catch (IOException e1) {
                e1.printStackTrace();
            }
    }

    public static void passengerFlowDynamics(String exportFolder,String uuid,String title,String source)throws Exception{
        try {
            JsonParser parser = new JsonParser(); // 创建JSON解析器
            JsonObject object = (JsonObject) parser.parse(source); // 创建JsonObject对象

            String curDate=null;
            String chainDate=null;

            List<Object[]> dataList = new ArrayList<Object[]>();

            Object[] objs_1 = new Object[3];
            objs_1[0]="销售金额";
            JsonArray salesAmount = object.get("销售金额").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < salesAmount.size(); i++) {
                JsonObject subObject = salesAmount.get(i).getAsJsonObject();
                if(i==0){
                    curDate="日期（" + subObject.get("date").getAsString() +")";
                }else if(i==1){
                    chainDate="环比日期（" + subObject.get("date").getAsString() +")";
                }
                objs_1[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_1);

            Object[] objs_2 = new Object[3];
            objs_2[0]="订单数";
            JsonArray orderCnts = object.get("订单数").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < orderCnts.size(); i++) {
                JsonObject subObject = orderCnts.get(i).getAsJsonObject();
                objs_2[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_2);

            Object[] objs_3 = new Object[3];
            objs_3[0]="入店客流";
            JsonArray storeTraffics = object.get("入店客流").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < storeTraffics.size(); i++) {
                JsonObject subObject = storeTraffics.get(i).getAsJsonObject();
                objs_3[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_3);

            Object[] objs_4 = new Object[3];
            objs_4[0]="件单价";
            JsonArray unitPrices = object.get("件单价").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < unitPrices.size(); i++) {
                JsonObject subObject = unitPrices.get(i).getAsJsonObject();
                objs_4[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_4);

            Object[] objs_5 = new Object[3];
            objs_5[0]="转化率";
            JsonArray conversionRates = object.get("转化率").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < conversionRates.size(); i++) {
                JsonObject subObject = conversionRates.get(i).getAsJsonObject();
                objs_5[i+1]=subObject.get("metric").getAsString();
            }
            dataList.add(objs_5);

            Object[] objs_6 = new Object[3];
            objs_6[0]="VPC";
            JsonArray vpcs = object.get("VPC").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < vpcs.size(); i++) {
                JsonObject subObject = vpcs.get(i).getAsJsonObject();
                objs_6[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_6);

            Object[] objs_7 = new Object[3];
            objs_7[0]="IPC";
            JsonArray ipcs = object.get("IPC").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < ipcs.size(); i++) {
                JsonObject subObject = ipcs.get(i).getAsJsonObject();
                objs_7[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_7);

            String[] rowsName = new String[]{"指标", curDate,chainDate};
            ExportExcelUtil ex = new ExportExcelUtil(title, rowsName, dataList);
            HSSFWorkbook wb = ex.export();
            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));

        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
        }
    }

    public static void sellAmount(String exportFolder,String uuid,String title,String source)throws Exception{
        try {
            JsonParser parser = new JsonParser(); // 创建JSON解析器
            JsonObject object = (JsonObject) parser.parse(source); // 创建JsonObject对象

            String curDate=null;
            String chainDate=null;

            List<Object[]> dataList = new ArrayList<Object[]>();

            Object[] objs_1 = new Object[3];
            objs_1[0]="销售金额";
            JsonArray salesAmount = object.get("销售金额").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < salesAmount.size(); i++) {
                JsonObject subObject = salesAmount.get(i).getAsJsonObject();
                if(i==0){
                    curDate="日期（" + subObject.get("date").getAsString() +")";
                }else if(i==1){
                    chainDate="环比日期（" + subObject.get("date").getAsString() +")";
                }
                objs_1[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_1);

            Object[] objs_2 = new Object[3];
            objs_2[0]="订单数";
            JsonArray orderCnts = object.get("订单数").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < orderCnts.size(); i++) {
                JsonObject subObject = orderCnts.get(i).getAsJsonObject();
                objs_2[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_2);

            Object[] objs_3 = new Object[3];
            objs_3[0]="入店客流";
            JsonArray storeTraffics = object.get("入店客流").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < storeTraffics.size(); i++) {
                JsonObject subObject = storeTraffics.get(i).getAsJsonObject();
                objs_3[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_3);

            Object[] objs_4 = new Object[3];
            objs_4[0]="件单价";
            JsonArray unitPrices = object.get("件单价").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < unitPrices.size(); i++) {
                JsonObject subObject = unitPrices.get(i).getAsJsonObject();
                objs_4[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_4);

            Object[] objs_5 = new Object[3];
            objs_5[0]="转化率";
            JsonArray conversionRates = object.get("转化率").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < conversionRates.size(); i++) {
                JsonObject subObject = conversionRates.get(i).getAsJsonObject();
                objs_5[i+1]=subObject.get("metric").getAsString();
            }
            dataList.add(objs_5);

            Object[] objs_6 = new Object[3];
            objs_6[0]="VPC";
            JsonArray vpcs = object.get("VPC").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < vpcs.size(); i++) {
                JsonObject subObject = vpcs.get(i).getAsJsonObject();
                objs_6[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_6);

            Object[] objs_7 = new Object[3];
            objs_7[0]="IPC";
            JsonArray ipcs = object.get("IPC").getAsJsonArray(); // 得到为json的数组
            for (int i = 0; i < ipcs.size(); i++) {
                JsonObject subObject = ipcs.get(i).getAsJsonObject();
                objs_7[i+1]=subObject.get("metric").getAsInt();
            }
            dataList.add(objs_7);

            String[] rowsName = new String[]{"指标", curDate,chainDate};
            ExportExcelUtil ex = new ExportExcelUtil(title, rowsName, dataList);
            HSSFWorkbook wb = ex.export();
            ExcelUtil.exportToFile(wb, new File(exportFolder, uuid));

        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
        }
    }
}
