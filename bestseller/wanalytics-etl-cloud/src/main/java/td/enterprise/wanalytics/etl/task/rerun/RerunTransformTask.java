package td.enterprise.wanalytics.etl.task.rerun;

//import java.text.ParseException;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;

/**
 * 获取原始文件数据并转换成collector格式
 * @author ran.li
 *
 */
public class RerunTransformTask {
	
	public static final Logger logger = Logger.getLogger(RerunTransformTask.class);
	
	public static void main(String[] args) throws org.apache.commons.cli.ParseException {

		/**
		 * java -classpath .:$basedir/libs/* td.enterprise.wanalytics.etl.task.rerun.RerunTransformTask
		 *  -inputPath "一个collector传一个，下级即为文件" -outputPath "对应输出目录"
		 */

		Options options = new Options();
		options.addOption("p", "inputPath", true, "读取文件路径");
		options.addOption("o", "outputPath", true, "输出文件目录");
		CommandLineParser parser = new PosixParser();
		CommandLine line = parser.parse(options, args);

		String inputPath = line.getOptionValue("inputPath");
		String outputPath = line.getOptionValue("outputPath");

		//test data
		// inputPath = "/Users/liran/Downloads/data";
		// outputPath = "/Users/liran/Downloads/out";
		
		long begin = System.currentTimeMillis();
		execute(inputPath,outputPath);
        long end = System.currentTimeMillis();
		logger.info("转化文件结束：take " + (end - begin)/1000 + "秒");

	}
	
	public static void execute(String inputPath, String outputPath){
		GetDataFromFile.getData(inputPath,outputPath);
	}
	
}
