package td.enterprise.wanalytics.etl.task.tag;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.commons.lang.StringUtils;
import td.enterprise.wanalytics.etl.bean.MacOffset;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.CubeUtils;
import td.enterprise.wanalytics.etl.util.DateUtil;

import java.io.FileWriter;
import java.util.List;

/**
 * 或者指定时间的offset 和mac 对应关系
 */
@Slf4j
public class MacMySql2HiveTask {

    /**
     *
     * @throws ParseException
     */
    public static void main(String[] args){
        try {

            Options options = new Options();
            options.addOption("date", "date",true, "时间");
            options.addOption("tenantId", "tenantId", true, "租户id");
            options.addOption("startDate", "startDate", true, "开始日期");
            options.addOption("endDate", "endDate", true, "结束日期");
            options.addOption("outputFile", "outputFile", true, "输出文件位置");
            options.addOption("projectIds", "projectIds",true, "项目Id，多个用逗号分割，-1表示全部");

            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String date = line.getOptionValue("date");
            String startDate = line.getOptionValue("startDate");
            String endDate = line.getOptionValue("endDate");
            int tenantId = Integer.parseInt(line.getOptionValue("tenantId"));
            String outputFile = line.getOptionValue("outputFile");
            String projectIds = line.getOptionValue("projectIds");
            log.info("请求参数是：date=" + date + " startDate=" + startDate + " endDate=" + endDate + " tenantId=" + tenantId + " outputFile=" + outputFile + " projectIds=" + projectIds);
            execute(tenantId, date,startDate,endDate, outputFile,projectIds);
        } catch (Exception e) {
            log.error("导出mac异常：",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }


    public static void execute(int tenantId, String date,String startDate,String endDate, String outputFile,String projectIds) throws Exception {
        log.info("导出mac offset 开始 MacMySql2HiveTask start. tenantId=" + tenantId + ", date=" + date + " startDate=" + startDate + " endDate = " +  endDate + ", outputFile=" + outputFile );
        FileWriter fw = null;
        try {
            //上个月的时间
            String lastMonthDate = DateUtil.format(DateUtil.addMonth2Date(-1, DateUtil.format(date, DateUtil.PATTERN_DATE)), DateUtil.PATTERN_DATE);

            //上个月开始日期
            String lastMonthStartDate = DateUtil.getFirstDay(lastMonthDate);
            //上个月结束日期
            String lastMonthEndDate = DateUtil.getLastDay(lastMonthDate);

            List<MacOffset> macOffsetList = null;
            if(StringUtils.isNotBlank(startDate) && !"-1".equals(startDate)
                    && StringUtils.isNotBlank(endDate) && !"-1".equals(endDate)){
                macOffsetList =  CubeUtils.queryTenantMacList(tenantId + "",startDate,endDate,projectIds);
            }else {
                macOffsetList =  CubeUtils.queryTenantMacList(tenantId + "",lastMonthStartDate,lastMonthEndDate,projectIds);
            }

            fw = new FileWriter(outputFile);

            if(null != macOffsetList){

                for(MacOffset macOffset : macOffsetList) {

                    Integer offset = macOffset.getOffset();
                    String mac = macOffset.getMac();
                    if(offset != null && mac != null ){
                        fw.write(offset +
                                WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR + mac +
                                WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR + date
                        );
                        fw.write(WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                    }else{
                        log.error("offset or mac is null");
                    }
//                    log.info(offset +
//                            WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR + mac +
//                            WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR + date);
                }
            }
        } catch (Exception e) {
            log.error("生成offset失败!",e);
            throw new Exception("task failed !");
        } finally {
            if(fw != null){
                fw.close();
            }
        }
        log.info("MacMySql2HiveTask end ...");
    }
}
