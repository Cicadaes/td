package com.talkingdata.marketing.core.constant;

/**
 *
 * @author maoyu.zhang
 * @date 9/26/2017
 */
public class PipelineDefinitionConstant {
    /**
     * The type Action type constant.
     */
    @Deprecated
    public static class ActionTypeConstant{
        /**
         * 保存草稿
         */
        public final static Integer DRAFT = 0;
        /**
         * 申请上线
         */
        public final static Integer COMMIT = 1;
    }

    /**
     * The type Pipeline definition status constant.
     */
    public static class PipelineDefinitionStatusConstant {
        /**
         * 草稿
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_DRAFT = 1;
        /**
         *   校验通过 or 测试通过
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_CHECKED = 2;
        /**
         *  上线申请
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_APPLY_TO_ONLINE = 3;
        /**
         *  审批未通过
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_APPLY_FAIL = 4;
        /**
         *  已上线
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_WAITING_ONLINE = 5;
        /**
         *  运行中
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_APPLY_SUCC = 6;
        /**
         *  已下线
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_OFFLINE = 7;
        /**
         *  流程已结束
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_FINISH = 8;
        /**
         *  流程测试中
         */
        public final static Integer PIPELINE_DEFINITION_STATUS_TESTING = 9;


    }

    /**
     * Pipeline Instance Constant
     */
    public static class PipelineInstanceConstant {
        /**
         * 未开始
         */
        public final static Integer PIPELINE_INSTANCE_STATUS_UNSTART = 0;
        /**
         * 进行中
         */
        public final static Integer PIPELINE_INSTANCE_STATUS_PROCESSING = 1;
        /**
         * 已下线
         */
        public final static Integer PIPELINE_INSTANCE_STATUS_OFFLINE = 2;
        /**
         * 已完成
         */
        public final static Integer PIPELINE_INSTANCE_STATUS_FI_NISH = 3;
        /**
         * 提前终止
         */
        public final static Integer PIPELINE_INSTANCE_STATUS_PREMATURE_TERMINATION = 4;
    }
}
