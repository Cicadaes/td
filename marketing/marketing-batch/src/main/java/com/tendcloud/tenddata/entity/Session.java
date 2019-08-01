package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;
import org.msgpack.annotation.Optional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class Session implements TDMessagePackable {

	/**
	 * Session id
	 */
	public String id = "";
	/**
	 * Session的开始时间
	 */
	public long start;

	/**
	 * Session Status: 1: launch 2:continue 3:terminate
	 */
	public int mStatus;

	/**
	 * launch 为true,存储使用间隔 Terminate事件，存储session持续时间
	 */
	public int duration;
	
	/**
	 * Activity List
	 */
	public List<Activity> activities = new ArrayList<Activity>();
	/**
	 * AppEvent List
	 */
	public List<AppEvent> appEvents = new ArrayList<AppEvent>();
	
	@Optional
	public int isConnected;

	public int mLastSessionInterval=0;

	@Override
	public void messagePack(final TDPacker pk) throws IOException {
		pk.packArray(7);
		pk.pack(id);
		pk.pack(start);
		pk.pack(mStatus);
		pk.pack(duration);
		pk.packArray(activities.size());
		for (final Activity activity : activities) {
			pk.pack(activity);
		}
		pk.packArray(appEvents.size());
		for (final AppEvent appEvent : appEvents) {
			pk.pack(appEvent);
		}
		pk.pack(isConnected);
	}

	@Override
	public String toString() {
		return new StringBuilder("Session").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("id").append(Printag.STARTAG).append(id).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("start").append(Printag.STARTAG).append(start).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mStatus").append(Printag.STARTAG).append(mStatus).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("duration").append(Printag.STARTAG).append(duration).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("List<Activity>").append(Printag.LISTSTARTAG).append(activities.size()).append(Printag.LISTENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(activities).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("List<AppEvent>").append(Printag.LISTSTARTAG).append(appEvents.size()).append(Printag.LISTENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(appEvents).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("isConnected").append(Printag.STARTAG).append(isConnected).append(Printag.ENDTAG)
				.toString();
	}
}
