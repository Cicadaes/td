package td.enterprise.wanalytics.etl.task.um;

import io.netty.util.internal.StringUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.ParseException;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;

import td.enterprise.entity.BsUser;
import td.enterprise.entity.UmDepartment;
import td.enterprise.entity.UmDeptUser;
import td.enterprise.entity.UmUser;
import td.enterprise.wanalytics.etl.jdbc.DbUmConn;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.MD5Util;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

/**
 * <p>Description：UM用户同步</p>
 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
 * @author liyinglei
 * @version 1.0
 * @date 2017年12月12日下午2:11:06 
 * @since jdk1.7
 */
@Slf4j
public class UmUserTask {

    private static Connection conn2Um;
    private static Connection conn2Wifianalytics;
    private static LocalDate  runDate     = null;
    static SqlSession sqlSession = null;
    static {
        conn2Um = DbUmConn.getConnection();
        conn2Wifianalytics = DbWifianalyticsConn.getConnection();
    }
    private static int        RUN_SUCCESS = 0;
    private static int        RUN_ERROR   = 1;
    
    /**
     * 批处理大小
     */
    public static final Integer BATCH_SIZE = 2000;
    
//    private static String tenantId;
//    private static String opUmid;
    private static String userPassword = "08b83c2378340ab7881506f0d188d57a1d750c3c";
//    private static String email = "bestseller@bestseller.com";
    private static String status = "0";
    
    private static final String groupTName = "客流运营平台集团用户权限模板";
    private static final String cityTName = "客流运营平台城市用户权限模板";
//    private static String groupRid; // 客流运营平台集团用户权限模板角色ID
//    private static String cityRid; // 客流运营平台城市用户权限模板角色ID
    
    private static final String USER_SIGN_SALE = "1"; // 零售标识
    private static final String USER_SIGN_NON_SALE = "2"; // 非零售标识
    
    private static final String TENANT_ID_FOUR = SysConfigUtil.getProp().getProperty("tenant.id.four");
    private static final String TENANT_ID_OLD = SysConfigUtil.getProp().getProperty("tenant.id.old");
    private static final String TENANT_ID_JL = SysConfigUtil.getProp().getProperty("tenant.id.jl");
    private static final String TENANT_ID_HAY = SysConfigUtil.getProp().getProperty("tenant.id.hay");
    private static final String TENANT_ID_FOREIGN = SysConfigUtil.getProp().getProperty("tenant.id.foreign");
    
    private static Map<String,Integer> rulesMap; // 角色集合
    
