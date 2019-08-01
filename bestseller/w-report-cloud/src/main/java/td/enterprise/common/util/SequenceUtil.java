package td.enterprise.common.util;

import org.apache.log4j.Logger;


/**
 * @description: 生成序列号
 * @author: cmh 2013-8-30
 * @version: 1.0
 * @modify:
 * @Copyright: 公司版权拥有
 */
public class SequenceUtil {
    private static final Logger logger = Logger.getLogger(SequenceUtil.class);

    /**
     * 生成订单号
     *
     * @param seqName
     * @return
     */
    public static String getSequenceCode(String seqName) {
        return "";
    }

    /**
     * 生成订单号 通过JDBC
     *
     * @param seqName
     * @return
     */
    public static String getSequenceIdByJDBC(String seqName) {
//        String applyNum = "";
//        Connection con = null;
//        CallableStatement cst = null;
//
//        try {
//            DataSource datasource = (DataSource) ApplicationContextManager.getBean("dataSource");
//
//            con = datasource.getConnection();
//            String sql = "{?= call fun_seq_nextval('" + seqName + "')}";
//            cst = con.prepareCall(sql);
//            cst.registerOutParameter(1, Types.VARCHAR);
//
//            cst.execute();
//
//            applyNum = cst.getString(1);
//            logger.debug("生成订单号" + applyNum);
//
//            con.close();
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//        }
//        finally {
//
//            try {
//                if (con != null) {
//                    con.close();
//                }
//                if (cst != null) {
//                    cst.close();
//                }
//            }
//            catch (SQLException e) {
//                // TODO 自动生成 catch 块
//                e.printStackTrace();
//            }
//
//        }
//        return applyNum;
        return "";
    }

    /**
     * 获取相对主键的完整序列号，支持分隔符
     *
     * @param seqSubName
     * @param connectSign
     * @return
     */
    public static String getSubSequenceCode(String seqSubName, String connectSign) {

        return "";
    }

    public static Integer getSubSequenceNum(String seqSubName) {

        return 0;
    }
}
