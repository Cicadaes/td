package td.enterprise.wanalytics.etl.bean;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class DownLoadExcelBean {

	private String cisCode  ;//CIS编码
	private String shopIntroduction  ;//店铺简称
	private String marketLevel  ;//市场级别
	private String ownedBusinesses  ;//所属商家
	private String province  ;//省
	private String city  ;//市
	private String area  ;//区
	private String township  ;//乡镇
	private String marketingCenter  ;//所属营销中心
	private String refrigeratorBranch  ;//冰箱分公司
	private String airConditioningBranch  ;//空调分公司
	private String televisionBranch  ;//电视分公司
	private String mobileBranch  ;//手机分公司
	private String totalPassengerFlow  ;//所选总客流
	private String dailyPassengerFlow  ;//日均客流
	private String newPassengerFlow  ;//新客（总量）
	private String dailyNewCustomer  ;//日均新客
	private String oldPassengerFlow  ;//老客（总量）
	private String dailyOldCustomer  ;//日均老客
	private String newPassengerRate  ;//新客率（百分比）
	private String peakPeriod  ;//峰值时段
	private String passengerFlow9  ;//9-10点客流
	private String passengerFlow10  ;//10-11点客流
	private String passengerFlow11  ;//11-12点客流
	private String passengerFlow12  ;//12-13点客流
	private String passengerFlow13  ;//13-14点客流
	private String passengerFlow14  ;//14-15点客流
	private String passengerFlow15  ;//15-16点客流
	private String passengerFlow16  ;//16-17点客流
	private String passengerFlow17  ;//17-18点客流
	private String passengerFlow18  ;//18-19点客流
	private String passengerFlow19  ;//19-20点客流
	private String passengerFlow20  ;//20-21点客流
	private String passengerFlow21  ;//21-22点客流
	private String passengerFlow22  ;//22-23点客流
	private String passengerFlow23  ;//23-24点客流
	private String meanResidenceTime  ;//次均停留时长//20170307修改为人均停留时长
	private String genderMale  ;//性别-男
	private String genderFemale  ;//性别-女
	private String years19  ;//19岁以下
	private String years25  ;//19到25岁
	private String years35  ;//26-35岁
	private String years45  ;//36-45岁
	private String years55  ;//46-55岁
	private String years100  ;//55岁以上
	private String married  ;//已婚
	private String child  ;//育儿
	private String haveCar  ;//有车
	private String phoneBrand  ;//手机品牌明细（top10）
	private String price499  ;//1-499
	private String price999  ;//500-999
	private String price1999  ;//1000-1999
	private String price3999  ;//2000-3999
	private String price4000  ;//4000及以上
	private String work  ;//工作
	private String video  ;//影音
	private String food  ;//美食
	private String businessTravel  ;//商旅
	private String finance  ;//金融
	private String cosmetology  ;//美容
	private String socialContact  ;//社交
	private String read  ;//阅读
	private String healthy  ;//健康
	private String life  ;//生活
	private String entertainment  ;//娱乐
	private String homeFurnishing  ;//家居
	private String car  ;//汽车
	private String houseProperty  ;//房产
	private String baby  ;//母婴
	private String onlineShopping  ;//网购
	private String information  ;//资讯
	private String communityRanking  ;//小区排名TOP10名

}
