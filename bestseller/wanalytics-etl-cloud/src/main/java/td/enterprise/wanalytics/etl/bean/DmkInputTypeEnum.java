package td.enterprise.wanalytics.etl.bean;

/**
 * DMK 输入类型枚举类
 */
public enum DmkInputTypeEnum {
    MAC("mac","mac地址"),
    TDID("tdid","通过TDID进行调用"),
    IMEI("imei","国际移动设备标识"),
    IDFA("idfa","苹果体系内设备唯一标识"),
    ANDROIDID("androidid","安卓体系内设备唯一标识");
    private String code;
    private String value;
    DmkInputTypeEnum(String code, String value){
      this.code = code;
      this.value = value;
    }

    public String getCode(){
        return this.code;
    }

    public String getValue(){
        return this.value;
    }

    public  static DmkInputTypeEnum getInstance(String type){
        if(MAC.getCode().equals(type)){
            return MAC;
        }else  if(TDID.getCode().equals(type)){
            return TDID;
        }else{
             throw new RuntimeException("不支持的类型:" +  type);
        }
    }

}
