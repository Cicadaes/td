package com.talkingdata.marketing.core.middleware;

import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

/**
 * The type Http client service.
 * @author xiaoming.kang
 */
@Service("httpClientService")
public class HttpClientService {

    /**
     * Gets map.
     *
     * @param url the url
     * @return the map
     */
    @Cacheable(value = "getDefault", sync = true)
    public Map <String, String> getMap(String url) throws IOException {
        String resp = HttpClientUtil.get(url);
        Map <String, String> m = JsonUtil.toObject(resp, Map.class);
        return m;
    }

}