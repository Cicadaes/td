package td.enterprise.wanalytics.etl.task.custom;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.GZipUtil;

/**
 * 可以对csv格式进行字段输出排序
 * columns 格式： 3:1:0 
 * @author junmin.li
 *
 */
public class ColumnFilterTask {
	
	public static Logger logger = Logger.getLogger(ColumnFilterTask.class);

	/**
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			Options options = new Options();
			options.addOption("inputFile", "inputFile", true, "输入文件");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			options.addOption("columns", "columns", true, "输出columns序号");
			options.addOption("inSeparator", "inSeparator", true, "原始文件分割符");
			options.addOption("ouputSeparator", "ouputSeparator", true, "输出文件分隔符");
			options.addOption("isGzip", "isGzip", true, "是否输出gzip 格式文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String inputFile = line.getOptionValue("inputFile");
			String outputFile = line.getOptionValue("outputFile");
			String inSeparator = line.getOptionValue("inSeparator");
			String ouputSeparator = line.getOptionValue("ouputSeparator");
			String columns = line.getOptionValue("columns");
			boolean isGzip = Boolean.parseBoolean(line.getOptionValue("isGzip"));
			long begin = System.currentTimeMillis();
			execute(inputFile, outputFile,inSeparator,ouputSeparator,columns,isGzip);
			long end = System.currentTimeMillis();
			logger.info("----ColumnFilterTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("数据过滤失败 ： ",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
		System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}

	public static void execute(String inputFile, String outputFile, String inSeparator, String ouputSeparator,String columns,boolean isGzip) throws Exception {
		BufferedReader br = null;
		BufferedWriter bw = null;
		int [] columIndex = null;
		FileReader fr = null;
		FileWriter fw = null;
		try {
			if(columns != null){
				String tempColumn [] = columns.split(":");
				columIndex = new int [tempColumn.length];
				for(int i=0;i<tempColumn.length; i ++){
					columIndex[i] = Integer.parseInt(tempColumn[i]);
				}
			}
			fr = new FileReader(inputFile);
			fw = new FileWriter(new File(outputFile));
			br = new BufferedReader(fr);
			bw = new BufferedWriter(fw);
			String line = br.readLine();
			while (null != line) {
				String [] values = line.split(inSeparator);
				if(columIndex != null &&  values != null){
					for(int i=0; i< columIndex.length; i ++){
						bw.append(values[columIndex[i]]);
						if(i != columIndex.length -1){
							bw.append(ouputSeparator);
						}
					}
				}
				bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
				line = br.readLine();
			}
			bw.flush();
		} catch (Exception e) {
			throw new Exception("FilterFileColumnTask failed!", e);
		} finally {
			FileUtil.close(br,bw,fr,fw);
		}
		
		if(isGzip){
			File file = new File(outputFile);
			String path = file.getParent();
			String fileName = file.getName();
			GZipUtil.gzip(outputFile, path, fileName + ".gz");
		}
	}
}
