package td.enterprise.service.manager;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import td.enterprise.entity.DicItem;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;


/**
 * <br>
 * <b>功能：</b>数据字典 DicService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("dicService")
@CacheConfig(cacheNames = "Dic")
@Slf4j
public class DicService {

    @Inject
    private RestTemplate restTemplate;

    @Value("${dmp-console-url}")
    private String dmpConsoleUrl;

    @Value("${systemcode}")
    private String systemcode;

    /**
     * 通过名称查找数据字典
     *
     * @param dicName
     * @return
     */
    @Cacheable(key = "#dicName")
    public List<DicItem> queryDicItemsByDicName(String dicName) {

        String queryUrl = dmpConsoleUrl + "/dic?name=" + dicName + "&systemCode=" + systemcode;

        List<DicItem> list = null;

        try {
            ResponseEntity<List<DicItem>> restResponse =
                    restTemplate.exchange(queryUrl,
                            HttpMethod.GET, null, new ParameterizedTypeReference<List<DicItem>>() {
                            });
            list = restResponse.getBody();
        } catch (Exception e) {
            log.error("查询dmp-console接口：" + queryUrl + "出错，错误码：" + e.getMessage());
            e.printStackTrace();
        }

        //仅为防止空指针报错
        if (list == null || list.size() == 0) {
            list = new ArrayList<>();
            DicItem dicItem = new DicItem();
            dicItem.setDicItemKey(dicName);
            dicItem.setDicItemValue("");

            List<DicItem> childDicItems = new ArrayList<>();
            DicItem childDicItem = new DicItem();
            childDicItem.setDicItemKey(dicName);
            childDicItem.setDicItemValue("");
            childDicItems.add(childDicItem);

            dicItem.setDicItems(childDicItems);
            list.add(dicItem);
        }

        return list;
    }

}
