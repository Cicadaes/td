package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;
import org.msgpack.annotation.Optional;

import java.io.IOException;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class DeviceProfile implements TDMessagePackable {

	/**
	 * 手机型号
	 */
	public String mMobileModel = "";
	/**
	 * SDK Version, e.g: 7,8,9,11
	 */
	public String mOsSdkVersion = "";
	/**
	 * 位置信息
	 */
	public Gis mGis = new Gis();
	/**
	 * Cpu
	 */
	public String mCpuABI = "";
	/**
	 * 分辨率
	 */
	public String mPixelMetric = "";
	/**
	 * 国家
	 */
	public String mCountry = "";
	/**
	 * 运营商
	 */
	public String mCarrier = "";
	/**
	 * 语言
	 */
	public String mLanguage = "";
	/**
	 * 时区
	 */
	public int mTimezone;
	/**
	 * 手机操作系统版本
	 */
	public String mOsVersion = "";
	
	/**
	 * 是否是Wifi连接, 0表示是Wifi连接，1表示2G/3G
	 */
	public int mChannel = -1;
	/**
	 * 在不是Wifi连接时有意义
	 */
	public String m2G_3G = "";
	
	/**
	 * for collector
	 */
	@Optional
	public boolean isJailBroken = false;	
	
	@Optional
	public String mSimOperator = "";

	public String mNetworkOperator = "";
	
	public String hostName = "";
	
	public String deviceName = "";
	
	public long kernBootTime=0;

	/**
	 * 对应1.5版本修改
	 */
	public String advertisingID;

	/**
	 * 对应1.5版本第二次修改<增加地理位置信息>
	 */
	@Optional
	public String mWifiBSSID;
	@Optional
	public String mMobileNetType;
	@Optional
	public int mCellID;
	@Optional
	public int mLac;

	@Override
	public void messagePack(final TDPacker pk) throws IOException {
		pk.packArray(23);
		pk.pack(mMobileModel);
		pk.pack(mOsSdkVersion);
		pk.pack(mGis);
		pk.pack(mCpuABI);
		pk.pack(mPixelMetric);
		pk.pack(mCountry);
		pk.pack(mCarrier);
		pk.pack(mLanguage);
		pk.pack(mTimezone);
		pk.pack(mOsVersion);
		pk.pack(mChannel);
		pk.pack(m2G_3G);
		pk.pack(isJailBroken);
		pk.pack(mSimOperator);
		pk.pack(mNetworkOperator);
		pk.pack(hostName);
		pk.pack(deviceName);
		pk.pack(kernBootTime);
		pk.pack(advertisingID);
		pk.pack(mWifiBSSID);
		pk.pack(mMobileNetType);
		pk.pack(mCellID);
		pk.pack(mLac);
	}
	
	@Override
	public String toString() {
		return new StringBuilder("DeviceProfile").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mMobileModel").append(Printag.STARTAG).append(mMobileModel).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mOsSdkVersion").append(Printag.STARTAG).append(mOsSdkVersion).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(mGis)
				.append(Printag.SPACE).append(Printag.SPACE).append("mCpuABI").append(Printag.STARTAG).append(mCpuABI).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mPixelMetric").append(Printag.STARTAG).append(mPixelMetric).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mCountry").append(Printag.STARTAG).append(mCountry).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mCarrier").append(Printag.STARTAG).append(mCarrier).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mLanguage").append(Printag.STARTAG).append(mLanguage).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mTimezone").append(Printag.STARTAG).append(mTimezone).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mOsVersion").append(Printag.STARTAG).append(mOsVersion).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mChannel").append(Printag.STARTAG).append(mChannel).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("m2G_3G").append(Printag.STARTAG).append(m2G_3G).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("isJailBroken").append(Printag.STARTAG).append(isJailBroken).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mSimOperator").append(Printag.STARTAG).append(mSimOperator).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mNetworkOperator").append(Printag.STARTAG).append(mNetworkOperator).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("hostName").append(Printag.STARTAG).append(hostName).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("deviceName").append(Printag.STARTAG).append(deviceName).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("kernBootTime").append(Printag.STARTAG).append(kernBootTime).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("advertisingID").append(Printag.STARTAG).append(advertisingID).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mWifiBSSID").append(Printag.STARTAG).append(mWifiBSSID).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mMobileNetType").append(Printag.STARTAG).append(mMobileNetType).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mCellID").append(Printag.STARTAG).append(mCellID).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mLac").append(Printag.STARTAG).append(mLac).append(Printag.ENDTAG)
				.toString();
	}
}
