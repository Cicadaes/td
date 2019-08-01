package td.enterprise.wanalytics.processor.bean;

public enum FilterTypeEnum {
    OPENING_TIME(5),//营业时间在9:00-22:00，那么在0点—7点见出现的设备mac都进入黑名单
    DURATION(4),    //驻留时长 超过90分钟的
    MOBILE_MAC(6);

    FilterTypeEnum(int name) {
        this.name = name;
    }

    private int name;

    public int getName() {
        return name;
    }

    public void setName(int name) {
        this.name = name;
    }

}
