package com.talkingdata.marketing.core.util;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.util.StringUtils;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

/**
 * The type Excel util.
 * @author hongsheng
 */
public class ExcelUtil {
	/**
	 * Create a new Workbook with the given sheetName and format, and objList.
	 *
	 * @param sheetName 需要创建的sheet名称
	 * @param format    表头的mapping.eg:                  new String[]{                  "活动名称,name","活动时间,dateRange","活动状态,status",                  "创建人,owner","目标达成率,targetReachSituation"}
	 * @param objList   the obj list
	 * @return the input stream
	 * @throws Exception the exception
	 */
	public static InputStream buildWorkbook(String sheetName, String[] format, List objList) throws Exception {
        Workbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet(sheetName);
        buildSheet(format, objList, sheet);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        wb.write(os);
        byte[] content = os.toByteArray();
        InputStream is = new ByteArrayInputStream(content);
        return is;
    }

	/**
	 * Build workbook by map workbook.
	 *
	 * @param sheetName the sheet name
	 * @param format    the format
	 * @param mapList   the map list
	 * @return the workbook
	 * @throws Exception the exception
	 */
	public static Workbook buildWorkbookByMap(String sheetName, String[] format, List<Map<String, Object>> mapList) throws Exception {
        Workbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet(sheetName);
        buildSheetByMap(format, mapList, sheet);
        return wb;
    }

	/**
	 * Build sheet.
	 *
	 * @param format  the format
	 * @param objList the obj list
	 * @param sheet   the sheet
	 * @throws Exception the exception
	 */
	public static void buildSheet(String[] format, List objList, Sheet sheet) throws Exception {
        int xIndex = 0;
        int yIndex = 0;
        Row titleRow = sheet.createRow(yIndex);
        yIndex++;
        buildHeader(format, xIndex, titleRow, sheet);
        buildContent(format, objList, sheet, yIndex);
    }

    private static void buildContent(String[] format, List objList, Sheet sheet, int yIndex) throws Exception {
        int xIndex;
        for (int i = 0; i < objList.size(); i++) {
            Row row = sheet.createRow(yIndex);
            yIndex++;
            xIndex = 0;
            for (String ff : format) {
                String[] fms = ff.split(",");
                if (fms.length < 2) {
                    continue;
                }
                String prop = fms[1];
                String fieldVal = getFieldValByObj(objList.get(i), prop);
                row.createCell((short) xIndex).setCellValue(fieldVal);
                int columnWidth = sheet.getColumnWidth(xIndex);
                if (!StringUtils.isEmpty(fieldVal) && fieldVal.getBytes().length * 256 > columnWidth) {
                    sheet.setColumnWidth(xIndex, fieldVal.getBytes().length * 256);
                }
                xIndex++;
            }
        }
    }

	/**
	 * Write row.
	 *
	 * @param rowItem the row item
	 * @param sheet   the sheet
	 * @param yIndex  the y index
	 * @throws Exception the exception
	 */
	public static void writeRow(List<String> rowItem, Sheet sheet, int yIndex) throws Exception {
        Row row = sheet.createRow(yIndex);

        int xIndex = 0;
        for (String item:rowItem) {
            Cell cell = row.createCell((short) xIndex);
            cell.setCellValue(item);
            int columnWidth = sheet.getColumnWidth(xIndex);
            if (!StringUtils.isEmpty(item) && item.getBytes().length * 256 > columnWidth) {
                sheet.setColumnWidth(xIndex, item.getBytes().length * 256);
            }
            xIndex++;
        }
    }

	/**
	 * Merge region.
	 *
	 * @param sheet    the sheet
	 * @param firstRow the first row
	 * @param lastRow  the last row
	 * @param firstCol the first col
	 * @param lastCol  the last col
	 */
	public static void mergeRegion(Sheet sheet, int firstRow, int lastRow, int firstCol, int lastCol) {
        CellRangeAddress region = new CellRangeAddress(
                firstRow, lastRow, firstCol, lastCol
        );
        sheet.addMergedRegion(region);

        // set cell VERTICAL_CENTER
        Row row = sheet.getRow(firstRow);
        Cell cell = row.getCell(firstCol);
        CellStyle cellStyle = cell.getCellStyle();
        cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
    }

	/**
	 * Write excel content input stream.
	 *
	 * @param excelRows the excel rows
	 * @param sheetName the sheet name
	 * @return the input stream
	 * @throws Exception the exception
	 */
	public static InputStream writeExcelContent(List<List<String>> excelRows, String sheetName) throws Exception{
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        HSSFWorkbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet(sheetName);
        int yIndex = 0;
        for (List<String> row : excelRows) {
            ExcelUtil.writeRow(row, sheet, yIndex);
            yIndex++;
        }
        wb.write(bos);
        byte[] content = bos.toByteArray();
        return new ByteArrayInputStream(content);
    }

	/**
	 * Build sheet by map.
	 *
	 * @param format  the format
	 * @param mapList the map list
	 * @param sheet   the sheet
	 * @throws Exception the exception
	 */
	public static void buildSheetByMap(String[] format, List<Map<String, Object>> mapList, Sheet sheet) throws Exception {
        int xIndex = 0;
        int yIndex = 0;
        Row titleRow = sheet.createRow(yIndex);
        yIndex++;
        buildHeader(format, xIndex, titleRow, sheet);

        for (Map<String, Object> map : mapList) {
            Row row = sheet.createRow(yIndex);
            yIndex++;
            xIndex = 0;
            for (String ff : format) {
                String[] fms = ff.split(",");
                if (fms.length < 2) {
                    continue;
                }
                String prop = fms[1];
                String fieldVal = map.get(prop).toString();
                row.createCell((short) xIndex).setCellValue(fieldVal);
                int columnWidth = sheet.getColumnWidth(xIndex);
                if (!StringUtils.isEmpty(fieldVal) && fieldVal.getBytes().length * 256 > columnWidth) {
                    sheet.setColumnWidth(xIndex, fieldVal.getBytes().length * 256);
                }
                xIndex++;
            }
        }
    }

    private static void buildHeader(String[] format, int xIndex, Row titleRow, Sheet sheet) {
        for (String ff : format) {
            String[] fms = ff.split(",");
            String title = fms[0];
            HSSFRichTextString s = new HSSFRichTextString(title);
            titleRow.createCell((short) xIndex).setCellValue(s);
            sheet.setColumnWidth(xIndex, title.getBytes().length * 256);
            xIndex++;
        }
    }

    private static String getFieldValByObj(Object o, String field) throws Exception {
        Field declaredField = null;
        Class c = o.getClass();
        while (true) {
            try {
                declaredField = c.getDeclaredField(field);
                break;
            } catch (NoSuchFieldException e) {
                c = c.getSuperclass();
            }
            if ("Object".equals(c.getSimpleName())) {
                break;
            }
        }
        if (declaredField == null) {
            return null;
        }
        declaredField.setAccessible(true);
        Object obj = declaredField.get(o);
        if (obj == null) {
            return null;
        }
        return obj.toString();
    }
}