package td.enterprise.wanalytics.etl.bean;

/**
 * dmk 类型
 */
public enum  DmkEnum {
    TAG_DEMOGRAPHIC("I010202","人口属性"),
    TAG_APP("I010203","应用兴趣"),
    TAG_DEVICE("I010209","设备属性"),
    POSITION_DEVICE("I010305","月聚集位置");
    private String code;
    private String value;
    DmkEnum(String code,String value){
      this.code = code;
      this.value = value;
    }

    public String getCode(){
        return this.code;
    }

    public String getValue(){
        return this.value;
    }

}
