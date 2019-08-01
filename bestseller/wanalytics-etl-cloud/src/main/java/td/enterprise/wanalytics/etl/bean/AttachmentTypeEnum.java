package td.enterprise.wanalytics.etl.bean;

/**
 * 附件类型枚举类
 */
public enum AttachmentTypeEnum {
    BLACK_MAC(1,"黑名单"),
    POI(5,"POI格式"),
    WIFILAILAI(3,"wifi来来zip包"),
    MAC(4,"mac文件列表，带有日期");
    private int code;
    private String value;
    AttachmentTypeEnum(int code, String value){
      this.code = code;
      this.value = value;
    }

    public int getCode(){
        return this.code;
    }

    public String getValue(){
        return this.value;
    }

    public  static AttachmentTypeEnum getInstance(int type){
        if(MAC.getCode()  == type){
            return MAC;
        }else  if(WIFILAILAI.getCode() == type){
            return WIFILAILAI;
        }else  if(POI.getCode() == type){
            return POI;
        }else{
            return null;
        }
    }

}
