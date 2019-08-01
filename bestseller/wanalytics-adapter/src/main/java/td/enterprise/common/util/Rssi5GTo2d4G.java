package td.enterprise.common.util;

import java.util.HashMap;
/**
 * 5G信号转换为2.4G信号
 * @author Administrator
 *
 */
public class Rssi5GTo2d4G {

	private Rssi5GTo2d4G(){}
	private static HashMap<String, String> hashMap = new HashMap<>();
	
	static {
		hashMap.put("0","0");
		hashMap.put("-1","0");
		hashMap.put("-2","0");
		hashMap.put("-3","0");
		hashMap.put("-4","0");
		hashMap.put("-5","0");
		hashMap.put("-6","0");
		hashMap.put("-7","-1");
		hashMap.put("-8","-2");
		hashMap.put("-9","-3");
		hashMap.put("-10","-4");
		hashMap.put("-11","-4");
		hashMap.put("-12","-5");
		hashMap.put("-13","-6");
		hashMap.put("-14","-7");
		hashMap.put("-15","-8");
		hashMap.put("-16","-9");
		hashMap.put("-17","-10");
		hashMap.put("-18","-11");
		hashMap.put("-19","-12");
		hashMap.put("-20","-13");
		hashMap.put("-21","-14");
		hashMap.put("-22","-15");
		hashMap.put("-23","-16");
		hashMap.put("-24","-17");
		hashMap.put("-25","-18");
		hashMap.put("-26","-19");
		hashMap.put("-27","-20");
		hashMap.put("-28","-21");
		hashMap.put("-29","-22");
		hashMap.put("-30","-23");
		hashMap.put("-31","-24");
		hashMap.put("-32","-25");
		hashMap.put("-33","-26");
		hashMap.put("-34","-27");
		hashMap.put("-35","-28");
		hashMap.put("-36","-29");
		hashMap.put("-37","-30");
		hashMap.put("-38","-30");
		hashMap.put("-39","-31");
		hashMap.put("-40","-32");
		hashMap.put("-41","-33");
		hashMap.put("-42","-34");
		hashMap.put("-43","-35");
		hashMap.put("-44","-36");
		hashMap.put("-45","-37");
		hashMap.put("-46","-38");
		hashMap.put("-47","-39");
		hashMap.put("-48","-40");
		hashMap.put("-49","-41");
		hashMap.put("-50","-42");
		hashMap.put("-51","-43");
		hashMap.put("-52","-44");
		hashMap.put("-53","-45");
		hashMap.put("-54","-46");
		hashMap.put("-55","-47");
		hashMap.put("-56","-48");
		hashMap.put("-57","-49");
		hashMap.put("-58","-50");
		hashMap.put("-59","-51");
		hashMap.put("-60","-52");
		hashMap.put("-61","-53");
		hashMap.put("-62","-54");
		hashMap.put("-63","-55");
		hashMap.put("-64","-56");
		hashMap.put("-65","-56");
		hashMap.put("-66","-57");
		hashMap.put("-67","-58");
		hashMap.put("-68","-59");
		hashMap.put("-69","-60");
		hashMap.put("-70","-61");
		hashMap.put("-71","-62");
		hashMap.put("-72","-63");
		hashMap.put("-73","-64");
		hashMap.put("-74","-65");
		hashMap.put("-75","-66");
		hashMap.put("-76","-67");
		hashMap.put("-77","-68");
		hashMap.put("-78","-69");
		hashMap.put("-79","-70");
		hashMap.put("-80","-71");
		hashMap.put("-81","-72");
		hashMap.put("-82","-73");
		hashMap.put("-83","-74");
		hashMap.put("-84","-75");
		hashMap.put("-85","-76");
		hashMap.put("-86","-77");
		hashMap.put("-87","-78");
		hashMap.put("-88","-79");
		hashMap.put("-89","-80");
		hashMap.put("-90","-81");
		hashMap.put("-91","-82");
		hashMap.put("-92","-82");
		hashMap.put("-93","-83");
		hashMap.put("-94","-84");
		hashMap.put("-95","-85");
		hashMap.put("-96","-86");
		hashMap.put("-97","-87");
		hashMap.put("-98","-88");
		hashMap.put("-99","-89");
		hashMap.put("-100","-90");
	}
	/**
	 * 5G信号强度，转换为2.4G信号强度
	 * 范围（0 到 -100）
	 * 超过范围的返回原值
	 * @param rssiof5
	 * @return
	 */
	public static String changeRssi5To2d4(String rssiof5){
		String rssiof2 = hashMap.get(rssiof5);
		if (rssiof2==null) {
			return rssiof5;
		}else{
			return rssiof2;
		}
	}
}
