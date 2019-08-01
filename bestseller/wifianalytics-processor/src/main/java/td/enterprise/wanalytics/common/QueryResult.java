package td.enterprise.wanalytics.common;

import td.enterprise.wanalytics.processor.utils.StringUtils;
import td.enterprise.wanalytics.processor.utils.Utils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QueryResult extends ArrayList<Object[]> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6588490252735148367L;

	public QueryResult(List<Object[]> result) {
		super(result);
	}

	public boolean isNotEmpty() {
		return Utils.isNotEmpty(this) && Utils.isNotEmpty(get(0)) && Utils.isNotNull(get(0)[0]);
	}

	public String getString() {
		return isNotEmpty() ? get(0)[0].toString() : null;
	}

	public List<String> getStringsByOneColumn() {
		List<String> res = null;
		if (isNotEmpty()) {
			res = new ArrayList<String>();
			for (Object[] os : this) {
				res.add(StringUtils.ToString(os[0]));
			}
		}
		return res;
	}

	public List<Integer> getIntegersByOneColumn() {
		List<Integer> res = null;
		if (isNotEmpty()) {
			res = new ArrayList<Integer>();
			for (Object[] os : this) {
				res.add(StringUtils.stringToInt(StringUtils.ToString((os[0]))));
			}
		}
		return res;
	}

	public int getInt() {
		return isNotEmpty() ? StringUtils.stringToInt(StringUtils.ToString((get(0)[0]))) : 0;
	}

	public long getLong() {
		return isNotEmpty() ? StringUtils.stringToLong(StringUtils.ToString((get(0)[0]))) : 0;
	}

	public List<String> getStringsByOneRow() {
		List<String> res = null;
		if (isNotEmpty()) {
			res = new ArrayList<String>();
			Object[] tr = get(0);
			for (Object object : tr) {
				res.add(StringUtils.ToString(object));
			}
		}
		return res;
	}

	public List<Integer> getIntegersByOneRow() {
		List<Integer> res = null;
		if (isNotEmpty()) {
			res = new ArrayList<Integer>();
			Object[] tr = get(0);
			for (Object object : tr) {
				res.add(StringUtils.stringToInt(StringUtils.ToString(object)));
			}
		}
		return res;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		if (Utils.isNotEmpty(this)) {
			for (Object[] os : this) {
				builder.append(Arrays.toString(os)).append("\t");
			}
			return builder.toString();
		} else {
			return "null";
		}
	}

	public Timestamp getTimestamp() {
		return isNotEmpty() ? (Timestamp) get(0)[0] : null;
	}
}
