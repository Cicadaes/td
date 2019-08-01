package td.enterprise.wanalytics.etl.task.lz;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.PosixParser;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.MetricDay;
import td.enterprise.entity.MetricMonth;
import td.enterprise.entity.MetricWeek;
import td.enterprise.service.MetricDayService;
import td.enterprise.service.MetricMonthService;
import td.enterprise.service.MetricWeekService;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.MD5Util;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

/**
 * <p>Description：按周或月汇总指标</p>
 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
 * @author liyinglei
 * @version 1.0
 * @date 2017年12月21日下午3:48:19 
 * @since jdk1.7
 */
@Slf4j
public class MetricMonthAndWeekTask {

	private static SqlSession sqlSession = null;
	private static Connection conn2Analytics;
    static {
        conn2Analytics = DbWifianalyticsConn.getConnection();
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();        
    }
    private static int        RUN_SUCCESS = 0;
    
    private static final String TYPE_WEEK = "week";
    private static final String TYPE_MONTH = "month";
    
    /**
     * 批处理大小
     */
    public static final Integer BATCH_SIZE = 2000;

    public static void main(String[] args) {
        String startDate = "2017-12-19";
        String endDate = "2017-12-22";
//        String type = TYPE_WEEK;
        String type = null;

        Options options = new Options();
        options.addOption("startDate", "startDate", true, "统计开始时间");
        options.addOption("endDate", "endDate", true, "统计结束时间");
        options.addOption("type", "type", true, "统计维度");

        CommandLineParser parser = new PosixParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            startDate = line.getOptionValue("startDate");
            endDate = line.getOptionValue("endDate");
            type = line.getOptionValue("type");
        } catch (ParseException e1) {
            log.warn("params error,startDate:{},endDate:{},type:{type}", startDate, endDate, type);
            e1.printStackTrace();
        }
        
        /*if (null == startDate || null == endDate || null == type) {
            System.exit(RUN_ERROR);
        }
        
        if (!type.equals(TYPE_MONTH) && !type.equals(TYPE_WEEK)) {
        	System.exit(RUN_ERROR);
        }*/
        // 默认统计当月或当周     默认统计月
        if (null == type || "".equals(type)) {
        	type = TYPE_MONTH;
        }
        
        if ((null == startDate || null == endDate)) {
        	SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        	Calendar cal = null;
        	cal = Calendar.getInstance();
        	if (type.equals(TYPE_MONTH)) {
	            // 获取前月的第一天
	            cal = Calendar.getInstance();
	            cal.add(Calendar.MONTH, 0);
	            cal.set(Calendar.DAY_OF_MONTH, 1);
	            startDate = format.format(cal.getTime());
	            // 获取前月的最后一天
	            cal = Calendar.getInstance();
	            cal.add(Calendar.MONTH, 1);
	            cal.set(Calendar.DAY_OF_MONTH, 0);
	            endDate = format.format(cal.getTime());
        	} else {
        		int d = 0;
                if (cal.get(Calendar.DAY_OF_WEEK)==1) {
                    d = -6;
                } else {
                    d = 2-cal.get(Calendar.DAY_OF_WEEK);
                }
                cal.add(Calendar.DAY_OF_WEEK, d);
                //所在周开始日期
                startDate = format.format(cal.getTime());
                cal.add(Calendar.DAY_OF_WEEK, 6);
                //所在周结束日期
                endDate = format.format(cal.getTime());
        	}
        }

        try {
        	execute(startDate, endDate, type);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
			e.printStackTrace();
		}
        
