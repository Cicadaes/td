package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by yanghao on 2017/6/26.
 */
@Setter
@Getter
@ToString
public class DmkEntity extends BaseEntity {
    private Integer id;
    private String mac;
    private String tdid;
}
