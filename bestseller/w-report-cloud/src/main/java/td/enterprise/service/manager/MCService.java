package td.enterprise.service.manager;

import com.tendcloud.enterprise.um.umic.entity.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.JSONUtil;
import td.enterprise.entity.CompeteAttribute;
import td.enterprise.entity.CompeteSource;
import td.enterprise.page.CompeteAttributePage;
import td.enterprise.service.CompeteAttributeService;
import td.enterprise.service.CompeteSourceService;
import td.enterprise.web.util.UserInfoUtil;

import javax.inject.Inject;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by Yan on 2017/7/15.
 */
@Service
@Slf4j
public class MCService {

    private static String APIGATEWAY_MCURL = "apigateway-mcUrl";
    private static String APIGATEWAY_APPKEY = "apigateway-appKey";
    private static String APIGATEWAY_APPSECRET = "apigateway-appSecret";
    private static String APIGATEWAY_APPSIGNATURE = "apigateway-appSignature";
    private static String APIGATEWAY_TID = "apigateway-tid";
    private static String APIGATEWAY_TKEY = "apigateway-tkey";

    @Inject
    private Environment env;

    private final String SUCCESS_CODE = "200";
    private final String SUCCESS_DESC = "success";

    private static String token;
    // private static String MCUrl = "http://router.apigateway.talkingdata.com/sbsmc";
    // private String appKey = "82461359";
    // private String appSecret = "7ad584d0a22a42f9b1eca8e718b1ecd3";
    // private String appSignature = "0840fa7116945e9ecc08d6df5354fd0a";
    // private String tid = "TGae14bdaa428744f59714fab0cd06916f";
    // private String tkey = "57f0764da4e14c96bdc5f4118e0bd47b";

    @Value("${apigateway-mcUrl}")
    private static String MCUrl;

    @Value("${apigateway-appKey}")
    private String appKey;

    @Value("${apigateway-appSecret}")
    private String appSecret;

    @Value("${apigateway-appSignature}")
    private String appSignature;

    @Value("${apigateway-tid}")
    private String tid;

    @Value("${apigateway-tkey}")
    private String tkey;

    @Inject
    private RestTemplate restTemplate;

    @Autowired
    private CompeteSourceService competeSourceService;
    @Autowired
    private CompeteAttributeService competeAttributeService;

    //@Scheduled(cron = "0 */50 * * * ?")
    public String getToken() throws BusinessException, UnsupportedEncodingException {

        token = "";

        String queryUrl = MCUrl + "/tenant/getToken";
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Gateway-Access-AppKey", appKey);
        headers.add("X-Gateway-Access-Signature", appSignature);
        headers.add("Content-Type", "application/json");

        HashMap map = new HashMap();
        map.put("tid", tid);
        map.put("tkey", tkey);

        try {
            String body = JSONUtil.objectToJsonStr(map);

            ResponseEntity <Token> restResponse =
                    restTemplate.exchange(queryUrl,
                            HttpMethod.POST, new HttpEntity <>(body, headers), Token.class);

            if (restResponse.getStatusCode() == HttpStatus.OK
                    && restResponse.getBody().getCode().equals(SUCCESS_CODE)
                    && restResponse.getBody().getDesc().equals(SUCCESS_DESC)) {
                token = restResponse.getBody().getData();

            } else {
                log.error(restResponse.getBody().toString());
                throw new BusinessException("查询MC接口");
            }

        } catch (IOException e) {
            log.error("查询MC接口：" + queryUrl + "出错，错误码：" + e);
            throw new BusinessException("查询MC接口");
        }

        return token;
    }


    public String createSegment(Map poiMap) throws UnsupportedEncodingException, BusinessException {

        // if(StringUtils.isNotEmpty(token)) {
        //     getToken();
        // }
        //
        // String data;
        // String queryUrl = MCUrl + "/segment/create";
        // // test data
        // // poiJson = "{\"name\":\"人群Poi测试\",\"pois\":[{\"ps\":[{\"lng\":116.374104,\"lat\":39.942444}],\"name\":\"po水淀粉\",\"range\":5,\"type\":1},{\"ps\":[{\"lng\":116.483195,\"lat\":39.944767},{\"lng\":116.548735,\"lat\":39.913783},{\"lng\":116.610826,\"lat\":40.004925},{\"lng\":116.480895,\"lat\":40.013767}],\"name\":\"poi2\",\"type\":2,\"range\":\"\"}],\"opRelation\":\"2\",\"type\":1}";
        //
        // HttpHeaders headers = new HttpHeaders();
        // headers.add("X-Gateway-Access-AppKey", appKey);
        // headers.add("X-Gateway-Access-Signature", appSignature);
        // headers.add("X-Gateway-Access-IdToken", token);
        // headers.add("Content-Type", "application/json");
        //
        // try {
        //     // String body = JSONUtil.objectToJsonStr(map);
        //
        //     ResponseEntity <Token> restResponse =
        //             restTemplate.exchange(queryUrl,
        //                     HttpMethod.POST, new HttpEntity <>(poiJson, headers), Token.class);
        //
        //     if (restResponse.getStatusCode() == HttpStatus.OK
        //             && restResponse.getBody().getCode().equals(SUCCESS_CODE)
        //             && restResponse.getBody().getDesc().equals(SUCCESS_DESC)) {
        //         data = restResponse.getBody().getData();
        //
        //     } else {
        //         log.error(restResponse.getBody().toString());
        //         throw new BusinessException("查询MC接口");
        //     }
        //
        // } catch (Exception e) {
        //     log.error("查询MC接口：" + queryUrl + "出错，错误码：" + e);
        //     throw new BusinessException("查询MC接口");
        // }

        String name = "";
        String competeId = "";
        try {
            name = (String) poiMap.get("name");
            competeId = (String) poiMap.get("competeId");

        } catch (Exception e) {
            e.printStackTrace();
        }

        //save to db
        User user = UserInfoUtil.getUser();
        CompeteSource competeSource = new CompeteSource();
        competeSource.setDataSource("POI");
        competeSource.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        competeSource.setProjectId(Integer.parseInt(competeId));
        competeSource.setStatus(ReportConstants.DefaultStatus.AVALIABLE);

        String poiJson = "";
        try {
            poiJson = JSONUtil.objectToJsonStr(poiMap);
        } catch (IOException e) {
            e.printStackTrace();
        }
        competeSource.setAttachmentSource(poiJson);
        competeSourceService.create(competeSource);
        //TODO 先查一次，有更新，没有新增
        CompeteAttributePage competeAttributePage = new CompeteAttributePage();
        competeAttributePage.setCompeteId(Integer.parseInt(competeId));
        competeAttributePage.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
        CompeteAttribute competeAttribute = competeAttributeService.queryBySingle(competeAttributePage);
        if (null == competeAttribute){
            CompeteAttribute competeAttribute1 = new CompeteAttribute();
            competeAttribute1.setCompeteId(Integer.parseInt(competeId));
            competeAttribute1.setStatus(ReportConstants.DefaultStatus.AVALIABLE);
            competeAttribute1.setDataSources("POI");
            competeAttributeService.create(competeAttribute1);
        }else {
            if (null != competeAttribute.getDataSources()&& !competeAttribute.getDataSources().contains("POI")){
                competeAttribute.setDataSources(competeAttribute.getDataSources()+ReportConstants.Punctuation.SEMICOLON+"POI");
                competeAttributeService.update(competeAttribute);
            }
        }

        return name;
    }

}

@Setter
@Getter
@ToString
class Token {
    private String code;
    private String desc;
    private String data;
}


class Segment {

}
