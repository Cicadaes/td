package td.enterprise.wanalytics.etl.task.target;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.entity.Target;
import td.enterprise.entity.TargetManagement;
import td.enterprise.service.TargetManagementService;
import td.enterprise.service.TargetService;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class MBOTask {
	
	public static Logger logger = Logger.getLogger(MBOTask.class);
	private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

	public static void main(String[] args) {
		String runDate=null;
		Options options = new Options();
		options.addOption("runDate", "runDate", true, "执行日期");
		CommandLineParser parser = new PosixParser();
		CommandLine lines = null;
		try {
			lines = parser.parse(options, args);
			runDate = lines.getOptionValue("runDate");
		} catch (ParseException e1) {
			logger.error("参数异常 ",e1);
			System.exit(1);
		}
		
		try{
			int execute = execute(runDate);
			if (execute!=0) {
				System.exit(10+execute);
			}
		}catch(Exception e){
			logger.error("MBOTask JAVA 处理失败",e);
			System.exit(1);
		}
	}

	private static int execute(String runDate) {
		int havefail = 0;
		
		//============================================================================================================//
		//=======遍历数据库 TD_Target_Management  where  finishDate > today ==============================================//
		//============================================================================================================//
		TargetManagement page = new TargetManagement();
		List<TargetManagement> targetManlist = null;
		try {
			targetManlist = TargetManagementService.queryByNotFinishList(page);
			if (targetManlist==null || targetManlist.isEmpty()) {
				logger.info("=================目前没有需要计算的目标任务=================");
				System.exit(2);
			}else {
				logger.info("=================需要计算的目标任务有 "+targetManlist.size()+" 个==========");
			}
		} catch (Exception e) {
			logger.error("TargetManagement数据库查询时失败",e);
			System.exit(1);
		}
		
		//============================================================================================================//
		//===========================取出TargetService 所有分类 == 存到Map==================================================//
		//============================================================================================================//
		Target targetPage = new Target();
		targetPage.setStatus(1);
		List<Target> tarlist = null;
		try {
			tarlist = TargetService.queryByList(targetPage);
		} catch (Exception e) {
			logger.error("Target数据库查询失败",e);
			System.exit(1);
		}
		HashMap<Integer, String> targetmap = new HashMap<Integer,String>();
		for (Target target : tarlist) {
			if (target!=null) {
				Integer id = target.getId();
				String code = target.getCode();
				targetmap.put(id, code);
			}
		}
		
		//============================================================================================================//
		//===========================循环对每一个需要计算的任务进行计算 ===========================================================//
		//============================================================================================================//
		
		for (TargetManagement targetManagement : targetManlist) {
			try{
				Integer targetId = targetManagement.getTargetId();
				String code= targetmap.get(targetId);
				String tenantId = targetManagement.getTenantId();
				Integer ProjectId =targetManagement.getProjectId();
				String startDate = targetManagement.getStartDate();
				String endDate = targetManagement.getEndDate();
				
				MBOsubtaskInterface choiceMethod = choiceMethod(code,tenantId,ProjectId);
				if (choiceMethod==null) {
					continue;
				}
				
				boolean start = needReBuild(runDate,startDate);//过滤掉        还没到开始日期的        startDate 在  runDate 之前  return true 
				if (!start) {
					continue;
				}
				
				double result = choiceMethod.result(startDate,endDate);//计算得到结果
				if(targetManagement.getTargetValue() == null || targetManagement.getDuration() == null ){
					logger.warn("targetManagement=" + targetManagement + " 目标value 为空！忽略！");
					continue;
				}
				int a = getfaceCode(targetManagement,result,runDate);//计算状态是否为笑脸什么的
				
				targetManagement.setCurrentValue(result);
				targetManagement.setOperationState(a);
				
				boolean need = needReBuild(runDate, endDate);
				if (need) {
					targetManagement.setFinishDate(endDate);
				}
				TargetManagementService.updateByPrimaryKey(targetManagement);
				//---------------如果是周期任务，那么检查是否需要生成新的记录------------------
				Integer isRecurring= targetManagement.getIsRecurring();
				if (null != isRecurring &&  isRecurring==1 && need) {
						//----------修改一下，再插一条-----------
						targetManagement.setId(null);
						targetManagement.setCurrentValue(0d);
						Integer duration = targetManagement.getDuration();
						targetManagement.setStartDate(getNewTime(endDate,1));
						targetManagement.setEndDate(getNewTime(endDate,duration));
						targetManagement.setFinishDate(null);
						targetManagement.setOperationState(0);
					    TargetManagementService.insert(targetManagement);
				}
			}catch(Exception e){
				Integer id = targetManagement.getId();
				logger.error("=========== 处理 TD_Target_Management 表中，ID="+id +" 时，发生了异常！",e);
				havefail++;
			}
		}
		
		
		return havefail;
		
	}

	private static int getfaceCode(TargetManagement targetManagement, Double nowvalue,String runday) {
		
		Double mubiao = targetManagement.getTargetValue();
		Integer day = targetManagement.getDuration();
		
		double everydayvalue = mubiao/day; //应该的每天达成率
		
		String startDate = targetManagement.getStartDate();
		
		long between_days = 0;
		
		try {
			Date now = simpleDateFormat.parse(runday);
			Date befor = simpleDateFormat.parse(startDate);
	        Calendar cal = Calendar.getInstance();    
	        cal.setTime(now);    
	        long time1 = cal.getTimeInMillis();                 
	        cal.setTime(befor);    
	        long time2 = cal.getTimeInMillis(); 
	        between_days=(time1-time2)/(1000*3600*24);
			
		} catch (java.text.ParseException e) {
			logger.error("计算执行状态失败");
			return 0;
		}
		
		if (between_days<=0) {
			return 0;
		}
		
		double double1 = nowvalue/between_days;//现在的达成率
		
		if (double1>everydayvalue) {
			return 0;
		}else if (double1==everydayvalue) {
			return 1;
		}else if (double1<everydayvalue) {
			return 2;
		}
		
		return 0;
	}
	
	private static String getNewTime(String endDate, Integer duration) {
		String newEndDate =null;
		try {
			Calendar cal = Calendar.getInstance();
			cal.setTime(simpleDateFormat.parse(endDate));
			cal.add(Calendar.DAY_OF_YEAR, duration);
			Date time = cal.getTime();
			newEndDate = simpleDateFormat.format(time);
		} catch (java.text.ParseException e) {
			logger.error("时间转换时出现异常",e);
			throw new RuntimeException("时间计算失败");
		}
		return newEndDate;
	}

	/**
	 * 如果enddate befor rundate   true
	 * @param runDate
	 * @param endDate
	 * @return
	 */
	private static boolean needReBuild(String runDate, String endDate){
		Date parse = null;
		Date today = null; 
		boolean need = false;
		try {
			parse = simpleDateFormat.parse(endDate);
			today = simpleDateFormat.parse(runDate);
			need = parse.before(today);
		} catch (java.text.ParseException e) {
			logger.error("时间转换时出现异常",e);
			throw new RuntimeException("时间计算失败");
		}
		return need;
	}
	
	

	private static MBOsubtaskInterface choiceMethod(String code, String tenantId, Integer projectId) {
		MBOsubtaskInterface way = null;
		if (code==null) {
			logger.error("code为null！");
			logger.error("======没有实现的功能。跳过！========");
			return null;
		}
		switch (code) {
		case "AU":
			//到访客流
			way = new SelectCounterCalculation(tenantId,projectId,"offline_active_user_day_counter");
			break;
		case "SU":
			//停留客流
			way = new SelectCounterCalculation(tenantId,projectId,"offline_stay_user_day_counter");
			break;
		case "NU":
			//新客数量
			way = new SelectCounterCalculation(tenantId,projectId,"offline_new_user_day_counter");
			break;
		case "OU":
			//老客数量
			way = new SelectCounterCalculation(tenantId,projectId,"offline_old_user_day_counter");
			break;
		case "ST":
			//停留时长
			way = new StayTimesCalculation(tenantId,projectId);
			break;
//		case "EP":
//			//进店率
//			way = new EnterPerCalculation(tenantId,projectId);//TODO
//			break;
		case "SP":
			//停留率
			way = new StayPerCalculation(tenantId,projectId);
			break;
		case "NTO":
			way = new NewToOldCalculation(tenantId,projectId);//TODO
			break;
//		case "":
//			老客月到访频次--TODO
//			break;
//		case "":
//			到访间隔--TODO
//			break;
//		case "":
//			市场覆盖率--TODO
//			break;

		default:
			logger.error("没有找到与【"+code+"】相匹配的code类型！");
			logger.error("======没有实现的功能。跳过！========");
			return null;
		}
		return way;
	}
	

}
