package td.enterprise.wanalytics.etl.task.customizedtags.bean;

public class FilmPlanInfo {
	private String film_plan_id;
	private String cinemacode;
	private String auditorium_id;
	private String auditorium_type;
	private String auditorium_seat;
	private String ymd;
	private String start_date;
	private String end_date;
	private String filmname;

	public String getFilm_plan_id() {
		return film_plan_id;
	}

	public void setFilm_plan_id(String film_plan_id) {
		this.film_plan_id = film_plan_id;
	}

	public String getCinemacode() {
		return cinemacode;
	}

	public void setCinemacode(String cinemacode) {
		this.cinemacode = cinemacode;
	}

	public String getAuditorium_id() {
		return auditorium_id;
	}

	public void setAuditorium_id(String auditorium_id) {
		this.auditorium_id = auditorium_id;
	}

	public String getAuditorium_type() {
		return auditorium_type;
	}

	public void setAuditorium_type(String auditorium_type) {
		this.auditorium_type = auditorium_type;
	}

	public String getAuditorium_seat() {
		return auditorium_seat;
	}

	public void setAuditorium_seat(String auditorium_seat) {
		this.auditorium_seat = auditorium_seat;
	}

	public String getYmd() {
		return ymd;
	}

	public void setYmd(String ymd) {
		this.ymd = ymd;
	}

	public String getStart_date() {
		return start_date;
	}

	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}

	public String getEnd_date() {
		return end_date;
	}

	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}

	public String getFilmname() {
		return filmname;
	}

	public void setFilmname(String filmname) {
		this.filmname = filmname;
	}

	@Override
	public String toString() {
		return "FilmPlanInfo [film_plan_id=" + film_plan_id + ", cinemacode="
				+ cinemacode + ", auditorium_id=" + auditorium_id
				+ ", auditorium_type=" + auditorium_type + ", auditorium_seat="
				+ auditorium_seat + ", ymd=" + ymd + ", start_date="
				+ start_date + ", end_date=" + end_date + ", filmname="
				+ filmname + "]";
	}

}
