package com.talkingdata.marketing.core.entity.thirdmodel.edm;

/**
 * @author armeng
 * @author xiaoming.kang
 */

public enum EdmReportEnum {
    //报告时间
    REPORT_TIME("reportTime", 1),
    //成功
    SENT_INCREMENT("sentIncrement", 12),
	//总退回
    TOTAL_REJECT_INCREMENT("totalRejectIncrement", 9),
	//无效
    INVALID_INCREMENT("invalidIncrement", 15),
	//拒收
    REJECT_INCREMENT("rejectIncrement", 24),
	//打开邮件人数
    OPEN_INCREMENT("openIncrement", 30),
	//点击链接人数
    CLICK_INCREMENT("clickIncrement", 33),
    CREATE_TIME("create_time", 58);

    /**表示header头信息
     */
    private String value;
    /**表示header对应的第N列(从0开始)
     */
    private Integer code;
    EdmReportEnum(String value, Integer code) {
        this.value = value;
        this.code = code;
    }
    public String getValue() {
        return value;
    }

    public Integer getCode() {
        return code;
    }
}
