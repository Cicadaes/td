package td.enterprise.entity.type;

/**
 * Created by junmin.li
 */
public enum ProjectGroupComputeEnum {

    EXCLUSION (2, "排重客流");

    private int code;
    private String value;

    ProjectGroupComputeEnum(int code, String value) {
        this.code = code;
        this.value = value;
    }


    public int getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }

    public static ProjectGroupComputeEnum getEnum(String value) {
        for (ProjectGroupComputeEnum v : values())
            if (v.toString().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }

}
