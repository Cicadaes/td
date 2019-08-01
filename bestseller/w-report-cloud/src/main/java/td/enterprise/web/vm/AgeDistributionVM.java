package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：年龄分布</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class AgeDistributionVM {
    private String age19Percent;  //19岁以下比例
    private String age25Percent;  //19-25岁以下比例
    private String age35Percent;  //26-35岁以下比例
    private String age45Percent;  //36-45岁以下比例
    private String age55Percent;  //46-55岁以下比例
    private String ageAbove55Percent;  //55岁以上比例
}
