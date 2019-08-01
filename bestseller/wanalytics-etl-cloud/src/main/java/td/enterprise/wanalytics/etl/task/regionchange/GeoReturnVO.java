package td.enterprise.wanalytics.etl.task.regionchange;

import java.util.List;

public class GeoReturnVO {

	String status;
	List<PointVO> result;
	List<Integer> match;

	public List<Integer> getMatch() {
		return match;
	}

	public void setMatch(List<Integer> match) {
		this.match = match;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<PointVO> getResult() {
		return result;
	}

	public void setResult(List<PointVO> result) {
		this.result = result;
	}

}
