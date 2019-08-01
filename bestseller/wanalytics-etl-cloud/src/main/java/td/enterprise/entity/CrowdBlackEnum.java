package td.enterprise.entity;

/**
 * junmin.li
 */
public enum CrowdBlackEnum {
    CREATE(1, "手工录入"),
    IMPORT(2, "批量导入"),
    RULE(3, "自动过滤"),
    STAY(4, "停留时长过长"),
    TIME(5, "非营业时间出现"),
    NO_MOBILE_DEVICE(6, "非移动设备mac"),
    MAC_PREDICT(7, "非移动设备识别算法过滤");

    private int code;
    private String value;

    CrowdBlackEnum(int code, String value) {
        this.code = code;
        this.value = value;
    }


    public int getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }

    public static CrowdBlackEnum getEnum(String value) {
        for (CrowdBlackEnum v : values())
            if (v.toString().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }
}
