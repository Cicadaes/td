package com.tenddata.bitmap.util;

import com.tenddata.bitmap.Bitmap;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class BitmapUtil {

	/**
	 * BitmapOperationRequest[] to bitset
	 */
	public static Bitmap byteArrayToBitmapRequest(byte[] bytearray) {
		ByteArrayInputStream bais = new ByteArrayInputStream(bytearray);
		GZIPInputStream gzipIn = null;
		ObjectInputStream is = null;
		try {
			gzipIn = new GZIPInputStream(bais);
			is = new ObjectInputStream(gzipIn);
			Bitmap bitmap = (Bitmap) is.readObject();
			return bitmap;
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			try {

				if (null != is)
				is.close();
				if (null != gzipIn)
				gzipIn.close();

				bais.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * BitmapOperationRequest to byte[]
	 */
	public static byte[] bitmapRequestToByteArray(Bitmap bitmapRequest) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		GZIPOutputStream gzip = null;
		ObjectOutputStream dout = null;
		try {
			gzip = new GZIPOutputStream(baos);
			dout = new ObjectOutputStream(gzip);
			dout.writeObject(bitmapRequest);
			gzip.finish();
			return baos.toByteArray();
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				if (null != dout)
				dout.close();
				if (null != gzip)
				gzip.close();

				baos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
