package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

/**
 * dmp-console
 *
 * Created by liran on 2017/6/26.
 */
@Setter
@Getter
@ToString
public class AuditLog {

    private Integer id;
    private String systemCode;
    private Date createTime;
    private String actorUmId;
    private String actorName;
    private String operationType;
    private String targetType;
    private String targetId;
    private String result;
    private String description;
    private String tenantId;
    private String projectId;
    private String beforeValue;
    private String afterValue;
    private String exception;
    private String returnValue;

}
