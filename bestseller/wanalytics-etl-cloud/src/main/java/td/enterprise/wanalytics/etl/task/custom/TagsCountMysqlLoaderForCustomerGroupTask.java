package td.enterprise.wanalytics.etl.task.custom;


/**
 * 导入到mysql 中
 */
public class TagsCountMysqlLoaderForCustomerGroupTask {
//    private static final Logger logger = LoggerFactory.getLogger(TagsCountMysqlLoaderForCustomerGroupTask.class);
//    public static String tenantId;
//    public static Integer projectId;
//    public static Integer crowdId;
//    public static String runDate;
//    public static String cycle_statistics;
//
//    public static String startDate;
//    public static String endDate;
//    public static String execId;
//
//    public static String inputFilePath;
//    static ServiceInterfaceCallLogService logService = ApplicationContextManager.getBean(ServiceInterfaceCallLogService.class);
//
//	public static JdbcTemplate  jdbcTemplate = null;
//	static {
//		 @SuppressWarnings("resource")
//		ApplicationContext applicationContext = new ClassPathXmlApplicationContext(new String[] { "idMappingContext.xml",
//	     "datafilter-spring-beans.xml" });
//		 jdbcTemplate = (JdbcTemplate) applicationContext.getBean("idMappingJdbcTemplate");
//	}
//
//
//
//
//    public static void execute(String inputFilePath, String tenantId, Integer projectId, Integer crowdId, String startDate, String endDate, String runDate, String cycle_statistics,String execId) {
//
//        File inputFile = new File(inputFilePath);
//        BufferedReader br = null;
//        try {
//            List<TenantDeviceCount> tenantDeviceCounts = new ArrayList<TenantDeviceCount>();
//            List<TenantTagsCount> tenantTagsCounts = new ArrayList<TenantTagsCount>();
//            br = new BufferedReader(new FileReader(inputFile));
//            String line = null;
//            long lineNumber = 1;
//            while ((line = br.readLine()) != null) {
//                if(line.equals("")){
//                    continue;
//                }
//                String[] lineColumns = line.split(",");
//                logger.info("tag key is 【" + lineColumns[0] + "】\t【" + lineColumns[1] + "】 \t tag count is \t【" + lineColumns[2] + "】");
//
//                if ((Tags.TD_TAGS_DEVCIE_BRAND.equals(lineColumns[0]) || Tags.TD_TAGS_DEVCIE_PRICE.equals(lineColumns[0]) || Tags.TD_TAGS_DEVCIE_GO.equals(lineColumns[0])) && StringUtils.isNotEmpty(lineColumns[1])) {
//                    int deviceAttrType = 0;
//                    if (Tags.TD_TAGS_DEVCIE_BRAND.equals(lineColumns[0])) {
//                        deviceAttrType = 2;
//                    } else if (Tags.TD_TAGS_DEVCIE_PRICE.equals(lineColumns[0])) {
//                        deviceAttrType = 1;
//                    } else if (Tags.TD_TAGS_DEVCIE_GO.equals(lineColumns[0])) {
//                        deviceAttrType = 3;
//                    }
//
//                    TenantDeviceCount tenantDeviceCount = new TenantDeviceCount();
//                    tenantDeviceCount.setTenantId(tenantId);
//                    tenantDeviceCount.setProjectId(projectId);
//                    tenantDeviceCount.setCrowdId(crowdId);
//                    tenantDeviceCount.setDeviceAttrName(lineColumns[1]);
//                    tenantDeviceCount.setDeviceAttrType(deviceAttrType);
//                    tenantDeviceCount.setCycleStatistics(Integer.parseInt(cycle_statistics));
//                    tenantDeviceCount.setMetricValue(Integer.parseInt(lineColumns[2]));
//                    tenantDeviceCount.setRunDate(runDate);
//                    tenantDeviceCount.setStartDate(startDate);
//                    tenantDeviceCount.setEndDate(endDate);
//
//                    tenantDeviceCounts.add(tenantDeviceCount);
//
//                } else if (Tags.TD_TAGS_ALL.equals(lineColumns[0]) || Tags.TD_TAGS_GENDER.equals(lineColumns[0]) || Tags.TD_TAGS_LIFE_STAGE.equals(lineColumns[0])
//                        || Tags.TD_TAGS_VEHICLE.equals(lineColumns[0]) || Tags.TD_TAGS_MARRY.equals(lineColumns[0])
//                        || Tags.TD_TAGS_GENDER_UNKOWON.equals(lineColumns[0]) || Tags.TD_TAGS_CHILD.equals(lineColumns[0])) {
//                    TenantTagsCount tenantTagsCount = new TenantTagsCount();
//                    tenantTagsCount.setCrowdId(crowdId);
//                    tenantTagsCount.setCycleStatistics(Integer.parseInt(cycle_statistics));
//                    tenantTagsCount.setEndDate(endDate);
//                    tenantTagsCount.setMetricValue(Integer.parseInt(lineColumns[2]));
//                    tenantTagsCount.setProjectId(projectId);
//                    tenantTagsCount.setRunDate(runDate);
//                    tenantTagsCount.setStartDate(startDate);
//                    tenantTagsCount.setTagCode(lineColumns[1]);
//                    tenantTagsCount.setTagName(lineColumns[0]);
//                    tenantTagsCount.setTenantId(tenantId);
//
//                    tenantTagsCounts.add(tenantTagsCount);
//
//                }
//                lineNumber++;
//            }
//
//			for (TenantDeviceCount tenantDeviceCount : tenantDeviceCounts) {
// 				String sql ="insert into TD_BEHAVIOR_CROWD_RESULT_DEVICE (tenant_id,project_id,crowd_id,run_date,device_attr_type,device_attr_name,metric_value,cycle_statistics,start_date,end_date,exec_id) "
// 						+ "values('"+tenantDeviceCount.getTenantId()+"','"+tenantDeviceCount.getProjectId()+"','"+tenantDeviceCount.getCrowdId()+"','"+tenantDeviceCount.getRunDate()+"','"+tenantDeviceCount.getDeviceAttrType()+"','"+tenantDeviceCount.getDeviceAttrName()+"','"+tenantDeviceCount.getMetricValue()+"','"+tenantDeviceCount.getCycleStatistics()+"','"+startDate+"','"+endDate+"','"+execId+"')";
// 				jdbcTemplate.update(sql);
//             }
//             for (TenantTagsCount tenantTagsCount : tenantTagsCounts) {
//            	 String sql="insert into TD_BEHAVIOR_CROWD_RESULT "
//	         				+ "(tenant_id,project_id,crowd_id,run_date,tag_code,tag_name,metric_value,cycle_statistics,start_date,end_date,exec_id)"
//	         				+ " values('"+tenantId+"',"+projectId+","+crowdId+",'"+runDate+"','"+tenantTagsCount.getTagCode()+"','"+tenantTagsCount.getTagName()+"','"+tenantTagsCount.getMetricValue()+"','"+cycle_statistics+"','"+startDate+"','"+endDate+"','"+execId+"')";
//	         	jdbcTemplate.update(sql);
//             }
//            logger.info("-----------inputFilePath=" + inputFilePath + " import [" + (lineNumber - 1) + "] record");
//        } catch (Exception e) {
//            throw new BusinessException(e);
//        } finally {
//            if (br != null) {
//                try {
//                    br.close();
//                } catch (IOException e) {
//                    logger.error("BufferedReader close failed!", e);
//                }
//            }
//        }
//    }

}
