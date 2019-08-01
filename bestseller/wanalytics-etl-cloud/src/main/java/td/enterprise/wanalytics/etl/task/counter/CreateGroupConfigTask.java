package td.enterprise.wanalytics.etl.task.counter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.entity.ProjectTypeEnum;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.custom.CustomGroup;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.*;

/**
 * 生成店组配置信息
 * @author junmin.li
 *
 */
public class CreateGroupConfigTask {
	
	public static Logger logger = Logger.getLogger(CreateGroupConfigTask.class);
	 

	public static void main(String[] args) {
		try{

			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("outputFile", "outputFile", true, "输出文件");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String outputFile = line.getOptionValue("outputFile");
			execute(outputFile);
			long end = System.currentTimeMillis();
			logger.info("生成项目停留数据完毕.用时：" + (end - begin)/1000 + " 秒 ");
		}catch (Exception e){
			logger.error("",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}
	}
	
	public static Boolean execute(String outputFile) throws Exception{
		BufferedWriter bw = null;
		FileWriter fw = null;
        try {
			fw = new FileWriter(outputFile);
            bw = new BufferedWriter(fw);
			//查询每个店组下有多少个店铺
			String sql = "select id from TD_PROJECT where project_type =  " + ProjectTypeEnum.PROJECT_GROUP.getCode() + " and status = 1 ";
			List<Map<String,Object>> groupList = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
			for(Map<String,Object> map : groupList){
				Integer groupId = Integer.parseInt(map.get("id") + "");
				List<String> projectIds = new ArrayList<String> ();
				List<String> tempList = CustomGroup.queryChildrenByParam(groupId + "",projectIds);
				String ids = ListUtils.getConcatIds(tempList);
				if(null != ids){
					bw.append(groupId + "").append(Constant.SEMICOLON);
					bw.append(ids ).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
				}
			}
            bw.flush();
        }catch(Exception e){
        	logger.error("写到文件失败：", e);
        }finally{
        	FileUtil.close(bw,fw);
        }
		return true;
	}


}
