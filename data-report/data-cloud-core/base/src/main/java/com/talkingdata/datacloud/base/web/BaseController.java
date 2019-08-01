package com.talkingdata.datacloud.base.web;

import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaseController {

    protected BaseController() {}

    private static final String DATA = "data";
    private static final String TOTAL = "total";

    public static Map<String, Object> getGridData(int total, List<?> rows) {
        Map<String, Object> response = new HashMap<>();
        response.put(TOTAL, total);
        response.put(DATA, rows);
        return response;
    }

    public static Map<String, Object> getData(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put(DATA, data);
        return response;
    }

    public static void download(HttpServletResponse response, File file) throws IOException {
        download(response, file, file.getName());
    }

    public static void download(HttpServletResponse response, File file, String fileName)
            throws IOException {
        try (FileInputStream in = new FileInputStream(file)) {
            download(response, in, fileName);
        }
    }

    public static void download(HttpServletResponse response, InputStream in, String fileName)
            throws IOException {
        response.setContentType("application/x-msdownload;");
        response.addHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(fileName, "UTF-8"));
        response.setCharacterEncoding("UTF-8");
        IOUtils.copy(in, response.getOutputStream());
    }

}
