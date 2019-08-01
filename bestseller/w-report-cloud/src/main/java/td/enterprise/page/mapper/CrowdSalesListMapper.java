package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;

import td.enterprise.entity.CrowdSalesList;
import td.enterprise.page.BasePage;
import td.enterprise.web.vm.CrowdSalesListVM;

@Component
public class CrowdSalesListMapper extends BasePage {

    public CrowdSalesListVM entityToVM(CrowdSalesList entity) {

        CrowdSalesListVM vm = new CrowdSalesListVM();

        if (entity != null) {
            vm.setId(entity.getId());
            vm.setProjectId(entity.getProjectId());
            vm.setDeviceMac(entity.getDeviceMac());
            vm.setSource(entity.getSource());
            vm.setFilterReason(entity.getFilterReason());
            vm.setStatus(entity.getStatus());
            vm.setCreateTimestamp(entity.getCreateTime().getTime());
            vm.setUpdateTimestamp(entity.getUpdateTime().getTime());
        }

        return vm;
    }
}
