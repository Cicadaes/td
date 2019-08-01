package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;

import java.io.IOException;
import java.io.Serializable;

/**
 * TD序列化接口
 * @author Bison
 * @since 2011-9-19
 */
public interface TDMessagePackable extends Serializable {

	/**
	 * 配置需要序列化的数据
	 * @param pk
	 * @throws IOException
	 */
	public void messagePack(TDPacker pk) throws IOException;

}
