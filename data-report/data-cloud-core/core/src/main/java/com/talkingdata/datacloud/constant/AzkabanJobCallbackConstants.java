package com.talkingdata.datacloud.constant;

/**
 * Azkaban 回调状态常量
 * @author yangtao
 */
public class AzkabanJobCallbackConstants {

	/**
	 * Azkaban回调状态
	 * @author yangtao
	 */
	public static class AzkabanJobCallbackStatus {

		/**
		 * 任务开始状态
		 */
		public static String STATUS_START = "queued";

		/**
		 * 任务执行成功
		 */
		public static String STATUS_SUCCEEDED = "succeeded";

		/**
		 * 任务执行失败
		 */
		public static String STATUS_FAILED = "failed";
	}

	/**
	 * Azkaban任务执行Job类型
	 * @author yangtao
	 */
	public static class AzkabanJobCallbackProcessTypes {

		/**
		 * 任务初始化节点 0
		 */
		public static String PROCESS_TYPES_INIT = "0";

		/**
		 * 任务执行节点 1
		 */
		public static String PROCESS_TYPES_PROCESS = "1";

		/**
		 * 任务结束节点 2
		 */
		public static String PROCESS_TYPES_COMPLETED = "2";
	}

}
