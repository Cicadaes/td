package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.TagsInfo;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>标签信息 TagsInfoDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface TagsInfoDao extends BaseDao<TagsInfo> {

    List<TagsInfo> queryByCodeList(List<String> codeList);

    List<TagsInfo> selectByMatchCode(TagsInfo tagsInfo);

    List<TagsInfo> queryByMatchCode(String tagCode);
}
