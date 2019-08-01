package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class EventPackage implements TDMessagePackable {
	/**
	 * 设备id
	 * <p/>
	 * 1.可以取到IMEI，devId = "IMEI-" + md5(IMEI)；
	 * </p>
	 * 2.不能取到IMEI，但能取到WIFI的MAC，devId = "MAC-" + md5(MAC)；
	 * <p/>
	 * 3.IMEI和wifi MAC都取不到，devId = new UUID()；
	 */	
	public String mDeviceId="";
	
	/**
	 * 开发这的App key
	 */
	public String mDeveploperAppkey = "";
	
	/**
	 * 应用的Profile
	 */
	public AppProfile  mAppProfile = new AppProfile();
	
	/**
	 * Server要求每次交互都上传的信息
	 */
	public DeviceProfile mDeviceProfile = new DeviceProfile();
	/**
	 * 事件List
	 */
	public List<TMessage> mTMessages = new ArrayList<TMessage>();
	
	public List<long[]> activeApps = null;
	
	public String ip = null;

	/**
	 *采集时间的毫秒值
	 */
	public Long rectime = null;

    /**
     * 附加属性对象
     */
	public AdditiveProfile additiveProfile = new AdditiveProfile();

	/**
	 * 用户的Profile
	 */
	public UserProfile userProfile = new UserProfile();

	@Override
	public void messagePack(final TDPacker pk) throws IOException {
		pk.packArray(8);
		pk.pack(mDeviceId);
		pk.pack(mDeveploperAppkey);
		pk.pack(mAppProfile);
		pk.pack(mDeviceProfile);
		pk.packArray(mTMessages.size());
		for (final TMessage event : mTMessages) {
			pk.pack(event);
		}
		pk.pack(additiveProfile);
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder("EventPackage");
		sb.append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append("mDeviceId").append(Printag.STARTAG).append(mDeviceId).append(Printag.ENDTAG)
				.append(Printag.SPACE).append("mDeveploperAppkey").append(Printag.STARTAG).append(mDeveploperAppkey).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(mAppProfile)
				.append(Printag.SPACE).append(mDeviceProfile)
				.append(Printag.SPACE).append("List<TMessage>").append(Printag.LISTSTARTAG).append(mTMessages.size()).append(Printag.LISTENDTAG)
				.append(Printag.SPACE).append(mTMessages)
				.append(Printag.SPACE).append(userProfile);

		
		if (activeApps != null) {
			sb.append(Printag.OBJENDTAG).append("List<activeApps>").append(Printag.LISTSTARTAG).append(activeApps.size()).append(Printag.LISTENDTAG);
			for (long[] aa : activeApps) {
				sb.append(Printag.SPACE).append("<");
				if (aa != null) {
					for (long a : aa) {
						sb.append(a).append(" ");
					}
				} else {
					sb.append("null");
				}
				sb.append(Printag.ENDTAG);
			}
		} else {
			sb.append("List<activeApps>").append(Printag.STARTAG).append("null").append(Printag.ENDTAG);
		}
		sb.append(Printag.SPACE).append(additiveProfile);
		return sb.toString();
	}

}
