package td.enterprise.common.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * Created by loong on 4/13/16.
 */
public class ServletGzipUtil {


    /**
     * 创建以gzip格式输出的PrintWriter对象，如果浏览器不支持gzip格式，则创建普通的PrintWriter对象，
     *
     * @param req
     * @param resp
     * @return
     * @throws IOException
     */
    public static PrintWriter createGzipPrintWriter(HttpServletRequest req, HttpServletResponse resp) throws IOException {
//        PrintWriter pw;
//        if (isGzipSupport(req)) {
//            pw = new PrintWriter(new GZIPOutputStream(resp.getOutputStream()));
//            resp.setHeader("content-encoding", "gzip");
//        } else {
//            pw = resp.getWriter();
//        }
        PrintWriter pw = new PrintWriter(new GZIPOutputStream(resp.getOutputStream()));
        resp.setHeader("content-encoding", "gzip");
        return pw;
    }


    private static boolean isGzipSupport(HttpServletRequest request) {
        String headEncoding = request.getHeader("accept-encoding");
        return !(headEncoding == null || (!headEncoding.contains("gzip")));
    }

    public static BufferedInputStream isGzipRequest(HttpServletRequest request) {
    	byte[] header = new byte[2];
    	BufferedInputStream ips = null;
    	try {
			BufferedInputStream bufferedInputStream = new BufferedInputStream(request.getInputStream());
			bufferedInputStream.mark(2);
			int read = bufferedInputStream.read(header);
			bufferedInputStream.reset(); 
			int ss = (header[0] & 0xff) | ((header[1] & 0xff) << 8);
			if(read!=-1 && ss == GZIPInputStream.GZIP_MAGIC) {  
				BufferedInputStream gzipInputStream = new BufferedInputStream(new GZIPInputStream(bufferedInputStream));  
	            return gzipInputStream;  
			}else{
				 ips= bufferedInputStream;
			}
			return ips;
			
		} catch (IOException e) {
			e.printStackTrace();
		}
//    	Enumeration headerNames = request.getHeaderNames();
//    	while (headerNames.hasMoreElements()) {
//			Object nextElement = headerNames.nextElement();
//			String header = request.getHeader(nextElement.toString());
//			testlogger.info(nextElement.toString() + "==" +header);
//		}
		return ips;
    }
    
    public static BufferedInputStream isGzipfile(InputStream input) {
    	byte[] header = new byte[2];
    	BufferedInputStream ips = null;
    	try {
			BufferedInputStream bufferedInputStream = new BufferedInputStream(input);
			bufferedInputStream.mark(2);
			int read = bufferedInputStream.read(header);
			bufferedInputStream.reset(); 
			int ss = (header[0] & 0xff) | ((header[1] & 0xff) << 8);
			if(read!=-1 && ss == GZIPInputStream.GZIP_MAGIC) {  
				BufferedInputStream gzipInputStream = new BufferedInputStream(new GZIPInputStream(bufferedInputStream));  
	            return gzipInputStream;  
			}else{
				 ips= bufferedInputStream;
			}
			return ips;
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ips;
    }
}
