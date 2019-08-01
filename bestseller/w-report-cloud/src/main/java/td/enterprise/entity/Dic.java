package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;


/**
 * <br>
 * <b>功能：</b>数据字典 DicEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class Dic implements Serializable {
    private Integer id;
    private String name;
    private String description;
    private String dicKey;
    private String systemCode;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
}

