package td.enterprise.service.manager;

import com.alibaba.druid.support.json.JSONUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import td.enterprise.Application;
import td.enterprise.common.util.JSONUtil;

import javax.inject.Inject;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;


/**
 * Created by Yan on 2017/7/15.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class})
public class TestMCService {

    @Inject
    private MCService mcService;

    @Test
    public void testGetToken() throws Exception {
        String token = mcService.getToken();
        assertThat(StringUtils.isNotEmpty(token));
    }

    @Test
    public void testcreateSegment() throws Exception {
        String poiJson = "{\"name\":\"人群Poi测试\",\"pois\":[{\"ps\":[{\"lng\":116.374104,\"lat\":39.942444}],\"name\":\"po水淀粉\",\"range\":5,\"type\":1},{\"ps\":[{\"lng\":116.483195,\"lat\":39.944767},{\"lng\":116.548735,\"lat\":39.913783},{\"lng\":116.610826,\"lat\":40.004925},{\"lng\":116.480895,\"lat\":40.013767}],\"name\":\"poi2\",\"type\":2,\"range\":\"\"}],\"opRelation\":\"2\",\"type\":1}";
        Map map = new HashMap();
        try {
            map = JSONUtil.jsonToMap(poiJson, Map.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(map);
        String segment = mcService.createSegment(map);
        assertThat(StringUtils.isNotEmpty(segment));
        System.out.println(segment);
    }
}
