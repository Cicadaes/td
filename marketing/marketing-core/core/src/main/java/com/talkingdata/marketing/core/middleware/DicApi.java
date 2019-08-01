package com.talkingdata.marketing.core.middleware;

import com.fasterxml.jackson.core.type.TypeReference;
import com.google.common.reflect.TypeToken;
import com.talkingdata.marketing.core.config.UmConfig;
import com.talkingdata.marketing.core.entity.thirdmodel.config.Dic;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The type Dic api.
 * @author xiaoming.kang
 */
@Component
public class DicApi {
    private static final Logger logger = LoggerFactory.getLogger(DicApi.class);

    @Autowired
    private UmConfig umConfig;

    /**
     * Gets dic.
     *
     * @param name the name
     * @return the dic
     */
    public Map <String, String> getDic(String name) throws IOException {
        Map <String, String> dicMap = new HashMap <>(16);
        String url = umConfig.getUrl() + "/admin/dic?name={name}";
        Map <String, Object> queryParam = new HashMap <>(16);
        queryParam.put("name", name);
        String resp = HttpClientUtil.get(url, queryParam, "UTF-8");
        List <Dic> dics = JsonUtil.toObject(resp, new TypeReference<List <Dic>>() {});
        for (Dic dic : dics) {
            dicMap.put(dic.getDicItemKey(), dic.getDicItemValue());
        }

        return dicMap;
    }
}
