package td.enterprise.common.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import org.apache.commons.io.IOUtils;

public class GZIPUtils {

  public static byte[] gzipString(String str, String encType)
      throws IOException {
    byte[] stringData = str.getBytes(encType);

    return gzipBytes(stringData);
  }

  public static byte[] gzipBytes(byte[] bytes) throws IOException {
    return gzipBytes(bytes, 0, bytes.length);
  }

  public static byte[] gzipBytes(byte[] bytes, int offset, int length)
      throws IOException {
    ByteArrayOutputStream byteOutputStream = new ByteArrayOutputStream();
    GZIPOutputStream gzipStream = null;

    gzipStream = new GZIPOutputStream(byteOutputStream);

    gzipStream.write(bytes, offset, length);
    gzipStream.close();
    return byteOutputStream.toByteArray();
  }

  public static byte[] unGzipBytes(byte[] bytes) throws IOException {
    ByteArrayInputStream byteInputStream = new ByteArrayInputStream(bytes);
    GZIPInputStream gzipInputStream = new GZIPInputStream(byteInputStream);

    ByteArrayOutputStream byteOutputStream = new ByteArrayOutputStream();
    IOUtils.copy(gzipInputStream, byteOutputStream);

    return byteOutputStream.toByteArray();
  }

  public static String unGzipString(byte[] bytes, String encType)
      throws IOException {
    byte[] response = unGzipBytes(bytes);
    return new String(response, encType);
  }
}
