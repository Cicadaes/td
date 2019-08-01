package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectAttachment;
import td.enterprise.page.ProjectAttachmentPage;

/**
 *
 * <br>
 * <b>功能：</b>附件 AttachmentDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectAttachmentDao extends BaseDao<ProjectAttachment> {
	ProjectAttachment getLastByProjectIdAndType(ProjectAttachmentPage page);
}
