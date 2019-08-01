package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Administrator on 2017/6/21.
 */
@Setter
@Getter
@ToString
public class MacCompany extends BaseEntity{
    private String mac;
    private String company;
    private Integer isMobile;

}
