package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.util.FileUtil;

import java.io.*;
import java.util.Date;
import java.util.HashMap;

public class CorrelationCountTask {
	public static Logger logger = Logger.getLogger(CorrelationCountTask.class);
	public static void main(String[] args) {
		String inputcompetitor = null;
		String inputmy=null;
		String outputpath=null;
		Options options = new Options();
		options.addOption("inputcompetitor", "inputcompetitor", true, "竞品tdid路径");
		options.addOption("inputmy", "inputmy", true, "我的tdid路径");
		options.addOption("outputpath", "outputpath", true, "文件输出路径");
		CommandLineParser parser = new PosixParser();
		CommandLine lines = null;
		try {
			lines = parser.parse(options, args);
			inputcompetitor = lines.getOptionValue("inputcompetitor");
			inputmy = lines.getOptionValue("inputmy");
			outputpath = lines.getOptionValue("outputpath");
		} catch (ParseException e1) {
			logger.error("参数异常 " );
			System.exit(1);
		}
		execute(inputcompetitor,inputmy,outputpath);
	}

	private static void execute(String inputcompetitor, String inputmy,String outputpath) {
		HashMap<String, Integer> hashMapa = new HashMap<>();
		int count=0;
		int mysize=0;
		int competitorsize=0;
		Date a = new Date();
		BufferedReader br = null;
		BufferedReader bro = null;
		FileReader fr = null;
		FileReader fro = null;
		try {
			fr = new FileReader(new File(inputmy));
			br = new BufferedReader(fr);
			String line=null;
			while((line=br.readLine())!=null){
				hashMapa.put(line, 1);
			}
			mysize=hashMapa.size();
			fro = new FileReader(new File(inputcompetitor));
			bro = new BufferedReader(fro);
			while((line=bro.readLine())!=null){
				competitorsize++;
				if (hashMapa.get(line)!=null) {
					count++;
				}
			}
			bro.close();
		}catch (Exception e) {
			logger.error("文件读取失败",e);
			System.exit(1);
		}//TODO-- catch 内存溢出error 转hive执行
		finally{
			FileUtil.close(fr,br,fro,bro);
		}
		
		logger.info("计算使用时间："+(new Date().getTime()-a.getTime()));
		BufferedWriter bw = null;
		FileWriter fw = null;
		try {
			fw = new FileWriter(new File(outputpath));
			bw = new BufferedWriter(fw);
			bw.write(mysize+","+competitorsize+","+count);
			bw.flush();
		} catch (Exception e) {
			logger.error("写出文件失败",e);
			System.exit(1);
		}finally {
			FileUtil.close(fw,bw);
		}
		return;
		}
}
