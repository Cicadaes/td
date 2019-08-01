package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * mac offset 对应关系
 */
@Setter
@Getter
@ToString
public class MacOffset {
    private  Integer offset;
    private  String  mac;

}
