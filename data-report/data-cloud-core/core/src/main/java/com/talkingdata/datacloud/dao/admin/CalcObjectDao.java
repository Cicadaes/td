package com.talkingdata.datacloud.dao.admin;

import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.CalcObject;
import com.talkingdata.datacloud.page.admin.CalcObjectPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>计算对象 CalcObjectDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CalcObjectDao extends BaseDao<CalcObject> {
	
	public Integer queryExportCalcRecordByCount(CalcObjectPage page);
	
	public List<CalcObject> queryExportCalcRecordByList(CalcObjectPage page);
	
	public List<CalcObject> queryByCalcObject(CalcObject calcObject);
	
	/**
	 * 高级搜索 查询标签类别总数
	 * 
	 * @param page
	 * @return
	 */
	Integer queryWithSearchByCount(CalcObjectPage page);
	
	/**
	 * 高级搜索 查询标签类别列表
	 * 
	 * @param page
	 * @return
	 */
	List<CalcObject> queryWithSearchByList(CalcObjectPage page);
	
	CalcObject queryMaxByCode(@Param(value = "code") String code, @Param(value = "tenantId") String tenantId);
	
	@Deprecated
	int deleteByExcludesTenantIds(@Param(value = "tenantIds") String[] tenantIds);
	
	int deleteByExcludesCreaters(@Param(value = "creaters") String[] creaters);
}
