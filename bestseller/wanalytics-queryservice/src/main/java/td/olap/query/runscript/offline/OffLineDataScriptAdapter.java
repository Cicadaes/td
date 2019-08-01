package td.olap.query.runscript.offline;


/**
 * Created by loong on 4/28/16.
 */
public class OffLineDataScriptAdapter {
    private static final int MAX_INTERVAL = 31;
    private static final String[] offLineCube = new String[]{"active_user_hour_cube", "active_user_day_cube",
            "new_user_day_cube", "new_user_sensor_day_cube", "old_user_day_cube", "old_user_sensor_day_cube"};
    private static final String DATE_FORMAT = "yyyy-MM-dd";

    public String adapt(String script) {
        StringBuilder scriptFormated = new StringBuilder();
        for (String column : script.split(";")) {
            if (canCalculateByOffLine(column)) {
                scriptFormated.append(format(column));
            } else {
                scriptFormated.append(column).append(";");
            }
        }
        return scriptFormated.toString();
    }

    private String format(String column) {
        StringBuilder result = new StringBuilder();
        String[] dates = getDate(column);
        String columnName = column.split("=")[0].trim();
        if (null == dates[0]) {
            throw new RuntimeException("script adapter error!");
        }
        int interval = dateInterval(dates[0], dates[1]);
        String nextDay = TimeUtil.dateAdd(dates[1], 1, DATE_FORMAT);
        if (TimeUtil.today(DATE_FORMAT).equals(dates[1])) {//日期为今日
            if (interval == 1) {
                return column + ";\n";
            }
            interval--;
            nextDay = TimeUtil.today(DATE_FORMAT);
        }
        if (interval <= MAX_INTERVAL) {
            result.append(buildOffLineSql(column, columnName, nextDay, interval));
        } else {
            int intervalMultiple = interval / MAX_INTERVAL;
            int intervalLess = interval % MAX_INTERVAL;
            for (int i = 0; i < intervalMultiple; i++) {
                result.append(buildOffLineSql(column, columnName + i, nextDay, MAX_INTERVAL));
                if (i > 0) {
                    result.append(columnName).append("0=union(").append(columnName).
                            append("0,").append(columnName).append(i).append(");\n");
                }
                nextDay = TimeUtil.dateAdd(nextDay, -1 * MAX_INTERVAL, DATE_FORMAT);
            }
            result.append(buildOffLineSql(column, columnName + "_", nextDay, intervalLess));
            result.append(columnName).append("=union(").append(columnName).
                    append("0,").append(columnName).append("_").append(");\n");
        }
        if (TimeUtil.today(DATE_FORMAT).equals(dates[1])) {
            result.append(buildTodaySql(columnName, "_td", column));
            result.append(columnName).append("=union(").append(columnName).append(",").append(columnName)
                    .append("_td").append(");\n");
        }
        return result.toString();
    }

    private String buildTodaySql(String columnName, String key, String column) {
        StringBuilder result = new StringBuilder();
        column = replaceTable(column, columnName, key);
        String[] splitDate = column.split("date");
        result.append(splitDate[0]);
        if (haveOtherParam(splitDate[1])) {
            String[] splitAnd = splitDate[1].split("and");
            for (String str : splitAnd) {
                if (haveOtherParam(str)) {
                    result.append(str).append("and");
                }
            }
        }
        result.append("date='").append(TimeUtil.today(DATE_FORMAT)).append("';\n");
        return result.toString();
    }

    private String replaceTable(String column, String columnName, String key) {
        StringBuilder result = new StringBuilder();
        String[] split = column.split("=");
        result.append(columnName).append(key).append("=");
        for (int i = 1; i < split.length; i++) {
            result.append(split[i]).append("=");
        }
        return result.substring(0, result.length() - 1);
    }

    private String buildOffLineSql(String originSql, String columnName, String date, int interval) {
        StringBuilder result = new StringBuilder();
        result.append(columnName).append("=select * from bitmap.").append(getTableName(originSql)).append(" where ");
        String paramsSql = originSql.split("where")[1];
        String[] splitDate = paramsSql.split("date");
        result.append(splitDate[0]);
        if (haveOtherParam(splitDate[1])) {
            String[] splitAnd = splitDate[1].split("and");
            for (String str : splitAnd) {
                if (haveOtherParam(str)) {
                    result.append(str).append("and");
                }
            }
        }
        result.append("date='").append(date).append("' and data_type=").append(interval).append(";\n");
        return result.toString();
    }

    private boolean haveOtherParam(String str) {
        if (str.contains("tenant_id") || str.contains("project_id")
                || str.contains("place_id") || str.contains("sensor_id")
                || str.contains("hour")) {
            return true;
        } else {
            return false;
        }
    }

    private String getTableName(String originSql) {
        if (originSql.contains("active_user_hour_cube")) {
            return "offline_active_user_hour_cube";
        } else if (originSql.contains("active_user_day_cube")) {
            return "offline_active_user_cube";
        } else if (originSql.contains("new_user_day_cube")) {
            return "offline_new_user_cube";
        } else if (originSql.contains("new_user_sensor_day_cube")) {
            return "offline_new_user_sensor_cube";
        } else if (originSql.contains("old_user_day_cube")) {
            return "offline_old_user_cube";
        } else if (originSql.contains("old_user_sensor_day_cube")) {
            return "offline_old_user_sensor_cube";
        }
        return null;
    }

    private int dateInterval(String start, String end) {
        return TimeUtil.getTimeRange(start, end, DATE_FORMAT).size();
    }

    private String[] getDate(String column) {
        String[] result = new String[2];
        String[] format_by_date = column.split("date");
        if (format_by_date.length > 1) {
            if (format_by_date[1].contains("between")) {
                String[] dates = format_by_date[1].split("and");
                result[0] = dates[0].split("between")[1].trim();
                if (dates[1].contains(";")) {
                    result[1] = dates[1].split(";")[0].trim();
                } else if (dates[1].contains("and")) {
                    result[1] = dates[1].split("and")[0].trim();
                } else if (dates[1].contains("or")) {
                    result[1] = dates[1].split("or")[0].trim();
                } else {
                    result[1] = dates[1].trim();
                }
            } else {
                //TODO  其它模式
                String[] splitDate = column.split("date");
                if (splitDate[1].contains(">=")){
                    result[0] = splitDate[1].replace(">=","").split(" ")[0].trim();
                }
                if (splitDate[1].contains("<=")){
                    result[1] = splitDate[1].replace("<=","").split(" ")[0].trim();
                }

                if (splitDate[2].contains(">=")){
                    result[0] = splitDate[2].replace(">=","").split(" ")[0].trim();
                }
                if (splitDate[2].contains("<=")){
                    result[1] = splitDate[2].replace("<=","").split(" ")[0].trim();
                }
            }
            result[0] = result[0].replace("'", "");
            result[1] = result[1].replace("'", "");
        }
        return result;
    }

    private boolean canCalculateByOffLine(String column) {
        for (String cube : offLineCube) {
            if (column.contains(cube)) {
                return true;
            }
        }
        return false;
    }


    public static void main(String[] args) {
        OffLineDataScriptAdapter adapter = new OffLineDataScriptAdapter();
        String sql = "a=select * from bitmap.active_user_day_cube where tenant_id=1 and project_id = 2 and date between " +
                "'20160103' and '20160503';return a;";
        System.out.println(adapter.adapt(sql));
    }
}
