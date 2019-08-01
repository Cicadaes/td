package td.enterprise.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.dao.BsShopDao;
import td.enterprise.entity.BsShop;

/**
 * <br>
 * <b>功能：</b>绫致店铺 BsShopService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("bsShopService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BsShopService {
	public final static Logger logger = Logger.getLogger(BsShopService.class);
	
	public static List<BsShop> queryByList(SqlSession sqlSession, BsShop bsShop){
		BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
		return dao.queryByList(bsShop);
	}

    public static BsShop selectByPrimaryKey(SqlSession sqlSession, String id) {
        BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
        return dao.selectByPrimaryKey(id);
    }
    
    public static int insert(SqlSession sqlSession, BsShop bsShop) {
    	BsShopDao dao = sqlSession.getMapper(BsShopDao.class);
        return dao.insert(bsShop);
    }
}
