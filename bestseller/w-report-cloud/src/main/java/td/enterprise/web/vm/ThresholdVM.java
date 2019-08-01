package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Builder;
import td.enterprise.entity.Threshold;

/**
 * <br>
 * <b>功能：阈值</b><br>
 * <b>作者：</b>yinglei.li<br>
 * <b>日期：</b> 2017-09-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ThresholdVM extends Threshold {
	
	private String projectIds;

	private Integer salesListId;
	
	private Integer blackListId;
	
	//营业开始时间 HH：MM，比如，09:00
    private String openingTime;

    //营业结束时间 HH：MM，比如，18:00
    private String closingTime;
    
    private String salesAttaId;
    
    private String salesFilePath;
    
    private String salesFileName;
    
    private String blackAttaId;
    
    private String blackFilePath;
    
    private String blackFileName;
    
}
