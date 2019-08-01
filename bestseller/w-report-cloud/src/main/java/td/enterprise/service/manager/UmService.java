package td.enterprise.service.manager;

import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Yan on 2017/3/13.
 */
@Slf4j
@Service
public class UmService {

    @Value("${appcode}")
    private String appCode;

    @Value("${apptaken}")
    private String appToken;

    /**
     * @param umid
     * @param extResourceType
     * @return
     */
    public List<ExtResource> getExtResourceListByUmid(String umid, String extResourceType) {
        List<ExtResource> list = new ArrayList<>();
        try {
            SecurityService securityService = UmRmiServiceFactory.getSecurityService();
            String type = extResourceType;
            List<ExtResource> extResourcesList = securityService.getExtResourcesByTypeAndUmid(appCode, appToken, type, umid);
            for (ExtResource resource : extResourcesList) {
                if (!"root".equalsIgnoreCase(resource.getResourceCode())) {
                    list.add(resource);
                }
            }
        } catch (Exception e) {
            log.error("根据用户umid、appCode、appTaken，查询用户资源权限，异常" + e.getMessage());
        }
        return list;
    }
}
