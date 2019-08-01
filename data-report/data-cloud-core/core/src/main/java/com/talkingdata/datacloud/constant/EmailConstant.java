package com.talkingdata.datacloud.constant;

/**
 * 邮件常量
 * @author Anjie.Li
 */
public class EmailConstant {
	
	public static class EmailSendConstants {

		/**
		 * 邮件服务器serviceCode：dmpv3
		 */
		public static final String EMAIL_SEND_SERVER_CODE = "DMP_SEND_EMAIL";
	}
	
	
	public static class EmailSendStatusConstants {

		/**
		 * 邮件发送记录状态：1，未发送
		 */
		public static final int EMAIL_SEND_STATUS_UNSENT = 1;
		/**
		 * 邮件发送记录状态：2，重试
		 */
		public static final int EMAIL_SEND_STATUS_RETRY = 2;
		/**
		 * 邮件发送记录状态：3，已发送
		 */
		public static final int EMAIL_SEND_STATUS_SEND = 3;
		/**
		 * 邮件发送记录状态：-1，发送失败
		 */
		public static final int EMAIL_SEND_STATUS_FAILED = -1;
	}
}
