package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;
import td.enterprise.entity.CrossAnalysis;
import td.enterprise.page.BasePage;
import td.enterprise.page.CrossAnalysisPage;

/**
 * <br>
 * <b>功能：</b>交叉分析表 CrossAnalysisPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public class CrossAnalysisMapper extends BasePage {

    public CrossAnalysis crossAnalysisPageToCrossAnalysis(CrossAnalysisPage page) {

        CrossAnalysis crossAnalysis = new CrossAnalysis();

        if (page == null) {
            return crossAnalysis;
        }

        crossAnalysis.setId(page.getId());
        crossAnalysis.setProjectId(page.getProjectId());
        crossAnalysis.setAnalysisName(page.getAnalysisName());
        crossAnalysis.setXAxis(page.getXAxis());
        crossAnalysis.setYAxis(page.getYAxis());
        crossAnalysis.setStartDate(page.getStartDate());
        crossAnalysis.setEndDate(page.getEndDate());
        crossAnalysis.setStatus(page.getStatus());

        return crossAnalysis;
    }
}
