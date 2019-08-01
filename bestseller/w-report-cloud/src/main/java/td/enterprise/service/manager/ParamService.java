package td.enterprise.service.manager;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import lombok.extern.slf4j.Slf4j;

import org.elasticsearch.common.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import td.enterprise.common.constant.SessionConstant;
import td.enterprise.common.util.FileUtil;
import td.enterprise.entity.Param;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;


/**
 * <br>
 * <b>功能：</b>系统参数 ParamService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@CacheConfig(cacheNames = "Param")
@Service("paramService")
@Slf4j
public class ParamService {

    @Inject
    private RestTemplate restTemplate;

    @Value("${dmp-console-url}")
    private String dmpConsoleUrl;


    @Value("${systemcode}")
    private String systemcode;

    @Cacheable(key = "#paramKey")
    public Param queryByParamKey(String paramKey){

        String queryUrl = dmpConsoleUrl + "/param?paramKey=" + paramKey + "&systemCode=wreport";

        List<Param> list = null;

        try {
            ResponseEntity<List<Param>> restResponse =
                    restTemplate.exchange(queryUrl,
                            HttpMethod.GET, null, new ParameterizedTypeReference<List<Param>>() {
                            });
            list = restResponse.getBody();
        } catch (Exception e) {
            log.error("查询dmp-console接口：" + queryUrl + "出错，错误码：" + e.getMessage());
            e.printStackTrace();
        }

        if (list == null || list.size() == 0) {
            list = new ArrayList<>();
            Param param = new Param();
            param.setParamKey(paramKey);
            param.setParamValue("");
            list.add(param);
        }
//        resetCityValue(paramKey, list);
        return list.get(0);
    }

    private void resetCityValue(String paramKey, List<Param> list) {
        if (paramKey.equals("city_center_point")) {
            String city_center_point_path = list.get(0).getParamKey();
            if (!Strings.isNullOrEmpty(city_center_point_path)){
                String city_center_point = FileUtil.readStringByFilePath(city_center_point_path, "UTF-8");
               list.get(0).setParamValue(city_center_point);
            }else {
                log.error("city_center_point_path is null");
            }
        }
    }
}
