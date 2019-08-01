package td.enterprise.web.vm.comparator;

import lombok.Getter;
import lombok.Setter;
import td.enterprise.web.vm.ProjectAverageDetailVM;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 *  排序比较器
 */
@Setter
@Getter
public class ProjectAverageDetailVMComparator implements Comparator <ProjectAverageDetailVM> {
    //添加排序字段
    private String sort;
    private String order;

    public ProjectAverageDetailVMComparator (String sort,String order ){
         this.sort = sort;
         this.order = order ;
    }

    @Override
    public int compare(ProjectAverageDetailVM source, ProjectAverageDetailVM dest) {
            Double sourceValue = null;
            Double destValue  = null;
            if("activeUsers".equalsIgnoreCase(this.sort)){
                sourceValue = Double.parseDouble(source.getActiveUsers());
                destValue = Double.parseDouble(dest.getActiveUsers());
            } else if("newUsers".equalsIgnoreCase(this.sort)){
                sourceValue = Double.parseDouble(source.getNewUsers());
                destValue = Double.parseDouble(dest.getNewUsers());
            }else if("oldUsers".equalsIgnoreCase(this.sort)){
                sourceValue = Double.parseDouble(source.getOldUsers());
                destValue = Double.parseDouble(dest.getOldUsers());
            }else if("stayUsers".equalsIgnoreCase(this.sort)){
                sourceValue = Double.parseDouble(source.getStayUsers());
                destValue = Double.parseDouble(dest.getStayUsers());
            }else if("stayRate".equalsIgnoreCase(this.sort)){
                sourceValue = Double.parseDouble(source.getStayRate());
                destValue = Double.parseDouble(dest.getStayRate());
            }else if("averageStayDuration".equalsIgnoreCase(this.sort)){
                sourceValue = Double.parseDouble(source.getAverageStayDuration());
                destValue = Double.parseDouble(dest.getAverageStayDuration());
            }

            if(null != sourceValue && "asc".equalsIgnoreCase(this.order)){
                return sourceValue.compareTo(destValue) ;
            } else if(null != destValue && "desc".equalsIgnoreCase(this.order)){
                return destValue.compareTo(sourceValue) ;
            }
        return 0;
    }



}
