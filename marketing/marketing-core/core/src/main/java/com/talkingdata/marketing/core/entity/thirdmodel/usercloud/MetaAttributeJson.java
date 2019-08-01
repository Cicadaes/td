package com.talkingdata.marketing.core.entity.thirdmodel.usercloud;

import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.util.JsonUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * The type Meta attribute json.
 * @author xiaoming.kang
 */
public class MetaAttributeJson {

    private String type;
    private List<MetaAttribute> data;

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     * @throws Exception the exception
     */
    public static void main(String[] args) throws Exception{
        Integer channelType = 2;
        String attributesStr = "[{\"type\":\"2\",\"data\":[{\"attributeCode\":\"name\",\"attributeName\":\"姓名\",\"objectCode\":\"METASAC20170824005\",\"objectIdType\":\"METAACCOUNT20170824002\",\"objectType\":\"MetaStaticAttributeCollection_mobile\"},{\"attributeCode\":\"sex\",\"attributeName\":\"性别\",\"objectCode\":\"METASAC20170824005\",\"objectIdType\":\"METAACCOUNT20170824002\",\"objectType\":\"MetaStaticAttributeCollection_mobile\"}]},{\"type\":\"3\",\"data\":[{\"attributeCode\":\"name\",\"attributeName\":\"姓名\",\"objectCode\":\"METASAC20170824005\",\"objectIdType\":\"METAACCOUNT20170824002\",\"objectType\":\"MetaStaticAttributeCollection_email\"},{\"attributeCode\":\"sex\",\"attributeName\":\"性别\",\"objectCode\":\"METASAC20170824005\",\"objectIdType\":\"METAACCOUNT20170824002\",\"objectType\":\"MetaStaticAttributeCollection_email\"}]}]";
        List <Map> metaAttributeJsons = JsonUtil.toObject(attributesStr, ArrayList.class);
        List <String> attributes = new ArrayList <>();
        for (Map metaAttributeJson : metaAttributeJsons) {
            String metaAttributeStr = JsonUtil.toJson(metaAttributeJson);
            MetaAttributeJson metaAttribute = JsonUtil.toObject(metaAttributeStr, MetaAttributeJson.class);
            String type = metaAttribute.getType();
            int i = -1;
                try {
                    i = Integer.parseInt(type);
                } catch (Exception e) {
                    throw new Exception("用户管家 TD_PARAM 配置错误:" + ParamConstants.MARKETING_DMP_CROWD_ATTRIBUTES + ",type应为渠道类型数值");
                }
                if (channelType.equals(i)) {
                    List <MetaAttribute> data = metaAttribute.getData();
                for (MetaAttribute datum : data) {
                    attributes.add(datum.getAttributeCode());
                }
            }
        }
        for (String attribute : attributes) {
            System.out.println(attribute);
        }


        String[] messageParams = "name,sex".split(",");
        List <MetaAttribute> attributesList = new ArrayList <>();
        for (Map metaAttributeJson : metaAttributeJsons) {
            String metaAttributeStr = JsonUtil.toJson(metaAttributeJson);
            MetaAttributeJson metaAttribute = JsonUtil.toObject(metaAttributeStr, MetaAttributeJson.class);
            String type = metaAttribute.getType();
            Integer i;
            try {
                i = Integer.parseInt(type);
            } catch (Exception e) {
                throw new Exception("用户管家 TD_PARAM 配置错误:" + ParamConstants.MARKETING_DMP_CROWD_ATTRIBUTES + ",type应为渠道类型数值");
            }
            Integer c = 3;
            if (c.equals(i)) {
                List <MetaAttribute> data = metaAttribute.getData();
                for (String messageParam : messageParams) {
                    for (MetaAttribute datum : data) {
                        if (messageParam.equalsIgnoreCase(datum.getAttributeCode())) {
                            attributesList.add(datum);
                            break;
                        }
                    }
                }
            }
        }
        List<MetaAttributeParam> metaAttributeParams = new ArrayList <>();
        for (MetaAttribute metaAttribute : attributesList) {
            boolean flag = false;
            for (MetaAttributeParam metaAttributeParamObject : metaAttributeParams) {
                String objectCode = metaAttributeParamObject.getObjectCode();
                String objectIdType = metaAttributeParamObject.getObjectIdType();
                String objectType = metaAttributeParamObject.getObjectType();
                if(metaAttribute.getObjectCode().equals(objectCode)
                        && metaAttribute.getObjectIdType().equals(objectIdType)
                        && metaAttribute.getObjectType().equals(objectType)){
                    metaAttributeParamObject.setAttributes(metaAttributeParamObject.getAttributes() + "," + metaAttribute.getAttributeCode());
                    flag = true;
                    break;
                }
            }
            if(!flag){
                MetaAttributeParam metaAttributeParam = new MetaAttributeParam();
                metaAttributeParam.setAttributes(metaAttribute.getAttributeCode());
                metaAttributeParam.setObjectCode(metaAttribute.getObjectCode());
                metaAttributeParam.setObjectIdType(metaAttribute.getObjectIdType());
                metaAttributeParam.setObjectType(metaAttribute.getObjectType());
                metaAttributeParams.add(metaAttributeParam);
            }
        }

       System.out.println(JsonUtil.toJson(metaAttributeParams));
    }

    /**
     * Gets type.
     *
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * Sets type.
     *
     * @param type the type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * Gets data.
     *
     * @return the data
     */
    public List<MetaAttribute> getData() {
        return data;
    }

    /**
     * Sets data.
     *
     * @param data the data
     */
    public void setData(List<MetaAttribute> data) {
        this.data = data;
    }
}

