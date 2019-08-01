package com.talkingdata.datacloud.util;

import org.apache.log4j.Logger;

import java.io.*;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * 持续读写CSV文件工具类
 * 
 * @author Anjie.Li
 */
public class CSVUtil {

	public final static Logger logger = Logger.getLogger(CSVUtil.class);
	/**
	 * CSV文件分割标记
	 */
	public static String CSV_SPACE = ",";
	/**
	 * 文件
	 */
	private File csv = null;
	/**
	 * 输出流
	 */
	private BufferedWriter bw = null;

	/**
	 * 初始化输出流
	 * @param filePath
	 */
	public void writeInit(String filePath) {
		try {
			csv = new File(filePath);
			bw = new BufferedWriter(new FileWriter(csv));
		} catch (IOException e) {
			logger.error("IO异常", e);
		}
	}

	/**
	 * 输出数据到文件
	 * @param filePath
	 * @param rows
	 */
	@SuppressWarnings({ "rawtypes" })
	public void write(List<Map> rows) {
		if(csv == null || bw == null){
			logger.debug("请初始化输出流!");
			return;
		}
		try {
			Iterator iterator = null;
			for (int i = 0; i < rows.size(); i++) {
				Map map = rows.get(i);
				// 获取key
				if (iterator == null)
					iterator = map.keySet().iterator();
				StringBuffer rowStr = new StringBuffer();
				while (iterator.hasNext()) {
					Object value = map.get(iterator.next());
					if (value != null)
						rowStr.append(value);
					rowStr.append(CSV_SPACE);
				}
				rowStr.deleteCharAt(rowStr.length() - 1);
				bw.write(rowStr.toString());
				bw.newLine();
			}
			//写入文件
			bw.flush();
			logger.debug("成功输出CSV数据至文件");
		} catch (IOException e) {
			logger.error("IO异常", e);
		}
	}
	
	/**
	 * 关闭输出流
	 * @param filePath
	 */
	public void writeClose() {
		try {
			bw.close();
		} catch (IOException e) {
			logger.error("IO异常", e);
		}
	}
	
	/**
	 * 一次性将所以数据用输出流输出
	 * @param rows
	 * @throws Exception 
	 */
	@SuppressWarnings({ "rawtypes" })
	public void write(OutputStream os, List<Map> rows,String[] colums) throws Exception {
		for (int i = 0; i < rows.size(); i++) {
			Map row = rows.get(i);
			StringBuffer rowStr = new StringBuffer();
			for (int j = 0; j < colums.length; j++) {
				Object value = row.get(colums[j]);
				rowStr.append(value);
				rowStr.append(CSV_SPACE);
			}
			rowStr.deleteCharAt(rowStr.length() - 1);
			rowStr.append("\n");
			os.write(rowStr.toString().getBytes());
		}
		os.flush();
		os.close();
		logger.debug("成功输出CSV数据至文件");
	}
}
