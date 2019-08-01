package td.enterprise.entity.type;

/**
 * Created by Yan on 2017/3/10.
 */
public enum ProjectTypeEnum {

    // 注意，下面是代码中的旧的枚举，代码中好多地方的枚举还是沿用下列
    //    PROJECT_GROUP(1, "店组类型项目"),
    //    PROJECT_STORE(2, "店铺类型项目"),
    //    PROJECT_COMPETE(-1, "竞品类型项目");

    //     `project_type` int(11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份',

    /**  
     * 项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 
      6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份
      11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市
      */

    PROJECT_ERROR(-1, "历史残留，慢慢清理"), //
    PROJECT_SHOP(1, "店铺"), //
    PROJECT_CUSTOM(2, "自定义"), //
    PROJECT_PHYSICAL_CITY(3, "物理城市"), //
    PROJECT_BRAND_CITY(4, "品牌城市"), //
    PROJECT_BRAND_REGION(5, "品牌大区"), //
    PROJECT_BRANDS(6, "品牌"), //
    PROJECT_MALL(7, "商场"), //
    PROJECT_CHANNEL(8, "渠道"), //
    PROJECT_PHYSICAL_PROVINCES(9, "物理省份"), //
    PROJECT_BRAND_PROVINCES(10, "品牌省份"), //
    PROJECT_LOGICAL_CITY(11, "逻辑城市"), //
    PROJECT_BRANC_CHANNEL(12, "品牌渠道"), //
    PROJECT_CHANNEL_PROVINCES(13, "渠道省份"), //
    PROJECT_CAHNNEL_CITY(14, "渠道城市");

    private int    code;
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
            if (v.toString().equalsIgnoreCase(value))
                return v;
        throw new IllegalArgumentException();
    }

}
