package com.talkingdata.datacloud.entity.catalog;

import com.alibaba.fastjson.JSON;
import com.talkingdata.datacloud.base.entity.BaseEntity;
import com.talkingdata.datacloud.enums.catalog.DataPartitionTypeEnum;
import com.talkingdata.datacloud.util.FileNameUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.format.DateTimeFormatter;
import java.util.*;

public class DataPartitionFormat extends BaseEntity {

    private static Logger logger = LoggerFactory.getLogger(DataPartitionFormat.class);

    private DataPartitionTypeEnum type;
    private int length;
    private String content;//HASH分区,该项一般没有值.TIME分区,内容为yyyy/mm等类似格式.
    private String name;

    //for fastjson.
    public DataPartitionFormat(){

    }

    public DataPartitionFormat(String name, DataPartitionTypeEnum type,String content){
        if (StringUtils.isNotBlank(name)) {
            this.name = name;
            this.type = type;
            this.content = content;
            if(type.equals(DataPartitionTypeEnum.HASH)){
                this.length = 1;
            }else{
                if(StringUtils.isNotBlank(content)){
                    this.length = content.replaceFirst("^/+","").replaceFirst("/+$","").split("/").length;
                }else{
                    throw new IllegalArgumentException("参数错误:时间分区没有传递格式.");
                }

            }
        }else{
            throw new IllegalArgumentException("参数错误");
        }
    }

    public DataPartitionFormat(String name){
        this(name,DataPartitionTypeEnum.HASH,null);
    }

