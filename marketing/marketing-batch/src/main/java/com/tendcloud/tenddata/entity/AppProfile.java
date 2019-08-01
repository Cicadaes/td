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
public class AppProfile implements TDMessagePackable {

	/**
	 * 应用包名称
	 */
	public String mAppPackageName = "";
	/**
	 * 应用版本名称如：疯狂的小鸟太空版
	 */
	public String mAppVersionName = "";
	/**
	 * 应用版本号
	 */
	public String mAppVersionCode = "";
	/**
	 * App启动时间
	 */
	public long mStartTime;
	/**
	 * TC SDK 版本号
	 */
	public String mSdkVersion = "";
	/**
	 * 渠道ID	
	 */
	public String mPartnerId = "";
	
	/**
	 * for collector
	 */
	@Optional
	public boolean isCracked = false;
	
	public long installationTime = 0;
	
	public long purchaseTime = 0;

	/**
	 * 对应1.5版本修改，只有ios会用到此字段
	 */
	@Optional
	public long appStoreID;

	@Override
	public void messagePack(final TDPacker pk) throws IOException {
		pk.packArray(9);
		pk.pack(mAppPackageName);
		pk.pack(mAppVersionName);
		pk.pack(mAppVersionCode);
		pk.pack(mStartTime);
		pk.pack(mSdkVersion);
		pk.pack(mPartnerId);
		pk.pack(isCracked);
		pk.pack(installationTime);
		pk.pack(purchaseTime);
	}
	
	@Override
	public String toString() {
		return new StringBuilder("AppProfile").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mAppPackageName").append(Printag.STARTAG).append(mAppPackageName).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mAppVersionName").append(Printag.STARTAG).append(mAppVersionName).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mAppVersionCode").append(Printag.STARTAG).append(mAppVersionCode).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mStartTime").append(Printag.STARTAG).append(mStartTime).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mSdkVersion").append(Printag.STARTAG).append(mSdkVersion).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("mPartnerId").append(Printag.STARTAG).append(mPartnerId).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("isCracked").append(Printag.STARTAG).append(isCracked).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("installationTime").append(Printag.STARTAG).append(installationTime).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("purchaseTime").append(Printag.STARTAG).append(purchaseTime).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append("appStoreID").append(Printag.STARTAG).append(appStoreID).append(Printag.ENDTAG)
				.toString();
	}
}
