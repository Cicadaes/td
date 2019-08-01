package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;

import java.io.IOException;
import java.io.Serializable;

/**
 * 
 * @author Bison
 * @since 2011-9-19
 */
public interface TDMessagePackable extends Serializable {

	/**
	 * 消息包
	 *
	 * @param pk
	 * @throws IOException IO Exception
	 */
	public void messagePack(TDPacker pk) throws IOException;

}
