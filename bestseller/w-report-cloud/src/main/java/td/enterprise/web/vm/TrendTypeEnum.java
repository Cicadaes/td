package td.enterprise.web.vm;

/**
 * <br>
 * <b>功能：进店，停留类型</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public enum TrendTypeEnum {

    STAY("stay"), ENTER("enter"), ACTIVE("active"), ENTER_RATE("enter_rate"), STAY_RATE("stay_rate");

    TrendTypeEnum(String name) {
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
