package td.enterprise.wanalytics.etl.util;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

public class ExcelUtil {
	public final static Logger logger = Logger.getLogger(ExcelUtil.class);

	/**
	 *
	 * 
	 * @param filePath Excel文件路径
	 * @param sheetName Excel工作表名称
	 * @return
	 * @throws Exception
	 */
	/**
	 * 读取Sheet数据
	 * @param is
	 * @param sheetName
	 * @param startRowNum
	 * @return
	 * @throws Exception
	 */
	public static  List<String[]> readSheetDataByParam( InputStream is, String sheetName, int startRowNum) throws Exception {
		List<String[]> datas = new ArrayList<String[]>();		
		HSSFWorkbook   hssfWorkbook = new HSSFWorkbook(is);
		HSSFSheet  hssfSheet = hssfWorkbook.getSheet(sheetName);
		for (int rowNum = startRowNum; rowNum <= hssfSheet.getPhysicalNumberOfRows(); rowNum++) {
			HSSFRow hssfRow = hssfSheet.getRow(rowNum);
			if (hssfRow != null) {
				int cellNum = hssfRow.getLastCellNum();
				String[] data = new String[cellNum];
				for (int i = 0; i < cellNum; i++) {
					try {
						data[i] = getCellDataStringVal(hssfRow.getCell(i), null);//hssfRow.getCell(i) == null ? "" : hssfRow.getCell(i).getStringCellValue();
					} catch (Exception e) {
						e.printStackTrace();
						continue;
					}
				}
				datas.add(data);
			}
		}

		hssfWorkbook.close();
		return datas;
	}
	
	private static String getCellDataStringVal(Cell cell, FormulaEvaluator formula) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    switch (cell.getCellType()) {
	    case Cell.CELL_TYPE_STRING:
	        return cell.getRichStringCellValue().getString();
	    case Cell.CELL_TYPE_NUMERIC:
	        if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
	        	Date date = cell.getDateCellValue(); 
	            return sdf.format(date); 
	        } else {
	            return String.valueOf((int)cell.getNumericCellValue());
	        }
	    case Cell.CELL_TYPE_BOOLEAN:
	        return String.valueOf(cell.getBooleanCellValue());
	    case Cell.CELL_TYPE_FORMULA:
	        return String.valueOf(formula.evaluate(cell).getNumberValue());
	    default:
	        return null;
	    }
	}

	
	/**
	 * 读取Sheet数据
	 * 
	 * @param filePath Excel文件路径
	 * @param sheetName Excel工作表名称
	 * @return
	 * @throws Exception
	 */
	public static  List<String[]> readSheetData(String filePath, String sheetName) throws Exception {
		List<String[]> datas = new ArrayList<String[]>();		
		InputStream is = new FileInputStream(filePath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
		XSSFSheet xssfSheet = xssfWorkbook.getSheet(sheetName);

		for (int rowNum = 0; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
			XSSFRow xssfRow = xssfSheet.getRow(rowNum);
			if (xssfRow != null) {
				int cellNum = xssfRow.getLastCellNum();
				String[] data = new String[cellNum];
				for (int i = 0; i < cellNum; i++) {
					data[i] = xssfRow.getCell(i) == null ? "" : xssfRow.getCell(i).getStringCellValue();
				}
				datas.add(data);
			}
		}

		xssfWorkbook.close();
		return datas;
	}
	
	public static  List<String[]> readSheetData(String filePath, String sheetName,int fromIndex) throws Exception {
		List<String[]> datas = new ArrayList<String[]>();		
		InputStream is = new FileInputStream(filePath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
		XSSFSheet xssfSheet = xssfWorkbook.getSheet(sheetName);
		for (int rowNum = fromIndex; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
			XSSFRow xssfRow = xssfSheet.getRow(rowNum);
			if (xssfRow != null) {
				int cellNum = xssfRow.getLastCellNum();
				String[] data = new String[cellNum];
				for (int i = 0; i < cellNum; i++) {
					Cell cell = xssfRow.getCell(i);
					if(null != cell){
						data[i] = getCellDataStringVal(cell , null );
					}
				}
				datas.add(data);
			}
		}

		xssfWorkbook.close();
		return datas;
	}

	/**
	 * 按token读取sheet数据
	 * 
	 * @param filePath Excel文件路径
	 * @param sheetName Excel工作表名称
	 * @param tokens token数组
	 * @return
	 * @throws Exception
	 */
	public static Map<String, List<String[]>> readSheetDataByToken(String filePath, String sheetName, final List<String> tokens) throws Exception {
		Map<String, List<String[]>> tokenMap = new HashMap<String, List<String[]>>();

		InputStream is = new FileInputStream(filePath);
		XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
		XSSFSheet xssfSheet = xssfWorkbook.getSheet(sheetName);

		for (int rowNum = 0; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
			XSSFRow xssfRow = xssfSheet.getRow(rowNum);
			if (xssfRow != null) {
				String value = xssfRow.getCell(0).getStringCellValue();
				if (tokens.indexOf(value) != -1) {
					List<String[]> tokenData = readTokenData(xssfSheet, rowNum);
					tokenMap.put(value, tokenData);
				}
			}
		}

		xssfWorkbook.close();

		return tokenMap;
	}

	/**
	 * 从token行读取数据，遇到空行停止读取
	 * 
	 * @param xssfSheet Excel工作表
	 * @param tokenRowNum token行数
	 * @return
	 */
	private static List<String[]> readTokenData(XSSFSheet xssfSheet, int tokenRowNum) {
		List<String[]> tokenData = new ArrayList<String[]>();
		int rowNum = tokenRowNum + 1;
		while (true) {
			XSSFRow xssfRow = xssfSheet.getRow(rowNum);
			if (xssfRow == null || StringUtils.isBlank(xssfRow.getCell(0).getStringCellValue())) {
				break;
			}
			int cellNum = xssfRow.getLastCellNum();
			String[] datas = new String[cellNum];
			for (int i = 0; i < cellNum; i++) {
				datas[i] = xssfRow.getCell(i) == null ? "" : xssfRow.getCell(i).getStringCellValue();
			}
			tokenData.add(datas);
			rowNum++;
		}
		return tokenData;
	}
	
	public static String checkExcelMacValid(String data){
		String errorMsg = "";
		String mac = data;
		mac = mac.toLowerCase();
		
		//mac格式校验
		String patternMac="^[a-f0-9]{2}(:[a-f0-9]{2}){5}$";  
	    if(!Pattern.compile(patternMac).matcher(mac).find()){  
	        logger.info("该mac地址("+mac+")格式错误");  
	        errorMsg="mac地址("+mac+")格式错误";
	    }
		return errorMsg;
	}

}
