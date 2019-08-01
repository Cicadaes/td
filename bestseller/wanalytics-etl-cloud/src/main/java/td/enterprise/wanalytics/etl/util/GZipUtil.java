package td.enterprise.wanalytics.etl.util;

import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.compress.utils.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class GZipUtil {

	/**
	 * 日志
	 */
	public static Logger logger = LoggerFactory.getLogger(GZipUtil.class);
	
	/**
	 * 压缩文件成gz格式
	 * 
	 * @param filePath
	 *            被压缩文件路径
	 * @param gzipPath
	 *            存储压缩文件的路径
	 * @param gzipName
	 *            gzip压缩文件的文件名
	 * @throws IOException
	 */
	public static void gzip(String filePath, String gzipPath, String gzipName) throws Exception {
		logger.info("filePath " + filePath);
		logger.info("gzip file path " + gzipPath + File.separatorChar + gzipName);
		InputStream input = null;
		OutputStream output = null;
		FileInputStream fs = null;
		FileOutputStream fo = null;
		try {
			fs = new FileInputStream(new File(filePath));
			fo = new FileOutputStream(new File(gzipPath + File.separatorChar + gzipName));
			input = new BufferedInputStream(fs, 1024);
			output = new GzipCompressorOutputStream(new BufferedOutputStream(
					fo, 1024));
			IOUtils.copy(input, output);
		} catch (Exception e) {
			throw e;
		} finally {
			FileUtil.close(input,output,fs,fo);
		}
	}

	/**
	 * 解压文件
	 * @param gzipFilePath gzip文件路径
	 * @param ungzipFilePath 解压文件路径
	 * @throws Exception e
	 */
	public static void ungzip(String gzipFilePath, String ungzipFilePath) throws Exception {
		InputStream input = null;
		OutputStream output = null;
		FileInputStream fs = null;
		FileOutputStream fo = null;
		try {
			fs = new FileInputStream(gzipFilePath);
			fo = new FileOutputStream(ungzipFilePath);
			input = new GzipCompressorInputStream(new BufferedInputStream(fs, 1024));
			output = new BufferedOutputStream(fo, 1024);
			IOUtils.copy(input, output);
		} catch (Exception e) {
			throw e;
		} finally {
			FileUtil.close(input,output,fs,fo);
		}

	}

	/**
	 * 压缩
	 * @param str
	 * @return
	 * @throws IOException
	 */
	public static String gzip(String str) throws IOException {
		if (str == null || str.length() == 0) {
			return str;
		}
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		GZIPOutputStream gzip = new GZIPOutputStream(out);
		gzip.write(str.getBytes());
		gzip.close();
		out.flush();
		out.close();
		return out.toString("ISO-8859-1");
	}

	/**
	 * 解压缩
	 * @param str
	 * @return
	 * @throws IOException
	 */
	public static String ungzip(String str) throws IOException {
		if (str == null || str.length() == 0) {
			return str;
		}
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		ByteArrayInputStream in = new ByteArrayInputStream(str
				.getBytes("ISO-8859-1"));
		GZIPInputStream gunzip = new GZIPInputStream(in);
		byte[] buffer = new byte[256];
		int n;
		while ((n = gunzip.read(buffer))>= 0) {
			out.write(buffer, 0, n);
		}
		return out.toString();
	}


}