        System.exit(RUN_SUCCESS);
    }

    public static void execute(String startDate, String endDate, String type) throws Exception {
        PreparedStatement updateps = null;

        String updateMonthSql = "UPDATE TD_METRIC_MONTH  "//
        		+ " SET update_time=SYSDATE(),active_new_users=?,active_old_users=?, "//
				+ " active_users=?,stay_new_users=?,stay_old_users=?,stay_users=?,front_users=?,jump_users=?,high_active_users=?,middle_active_users=?, "//
				+ " low_active_users=?,sleep_active_users=?,high_stay_users=?,middle_stay_users=?,low_stay_users=?,sleep_stay_users=?,active_duration=?, "//
				+ " active_times=?,stay_duration=?,stay_times=?,interval_2=?,interval_5=?,interval_10=?,interval_15=?,visit_cycle=?,sales_amount=?,order_count=?, "//
				+ " member_count=?,potential_count=?,new_active_duration=?,new_active_time=?,old_active_duration=?,old_active_time=?, "//
				+ " sales_count=?,order_count_gt1=?,vip_sales_amount=?,vip_order_count=?,vip_sales_count=?,vip_order_count_gt1=?,non_vip_sales_amount=?,non_vip_order_count=?, "//
				+ " non_vip_sales_count=?,non_vip_order_count_gt1=?, "//
				+ " project_id=?,`year`=?,`month`=?,tenant_id=?,project_num=? where id = ?";//
        
        String updateWeekSql = "UPDATE TD_METRIC_WEEK  "//
        		+ " SET update_time=SYSDATE(),active_new_users=?,active_old_users=?, "//
				+ " active_users=?,stay_new_users=?,stay_old_users=?,stay_users=?,front_users=?,jump_users=?,high_active_users=?,middle_active_users=?, "//
				+ " low_active_users=?,sleep_active_users=?,high_stay_users=?,middle_stay_users=?,low_stay_users=?,sleep_stay_users=?,active_duration=?, "//
				+ " active_times=?,stay_duration=?,stay_times=?,interval_2=?,interval_5=?,interval_10=?,interval_15=?,visit_cycle=?,sales_amount=?,order_count=?, "//
				+ " member_count=?,potential_count=?,new_active_duration=?,new_active_time=?,old_active_duration=?,old_active_time=?, "//
				+ " sales_count=?,order_count_gt1=?,vip_sales_amount=?,vip_order_count=?,vip_sales_count=?,vip_order_count_gt1=?,non_vip_sales_amount=?,non_vip_order_count=?, "//
				+ " non_vip_sales_count=?,non_vip_order_count_gt1=?, "//
				+ " project_id=?,`year`=?,`week_of_year`=?,tenant_id=?,project_num=? where id = ?";//

        if (type.equals(TYPE_WEEK)) {
        	updateps = conn2Analytics.prepareStatement(updateWeekSql);
        } else {
        	updateps = conn2Analytics.prepareStatement(updateMonthSql);
        }
    	
        // 周
    	if (TYPE_WEEK.equals(type)) {
    		
    		// update
    		List<MetricDay> list = MetricDayService.queryMetricWeekByDate(sqlSession, startDate, endDate);
    		if (null == list || list.size() == 0) {
    			log.info("没有查询到数据,startDate:{},endDate:{},type:{}",startDate,endDate,type);
    			return;
    		}
    		Map<String, Object> dayMap = getObjectMap(list, type);
    		List<MetricWeek> weekList = MetricWeekService.queryListByDate(sqlSession, DateUtil.formatString(startDate, "yyyy-w"),DateUtil.formatString(endDate, "yyyy-w"));
    		Map<String, Object> weekMap = getObjectMap(weekList,type);
    		long start = System.currentTimeMillis();
    		int num = 0;
    		if (weekMap != null && dayMap != null) {
	    		for (Map.Entry<String, Object> entry : dayMap.entrySet()) {
	    			if (weekMap.containsKey(entry.getKey())) {
	    				// update
	    				MetricDay metricDay = (MetricDay)dayMap.get(entry.getKey());
	    				MetricWeek metricWeek = (MetricWeek)weekMap.get(entry.getKey());
	    				String md5Day = MD5Util.MD5(metricDay.getActiveDuration()+"|"+metricDay.getActiveNewUsers()+"|"+metricDay.getActiveOldUsers()+"|"+metricDay.getActiveTimes()+"|"+metricDay.getActiveUsers()+"|"+"|"+metricDay.getFrontUsers()+"|"+metricDay.getHighActiveUsers()+"|"+metricDay.getHighStayUsers()+"|"+metricDay.getInterval10()+"|"+metricDay.getInterval15()+"|"+metricDay.getInterval2()+"|"+metricDay.getInterval5()+"|"+metricDay.getJumpUsers()+"|"+metricDay.getLowActiveUsers()+"|"+metricDay.getLowStayUsers()+"|"+metricDay.getMemberCount()+"|"+metricDay.getMiddleActiveUsers()+"|"+metricDay.getMiddleStayUsers()+"|"+metricDay.getNewActiveDuration()+"|"+metricDay.getNewActiveTime()+"|"+metricDay.getNonVipOrderCount()+"|"+metricDay.getNonVipOrderCountGt1()+"|"+metricDay.getNonVipSalesAmount()+"|"+metricDay.getNonVipSalesCount()+"|"+metricDay.getOldActiveDuration()+"|"+metricDay.getOldActiveTime()+"|"+metricDay.getOrderCount()+"|"+metricDay.getOrderCountGt1()+"|"+metricDay.getPotentialCount()+"|"+"|"+metricDay.getSalesAmount()+"|"+metricDay.getSalesCount()+"|"+metricDay.getSleepActiveUsers()+"|"+metricDay.getSleepStayUsers()+"|"+metricDay.getStayDuration()+"|"+metricDay.getStayNewUsers()+"|"+metricDay.getStayOldUsers()+"|"+metricDay.getStayTimes()+"|"+metricDay.getStayUsers()+"|"+metricDay.getVipOrderCount()+"|"+metricDay.getVipOrderCountGt1()+"|"+metricDay.getVipSalesAmount()+"|"+metricDay.getVipSalesCount()+"|"+metricDay.getVisitCycle());
	    				String md5Week = MD5Util.MD5(metricWeek.getActiveDuration()+"|"+metricWeek.getActiveNewUsers()+"|"+metricWeek.getActiveOldUsers()+"|"+metricWeek.getActiveTimes()+"|"+metricWeek.getActiveUsers()+"|"+metricWeek.getFrontUsers()+"|"+metricWeek.getHighActiveUsers()+"|"+metricWeek.getHighStayUsers()+"|"+metricWeek.getInterval10()+"|"+metricWeek.getInterval15()+"|"+metricWeek.getInterval2()+"|"+metricWeek.getInterval5()+"|"+metricWeek.getJumpUsers()+"|"+metricWeek.getLowActiveUsers()+"|"+metricWeek.getLowStayUsers()+"|"+metricWeek.getMemberCount()+"|"+metricWeek.getMiddleActiveUsers()+"|"+metricWeek.getMiddleStayUsers()+"|"+metricWeek.getNewActiveDuration()+"|"+metricWeek.getNewActiveTime()+"|"+metricWeek.getNonVipOrderCount()+"|"+metricWeek.getNonVipOrderCountGt1()+"|"+metricWeek.getNonVipSalesAmount()+"|"+metricWeek.getNonVipSalesCount()+"|"+metricWeek.getOldActiveDuration()+"|"+metricWeek.getOldActiveTime()+"|"+metricWeek.getOrderCount()+"|"+metricWeek.getOrderCountGt1()+"|"+metricWeek.getPotentialCount()+"|"+(int)metricWeek.getSalesAmount()+"|"+metricWeek.getSalesCount()+"|"+metricWeek.getSleepActiveUsers()+"|"+metricWeek.getSleepStayUsers()+"|"+metricWeek.getStayDuration()+"|"+metricWeek.getStayNewUsers()+"|"+metricWeek.getStayOldUsers()+"|"+metricWeek.getStayTimes()+"|"+metricWeek.getStayUsers()+"|"+metricWeek.getVipOrderCount()+"|"+metricWeek.getVipOrderCountGt1()+"|"+metricWeek.getVipSalesAmount()+"|"+metricWeek.getVipSalesCount()+"|"+metricWeek.getVisitCycle());
	    				if (!md5Day.equals(md5Week)) {
	    					num++;
//	    					MetricMonthService.updateBySelective(sqlSession, metricMonth);
	    					updateps.setInt(1, metricDay.getActiveNewUsers());
	    					updateps.setInt(2, metricDay.getActiveOldUsers());
	    					updateps.setInt(3, metricDay.getActiveUsers());
	    					updateps.setInt(4, metricDay.getStayNewUsers());
	    					updateps.setInt(5, metricDay.getStayOldUsers());
	    					updateps.setInt(6, metricDay.getStayUsers());
	    					updateps.setInt(7, metricDay.getFrontUsers());
	    					updateps.setInt(8, metricDay.getJumpUsers());
	    					updateps.setInt(9, metricDay.getHighActiveUsers());
	    					updateps.setInt(10, metricDay.getMiddleActiveUsers());
	    					updateps.setInt(11, metricDay.getLowActiveUsers());
	    					updateps.setInt(12, metricDay.getSleepActiveUsers());
	    					updateps.setInt(13, metricDay.getHighStayUsers());
	    					updateps.setInt(14, metricDay.getMiddleStayUsers());
	    					updateps.setInt(15, metricDay.getLowStayUsers());
	    					updateps.setInt(16, metricDay.getSleepStayUsers());
	    					updateps.setInt(17, metricDay.getActiveDuration());
	    					updateps.setLong(18, metricDay.getActiveTimes());
	    					updateps.setLong(19, metricDay.getStayDuration());
	    					updateps.setInt(20, metricDay.getStayTimes());
	    					updateps.setInt(21, metricDay.getInterval2());
	    					updateps.setInt(22, metricDay.getInterval5());
	    					updateps.setInt(23, metricDay.getInterval10());
	    					updateps.setInt(24, metricDay.getInterval15());
	    					updateps.setLong(25, metricDay.getVisitCycle());
	    					updateps.setDouble(26, metricDay.getSalesAmount());
	    					updateps.setInt(27, metricDay.getOrderCount());
	    					updateps.setInt(28, metricDay.getMemberCount());
	    					updateps.setInt(29, metricDay.getPotentialCount());
	    					updateps.setInt(30, metricDay.getNewActiveDuration());
	    					updateps.setInt(31, metricDay.getNewActiveTime());
	    					updateps.setLong(32, metricDay.getOldActiveDuration());
	    					updateps.setLong(33, metricDay.getOldActiveTime());
	    					updateps.setDouble(34, metricDay.getSalesCount());
	    					updateps.setInt(35, metricDay.getOrderCountGt1());
	    					updateps.setDouble(36, metricDay.getVipSalesAmount());
	    					updateps.setInt(37, metricDay.getVipOrderCount());
	    					updateps.setDouble(38, metricDay.getVipSalesCount());
	    					updateps.setInt(39, metricDay.getVipOrderCountGt1());
	    					updateps.setDouble(40, metricDay.getNonVipSalesAmount());
	    					updateps.setInt(41, metricDay.getNonVipOrderCount());
	    					updateps.setDouble(42, metricDay.getNonVipSalesCount());
	    					updateps.setInt(43, metricDay.getNonVipOrderCountGt1());
	    					updateps.setInt(44, metricDay.getProjectId());
	    					updateps.setString(45, metricDay.getDate());
	    					updateps.setString(46, metricDay.getWeekOfYear());
	    					updateps.setString(47, metricDay.getTenantId());
	    					updateps.setString(48, metricDay.getProjectNum());
	    					// where
	    					updateps.setInt(49, metricWeek.getId());
	    					updateps.addBatch();
	    	                if (num % BATCH_SIZE == 0) {
	    	                	log.info("=============sql=" + updateps.toString());
	    	                    int[] affectUpdateRows = updateps.executeBatch();
	    	                    log.info("updateRows:{}", affectUpdateRows.length);
	    	                }
	    				}
	    			}
	    		}
    		}
    		// insert
    		log.info("=============sql=" + updateps.toString());
    		int insert = MetricWeekService.insertOrUpdate(sqlSession, startDate, endDate);
            int[] affectUpdateRows = updateps.executeBatch();
            log.info("insertRows:{},updateRows:{},update spend time :{}", insert, affectUpdateRows.length, (System.currentTimeMillis() - start));
        // 月
    	} else {
    		
    		// update
    		List<MetricDay> list = MetricDayService.queryMetricMonthByDate(sqlSession, startDate, endDate);
    		if (null == list || list.size() == 0) {
    			log.info("没有查询到数据,startDate:{},endDate:{},type:{}",startDate,endDate,type);
    			return;
    		}
    		Map<String, Object> dayMap = getObjectMap(list, type);
    		List<MetricMonth> monthList = MetricMonthService.queryListByDate(sqlSession, DateUtil.formatString(startDate, "yyyy-MM"),DateUtil.formatString(endDate, "yyyy-MM"));
    		Map<String, Object> monthMap = getObjectMap(monthList,type);
    		long start = System.currentTimeMillis();
    		int num = 0;
    		if (monthMap != null && dayMap != null) {
	    		for (Map.Entry<String, Object> entry : dayMap.entrySet()) {
	    			if (monthMap.containsKey(entry.getKey())) {
	    				// update
	    				MetricDay metricDay = (MetricDay)dayMap.get(entry.getKey());
	    				MetricMonth metricMonth = (MetricMonth)monthMap.get(entry.getKey());
	    				String md5Day = MD5Util.MD5(metricDay.getActiveDuration()+"|"+metricDay.getActiveNewUsers()+"|"+metricDay.getActiveOldUsers()+"|"+metricDay.getActiveTimes()+"|"+metricDay.getActiveUsers()+"|"+metricDay.getFrontUsers()+"|"+metricDay.getHighActiveUsers()+"|"+metricDay.getHighStayUsers()+"|"+metricDay.getInterval10()+"|"+metricDay.getInterval15()+"|"+metricDay.getInterval2()+"|"+metricDay.getInterval5()+"|"+metricDay.getJumpUsers()+"|"+metricDay.getLowActiveUsers()+"|"+metricDay.getLowStayUsers()+"|"+metricDay.getMemberCount()+"|"+metricDay.getMiddleActiveUsers()+"|"+metricDay.getMiddleStayUsers()+"|"+metricDay.getNewActiveDuration()+"|"+metricDay.getNewActiveTime()+"|"+metricDay.getNonVipOrderCount()+"|"+metricDay.getNonVipOrderCountGt1()+"|"+metricDay.getNonVipSalesAmount()+"|"+metricDay.getNonVipSalesCount()+"|"+metricDay.getOldActiveDuration()+"|"+metricDay.getOldActiveTime()+"|"+metricDay.getOrderCount()+"|"+metricDay.getOrderCountGt1()+"|"+metricDay.getPotentialCount()+"|"+metricDay.getSalesAmount()+"|"+metricDay.getSalesCount()+"|"+metricDay.getSleepActiveUsers()+"|"+metricDay.getSleepStayUsers()+"|"+metricDay.getStayDuration()+"|"+metricDay.getStayNewUsers()+"|"+metricDay.getStayOldUsers()+"|"+metricDay.getStayTimes()+"|"+metricDay.getStayUsers()+"|"+metricDay.getVipOrderCount()+"|"+metricDay.getVipOrderCountGt1()+"|"+metricDay.getVipSalesAmount()+"|"+metricDay.getVipSalesCount()+"|"+metricDay.getVisitCycle());
	    				String md5Month = MD5Util.MD5(metricMonth.getActiveDuration()+"|"+metricMonth.getActiveNewUsers()+"|"+metricMonth.getActiveOldUsers()+"|"+metricMonth.getActiveTimes()+"|"+metricMonth.getActiveUsers()+"|"+metricMonth.getFrontUsers()+"|"+metricMonth.getHighActiveUsers()+"|"+metricMonth.getHighStayUsers()+"|"+metricMonth.getInterval10()+"|"+metricMonth.getInterval15()+"|"+metricMonth.getInterval2()+"|"+metricMonth.getInterval5()+"|"+metricMonth.getJumpUsers()+"|"+metricMonth.getLowActiveUsers()+"|"+metricMonth.getLowStayUsers()+"|"+metricMonth.getMemberCount()+"|"+metricMonth.getMiddleActiveUsers()+"|"+metricMonth.getMiddleStayUsers()+"|"+metricMonth.getNewActiveDuration()+"|"+metricMonth.getNewActiveTime()+"|"+metricMonth.getNonVipOrderCount()+"|"+metricMonth.getNonVipOrderCountGt1()+"|"+metricMonth.getNonVipSalesAmount()+"|"+metricMonth.getNonVipSalesCount()+"|"+metricMonth.getOldActiveDuration()+"|"+metricMonth.getOldActiveTime()+"|"+metricMonth.getOrderCount()+"|"+metricMonth.getOrderCountGt1()+"|"+metricMonth.getPotentialCount()+"|"+(int)metricMonth.getSalesAmount()+"|"+metricMonth.getSalesCount()+"|"+metricMonth.getSleepActiveUsers()+"|"+metricMonth.getSleepStayUsers()+"|"+metricMonth.getStayDuration()+"|"+metricMonth.getStayNewUsers()+"|"+metricMonth.getStayOldUsers()+"|"+metricMonth.getStayTimes()+"|"+metricMonth.getStayUsers()+"|"+metricMonth.getVipOrderCount()+"|"+metricMonth.getVipOrderCountGt1()+"|"+metricMonth.getVipSalesAmount()+"|"+metricMonth.getVipSalesCount()+"|"+metricMonth.getVisitCycle());
	    				if (!md5Day.equals(md5Month)) {
	    					num++;
//	    					MetricMonthService.updateBySelective(sqlSession, metricMonth);
	    					updateps.setInt(1, metricDay.getActiveNewUsers());
	    					updateps.setInt(2, metricDay.getActiveOldUsers());
	    					updateps.setInt(3, metricDay.getActiveUsers());
	    					updateps.setInt(4, metricDay.getStayNewUsers());
	    					updateps.setInt(5, metricDay.getStayOldUsers());
	    					updateps.setInt(6, metricDay.getStayUsers());
	    					updateps.setInt(7, metricDay.getFrontUsers());
	    					updateps.setInt(8, metricDay.getJumpUsers());
	    					updateps.setInt(9, metricDay.getHighActiveUsers());
	    					updateps.setInt(10, metricDay.getMiddleActiveUsers());
	    					updateps.setInt(11, metricDay.getLowActiveUsers());
	    					updateps.setInt(12, metricDay.getSleepActiveUsers());
	    					updateps.setInt(13, metricDay.getHighStayUsers());
	    					updateps.setInt(14, metricDay.getMiddleStayUsers());
	    					updateps.setInt(15, metricDay.getLowStayUsers());
	    					updateps.setInt(16, metricDay.getSleepStayUsers());
	    					updateps.setInt(17, metricDay.getActiveDuration());
	    					updateps.setLong(18, metricDay.getActiveTimes());
	    					updateps.setLong(19, metricDay.getStayDuration());
	    					updateps.setInt(20, metricDay.getStayTimes());
	    					updateps.setInt(21, metricDay.getInterval2());
	    					updateps.setInt(22, metricDay.getInterval5());
	    					updateps.setInt(23, metricDay.getInterval10());
	    					updateps.setInt(24, metricDay.getInterval15());
	    					updateps.setLong(25, metricDay.getVisitCycle());
	    					updateps.setDouble(26, metricDay.getSalesAmount());
	    					updateps.setInt(27, metricDay.getOrderCount());
	    					updateps.setInt(28, metricDay.getMemberCount());
	    					updateps.setInt(29, metricDay.getPotentialCount());
	    					updateps.setInt(30, metricDay.getNewActiveDuration());
	    					updateps.setInt(31, metricDay.getNewActiveTime());
	    					updateps.setLong(32, metricDay.getOldActiveDuration());
	    					updateps.setLong(33, metricDay.getOldActiveTime());
	    					updateps.setDouble(34, metricDay.getSalesCount());
	    					updateps.setInt(35, metricDay.getOrderCountGt1());
	    					updateps.setDouble(36, metricDay.getVipSalesAmount());
	    					updateps.setInt(37, metricDay.getVipOrderCount());
	    					updateps.setDouble(38, metricDay.getVipSalesCount());
	    					updateps.setInt(39, metricDay.getVipOrderCountGt1());
	    					updateps.setDouble(40, metricDay.getNonVipSalesAmount());
	    					updateps.setInt(41, metricDay.getNonVipOrderCount());
	    					updateps.setDouble(42, metricDay.getNonVipSalesCount());
	    					updateps.setInt(43, metricDay.getNonVipOrderCountGt1());
	    					updateps.setInt(44, metricDay.getProjectId());
	    					updateps.setString(45, metricDay.getDate());
	    					updateps.setString(46, metricDay.getMonth());
	    					updateps.setString(47, metricDay.getTenantId());
	    					updateps.setString(48, metricDay.getProjectNum());
	    					// where
	    					updateps.setInt(49, metricMonth.getId());
	    					updateps.addBatch();
	    	                if (num % BATCH_SIZE == 0) {
	    	                    int[] affectUpdateRows = updateps.executeBatch();
	    	                    log.info("updateRows:{}", affectUpdateRows.length);
	    	                }
	    				}
	    			}
	    		}
    		}
    		// insert
    		int insert = MetricMonthService.insertOrUpdate(sqlSession, startDate, endDate);
            int[] affectUpdateRows = updateps.executeBatch();
            log.info("insertRows:{},updateRows:{},update spend time :{}", insert, affectUpdateRows.length, (System.currentTimeMillis() - start));
    	}
    }
    
    public static Map<String,Object> getObjectMap (List<?> list, String type) {
    	if (null == list || list.size() ==0) {
    		return null;
    	}
    	Map<String,Object> map = new HashMap<String,Object>();
    	if (list.get(0) instanceof MetricDay) {
    		if (type.equals(TYPE_WEEK)) {
	    		for (Object object : list) {
					String key = ((MetricDay) object).getProjectId()+((MetricDay) object).getTenantId()+((MetricDay) object).getDate()+((MetricDay) object).getWeekOfYear();
					map.put(key, object);
				}
    		} else {
    			for (Object object : list) {
					String key = ((MetricDay) object).getProjectId()+((MetricDay) object).getTenantId()+((MetricDay) object).getDate()+((MetricDay) object).getMonth();
					map.put(key, object);
				}
    		}
    	}
    	if (list.get(0) instanceof MetricMonth) {
    		for (Object object : list) {
				String key = ((MetricMonth) object).getProjectId()+((MetricMonth) object).getTenantId()+((MetricMonth) object).getYear()+((MetricMonth) object).getMonth();
				map.put(key, object);
			}
    	}
    	if (list.get(0) instanceof MetricWeek) {
    		for (Object object : list) {
				String key = ((MetricWeek) object).getProjectId()+((MetricWeek) object).getTenantId()+((MetricWeek) object).getYear()+((MetricWeek) object).getWeekOfYear();
				map.put(key, object);
			}
    	}
    	return map;
    }
    
    public static int[] getWeeks(String startDate, String endDate) {
    	SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");  
    	try {
    		
			Date sDate = format.parse(startDate);
			Calendar calendarStart = Calendar.getInstance();  
			calendarStart.setFirstDayOfWeek(Calendar.MONDAY);  
			calendarStart.setTime(sDate);
			int startWeek = calendarStart.get(Calendar.WEEK_OF_YEAR);
			
			Date eDate = format.parse(endDate);
			Calendar calendarEnd = Calendar.getInstance();  
			calendarEnd.setFirstDayOfWeek(Calendar.MONDAY);  
			calendarEnd.setTime(eDate);
			int endWeek = calendarEnd.get(Calendar.WEEK_OF_YEAR);
			
			int[] weeks = new int[(endWeek-startWeek) + 1];
			if (startWeek == endWeek) {
				weeks[0] = startWeek;
			} else {
				for (int i = 0; i < weeks.length; i++) {
					weeks[i] = startWeek++;
				}
			}
			return weeks;
		} catch (java.text.ParseException e) {
			e.printStackTrace();
		}
		return null;
    }
    
    public static int[] getMonths(String startDate, String endDate) throws ParseException {
    	SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");  
    	try {
			Date sDate = format.parse(startDate);
			Calendar calendarStart = Calendar.getInstance();  
			calendarStart.setTime(sDate);
			int startMonth = calendarStart.get(Calendar.MONTH) + 1;
			
			Date eDate = format.parse(endDate);
			Calendar calendarEnd = Calendar.getInstance();  
			calendarEnd.setTime(eDate);
			int endMonth = calendarEnd.get(Calendar.MONTH) + 1;
			
			int[] months = new int[(endMonth-startMonth) + 1];
			if (startMonth == endMonth) {
				months[0] = endMonth;
			} else {
				for (int i = 0; i < months.length; i++) {
					months[i] = startMonth++;
				}
			}
			return months;
		} catch (java.text.ParseException e) {
			e.printStackTrace();
		}
		return null;
    }
    
    public static Object convertBean2Bean(Object from, Object to) {
    	try {
	    	BeanInfo beanInfo = Introspector.getBeanInfo(to.getClass());
	    	PropertyDescriptor[] ps = beanInfo.getPropertyDescriptors();
	    	Class<?> classType = from.getClass();
	    	for (PropertyDescriptor p : ps) {
		    	Method getMethod = p.getReadMethod();
		    	Method setMethod = p.getWriteMethod();
		    	if (getMethod != null && setMethod != null) {
			    	try {
				    	Method fromGetMethod = classType.getMethod(getMethod.getName());
				    	Object result = fromGetMethod.invoke(from);
				    	setMethod.invoke(to, result);
			    	} catch (Exception e) {
			    		continue;
			    	}
		    	}
	    	}
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	return to;
    }
    
}
