package td.enterprise.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.BsUserDao;
import td.enterprise.entity.BsUser;

/**
 * <br>
 * <b>功能：</b>用户表 BsUserService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2018-01-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("bsUserService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BsUserService extends BaseService<BsUser> {
	public final static Logger logger = Logger.getLogger(BsUserService.class);
	
	@Autowired
	private BsUserDao dao;

	public BsUserDao getDao() {
		return dao;
	}
	
	/**
	* <p>Description: 通过userId查询用户信息</p>
	* @param userId
	* @return
	* @author liyinglei 
	* @date 2018年1月8日下午2:38:49
	 */
    public List <BsUser> queryListByUserId(String userId) {
    	Map<String, Object> param = new HashMap<String, Object>();
    	param.put("userId", userId);
    	List<BsUser> bsUserList = dao.queryListByUserId(param);
    	if (bsUserList == null || bsUserList.size() == 0) {
    		bsUserList = new ArrayList<BsUser>();
    		bsUserList.add(new BsUser());
    	}
        return bsUserList;
    }
    
    /**
    * <p>Description: </p>
    * @param bsUserList
    * @param appConfig
    * @author liyinglei 
    * @date 2018年1月8日下午3:04:59
     */
    public void setParamToAppConfig(List<BsUser> bsUserList, Map<String, Object> appConfig, HttpSession session) {
    	if (bsUserList == null || bsUserList.size() ==0) {
    		return;
    	}
    	List<String> logicalCityList = new ArrayList<String>();
    	for (BsUser bsUser : bsUserList) {
			logicalCityList.add(bsUser.getLogicalCity());
			appConfig.put("group_sign", null == bsUser.getGroupSign() ? "Y" : bsUser.getGroupSign());
			session.setAttribute("group_sign", null == bsUser.getGroupSign() ? "Y" : bsUser.getGroupSign());
		}
    	appConfig.put("logical_city", logicalCityList);
    	session.setAttribute("logical_city", logicalCityList);
    }
	
}
