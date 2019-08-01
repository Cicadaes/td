package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：竞品管理 客群辐射分布</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Setter
@Getter
@ToString
public class TenantHousingCoverageCountVM {
    private Integer projectId;
    private String km1Rate;
    private String km3Rate;
    private String km5Rate;
    private String km10Rate; // 大于5km

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TenantHousingCoverageCountVM countVM = (TenantHousingCoverageCountVM) o;

        return !(projectId != null ? !projectId.equals(countVM.projectId) : countVM.projectId != null);

    }

    @Override
    public int hashCode() {
        return projectId != null ? projectId.hashCode() : 0;
    }
}
