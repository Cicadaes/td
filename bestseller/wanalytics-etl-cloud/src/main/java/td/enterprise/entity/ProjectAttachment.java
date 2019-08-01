package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>附件 AttachmentEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectAttachment {

    private Integer id;
    private Integer type;
    private String name;
    private Object data;
    private String tenantId;
    private String creator;
    private String createBy;
    private Date createTime;
    private Integer status;
    private String attr1;
    private String attr2;
    private String attr3;
    private String attr4;
}

