package td.enterprise.wanalytics.processor.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TimespendLogger {

	public static Logger logger = LoggerFactory.getLogger(TimespendLogger.class);

	private long lastTime = 0;

	private String lastStep = "";
	private long in = 0;

	public TimespendLogger() {

	}

	public TimespendLogger(long t) {
		this.in = t;
	}

	public TimespendLogger logReset(String stepName) {
		lastTime = System.currentTimeMillis();
		lastStep = stepName;
		return this;
	}

	public TimespendLogger logStep(String stepName) {
		long now = System.currentTimeMillis();
		if (now - lastTime > in) {
			logger.info(" {} =============== step:{},spend:{}", Thread.currentThread().getName(), lastStep, now - lastTime);
		}
		lastTime = now;
		lastStep = stepName;
		return this;
	}

}
