package td.enterprise.entity;

/**
 * junmin.li
 */
public enum ProjectTypeEnum {
    PROJECT_GROUP(1, "店组类型项目"),
    PROJECT_STORE(2, "店铺类型项目"),
    PROJECT_COMPETE(-1, "竞品类型项目");

    private int code;
    private String value;

    ProjectTypeEnum(int code, String value) {
        this.code = code;
        this.value = value;
    }


    public int getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }

    public static ProjectTypeEnum getEnum(String value) {
        for (ProjectTypeEnum v : values())
            if (v.toString().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }
}
