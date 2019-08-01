package td.enterprise.entity.type;

/**
 * Created by Yan on 2017/3/10.
 */
public enum CrowdTypeEnum {

    AU(1, "进店人群"),
    OU(2, "老客人群"),
    NU(3, "新客人群"),
    TU(4, "竞品人群");

    private int code;
    private String value;

    CrowdTypeEnum(int code, String value) {
        this.code = code;
        this.value = value;
    }


    public int getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }

    public static CrowdTypeEnum getEnum(String value) {
        for (CrowdTypeEnum v : values())
            if (v.toString().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }

}
