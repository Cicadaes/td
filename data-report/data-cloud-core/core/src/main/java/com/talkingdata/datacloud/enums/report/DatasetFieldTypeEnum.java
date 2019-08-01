package com.talkingdata.datacloud.enums.report;

/**
 * Created by yashiro on 17/2/14.
 */
public enum DatasetFieldTypeEnum {

    /**
     * .TODO  增加 DATE 类型
     */
    INT("int", "Number"),
    LONG("long", "Number"),
    STRING("string", "String"),
    DOUBLE("double", "Number"),
    ARRAY("array", "Number"),
    INTEGER("integer", "Number"),
    FLOAT("float", "Number"),
    //kylin data type
    BIGINT("BIGINT", "Number"),
    DECIMAL("DECIMAL", "Number"),
    VARCHAR("VARCHAR", "String"),
    DATE("DATE", "Date");

    public String key;
    public String value;

    DatasetFieldTypeEnum(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public static String parseKey(String key) {
        for (DatasetFieldTypeEnum field : DatasetFieldTypeEnum.values()) {
            if (key.equals(field.key) || key.toUpperCase().contains(field.key.toUpperCase())) {
                return field.value;
            }
        }
        return null;
    }

}