    public DataPartitionFormat(String name,String content){
        this(name,DataPartitionTypeEnum.TIME,content);
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getLength() {
        if(0 == length){
            if(type.equals(DataPartitionTypeEnum.HASH)){
                this.length = 1;
            }else{
                this.length = content.replaceFirst("^/+","").replaceFirst("/+$","").split("/").length;
            }
        }
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public DataPartitionTypeEnum getType() {
        return type;
    }

    public void setType(DataPartitionTypeEnum type) {
        this.type = type;
    }

    /*    public static void check(DatasetPartition partition,String path){
        Map<String, Object> record = new HashMap<>();
        check(partition,path,record);
    }*/



    public static void check(DatasetPartition partition,String path,Map<String,Object> record){

        List<DataPartitionFormat> formatList = assembleFormatList(partition);
        checkFormatList(formatList);
        check(formatList,path, record);
    }

    /**
     * 校验一个path是否符合分区格式,并返回匹配到的层级
     * @param formatList
     * @param path
     * @param record
     */
    public static void check(List<DataPartitionFormat> formatList,String path, Map<String, Object> record) {
        if(CollectionUtils.isNotEmpty(formatList) && StringUtils.isNotBlank(path)){
            List<String> folderList = Arrays.asList(path.split("/"));
            int i;
            for(i=0;i<formatList.size();i++){
                DataPartitionFormat f = formatList.get(i);
                if(DataPartitionTypeEnum.TIME.equals(f.getType())){
                    if(f.getLength() > folderList.size()){
                        throw new IllegalArgumentException("选择的路径不符合分区规则.");
                    }else{
                        String checkFolderPath = String.join("/",folderList.subList(0,f.getLength()));
                        try{
                            DateTimeFormatter.ofPattern(f.getContent()).parse(checkFolderPath);
                        }catch(Exception e){
                            //格式错误,直接退出循环返回.
                            throw new IllegalArgumentException("选择的路径不符合分区规则：时间分区.");
                        }
                        //如果校验通过,把folderList裁切.
                        folderList = folderList.subList(f.getLength(),folderList.size());
                    }

                }else{
                    //KEY值分区不做校验,直接跳过一级.
                    folderList = folderList.subList(1, folderList.size());
                }

                //循环一轮结束以后,
                if(CollectionUtils.isEmpty(folderList)){
                    break;
                }
            }

            if(CollectionUtils.isNotEmpty(folderList)){
                throw new IllegalArgumentException("选择的路径不符合分区规则：路径层级超出分区范围");
            }else{
                if(i == formatList.size() -1){
                    //全部匹配了,下一层级就是文件了.

                }else{
                    record.put("nextLevel",formatList.get(++i));
                }
            }
        }else{
            if(CollectionUtils.isNotEmpty(formatList)) {
                record.put("nextLevel",formatList.get(0));
            }else{
                throw new IllegalArgumentException("分区定义不存在.");
            }
        }
    }

    public static List<DataPartitionFormat> assembleFormatList(DatasetPartition partition){
        List<DataPartitionFormat> formatList = new ArrayList<>();

        if(null != partition && ((null != partition.getHasTimePartition() && partition.getHasTimePartition() !=0) || (null != partition.getHasHashPartition() && partition.getHasHashPartition() != 0))){
            String order = partition.getPartitionOrder();
            if(StringUtils.isNotBlank(order)){
                String[] orderArray = order.split(",");
                int keyIndex = 0;

                String[] keyNameArray = {};
                if(StringUtils.isNotBlank(partition.getHashPartitionName())){
                    keyNameArray = partition.getHashPartitionName().split(",");
                }
                for(String o : orderArray){
                    DataPartitionFormat format;
                    if(o.equalsIgnoreCase("time")){
                        format = new DataPartitionFormat(partition.getTimePartitionName(),DataPartitionTypeEnum.TIME,partition.getTimePartitionExpression());
                    }else{
                        format = new DataPartitionFormat(keyNameArray[keyIndex++],DataPartitionTypeEnum.HASH,null);
                    }
                    formatList.add(format);
                }

            }else{
                //throw new IllegalArgumentException("分区定义存在问题.请检查.");
                //假设如果为空的话,就按照时间分区优先的方式编排一个.
                if(null != partition.getHasTimePartition() && partition.getHasTimePartition() != 0 && StringUtils.isNotBlank(partition.getTimePartitionExpression())){
                    DataPartitionFormat format = new DataPartitionFormat(partition.getTimePartitionName(), DataPartitionTypeEnum.TIME,partition.getTimePartitionExpression());
                    formatList.add(format);
                }

                if(null != partition.getHasHashPartition() && partition.getHasHashPartition() != 0 && StringUtils.isNotBlank(partition.getPartitionKeys())){
                    for(String key : partition.getHashPartitionName().split(",")){
                        DataPartitionFormat format = new DataPartitionFormat(key, DataPartitionTypeEnum.HASH,null);
                        formatList.add(format);
                    }
                }
            }
        }

        return formatList;
    }

    /**
     * 校验分区格式.
     * 1.分区数量不能超过3个.
     * 2.时间分区不允许有多个.
     * 3.名字不能重复.
     * @param formatList
     */
    public static void checkFormatList(List<DataPartitionFormat> formatList){

        if(CollectionUtils.isNotEmpty(formatList)){
            if(formatList.size()>3){
                throw new IllegalArgumentException("分区数量不能超过3级");
            }

            int timePartitionNum = 0;
            Set<String> nameSet = new HashSet<>();
            for(DataPartitionFormat f : formatList){
                try {
                    FileNameUtils.checkFileName(f.getName());
                }catch(Exception e){
                    throw new IllegalArgumentException("分区名称不合法.(包含特殊字符或超过255长度)");
                }
                if(f.getType().equals(DataPartitionTypeEnum.TIME)){
                    if(++timePartitionNum > 1){
                        throw new IllegalArgumentException("时间分区数量不能超过一个");
                    }
                }
                if(nameSet.contains(f.getName())){
                    throw new IllegalArgumentException("分区名称不能重复.");
                }
                nameSet.add(f.getName());
            }
        }
    }


    public static void main(String[] args) {

        DataPartitionFormat f1= new DataPartitionFormat("datetime","yyyy/mm/dd");
        DataPartitionFormat f2= new DataPartitionFormat("city");
        DataPartitionFormat f3= new DataPartitionFormat("town");

        f1.setName("时间分区");
        f2.setName("城市");
        f3.setName("乡镇");
        List<DataPartitionFormat> list = new ArrayList<>();
        list.add(f1);
        list.add(f2);
        list.add(f3);

        System.out.println(JSON.toJSONString(list.subList(1,3)));


    }

}
