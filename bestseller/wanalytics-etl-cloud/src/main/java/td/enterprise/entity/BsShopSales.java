package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class BsShopSales {
	private String shopName;
	private String shopCode;
	private Double salesAmount;
	private Integer orderCount;
	private Double salesCount;
	private Integer orderCountGt1;
	private Integer vipOrderCount;
	private Integer vipOrderCountGt1;	
	private Double vipSalesAmount;
	private Double vipSalesCount;
	private Integer nonVipOrderCount;
	private Double nonVipSalesCount;
	private Double nonVipSalesAmount;
	private Integer nonVipOrderCountGt1;
	private String dateId;
	private Integer projectId;

	public boolean equals(Object object) {
		if (object != null && object instanceof BsShopSales) {
			BsShopSales o = (BsShopSales)object;
			boolean equals = 
					equals(shopCode, o.shopCode) &&
					equals(salesAmount, o.salesAmount) &&
					equals(orderCount, o.orderCount) &&
					equals(salesCount, o.salesCount) &&
					equals(orderCountGt1, o.orderCountGt1) && 
					equals(vipOrderCount, o.vipOrderCount) &&
				    equals(vipOrderCountGt1, o.vipOrderCountGt1) && 
					equals(vipSalesAmount, o.vipSalesAmount) && 
					equals(vipSalesCount, o.vipSalesCount) && 				    
				    equals(nonVipOrderCount, o.nonVipOrderCount) && 
				    equals(nonVipOrderCountGt1, o.nonVipOrderCountGt1) &&
					equals(nonVipSalesCount, o.nonVipSalesCount) && 
					equals(nonVipSalesAmount, o.nonVipSalesAmount) &&
			        equals(dateId, o.dateId);
			return equals;
		}
		return false;
	}
	
	public boolean equals(Object obj1, Object obj2) {
		boolean equals = true;
		if (obj1 != obj2) {
			if (obj1 == null || obj2 == null) {
				equals = false;
			} else {
				// 对象都不为空的情况

				// Integer
				if (obj1 instanceof Integer) {
					if (obj2 instanceof Integer) {
						Integer int1 = (Integer) obj1;
						Integer int2 = (Integer) obj2;
						if (int1.intValue() != int2.intValue()) {
							equals = false;
						}
					} else {
						equals = false;
					}
				}

				// Double
				if (obj1 instanceof Double) {
					if (obj2 instanceof Double) {
						Double d1 = (Double) obj1;
						Double d2 = (Double) obj2;
						if (!d1.toString().equals(d2.toString())) {
							equals = false;
						}
					} else {
						equals = false;
					}
				}
				
				// String
				if (obj1 instanceof String) {
					if (obj2 instanceof String) {
						String str1 = (String) obj1;
						String str2 = (String) obj2;
						if (!str1.equals(str2)) {
							equals = false;
						}
					} else {
						equals = false;
					}
				}
			}
		}
		return equals;
	}
}
