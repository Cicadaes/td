import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.util.BitmapUtil;
import junit.framework.TestCase;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.RedisClient;
import td.olap.query.WiFiAnalyticsESQuerService;
import td.olap.query.runscript.bean.EsQueryBean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by Yan on 2017/4/6.
 */
@Slf4j
public class WiFiAnalyticsESQuerServiceTest extends TestCase {


    private WiFiAnalyticsESQuerService esQueryService;

    @Override
    protected void setUp() throws Exception {
        esQueryService = WiFiAnalyticsESQuerService.getInstance("wifipix", "172.23.5.148:9300");

    }

    @Test
    public void testQueryBitmap() {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setProjectId("13");
        query.setMinDuration("5");
        query.setHasMin(true);
        String redisHosts = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
        String masterName = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);
        byte[] bytes = esQueryService.queryBitmap(query,redisHosts,masterName);
        Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(bytes);
        log.info(Arrays.toString(bitmap.toArray()));
    }

    /***
     * 测试次数验证
     */
    @Test
    public void testQueryTimes() {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        query.setProjectId("33");
        query.setEventCount("2");
        query.setRelatetionship("gt");
        String startDate = "2017-05-09";
        String endDate = "2017-05-09";
        long startLong = DateUtil.format(startDate,DateUtil.PATTERN_DATE).getTime();
        long endLong = DateUtil.format(endDate,DateUtil.PATTERN_DATE).getTime();
        query.setStartDate(startLong + "");
        query.setEndDate(endLong + "");
        String redisHosts = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
        String masterName = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);
        byte[] bytes = esQueryService.queryBitmap(query,redisHosts,masterName);
        Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(bytes);
        log.info(Arrays.toString(bitmap.toArray()));
    }


    /***
     * 测试时间bitmap
     */
    @Test
    public void testQueryDuration() {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        query.setProjectId("33");
        query.setMinDuration("20");
        query.setHasMin(false);
        String startDate = "2017-05-09";
        String endDate = "2017-05-09";
        long startLong = DateUtil.format(startDate,DateUtil.PATTERN_DATE).getTime();
        long endLong = DateUtil.format(endDate,DateUtil.PATTERN_DATE).getTime();
        query.setStartDate(startLong + "");
        query.setEndDate(endLong + "");
        String redisHosts = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
        String masterName = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);
        byte[] bytes = esQueryService.queryBitmap(query,redisHosts,masterName);
        Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(bytes);
        log.info(""+bitmap.cardinary());
        log.info(Arrays.toString(bitmap.toArray()));
    }

    /***
     * 测试in 操作
     */
    @Test
    public void testQueryInDuration() {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        List<String> projectIds = new ArrayList<String>();
        projectIds.add("16");
        projectIds.add("38");
        projectIds.add("40");
        query.setProjectIds(projectIds);
        query.setMinDuration("20");
        query.setHasMin(false);
        String startDate = "2017-05-09";
        String endDate = "2017-05-09";
        long startLong = DateUtil.format(startDate,DateUtil.PATTERN_DATE).getTime();
        long endLong = DateUtil.format(endDate,DateUtil.PATTERN_DATE).getTime();
        query.setStartDate(startLong + "");
        query.setEndDate(endLong + "");
        String redisHosts = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
        String masterName = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);
        byte[] bytes = esQueryService.queryBitmap(query,redisHosts,masterName);
        Bitmap bitmap = BitmapUtil.byteArrayToBitmapRequest(bytes);
        log.info(""+bitmap.cardinary());
        log.info(Arrays.toString(bitmap.toArray()));
    }
}
