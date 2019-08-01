package td.enterprise.wanalytics.etl.task.regionchange;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import td.enterprise.wanalytics.etl.bean.CityRegion;
import td.enterprise.wanalytics.etl.util.JsonUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * Created by pc on 2017/7/3.
 */
public class CityRegionChangeThread implements Callable<List<CityRegion>> {
    private List<CityRegion> regionList;
    private static String oid;
    private static String key;

    public CityRegionChangeThread(String oid,String key,List<CityRegion> regionList){
        CityRegionChangeThread.oid = oid;
        CityRegionChangeThread.key = key;
        this.regionList = regionList;
    }

    @Override
    public List<CityRegion> call() throws Exception {
        List<CityRegion> returnRegionList = new ArrayList<CityRegion>();
        int size = 0;
        List<CityRegion> list = new ArrayList<CityRegion>();
        System.out.println(Thread.currentThread().getName()+"------"+regionList.size());
        for(int i=0;i<regionList.size();i++){
            if(size==19||i==regionList.size()-1){
                list.add(regionList.get(i));
                returnRegionList.addAll(getGeoInfo(list));
                size = 0;
                list = new ArrayList<CityRegion>();
            }else{
                list.add(regionList.get(i));
                size++;
            }
        }
        return returnRegionList;
    }

    public static List<CityRegion> getGeoInfo(List<CityRegion> regionList) {
        StringBuilder latlng = new StringBuilder();
        for (int i = 0; i < regionList.size(); i++) {
            latlng.append(regionList.get(i).getLatitudeBd()).append(",").append(regionList.get(i).getLongitudeBd());
            if (i != regionList.size() - 1) {
                latlng.append(";");
            }
        }

        GeoReturnVO vo = null;
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            HttpGet httpget = new HttpGet("http://api.gpsspg.com/convert/latlng/?oid=" + oid + "&key=" + key + "&from=0&to=2&latlng=" + latlng.toString());
            System.out.println("executing request " + httpget.getURI());
            CloseableHttpResponse response = httpclient.execute(httpget);
            try {
                HttpEntity entity = response.getEntity();
//                System.out.println(response.getStatusLine());
                if (entity != null) {
                    String returnStr = EntityUtils.toString(entity);
                    vo = JsonUtils.jsonToObject(returnStr,GeoReturnVO.class);
//                    vo = JSON.parseObject(returnStr, GeoReturnVO.class);
//                    System.out.println("Response content: " + returnStr);
                }
            } finally {
                response.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        List<PointVO> list = vo.getResult();
        for(int i=0;i<regionList.size();i++){
            regionList.get(i).setLatitudeGoogle(list.get(i).getLat());
            regionList.get(i).setLongitudeGoogle(list.get(i).getLng());
        }

        return regionList;
    }

}
