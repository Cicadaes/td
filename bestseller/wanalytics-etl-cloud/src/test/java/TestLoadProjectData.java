import td.enterprise.wanalytics.etl.task.competitor.LoadProjectDataTaskFromDB;

/**
 * Created by junmin.li
 */
public class TestLoadProjectData {

    public static void main(String [] args ) throws  Exception {
           String file = "C:\\Users\\Administrator\\Desktop\\卓越_深圳POI.xlsx";
           int projectId = 7;
           long start = System.currentTimeMillis();
           LoadProjectDataTaskFromDB.importProjectRoomFromFile(file,projectId);
           long end = System.currentTimeMillis();
           System.out.println("----------Use time--------=" + (end -start) );
    }
}
