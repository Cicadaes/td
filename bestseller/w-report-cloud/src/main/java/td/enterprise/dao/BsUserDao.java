package td.enterprise.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import td.enterprise.entity.BsUser;

/**
 * <br>
 * <b>功能：</b>用户表 BsUserDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2018-01-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface BsUserDao extends BaseDao<BsUser> {
	
	List<BsUser> queryListByUserId(Map<String,Object> param);
	
}
