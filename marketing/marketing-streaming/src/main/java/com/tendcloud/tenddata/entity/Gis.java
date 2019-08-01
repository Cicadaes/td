package com.tendcloud.tenddata.entity;

import java.io.IOException;

import org.msgpack.annotation.Message;

import com.tendcloud.tenddata.msgpack.TDPacker;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class Gis implements TDMessagePackable {

	/**
	 * 经度
	 */
	public double lng;
	/**
	 * 纬度
	 */
	public double lat;

	@Override
	public void messagePack(final TDPacker pk) throws IOException {
		pk.packArray(2);
		pk.pack(lng);
		pk.pack(lat);
	}
	
	@Override
	public String toString() {
		return new StringBuilder("Gis").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("lng").append(Printag.STARTAG).append(lng).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("lat").append(Printag.STARTAG).append(lat).append(Printag.ENDTAG).toString();
	}
}
