package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TargetManagementDao;
import td.enterprise.entity.TargetManagement;
import td.enterprise.page.TargetManagementPage;
import td.enterprise.web.util.UserInfoUtil;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>目标管理 TargetManagementService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("targetManagementService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TargetManagementService extends BaseService<TargetManagement> {
    public final static Logger logger = Logger.getLogger(TargetManagementService.class);

    @Autowired
    private TargetManagementDao dao;

    public TargetManagementDao getDao() {
        return dao;
    }

    /**
     * 根据条件查找目标管理
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<TargetManagement> query(TargetManagementPage page) throws Exception {
        int listType = page.getListType();
        List<TargetManagement> rows;
        if (listType == 2) {
            rows = queryFinishList(page);
        } else {
            rows = queryByNotFinishListDesc(page);
        }
        return rows;
    }

    /**
     * 创建目标管理
     *
     * @param targetManagement
     * @return
     * @throws Exception
     */
    public TargetManagement create(TargetManagement targetManagement) throws Exception {
        Integer pageIndex = targetManagement.getPageIndex();
        //新建 置顶0，未置顶-1
        if (pageIndex != null && pageIndex == 0) {
            TargetManagementPage page = new TargetManagementPage();
            page.setTenantId(targetManagement.getTenantId());
            page.setProjectId(targetManagement.getProjectId());
            Integer querybiggerIndex = querybiggerIndex(page);
            if (querybiggerIndex == null) {
                querybiggerIndex = 1;
            } else {
                querybiggerIndex++;
            }
            targetManagement.setPageIndex(querybiggerIndex);
        }
        targetManagement.setOperationState(0);
        User user = UserInfoUtil.getUser();
        targetManagement.setCreateBy(user.getUmid());
        targetManagement.setCreator(user.getName());
        dao.insert(targetManagement);
        return targetManagement;
    }

    /**
     * 更新方法，需要额外的参数：是否为置顶
     *
     * @param targetManagement
     * @return
     * @throws Exception
     */
    public TargetManagement update(TargetManagement targetManagement) throws Exception {
        Integer pageIndex = targetManagement.getPageIndex();
        //更新 置顶0，未置顶原来的pageIndex
        if (pageIndex != null && pageIndex == 0) {
            TargetManagementPage page = new TargetManagementPage();
            page.setTenantId(targetManagement.getTenantId());
            page.setProjectId(targetManagement.getProjectId());
            Integer querybiggerIndex = querybiggerIndex(page);
            if (querybiggerIndex == null) {
                querybiggerIndex = 1;
            } else {
                querybiggerIndex++;
            }
            targetManagement.setPageIndex(querybiggerIndex);
        }
        User user = UserInfoUtil.getUser();
        targetManagement.setUpdateBy(user.getUmid());
        targetManagement.setUpdater(user.getName());
        dao.updateByPrimaryKeySelective(targetManagement);
        return targetManagement;
    }

    /**
     * 停止按钮触发的方法，参数TargetManagement
     *
     * @param targetManagement
     * @return
     * @throws Exception
     */
    public TargetManagement stop(TargetManagement targetManagement) throws Exception {
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String format = simpleDateFormat.format(date);
        targetManagement.setFinishDate(format);
        dao.updateByPrimaryKeySelective(targetManagement);
        return targetManagement;
    }

    /**
     * 正序查找未完成目标
     *
     * @param page
     * @return
     */
    private List<TargetManagement> queryByNotFinishList(TargetManagementPage page) {
        return dao.queryByNotFinishList(page);
    }

    /**
     * 倒序查找未完成目标
     *
     * @param page
     * @return
     */
    public List<TargetManagement> queryByNotFinishListDesc(TargetManagementPage page) {
        Integer rowCount = dao.queryByNotFinishListDescCount(page);
        page.getPager().setRowCount(rowCount);
        return dao.queryByNotFinishListDesc(page);
    }

    /**
     * 查找已完成的目标
     *
     * @param page
     * @return
     */
    public List<TargetManagement> queryFinishList(TargetManagementPage page) {
        Integer rowCount = dao.queryFinishListCount(page);
        page.getPager().setRowCount(rowCount);
        return dao.queryFinishList(page);
    }

    private Integer querybiggerIndex(TargetManagementPage page) {
        return dao.querybiggerIndex(page);
    }
}
