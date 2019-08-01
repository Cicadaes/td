package com.talkingdata.marketing.core.util;

import com.talkingdata.marketing.core.entity.campaign.Sequence;
import com.talkingdata.marketing.core.entity.dto.SequenceDto;
import com.talkingdata.marketing.core.service.campaign.SequenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * @create 2017-09-06-下午5:20
 * @since JDK 1.8
 * @author hongsheng
 */
public class SequenceUtil {

    private static final Logger logger = LoggerFactory.getLogger(SequenceUtil.class);

    /**
     * Sequence Type
     */
    public enum SequenceTypeEnum{
        /**
         * //pipeline equity
         */
        PE("PE"),
        /**
         * //BehaviorDefinition code
         */
        BD("BD");
        private String code;

        SequenceTypeEnum(String code){
            this.code = code;
        }

        public String getCode() {
            return code;
        }
    }

    /**
     * 生成订唯一单号
     * @param type @see SequenceTypeEnum
     * @return
     */
    public static String getSequenceCode(SequenceTypeEnum type) {
        SequenceService sequenceService = (SequenceService) SpringContextUtil.getBean("sequenceService");
        Sequence sequence = new Sequence();
        sequence.setSeqName(type.getCode());
        SequenceDto sequenceDto = sequenceService.selectSeqNextVal(sequence);
        return sequenceDto.getApplyNum();
    }

    /**
     * 无用，暂时注释
     * 生成订单号 通过JDBC
     * @param seqName
     * @return
     */
//    public static String getSequenceIdByJDBC(String seqName) {
//        String applyNum = "";
//        Connection con = null;
//        CallableStatement cst = null;
//
//        try {
//            DataSource datasource = (DataSource) SpringContextUtil.getBean("marketingDataSource");
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
//    }
}
