package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Created by Yan on 2017/3/6.
 * 所有实体类的基类
 */
@Setter
@Getter
@ToString
public class BaseEntity implements Serializable {

    //创建人账号
    private String createBy;

    //创建人
    private String creator;

    //修改人账号
    private String updateBy;

    //修改人
    private String updater;

    //创建时间
    private Timestamp createTime;

    //修改时间
    private Timestamp updateTime;
}

