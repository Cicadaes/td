package com.talkingdata.datacloud.util;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>Datetime   : 2013-5-28 下午4:08:51</p>
 * <p>Title      : HttpErrorCode.java</p>
 * <p>Description: </p>
 * <p>Copyright  : Copyright (c) 2013</p>
 * <p>Company    : TendCloud</p>
 * @author  <a href="mailto:jinhu.fan@tendcloud.com">fjh</a>
 */
public class HttpErrorCode {

	public static final int SQL_EXCEPTION = 420;
	public static final int CONSTRANT_EXCEPTION = 421;
	public static final int NULL_EXCEPTION = 422;
	public static final int CUSTOME_EXCEPTION = 423;
	
	public static List<Integer> codes = new ArrayList<Integer>();
	
	static {
		synchronized (HttpErrorCode.class) {
			codes.add(SQL_EXCEPTION);
			codes.add(CONSTRANT_EXCEPTION);
			codes.add(NULL_EXCEPTION);
			codes.add(CUSTOME_EXCEPTION);
		}
	}
	
}
