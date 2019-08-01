package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.BsShopSales;

public interface BsShopSalesDao extends BaseDao<BsShopSales> {

	public List<BsShopSales> listBsShopSalesBySyncDate(String syncDate);

}
