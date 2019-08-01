package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;
import td.enterprise.entity.CrowdBlackList;
import td.enterprise.page.BasePage;
import td.enterprise.web.vm.CrowdBlackListVM;

@Component
public class CrowdBlackListMapper extends BasePage {

    public CrowdBlackListVM entityToVM(CrowdBlackList entity) {

        CrowdBlackListVM vm = new CrowdBlackListVM();

        if (entity != null) {
            vm.setId(entity.getId());
            vm.setProjectId(entity.getProjectId());
            vm.setDeviceMac(entity.getDeviceMac());
            vm.setSource(entity.getSource());
            vm.setFilterReason(entity.getFilterReason());
            vm.setStatus(entity.getStatus());
            vm.setTenantId(entity.getTenantId());
            vm.setCreateTimestamp(entity.getCreateTime().getTime());
            vm.setUpdateTimestamp(entity.getUpdateTime().getTime());
        }

        return vm;
    }
}
