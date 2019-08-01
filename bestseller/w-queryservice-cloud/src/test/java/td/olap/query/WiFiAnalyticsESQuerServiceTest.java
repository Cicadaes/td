package td.olap.query;

import junit.framework.TestCase;
import org.junit.Test;
import td.olap.query.runscript.bean.EsQueryBean;

/**
 * Created by Yan on 2017/4/6.
 */
public class WiFiAnalyticsESQuerServiceTest extends TestCase {


    private WiFiAnalyticsESQuerService esQueryService;

    @Override
    protected void setUp() throws Exception {
        esQueryService = WiFiAnalyticsESQuerService.getInstance("wifipix", "172.23.5.148:9300");

    }

    @Test
    public void testQuerySum() {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytcis");
        query.setTypeName("log_es_201704");
        query.setIndex("session_duration");
        query.setTenantId("2000247");
        query.setProjectId("13");
        query.setMinDuration("5");
        query.setHasMin(true);
        Double sum = esQueryService.querySum(query);
        assertEquals(740.0, sum);
    }

    @Test
    public void testQueryCounter() {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytcis");
        query.setTypeName("log_es_201704");
        query.setIndex("tenant_offset");
        query.setTenantId("2000247");
        query.setProjectId("13");
        query.setMinDuration("5");
        query.setHasMin(true);
        long count = esQueryService.queryCounter(query);
        assertEquals(27, count);
    }

}
