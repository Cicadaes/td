package td.enterprise.web.vm;

/**
 * TOP10 图表类型
 */
public enum ChartTypeEnum {
    ENTER("enter"), //进店
    NEW("new"),  //新客
    OLD("old"), //老客
    STAY("stay"), //停留
    STAY_RATE("stayrate"), //停留率
    STAY_DURATION("stayduration"); //停留时长

    ChartTypeEnum(String name) {
        this.name = name;
    }

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
