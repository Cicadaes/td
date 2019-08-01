package com.talkingdata.marketing.core.util;

import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import info.monitorenter.cpdetector.CharsetPrinter;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

/**
 * The type File util.
 * @author hongsheng
 */
public class FileUtil {
    /**
     * The constant UTF8_BOM_BYTES.
     */
    public static final byte[] UTF8_BOM_BYTES = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};

    /**
     * Generate file file.
     *
     * @param file     the file
     * @param pathname the pathname
     * @return the file
     * @throws IOException the io exception
     */
    public static File generateFile(MultipartFile file, String pathname) throws IOException {
        File certificate = new File(pathname);
        FileUtils.copyInputStreamToFile(file.getInputStream(), certificate);
        return certificate;
    }

    /**
     * Remove utf 8 bom byte [ ].
     *
     * @param bytes the bytes
     * @return the byte [ ]
     * @throws UnsupportedEncodingException the unsupported encoding exception
     */
    public static byte[] removeUTF8BOM(byte[] bytes) throws UnsupportedEncodingException {
        boolean containsBOM = bytes.length >= 3
                && bytes[0] == UTF8_BOM_BYTES[0]
                && bytes[1] == UTF8_BOM_BYTES[1]
                && bytes[2] == UTF8_BOM_BYTES[2];
        if (containsBOM) {
            String s = new String(bytes, 3, bytes.length - 3);
            bytes = s.getBytes("utf-8");
        }
        return bytes;
    }

    /**
     * Merge bytes byte [ ].
     *
     * @param data1 the data 1
     * @param data2 the data 2
     * @return the byte [ ]
     */
    public static byte[] mergeBytes(byte[] data1, byte[] data2) {
        byte[] data3 = new byte[data1.length + data2.length];
        System.arraycopy(data1, 0, data3, 0, data1.length);
        System.arraycopy(data2, 0, data3, data1.length, data2.length);
        return data3;
    }

    /**
     * File check.
     *
     * @param file   the file
     * @param suffix the suffix
     * @throws Exception the exception
     */
    public static void fileCheck(MultipartFile file,String suffix) throws Exception {
        ExceptionBuilder exceptionBuilder = (ExceptionBuilder)SpringContextUtil.getBean("exceptionBuilder");
        boolean regularSuffixFlag = file.getOriginalFilename().endsWith(suffix);
        if (!regularSuffixFlag) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_CSV);
        }
        String pathName = "fileupload/" + file.getOriginalFilename() + "_" + UUID.randomUUID().toString();
        File localTempFile = FileUtil.generateFile(file, pathName);
        //编码为UTF-8
        if (StandardCharsets.UTF_8.displayName().equals(new CharsetPrinter().guessEncoding(localTempFile))) {
            byte[] data = FileUtil.removeUTF8BOM(file.getBytes());
            if (data.length<=0){
                throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_EMPTY);
            }
            FileUtils.forceDelete(localTempFile);
        } else {
            FileUtils.forceDelete(localTempFile);
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_UTF8);
        }
    }

    /**
     * File check.
     *
     * @param file   the file
     * @param suffix the suffix
     * @throws Exception the exception
     */
    public static void fileCheck(File file,String suffix) throws Exception {
        ExceptionBuilder exceptionBuilder = (ExceptionBuilder)SpringContextUtil.getBean("exceptionBuilder");
        boolean regularSuffixFlag = file.getName().endsWith(AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        if (!regularSuffixFlag) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_CSV);
        }
        //编码为UTF-8
        if (StandardCharsets.UTF_8.name().equals(new CharsetPrinter().guessEncoding(file))) {
            try(FileInputStream in = new FileInputStream(file)){
                byte[] data = FileUtil.removeUTF8BOM(IOUtils.toByteArray(in));
                if (data.length<=0){
                    throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_EMPTY);
                }
            }
        } else {
            throw exceptionBuilder.buildMktException(ExceptionMessage.FILE_NOT_UTF8);
        }
    }
}