    public static void main(String[] args) throws ParseException {
    	
//    	opUmid = "bestseller@bestseller.com";
//        tenantId = "5";

//        Options options = new Options();
//        options.addOption("opUmid", "opUmid", true, "操作人员umid");
////        options.addOption("tenantId", "tenantId", true, "租户ID");
//
//        CommandLineParser parser = new PosixParser();
//        CommandLine line;
        try {
//            line = parser.parse(options, args);
//            opUmid = line.getOptionValue("opUmid");
//            tenantId = line.getOptionValue("tenantId");
//            groupRid = queryRidByTName(groupTName, tenantId);
//            cityRid = queryRidByTName(cityTName, tenantId);
            
        } catch (Exception e) {
        	log.warn("queryRidByTName error,groupTName:{},cityTName:{}", groupTName, cityTName);
			e.printStackTrace();
		}

        Map<String, BsUser> allBsUsers = null;
		try {
			allBsUsers = queryBsUser();
		} catch (SQLException e2) {
			e2.printStackTrace();
			System.exit(RUN_ERROR);
		}
        
        Map<String, UmUser> allUmUsers = null;
        try {
			allUmUsers = queryUmUser();
		} catch (SQLException e1) {
			e1.printStackTrace();
			System.exit(RUN_ERROR);
		}
        
        Map<String, UmDepartment> allUmDepartments = null;
        try {
        	allUmDepartments = queryUmDepartment();
		} catch (SQLException e1) {
			e1.printStackTrace();
			System.exit(RUN_ERROR);
		}
        
        Map<String, UmDeptUser> allUmDeptUsers = null;
        try {
        	allUmDeptUsers = queryUmDeptUser();
		} catch (SQLException e1) {
			e1.printStackTrace();
			System.exit(RUN_ERROR);
		}

        try {
            dayBatchInsert(allBsUsers, allUmUsers, allUmDepartments, allUmDeptUsers);
        } catch (SQLException e) {
            e.printStackTrace();
            System.exit(RUN_ERROR);
        }

        if (null != conn2Um) {
            try {
                conn2Um.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        System.exit(RUN_SUCCESS);
    }
    
    /**
    * <p>Description: 批量执行</p>
    * @param dateStr
    * @param allBsUsers
    * @param allUmUsers
    * @param allUmDepartMents
    * @param allUmDeptUsers
    * @throws SQLException
    * @author liyinglei 
     */
    public static void dayBatchInsert(Map<String, BsUser> allBsUsers, Map<String, UmUser> allUmUsers, Map<String, UmDepartment> allUmDepartMents, Map<String, UmDeptUser> allUmDeptUsers) throws SQLException {
    	
    	Map<String,String> allUmRoleUsers = queryUmRoleUser();
    	
        PreparedStatement insertPs = null;
        PreparedStatement updatePs = null;
        PreparedStatement deletePs = null;
        
        PreparedStatement insertRuPs = null;
        PreparedStatement updateRuPs = null;
        PreparedStatement deleteRuPs = null;
        
        PreparedStatement insertDuPs = null;
        PreparedStatement updateDuPs = null;
        PreparedStatement deleteDuPs = null;
        PreparedStatement deleteDuAllPs = null;
        
        // UM_USER
        String insertSql = "insert ignore into UM_USER "//
                + " (umid,user_name,user_password,user_desc,email,"
                + "departmentName,status,create_time,op_umid,tenant_id) " // 
                + "values (?,?,?,?,?,   ?,?,?,?,?) ";//

        String updateSql = "update UM_USER "//
                + "set user_name=?,departmentName=?,op_umid=?,tenant_id=?,update_time=?,email=?,user_desc=? " // 
                + "where umid=? and tenant_id=? ";//
        
        String deleteSql = "delete from UM_USER where umid=? and user_desc=? and tenant_id=? ";
        
        // UM_ROLE_USER
        String insertRuSql = "insert ignore into UM_ROLE_USER "
                + " (role_rid,user_rid,is_grantable,create_time) "
                + "values (?,?,?,?) ";//

        String updateRuSql = "update UM_ROLE_USER "//
                + "set role_rid=?,create_time=? " // 
                + "where user_rid=? and role_rid=? ";//
        
        String deleteRuSql = "delete from UM_ROLE_USER where user_rid=? and role_rid in (?,?) ";
        
        // UM_DEPT_USER
        String insertDuSql = "INSERT ignore INTO UM_DEPT_USER (dept_rid,user_rid,op_umid,create_time) "//
        		+ "SELECT d.rid,u.rid,d.op_umid,SYSDATE()  "//
				+ "FROM UM_USER u,UM_DEPARTMENT d  "//
				+ "WHERE u.tenant_id = d.tenantId  "//
				+ "AND u.user_desc = '1' "//
				+ "AND CONCAT(d.rid,u.rid) NOT IN (SELECT CONCAT(t.dept_rid,t.user_rid) FROM UM_DEPT_USER t) ";//

        String updateDuSql = "update UM_DEPT_USER "//
                + "set dept_rid=?,op_umid=?,update_time=? " // 
                + "where user_rid=? and dept_rid=? ";//
        
        String deleteDuSql = "delete from UM_DEPT_USER where user_rid=? and dept_rid=? and user_type='S' ";
        
        // 删除用户与部门所有关系
        String deleteDuAllSql = "delete from UM_DEPT_USER where user_rid=? and user_type='S' ";

        insertPs = conn2Um.prepareStatement(insertSql);
        updatePs = conn2Um.prepareStatement(updateSql);
        deletePs = conn2Um.prepareStatement(deleteSql);
        
        insertRuPs = conn2Um.prepareStatement(insertRuSql);
        updateRuPs = conn2Um.prepareStatement(updateRuSql);
        deleteRuPs = conn2Um.prepareStatement(deleteRuSql);
        
        insertDuPs = conn2Um.prepareStatement(insertDuSql);
        updateDuPs = conn2Um.prepareStatement(updateDuSql);
        deleteDuPs = conn2Um.prepareStatement(deleteDuSql);
        deleteDuAllPs = conn2Um.prepareStatement(deleteDuAllSql);

        int ii = 0;
        int ui = 0;
        int di = 0;

        String umid;
        Timestamp updateTime = new Timestamp(System.currentTimeMillis());
        
        // 根据租户ID获取集团/城市权限模板rid
        String groupRid1 = queryRidByTName(groupTName, TENANT_ID_FOUR);
        String groupRid2 = queryRidByTName(groupTName, TENANT_ID_OLD);
        String groupRid3 = queryRidByTName(groupTName, TENANT_ID_JL);
        String groupRid4 = queryRidByTName(groupTName, TENANT_ID_HAY);
        String groupRid5 = queryRidByTName(groupTName, TENANT_ID_FOREIGN);
        
        String cityRid1 = queryRidByTName(cityTName, TENANT_ID_FOUR);
        String cityRid2 = queryRidByTName(cityTName, TENANT_ID_OLD);
        String cityRid3 = queryRidByTName(cityTName, TENANT_ID_JL);
        String cityRid4 = queryRidByTName(cityTName, TENANT_ID_HAY);
        String cityRid5 = queryRidByTName(cityTName, TENANT_ID_FOREIGN);
        
        String newUserSign = "";
        String oldUserSign = "";
        
        for (Map.Entry<String, UmUser> entry : allUmUsers.entrySet()) {
        	
        	umid = entry.getKey();
        	
        	//更新
            if (allBsUsers.containsKey(umid) && allBsUsers.get(umid).getTenantSign() != null) {
            	
            	String tenantSign = allBsUsers.get(umid).getTenantSign();
            	
            	newUserSign = allBsUsers.get(umid).getUserSign();
            	oldUserSign = entry.getValue().getUserDesc();
            	
            	// 零售-更新权限
            	if (newUserSign.equals(oldUserSign) && newUserSign.equals(USER_SIGN_SALE)) {
            		
	            	String tenantId = "";
	            	String groupRid = "";
	            	String cityRid = "";
	            	String opUmid = "";
	            	
	            	if ("1".equals(tenantSign)) {
	            		tenantId = TENANT_ID_FOUR;
	            		groupRid = groupRid1;
	            		cityRid = cityRid1;
	            	} else if ("2".equals(tenantSign)) {
	            		tenantId = TENANT_ID_OLD;
	            		groupRid = groupRid2;
	            		cityRid = cityRid2;
	            	} else if ("3".equals(tenantSign)) {
	            		tenantId = TENANT_ID_JL;
	            		groupRid = groupRid3;
	            		cityRid = cityRid3;
	            	} else if ("4".equals(tenantSign)) {
	            		tenantId = TENANT_ID_HAY;
	            		groupRid = groupRid4;
	            		cityRid = cityRid4;
	            	} else if ("5".equals(tenantSign)) {
	            		tenantId = TENANT_ID_FOREIGN;
	            		groupRid = groupRid5;
	            		cityRid = cityRid5;
	            	} else {
	            		// 非零售用户默认为四品牌租户
	            		tenantId = TENANT_ID_FOUR;
	            		groupRid = groupRid1;
	            		cityRid = cityRid1;
	            	}
	            	
	            	opUmid = allUmDepartMents.get(tenantId).getOpUmid();
	            	
	            	// md5计算是否需要update
	            	String bsUserRows = allBsUsers.get(umid).getName()+"|"+allBsUsers.get(umid).getDepartment()+"|"+(StringUtil.isNullOrEmpty(allBsUsers.get(umid).getEmail()) ? "bestseller@bestseller.com" : allBsUsers.get(umid).getEmail())+"|"+opUmid+"|"+tenantId;
	            	String umUserRows = entry.getValue().getUserName()+"|"+entry.getValue().getDepartmentName()+"|"+entry.getValue().getEmail()+"|"+entry.getValue().getOpUmid()+"|"+String.valueOf(entry.getValue().getTenantId());
	            	
	            	if (MD5Util.MD5(bsUserRows).equals(MD5Util.MD5(umUserRows))) {
	            		// 判断是否修改了用户集团客户权限
	            		if (allUmRoleUsers.containsKey(umid)) {
		            		String temp = allUmRoleUsers.get(umid).equals(groupRid) ? "Y" : "N";
		            		if (temp.equals(allBsUsers.get(umid).getGroupSign())) {
		            			System.out.println("UM_USER表MD5相同->UM_USER集团客户权限相同->略过："+umUserRows);
		            			continue;
		            		} else {
		            			System.out.println("UM_USER表MD5相同->UM_USER集团客户权限不同->："+umUserRows);
		            		}
	            		} else {
	            			continue;
	            		}
	            	} else {
	            		System.out.println("UM_USER表MD5不同->："+umUserRows+"->：bsUserRows："+bsUserRows);
	            	}
	                ui++;
	
	                updatePs.setString(1, allBsUsers.get(umid).getName());
	                updatePs.setString(2, allBsUsers.get(umid).getDepartment());
	                updatePs.setString(3, opUmid);
	                updatePs.setString(4, tenantId);
	                updatePs.setTimestamp(5, updateTime);
	                updatePs.setString(6, StringUtil.isNullOrEmpty(allBsUsers.get(umid).getEmail()) ? "bestseller@bestseller.com" : allBsUsers.get(umid).getEmail());
	                updatePs.setString(7, USER_SIGN_SALE);
	                
	                //where
	                updatePs.setString(8, umid);
	                updatePs.setString(9, String.valueOf(entry.getValue().getTenantId()));
	
	                updatePs.addBatch();
	                if (ui % BATCH_SIZE == 0) {
	                    int[] affectUpdateRows = updatePs.executeBatch();
	                    log.info("updateRows:{}", affectUpdateRows.length);
	                }
	                
	                // 角色关系表
	                if (allUmRoleUsers.containsKey(umid)) {
	                	String rid = "";
		                if ("Y".equals(allBsUsers.get(umid).getGroupSign())) {
		                	updateRuPs.setInt(1, Integer.valueOf(groupRid));
		                	rid = groupRid;
		                } else {
		                	rid = cityRid;
		                	updateRuPs.setInt(1, Integer.valueOf(cityRid));
		                }
		                if (!rulesMap.containsKey(umid+rid)) {
			                updateRuPs.setTimestamp(2, updateTime);
			
			                //where
			                updateRuPs.setString(3, umid);
			                updateRuPs.setInt(4, Integer.valueOf(allUmRoleUsers.get(umid)));
			
			                updateRuPs.addBatch();
			                if (ui % BATCH_SIZE == 0) {
			                    int[] affectUpdateRows = updateRuPs.executeBatch();
			                    log.info("updateRuRows:{}", affectUpdateRows.length);
			                }
		                }
	                }
	                
	                if (allUmDeptUsers.containsKey(umid+"|"+allUmDepartMents.get(tenantId).getRid())) {
	//	                updateDuSql = "update UM_DEPT_USER "//
	//	                        + "set dept_rid=?,op_umid=?,update_time=? " // 
	//	                        + "where user_rid=? and dept_rid=? ";//
		                // 用户和部门关系表
		                updateDuPs.setInt(1, allUmDepartMents.get(tenantId).getRid());
		                updateDuPs.setString(2, allUmDepartMents.get(tenantId).getOpUmid());
		                updateDuPs.setTimestamp(3, updateTime);
		
		                //where
		                updateDuPs.setString(4, umid);
		                updateDuPs.setInt(5, allUmDepartMents.get(tenantId).getRid());
		
		                updateDuPs.addBatch();
		                if (ui % BATCH_SIZE == 0) {
		                    int[] affectUpdateRows = updateDuPs.executeBatch();
		                    log.info("updateRuRows:{}", affectUpdateRows.length);
		                }
	                }
                
            	} else if (!newUserSign.equals(oldUserSign) && newUserSign.equals(USER_SIGN_SALE)) {
            		// 原来是非零售，变更为零售，先删除所有权限，再赋权零售权限
            		
            		String tenantId = "";
	            	String groupRid = "";
	            	String cityRid = "";
	            	String opUmid = "";
	            	
	            	if ("1".equals(tenantSign)) {
	            		tenantId = TENANT_ID_FOUR;
	            		groupRid = groupRid1;
	            		cityRid = cityRid1;
	            	} else if ("2".equals(tenantSign)) {
	            		tenantId = TENANT_ID_OLD;
	            		groupRid = groupRid2;
	            		cityRid = cityRid2;
	            	} else if ("3".equals(tenantSign)) {
	            		tenantId = TENANT_ID_JL;
	            		groupRid = groupRid3;
	            		cityRid = cityRid3;
	            	} else if ("4".equals(tenantSign)) {
	            		tenantId = TENANT_ID_HAY;
	            		groupRid = groupRid4;
	            		cityRid = cityRid4;
	            	} else if ("5".equals(tenantSign)) {
	            		tenantId = TENANT_ID_FOREIGN;
	            		groupRid = groupRid5;
	            		cityRid = cityRid5;
	            	} else {
	            		// 非零售用户默认为四品牌租户
	            		tenantId = TENANT_ID_FOUR;
	            		groupRid = groupRid1;
	            		cityRid = cityRid1;
	            	}
	            	
	            	opUmid = allUmDepartMents.get(tenantId).getOpUmid();
            		
            		// 删除
	            	if (allUmRoleUsers.containsKey(umid)) {
	            		di++;
	                    deleteRuPs.setString(1, umid);
	                    deleteRuPs.setInt(2, Integer.valueOf(allUmRoleUsers.get(umid)));
	                    deleteRuPs.setInt(3, Integer.valueOf(allUmRoleUsers.get(umid)));
	                    deleteRuPs.addBatch();
	                    if (di % BATCH_SIZE == 0) {
	                        int[] affectDeleteRows = deleteRuPs.executeBatch();
	                        log.info("deleteRuRows:{}", affectDeleteRows.length);
	                    }
	            	}
	            	
	            	if (allUmDeptUsers.containsKey(entry.getValue().getRid()+"|"+allUmDepartMents.get(tenantId).getRid())) {
	                    deleteDuAllPs.setInt(1, allUmDeptUsers.get(entry.getValue().getRid()+"|"+allUmDepartMents.get(tenantId).getRid()).getUserRid());
	                    deleteDuAllPs.addBatch();
	                    if (di % BATCH_SIZE == 0) {
	                        int[] affectDeleteRows = deleteDuAllPs.executeBatch();
	                        log.info("deleteDuAllRows:{}", affectDeleteRows.length);
	                    }
	            	}
                    
                    // 修改
                    ui++;
                	
	                updatePs.setString(1, allBsUsers.get(umid).getName());
	                updatePs.setString(2, allBsUsers.get(umid).getDepartment());
	                updatePs.setString(3, opUmid);
	                updatePs.setString(4, tenantId);
	                updatePs.setTimestamp(5, updateTime);
	                updatePs.setString(6, StringUtil.isNullOrEmpty(allBsUsers.get(umid).getEmail()) ? "bestseller@bestseller.com" : allBsUsers.get(umid).getEmail());
	                updatePs.setString(7, USER_SIGN_SALE);
	                
	                //where
	                updatePs.setString(8, umid);
	                updatePs.setString(9, String.valueOf(entry.getValue().getTenantId()));
	
	                updatePs.addBatch();
	                if (ui % BATCH_SIZE == 0) {
	                    int[] affectUpdateRows = updatePs.executeBatch();
	                    log.info("updateRows:{}", affectUpdateRows.length);
	                }
                    
                    // 新增
                	ii++;
	                // UM_ROLE_USER 用户和角色关系表
	                if ("Y".equals(allBsUsers.get(umid).getGroupSign())) {
	                	insertRuPs.setInt(1, Integer.valueOf(groupRid));
	                } else {
	                	insertRuPs.setInt(1, Integer.valueOf(cityRid));
	                }
	                insertRuPs.setString(2, umid);
	                insertRuPs.setInt(3, 0);
	                insertRuPs.setTimestamp(4, updateTime);
	
	                insertRuPs.addBatch();
	                if (ii % BATCH_SIZE == 0) {
	                    int[] affectInsertRows = insertRuPs.executeBatch();
	                    log.info("insertRuRows:{}", affectInsertRows.length);
	                }
	                
	                // UM_DEPT_USER 用户和部门关系表
                    
            	} else if (!newUserSign.equals(oldUserSign) && newUserSign.equals(USER_SIGN_NON_SALE)) {
            		// 原来是零售，变更为非零售，删除所有权限，变更user信息
            		
            		String tenantId = "";
	            	String opUmid = "";
	            	
	            	if ("1".equals(tenantSign)) {
	            		tenantId = TENANT_ID_FOUR;
	            	} else if ("2".equals(tenantSign)) {
	            		tenantId = TENANT_ID_OLD;
	            	} else if ("3".equals(tenantSign)) {
	            		tenantId = TENANT_ID_JL;
	            	} else if ("4".equals(tenantSign)) {
	            		tenantId = TENANT_ID_HAY;
	            	} else if ("5".equals(tenantSign)) {
	            		tenantId = TENANT_ID_FOREIGN;
	            	} else {
	            		// 非零售用户默认为四品牌租户
	            		tenantId = TENANT_ID_FOUR;
	            	}
	            	
	            	opUmid = allUmDepartMents.get(tenantId).getOpUmid();
            		
            		// 删除
	            	if (allUmRoleUsers.containsKey(umid)) {
	            		di++;
	            		deleteRuPs.setString(1, umid);
	            		deleteRuPs.setInt(2, Integer.valueOf(allUmRoleUsers.get(umid)));
	            		deleteRuPs.setInt(3, Integer.valueOf(allUmRoleUsers.get(umid)));
	            		deleteRuPs.addBatch();
	            		if (di % BATCH_SIZE == 0) {
	            			int[] affectDeleteRows = deleteRuPs.executeBatch();
	            			log.info("deleteRuRows:{}", affectDeleteRows.length);
	            		}
	            		if (allUmDeptUsers.containsKey(entry.getValue().getRid()+"|"+allUmDepartMents.get(tenantId).getRid())) {
	            			deleteDuAllPs.setInt(1, allUmDeptUsers.get(entry.getValue().getRid()+"|"+allUmDepartMents.get(tenantId).getRid()).getUserRid());
	            			deleteDuAllPs.addBatch();
	            			if (di % BATCH_SIZE == 0) {
	            				int[] affectDeleteRows = deleteDuAllPs.executeBatch();
	            				log.info("deleteDuAllRows:{}", affectDeleteRows.length);
	            			}
	            		}
	            	}
                    
                    // 修改
                    ui++;
                	
	                updatePs.setString(1, allBsUsers.get(umid).getName());
	                updatePs.setString(2, allBsUsers.get(umid).getDepartment());
	                updatePs.setString(3, opUmid);
	                updatePs.setString(4, tenantId);
	                updatePs.setTimestamp(5, updateTime);
	                updatePs.setString(6, StringUtil.isNullOrEmpty(allBsUsers.get(umid).getEmail()) ? "bestseller@bestseller.com" : allBsUsers.get(umid).getEmail());
	                updatePs.setString(7, USER_SIGN_NON_SALE);
	                
	                //where
	                updatePs.setString(8, umid);
	                updatePs.setString(9, String.valueOf(entry.getValue().getTenantId()));
	
	                updatePs.addBatch();
	                if (ui % BATCH_SIZE == 0) {
	                    int[] affectUpdateRows = updatePs.executeBatch();
	                    log.info("updateRows:{}", affectUpdateRows.length);
	                }
            	}
                
            } else {
            // 删除
            	String delTenantId = allUmUsers.get(umid).getTenantId()+"";
            	String userSign = allUmUsers.get(umid).getUserDesc();
            	String groupRid = "";
            	String cityRid = "";
                di++;
                deletePs.setString(1, umid);
                deletePs.setString(2, userSign);
                deletePs.setString(3, delTenantId);

                deletePs.addBatch();
                if (di % BATCH_SIZE == 0) {
                    int[] affectDeleteRows = deletePs.executeBatch();
                    log.info("deleteRows:{}", affectDeleteRows.length);
                }
                
                if (TENANT_ID_FOUR.equals(delTenantId)) {
            		groupRid = groupRid1;
            		cityRid = cityRid1;
            	} else if (TENANT_ID_OLD.equals(delTenantId)) {
            		groupRid = groupRid2;
            		cityRid = cityRid2;
            	} else if (TENANT_ID_JL.equals(delTenantId)) {
            		groupRid = groupRid3;
            		cityRid = cityRid3;
            	} else if (TENANT_ID_HAY.equals(delTenantId)) {
            		groupRid = groupRid4;
            		cityRid = cityRid4;
            	} else if (TENANT_ID_FOREIGN.equals(delTenantId)) {
            		groupRid = groupRid5;
            		cityRid = cityRid5;
            	} else {
            		// 非零售用户默认为四品牌租户
            		groupRid = groupRid1;
            		cityRid = cityRid1;
            	}
                
                deleteRuPs.setString(1, umid);
                deleteRuPs.setInt(2, Integer.valueOf(groupRid));
                deleteRuPs.setInt(3, Integer.valueOf(cityRid));
                deleteRuPs.addBatch();
                if (di % BATCH_SIZE == 0) {
                    int[] affectDeleteRows = deleteRuPs.executeBatch();
                    log.info("deleteRuRows:{}", affectDeleteRows.length);
                }
                
                deleteDuPs.setString(1, umid);
                deleteDuPs.setInt(2, allUmDepartMents.get(delTenantId).getRid());
                deleteDuPs.addBatch();
                if (di % BATCH_SIZE == 0) {
                    int[] affectDeleteRows = deleteDuPs.executeBatch();
                    log.info("deleteDuRows:{}", affectDeleteRows.length);
                }
            }
        }
        for (Map.Entry<String, BsUser> entry : allBsUsers.entrySet()) {
        	umid = entry.getKey();
        	
            if (!allUmUsers.containsKey(umid)) {
            // 新增
            	
            	String tenantSign = entry.getValue().getTenantSign();
            	
            	String tenantId = "";
            	String groupRid = "";
            	String cityRid = "";
            	String opUmid = "";
            	
            	String userSign = entry.getValue().getUserSign();
            	
            	if ("1".equals(tenantSign)) {
            		tenantId = TENANT_ID_FOUR;
            		groupRid = groupRid1;
            		cityRid = cityRid1;
            	} else if ("2".equals(tenantSign)) {
            		tenantId = TENANT_ID_OLD;
            		groupRid = groupRid2;
            		cityRid = cityRid2;
            	} else if ("3".equals(tenantSign)) {
            		tenantId = TENANT_ID_JL;
            		groupRid = groupRid3;
            		cityRid = cityRid3;
            	} else if ("4".equals(tenantSign)) {
            		tenantId = TENANT_ID_HAY;
            		groupRid = groupRid4;
            		cityRid = cityRid4;
            	} else if ("5".equals(tenantSign)) {
            		tenantId = TENANT_ID_FOREIGN;
            		groupRid = groupRid5;
            		cityRid = cityRid5;
            	} else {
            		// 非零售用户默认为四品牌租户
            		tenantId = TENANT_ID_FOUR;
            		groupRid = groupRid1;
            		cityRid = cityRid1;
            	}
            	
            	opUmid = allUmDepartMents.get(tenantId).getOpUmid();
            	
            	ii++;
            	// UM_USER 用户表
                BsUser u = allBsUsers.get(umid);
                insertPs.setString(1, umid);
                insertPs.setString(2, u.getName());
                insertPs.setString(3, userPassword);
                insertPs.setString(4, userSign);
                insertPs.setString(5, (null == u.getEmail() ? "bestseller@bestseller.com" : u.getEmail()));
                insertPs.setString(6, u.getDepartment());
                insertPs.setString(7, status);
                insertPs.setTimestamp(8, updateTime);
                insertPs.setString(9, opUmid);
                insertPs.setString(10, tenantId);

                insertPs.addBatch();
                if (ii % BATCH_SIZE == 0) {
                    int[] affectInsertRows = insertPs.executeBatch();
                    log.info("insertRows:{}", affectInsertRows.length);
                }
                
                // 零售用户赋权
                if (userSign.equals(USER_SIGN_SALE)) {
                	
	                // UM_ROLE_USER 用户和角色关系表
	                if ("Y".equals(allBsUsers.get(umid).getGroupSign())) {
	                	insertRuPs.setInt(1, Integer.valueOf(groupRid));
	                } else {
	                	insertRuPs.setInt(1, Integer.valueOf(cityRid));
	                }
	                insertRuPs.setString(2, umid);
	                insertRuPs.setInt(3, 0);
	                insertRuPs.setTimestamp(4, updateTime);
	
	                insertRuPs.addBatch();
	                
	                // UM_DEPT_USER 用户和部门关系表
                
                }
                if (ii % BATCH_SIZE == 0) {
                	int[] affectInsertRows = insertRuPs.executeBatch();
                	log.info("insertRuRows:{}", affectInsertRows.length);
                }
            }
        }
        int[] affectInsertRows = insertPs.executeBatch();
        int[] affectUpdateRows = updatePs.executeBatch();
        int[] affectDeleteRows = deletePs.executeBatch();
        log.info("insertRows:{},updateRows:{},deleteRows:{}", affectInsertRows.length, affectUpdateRows.length, affectDeleteRows.length);
        
        int[] affectDeleteRuRows = deleteRuPs.executeBatch();
        int[] affectInsertRuRows = insertRuPs.executeBatch();
        int[] affectUpdateRuRows = updateRuPs.executeBatch();
        log.info("insertRuRows:{},updateRuRows:{},deleteRuRows:{}", affectInsertRuRows.length, affectUpdateRuRows.length, affectDeleteRuRows.length);
        
        int affectInsertDuRows = insertDuPs.executeUpdate();
        int[] affectUpdateDuRows = updateDuPs.executeBatch();
        int[] affectDeleteDuRows = deleteDuPs.executeBatch();
        int[] affectDeleteDuAllRows = deleteDuAllPs.executeBatch();
        log.info("insertDuRows:{},updateDuRows:{},deleteDuRows:{},deleteDuAllRows:{}", affectInsertDuRows, affectUpdateDuRows.length, affectDeleteDuRows.length, affectDeleteDuAllRows.length);
        
    }
    
    /**
     * 获取UM用户信息
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Map<String, UmUser> queryUmUser() throws SQLException {
        String sql = "select * from UM_USER where status = 0 and user_desc in (?,?) ";
        PreparedStatement ps = conn2Um.prepareStatement(sql);
        ps.setString(1, USER_SIGN_SALE);
        ps.setString(2, USER_SIGN_NON_SALE);
        ResultSet rs = ps.executeQuery();
        List<UmUser> umUserList = new ArrayList<UmUser>();
        while (rs.next()) {
        	UmUser umUser = new UmUser();
        	umUser.setRid(rs.getInt("rid"));
        	umUser.setUmid(rs.getString("umid"));
        	umUser.setUserName(rs.getString("user_name"));
        	umUser.setUserPassword(rs.getString("user_password"));
        	umUser.setUserDesc(rs.getString("user_desc"));
        	umUser.setGender(rs.getString("gender"));
        	umUser.setBirthday(rs.getDate("birthday"));
        	umUser.setEmail(rs.getString("email"));
        	umUser.setTelphone(rs.getString("telphone"));
        	umUser.setMobile(rs.getString("mobile"));
        	umUser.setTitle(rs.getString("title"));
        	umUser.setDepartmentId(rs.getInt("departmentId"));
        	umUser.setDepartmentName(rs.getString("departmentName"));
        	umUser.setStatus(rs.getInt("status"));
        	umUser.setCreateTime(rs.getDate("create_time"));
        	umUser.setUpdateTime(rs.getDate("update_time"));
        	umUser.setOpUmid(rs.getString("op_umid"));
        	umUser.setTenantId(rs.getInt("tenant_id"));
        	umUser.setProxyUmid(rs.getString("proxy_umid"));
        	umUserList.add(umUser);
        }
        rs.close();
        ps.close();
        
        Map<String, UmUser> allUmUsers = new HashMap<>(umUserList.size());
        for (UmUser umUser : umUserList) {
        	allUmUsers.put(umUser.getUmid(), umUser);
        }
        
        return allUmUsers;
    }
    
    /**
     * 获取UM用户和角色关系信息
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Map<String, String> queryUmRoleUser() throws SQLException {
//        String sql = "select * from UM_ROLE_USER where role_rid in (?,?) ";
        String sql = "select DISTINCT ru.* from UM_ROLE_USER ru,UM_ROLE r WHERE ru.role_rid = r.rid AND (r.role_name LIKE '客流运营平台集团用户权限模板%' OR r.role_name LIKE '客流运营平台城市用户权限模板%') ";
        PreparedStatement ps = conn2Um.prepareStatement(sql);
        rulesMap = new HashMap<String,Integer>();
//        ps.setString(1, groupRid);
//        ps.setString(2, cityRid);
        ResultSet rs = ps.executeQuery();
        Map<String, String> allUmRoleUsers = new HashMap<>();
        while (rs.next()) {
        	allUmRoleUsers.put(rs.getString("user_rid"), String.valueOf(rs.getInt("role_rid")));
        	rulesMap.put(rs.getString("user_rid")+rs.getInt("role_rid"), 0);
        }
        rs.close();
        ps.close();
        
        return allUmRoleUsers;
    }
    
    /**
     * 获取BS用户信息
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Map<String, BsUser> queryBsUser() throws SQLException {
        String sql = "select distinct user_id,name,ky_sign,group_sign,department,position,brand_full_name,brand_short_name,email,tenant_sign,user_sign from TD_BS_USER ";
        PreparedStatement ps = conn2Wifianalytics.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();
        List<BsUser> bsUserList = new ArrayList<BsUser>();
        while (rs.next()) {
        	BsUser bsUser = new BsUser();
//        	bsUser.setId(rs.getInt("id"));
        	bsUser.setUserId(rs.getString("user_id"));
        	bsUser.setName(rs.getString("name"));
        	bsUser.setKySign(rs.getString("ky_sign"));
        	bsUser.setGroupSign(rs.getString("group_sign"));
//        	bsUser.setLogicalCityCode(rs.getString("logical_city_code"));
        	bsUser.setDepartment(rs.getString("department"));
        	bsUser.setPosition(rs.getString("position"));
//        	bsUser.setLogicalCity(rs.getString("logical_city"));
        	bsUser.setBrandFullName(rs.getString("brand_full_name"));
        	bsUser.setBrandShortName(rs.getString("brand_short_name"));
//        	bsUser.setSyncDate(rs.getTimestamp("sync_date"));
        	bsUser.setEmail(rs.getString("email"));
        	bsUser.setTenantSign(rs.getString("tenant_sign"));
        	bsUser.setUserSign(rs.getString("user_sign"));
        	bsUserList.add(bsUser);
        }
        rs.close();
        ps.close();
        
        Map<String, BsUser> allBsUsers = new HashMap<>(bsUserList.size());
        for (BsUser bsUser : bsUserList) {
        	allBsUsers.put(bsUser.getUserId(), bsUser);
        }
        
        return allBsUsers;
    }

    /**
     * 转换日期
     * @param dateStr
     * @return
     *
     */
    private static LocalDate getDate(String dateStr) {
        if (StringUtils.isEmpty(dateStr)) {
            log.warn("params error,date:{}", dateStr);
            return null;
        }
        LocalDate date = null;
        try {
            date = LocalDate.parse(dateStr, DateTimeFormat.forPattern(DateUtil.PATTERN_DATE));
        } catch (IllegalArgumentException e) {
            log.warn("params error,date:{}", dateStr);
            e.printStackTrace();
            return null;
        }
        if (date.isAfter(LocalDate.now())) {
            log.warn("params error,date:{}", dateStr);
            return null;
        }
        return date;
    }
    
    /**
    * <p>Description: 通过角色名称查询角色ID</p>
    * @param tName
    * @param tenantId
    * @return
    * @throws SQLException
    * @author liyinglei 
    * @date 2017年12月13日下午1:11:27
     */
    private static String queryRidByTName(String tName, String tenantId) throws SQLException {
        String sql = "select rid from UM_TEMPLETMANAGE where t_name = ? and tenantId = ? and type = 1 ";
        PreparedStatement ps = conn2Um.prepareStatement(sql);
        ps.setString(1, tName);
        ps.setInt(2, Integer.valueOf(tenantId));
        ResultSet rs = ps.executeQuery();
        String rId = "";
        while (rs.next()) {
        	rId = String.valueOf(rs.getInt("rid"));
        }
        rs.close();
        ps.close();
        
        return rId;
    }
    
    /**
     * 获取UM部门信息
     * @return
     * @throws SQLException
     */
    private static Map<String, UmDepartment> queryUmDepartment() throws SQLException {
        String sql = "select * from UM_DEPARTMENT ";
        PreparedStatement ps = conn2Um.prepareStatement(sql);
//        ps.setString(1, tenantId);
        ResultSet rs = ps.executeQuery();
        List<UmDepartment> umDepartmentList = new ArrayList<UmDepartment>();
        while (rs.next()) {
        	UmDepartment ud = new UmDepartment();
        	ud.setRid(rs.getInt("rid"));
        	ud.setDeptCode(rs.getString("dept_code"));
        	ud.setDeptName(rs.getString("dept_name"));
        	ud.setDeptDesc(rs.getString("dept_desc"));
        	ud.setTenantId(rs.getInt("tenantId"));
        	ud.setParentRid(rs.getInt("parent_rid"));
        	ud.setCreateTime(rs.getDate("create_time"));
        	ud.setUpdateTime(rs.getDate("update_time"));
        	ud.setOpUmid(rs.getString("op_umid"));
        	umDepartmentList.add(ud);
        }
        rs.close();
        ps.close();
        
        Map<String, UmDepartment> allUmDepartments = new HashMap<>();
        for (UmDepartment umDepartment : umDepartmentList) {
        	allUmDepartments.put(String.valueOf(umDepartment.getTenantId()), umDepartment);
        }
        
        return allUmDepartments;
    }
    
    /**
     * 获取UM用户和部门关系信息
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Map<String, UmDeptUser> queryUmDeptUser() throws SQLException {
        String sql = "select * from UM_DEPT_USER ";
        PreparedStatement ps = conn2Um.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();
        List<UmDeptUser> umDeptUserList = new ArrayList<UmDeptUser>();
        while (rs.next()) {
        	UmDeptUser ud = new UmDeptUser();
        	ud.setRid(rs.getInt("rid"));
        	ud.setDeptRid(rs.getInt("dept_rid"));
        	ud.setUserRid(rs.getInt("user_rid"));
        	ud.setUserType(rs.getString("user_type"));
        	ud.setCreateTime(rs.getDate("create_time"));
        	ud.setUpdateTime(rs.getDate("update_time"));
        	ud.setOpUmid(rs.getString("op_umid"));
        	umDeptUserList.add(ud);
        }
        rs.close();
        ps.close();
        
        Map<String, UmDeptUser> allUmDeptUsers = new HashMap<>();
        for (UmDeptUser umDeptUser : umDeptUserList) {
        	allUmDeptUsers.put(umDeptUser.getUserRid()+"|"+umDeptUser.getDeptRid(), umDeptUser);
        }
        
        return allUmDeptUsers;
    }

}
