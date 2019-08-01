package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.Algorithm;
import com.talkingdata.datacloud.page.admin.AlgorithmPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>机器学习模型 AlgorithmDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AlgorithmDao extends BaseDao<Algorithm> {
	
	public Integer queryWithSearchByCount(AlgorithmPage page);
	
	public List<Algorithm> queryWithSearchByList(AlgorithmPage page);
	
	public List<Algorithm> findAlgorithmsByCode(String code);
	
	public List<Algorithm> queryByAlgorithm(Algorithm algorithm);
	
}
