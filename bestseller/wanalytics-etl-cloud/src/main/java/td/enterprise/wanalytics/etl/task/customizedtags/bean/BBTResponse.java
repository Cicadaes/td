package td.enterprise.wanalytics.etl.task.customizedtags.bean;

import java.util.List;

public class BBTResponse {
	private int code;
	private String message;
	private List<FilmPlanInfo> result;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List<FilmPlanInfo> getResult() {
		return result;
	}

	public void setResult(List<FilmPlanInfo> result) {
		this.result = result;
	}

}
