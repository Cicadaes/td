package td.enterprise.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.dao.CrowdSalesListDao;
import td.enterprise.entity.CrowdSalesList;
import td.enterprise.entity.ProjectAttachment;
import td.enterprise.page.CrowdSalesListPage;
import td.enterprise.page.mapper.CrowdSalesListMapper;
import td.enterprise.service.manager.ParamService;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.CrowdSalesListVM;

import com.tendcloud.enterprise.um.umic.entity.User;

/**
 * <br>
 * <b>功能：</b>店员名单表 CrowdSalesListService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("crowdSalesListService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CrowdSalesListService extends BaseService<CrowdSalesList> {
	public final static Logger logger = Logger.getLogger(CrowdSalesListService.class);
	
    @Autowired
    private CrowdSalesListDao dao;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectAttachmentService attachmentService;
    @Autowired
    private ProjectParamService projectParamService;
    @Autowired
    private ParamService paramService;
    @Autowired
    private ProjectBatchConfigService projectBatchConfigService;
    @Autowired
    private CrowdSalesListMapper crowdSalesListMapper;
    @Inject
    private AzkabanRestUtil azkabanRestUtil;

    public CrowdSalesListDao getDao() {
        return dao;
    }

    /**
     * 通过参数和用户的tenantId获取店员名单
     *
     * @param page
     * @return
     */
    public List<CrowdSalesListVM> query(CrowdSalesListPage page) {
        //暂时不从user中取
//		User user = UserInfoUtil.getUser();
//		String tenantId = user.getTenantId().toString();
//		page.setTenantId(tenantId);

        List<CrowdSalesList> crowdSalesLists = queryByList(page);
        List<CrowdSalesListVM> crowdSalesListVMs = new ArrayList<>();

        for(CrowdSalesList crowdSalesList : crowdSalesLists){
            CrowdSalesListVM crowdSalesListVM = crowdSalesListMapper.entityToVM(crowdSalesList);
            crowdSalesListVMs.add(crowdSalesListVM);
        }
        return crowdSalesListVMs;
    }

    /**
     * 创建带用户信息的店员名单
     *
     * @param crowdSalesList
     * @return
     * @throws Exception
     */
    public CrowdSalesList create(CrowdSalesList crowdSalesList) throws Exception {
        User user = UserInfoUtil.getUser();
        crowdSalesList.setCreateBy(user.getUmid());
        crowdSalesList.setCreator(user.getUmid());
        crowdSalesList.setStatus(1);
        crowdSalesList.setSource(ReportConstants.CrowdSalesListType.ADD_BY_HAND);
        dao.insert(crowdSalesList);
        return crowdSalesList;
    }

    /**
     * 批量导入文件
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unused")
	public List<String> batchImport(ProjectAttachment attachment, Integer projectId) throws Exception {
        User user = UserInfoUtil.getUser();
        List<String> errMsgList = new ArrayList<>();
        String errorMsg = "";
        String tenantId = UserInfoUtil.getCurrentUserTenantId();
        String filePath = attachment.getAttr4();
        if (attachment != null && filePath != null) {
            logger.info("mac.batchImport.file=" + filePath);
            InputStream is = new FileInputStream(new File(filePath));;

            String sheetName = "Sheet1";
            int startRowNum = 1;
            List<String[]> datas = ExcelUtil.readSheetDataByParam(is, sheetName, startRowNum);
            if (datas.size() == 0) {
                errMsgList.add("导入模板数据为空");
            }
            for (String[] strArray : datas) {
                if (strArray.length == 0 ||
                        strArray[0] == null) {  //mac ,为null，跳到下条记录
                    continue;
                    
                }
                errorMsg = ExcelUtil.checkExcelMacValid(strArray[0]);
                if (!errorMsg.isEmpty()) {
                    logger.error(errorMsg);
                    errMsgList.add(errorMsg);
                } else {
            		CrowdSalesList crowdSalesList = new CrowdSalesList();
            		crowdSalesList.setProjectId(projectId);
            		crowdSalesList.setDeviceMac(strArray[0]);
            		crowdSalesList.setCreateBy(user.getUmid());
            		crowdSalesList.setCreator(user.getUmid());
            		crowdSalesList.setStatus(1);
            		crowdSalesList.setSource(ReportConstants.CrowdSalesListType.ADD_BY_BATCH_IMPORT);
                    dao.insert(crowdSalesList);
                }
            }
            
        }
        return errMsgList;
    }
    
}
