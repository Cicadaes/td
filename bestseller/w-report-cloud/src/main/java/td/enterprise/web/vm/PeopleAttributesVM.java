package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：人口属性返回结果</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class PeopleAttributesVM {
    private Integer projectId;
    private Integer crowdId;

    private String age19Percent;  //19岁以下比例
    private String age25Percent;  //19-25岁以下比例
    private String age35Percent;  //26-35岁以下比例
    private String age45Percent;  //36-45岁以下比例
    private String age55Percent;  //46-55岁以下比例
    private String ageAbove55Percent;  //55岁以上比例
    private String malePercent;   //男
    private String femalePercent; //女

    private String marriedPercent;    //已婚
    private String unmarriedPercent;  //未婚
    private String haveChildrenPercent; //有车比例
    private String noChildrenPercent;   //无车比例
    private String haveCarPercent;//有车比例
    private String noCarPercent;  //无车比例

}
