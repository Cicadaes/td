package com.talkingdata.datacloud.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @description:
 * @author: cmh 2016年5月10日
 * @version: 1.0
 * @modify:
 * @Copyright: 2015, Beijing TendCloud Science & Technology Co., Ltd.
 */
@Deprecated
public class StringBASE64Util {

	/**
	 * 将单引号中的内容替换成BASE64 code
	 * 
	 * @param oldStr
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	public static String encodeForQuotation(String statement) throws IOException {
		Pattern p = Pattern.compile("\'(.*?)\'");
		Matcher m = p.matcher(statement);
		String paramTmp = "";
		while (m.find()) {
//			paramTmp = m.group();
//			paramTmp = m.group().replaceAll("'", "");
			paramTmp = m.group().replaceFirst("'", "");
			paramTmp = paramTmp.replace(paramTmp.charAt(paramTmp.length()-1)+"","");
			
//			charset == null ? CHARSET_GBK : charset
			// System.out.println(new String(Base64.encodeBase64(paramTmp.getBytes())));
			// System.out.println(new String(Base64.encodeBase64(paramTmp.getBytes(), true)));
			// System.out.println(new String(Base64.encodeBase64(paramTmp.getBytes(), true, true)));

//			statement = statement.replace(paramTmp, new String(Base64.encodeBase64URLSafeString(paramTmp.getBytes()).getBytes(), "UTF-8"));
			System.out.println(URLEncoder.encode(paramTmp, "UTF-8"));
			statement = statement.replace(paramTmp, URLEncoder.encode(paramTmp,"UTF-8"));
//			statement = statement.replace(paramTmp, new String(Base64.encodeBase64URLSafeString(paramTmp.getBytes()).getBytes(), "UTF-8"));
		}

		return statement;
	}

	/**
	 * 将单引号中的BASE64 code内容替换成原值
	 * 
	 * @param oldStr
	 * @return
	 * @throws IOException
	 */
	public static String decodeForQuotation(String statement) throws IOException {
		Pattern p = Pattern.compile("\'(.*?)\'");
		Matcher m = p.matcher(statement);
		String paramTmp = "";
		while (m.find()) {
//			paramTmp = m.group();
			paramTmp = m.group().replaceFirst("'", "");
			paramTmp = paramTmp.replace(paramTmp.charAt(paramTmp.length()-1)+"","");

			statement = statement.replace(paramTmp, URLDecoder.decode(paramTmp,"UTF-8"));
//			statement = statement.replace(paramTmp, new String(Base64.decodeBase64(paramTmp), "UTF-8"));
		}

		return statement;
	}

}
