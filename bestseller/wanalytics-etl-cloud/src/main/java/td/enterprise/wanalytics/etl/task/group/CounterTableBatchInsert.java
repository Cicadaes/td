package td.enterprise.wanalytics.etl.task.group;


import td.enterprise.wanalytics.etl.util.QueryUtils;

public class CounterTableBatchInsert {

    public static Boolean ordinaryTableBatchInsert(String tableName, String parentProjectId, String runDate) {

        String queryAndInsertSql = "INSERT INTO " + tableName + "(tenant_id, project_id, date, metric_value) "
                + " SELECT t.tenant_id, d.project_id, t.date, t.sum_metric_value "
                + " FROM "
                   + " (SELECT s.tenant_id, s.date, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
                    + " FROM " + tableName + " s WHERE s.project_id IN ( "
                         + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
                         + " WHERE r.project_parent_id = '" + parentProjectId + "') "
                    + " AND s.date = '" + runDate + "' "
                    + " GROUP BY s.date)t, "
                + " (SELECT DISTINCT project_parent_id AS project_id FROM  " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION WHERE project_parent_id = '" + parentProjectId + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";
        try {
            QueryUtils.execute(queryAndInsertSql, QueryUtils.COUNTER_DB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    public static void main(String[] args) {
        String queryAndInsertSql = "INSERT INTO " + 111 + "(tenant_id, project_id, date, metric_value) "
            + " SELECT t.tenant_id, d.project_id, t.date, t.sum_metric_value "
            + " FROM "
            + " (SELECT s.tenant_id, s.date, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
            + " FROM " + 111 + " s WHERE s.project_id IN ( "
            + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
            + " WHERE r.project_parent_id = '" + 222 + "') "
            + " AND s.date = '" + 111 + "' "
            + " GROUP BY s.tenant_id, s.date)t, "
            + " (SELECT DISTINCT project_parent_id AS project_id FROM  " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION WHERE project_parent_id = '" + 222 + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";

        System.out.println("-----" + queryAndInsertSql);
    }


    public static Boolean roomTypeTableBatchInsert(String tableName, String parentProjectId, String runDate) {

        String queryAndInsertSql = "INSERT INTO " + tableName + "(tenant_id, project_id, type, room_number, date, metric_value) "
                + " SELECT t.tenant_id, d.project_id, t.type, t.room_number, t.date, t.sum_metric_value "
                + " FROM "
                + " (SELECT s.tenant_id, s.type, s.room_number, s.date, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
                + " FROM " + tableName + " s WHERE s.project_id IN ( "
                + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
                + " WHERE r.project_parent_id = '" + parentProjectId + "') "
                + " AND s.date = '" + runDate + "' "
                + " GROUP BY s.tenant_id, s.type, s.room_number, s.date)t, "
                + " (SELECT DISTINCT project_parent_id AS project_id FROM  " + QueryUtils.WIFIANALYTICS_DB_PREFIX  + "TD_PROJECT_RELATION WHERE project_parent_id = '" + parentProjectId + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";
        try {
            QueryUtils.execute(queryAndInsertSql, QueryUtils.COUNTER_DB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    public static Boolean hourTableBatchInsert(String tableName, String parentProjectId, String runDate) {

        String queryAndInsertSql = "INSERT INTO " + tableName + "(tenant_id, project_id, date, hour, metric_value) "
                + " SELECT t.tenant_id, d.project_id, t.date, t.hour, t.sum_metric_value "
                + " FROM "
                + " (SELECT s.tenant_id, s.date, s.hour, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
                + " FROM " + tableName + " s WHERE s.project_id IN ( "
                + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
                + " WHERE r.project_parent_id = '" + parentProjectId + "') "
                + " AND s.date = '" + runDate + "' "
                + " GROUP BY s.tenant_id, s.date, s.hour)t, "
                + " (SELECT DISTINCT project_parent_id AS project_id FROM " +  QueryUtils.WIFIANALYTICS_DB_PREFIX  +"TD_PROJECT_RELATION WHERE project_parent_id = '" + parentProjectId + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";
        try {
            QueryUtils.execute(queryAndInsertSql, QueryUtils.COUNTER_DB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    public static Boolean durationTableBatchInsert(String tableName, String parentProjectId, String runDate) {

        String queryAndInsertSql = "INSERT INTO " + tableName + "(tenant_id, project_id, date, duration, metric_value) "
                + " SELECT t.tenant_id, d.project_id, t.date, t.duration, t.sum_metric_value "
                + " FROM "
                + " (SELECT s.tenant_id, s.date, s.duration, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
                + " FROM " + tableName + " s WHERE s.project_id IN ( "
                + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
                + " WHERE r.project_parent_id = '" + parentProjectId + "') "
                + " AND s.date = '" + runDate + "' "
                + " GROUP BY s.tenant_id, s.date, s.duration)t, "
                + " (SELECT DISTINCT project_parent_id AS project_id FROM "+ QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION WHERE project_parent_id = '" + parentProjectId + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";
        try {
            QueryUtils.execute(queryAndInsertSql, QueryUtils.COUNTER_DB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    public static Boolean sensorHourTableBatchInsert(String tableName, String parentProjectId, String runDate) {
        String queryAndInsertSql = "INSERT INTO " + tableName + "(tenant_id, project_id, place_id, sensor_id, date, hour, metric_value) "
                + " SELECT t.tenant_id, d.project_id, t.place_id, t.sensor_id, t.date, t.hour, t.sum_metric_value "
                + " FROM "
                + " (SELECT s.tenant_id, s.place_id, s.sensor_id, s.date, s.hour, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
                + " FROM " + tableName + " s WHERE s.project_id IN ( "
                + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
                + " WHERE r.project_parent_id = '" + parentProjectId + "') "
                + " AND s.date = '" + runDate + "' "
                + " GROUP BY s.tenant_id, s.place_id, s.sensor_id, s.date, s.hour)t, "
                + " (SELECT DISTINCT project_parent_id AS project_id FROM "+ QueryUtils.WIFIANALYTICS_DB_PREFIX +"TD_PROJECT_RELATION WHERE project_parent_id = '" + parentProjectId + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";
        try {
            QueryUtils.execute(queryAndInsertSql, QueryUtils.COUNTER_DB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }

    public static Boolean sensorTableBatchInsert(String tableName, String parentProjectId, String runDate) {
//
        String queryAndInsertSql = "INSERT INTO " + tableName + "(tenant_id, project_id, place_id, sensor_id, date, metric_value) "
                + " SELECT t.tenant_id, d.project_id, t.place_id, t.sensor_id, t.date, t.sum_metric_value "
                + " FROM "
                + " (SELECT s.tenant_id, s.place_id, s.sensor_id, s.date, SUM(IFNULL(s.metric_value,0)) AS sum_metric_value "
                + " FROM " + tableName + " s WHERE s.project_id IN ( "
                + " SELECT r.project_id FROM " + QueryUtils.WIFIANALYTICS_DB_PREFIX + "TD_PROJECT_RELATION r "
                + " WHERE r.project_parent_id = '" + parentProjectId + "') "
                + " AND s.date = '" + runDate + "' "
                + " GROUP BY s.tenant_id, s.place_id, s.sensor_id, s.date)t, "
                + " (SELECT DISTINCT project_parent_id AS project_id FROM "+ QueryUtils.WIFIANALYTICS_DB_PREFIX +"TD_PROJECT_RELATION WHERE project_parent_id = '" + parentProjectId + "')d ON DUPLICATE KEY UPDATE metric_value = (t.sum_metric_value)";
        try {
            QueryUtils.execute(queryAndInsertSql, QueryUtils.COUNTER_DB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return true;
    }
}
