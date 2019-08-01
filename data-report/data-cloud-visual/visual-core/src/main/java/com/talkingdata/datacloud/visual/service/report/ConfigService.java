package com.talkingdata.datacloud.visual.service.report;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.talkingdata.datacloud.entity.admin.DicItem;
import com.talkingdata.datacloud.entity.admin.Param;
import com.talkingdata.datacloud.util.HttpUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service("ConfigService")
public class ConfigService {
    private static final Logger logger = LoggerFactory.getLogger(ConfigService.class);
    private String ConfigAddr;
    public void initProperty(String configUrl) {
        ConfigAddr = configUrl;
    }

    /**
     * 获取当前key对应的value
     *
     * @param paramKey
     * @param systemCode
     * @return
     */
    public String getParam(String paramKey, String systemCode) {
        String res;
        try {
            String url = ConfigAddr + "/admin/param";
            Map<String, Object> queryParam = new HashMap<>();
            queryParam.put("paramKey", paramKey);
            queryParam.put("systemCode", systemCode);
            String response = HttpUtil.get(url, queryParam);
            List<Param> result;

            result = new ObjectMapper().readValue(response,
                    new TypeReference<List<Param>>() {
                    });
            res = result.get(0).getParamValue();
        } catch (Exception e) {
            return null;
        }
        return res;
    }

    public List<DicItem> getDict(String dictName) {
        List<DicItem> result;
        try {
            String url = ConfigAddr + "/admin/dic";
            Map<String, Object> queryParam = new HashMap<>();
            queryParam.put("name", dictName);
            String response = HttpUtil.get(url, queryParam);

            result = new ObjectMapper().readValue(response,new TypeReference<List<DicItem>>() {});

        } catch (Exception e) {
            return null;
        }
        return result;
    }



}
