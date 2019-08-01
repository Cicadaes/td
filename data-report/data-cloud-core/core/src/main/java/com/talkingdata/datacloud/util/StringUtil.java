package com.talkingdata.datacloud.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class StringUtil
{
	public static String formatNumber(int number, int destLength, char paddedChar)
	{
		String oldString = String.valueOf(number);
		StringBuffer newString = new StringBuffer("");
		int oldLength = oldString.length();
		if (oldLength > destLength)
		{
			newString.append(oldString.substring(oldLength - destLength));
		}
		else if (oldLength == destLength)
		{
			newString.append(oldString);
		}
		else
		{
			for (int i = 0; i < destLength - oldLength; i++)
			{
				newString.append(paddedChar);
			}
			newString.append(oldString);
		}
		return newString.toString();
	}
	
	public static String format2csv(List<String> sList){
		if (sList == null || sList.size() == 0){
			return "";
		}
		StringBuffer sb = new StringBuffer();
		for (String s : sList){
			sb.append(s).append(",");
		}
		return sb.substring(0, sb.length() -1);
	}
	
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
			paramTmp = m.group().replaceFirst("'", "");//替换第一个单引号
			paramTmp = paramTmp.replace(paramTmp.charAt(paramTmp.length()-1)+"","");//替换最后一个单引号
			
//			charset == null ? CHARSET_GBK : charset
			// System.out.println(new String(Base64.encodeBase64(paramTmp.getBytes())));
			// System.out.println(new String(Base64.encodeBase64(paramTmp.getBytes(), true)));
			// System.out.println(new String(Base64.encodeBase64(paramTmp.getBytes(), true, true)));

//			statement = statement.replace(paramTmp, new String(Base64.encodeBase64URLSafeString(paramTmp.getBytes()).getBytes(), "UTF-8"));
//			System.out.println(URLEncoder.encode(paramTmp, "UTF-8"));
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
			paramTmp = m.group().replaceFirst("'", "");//替换第一个单引号
			paramTmp = paramTmp.replace(paramTmp.charAt(paramTmp.length()-1)+"","");//替换最后一个单引号

			statement = statement.replace(paramTmp, URLDecoder.decode(paramTmp,"UTF-8"));
//			statement = statement.replace(paramTmp, new String(Base64.decodeBase64(paramTmp), "UTF-8"));
		}

		return statement;
	}

}
