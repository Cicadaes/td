package td.enterprise.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import td.enterprise.dao.BsShopSalesDao;
import td.enterprise.entity.BsShopSales;

/**
 * <br>
 * <b>功能：</b>绫致一方销售数据 BsDeviceService<br>
 */
public class BsShopSalseService {
	public final static Logger logger = Logger.getLogger(BsShopSalseService.class);

	public static List<BsShopSales> queryBySyncDate(SqlSession sqlSession, String date) {
		BsShopSalesDao dao = sqlSession.getMapper(BsShopSalesDao.class);
		return dao.listBsShopSalesBySyncDate(date);
	}
}
