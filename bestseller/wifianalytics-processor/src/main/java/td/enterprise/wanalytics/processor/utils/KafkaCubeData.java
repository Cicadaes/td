package td.enterprise.wanalytics.processor.utils;

import org.apache.storm.tuple.Values;

import java.io.Serializable;

public class KafkaCubeData implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * cube name
	 */
	private String cubeName;

	/**
	 * 维度
	 */
	private String dimension;

	/**
	 * values
	 */
	private Values values;

	public KafkaCubeData(String dimension, Values values) {
		this.dimension = dimension;
		this.values = values;
	}

	public Values getValues() {
		return values;
	}

	public void setValues(Values values) {
		this.values = values;
	}

	public String getCubeName() {
		return cubeName;
	}

	public void setCubeName(String cubeName) {
		this.cubeName = cubeName;
	}

	public String getDimension() {
		return dimension;
	}

	public void setDimension(String dimension) {
		this.dimension = dimension;
	}
}
