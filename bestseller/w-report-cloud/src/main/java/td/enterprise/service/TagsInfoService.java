package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.TagsInfoDao;
import td.enterprise.entity.TagsInfo;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>标签信息 TagsInfoService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("tagsInfoService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class TagsInfoService extends BaseService<TagsInfo> {
    public final static Logger logger = Logger.getLogger(TagsInfoService.class);

    @Autowired
    private TagsInfoDao dao;

    public TagsInfoDao getDao() {
        return dao;
    }

    public List<TagsInfo> queryByCodeList(List<String> codeList) {
        return dao.queryByCodeList(codeList);
    }

    public List<TagsInfo> selectByMatchCode(TagsInfo tagsInfo) {
        return dao.selectByMatchCode(tagsInfo);
    }

    public List<TagsInfo> queryByMatchCode(String tagCode) {
        return dao.queryByMatchCode(tagCode);
    }

    public List<String> getTagsCodeListByMachCode(String tagCode) {
        List<TagsInfo> list = new ArrayList<>();
        list = queryByMatchCode(tagCode);
        List<String> codeList = new ArrayList<>();
        TagsInfo tag = new TagsInfo();
        for (int i = 0; i < list.size(); i++) {
            tag = list.get(i);
            if (!tagCode.equals(tag.getTagCode())) {  //把tag根节点过滤掉
                codeList.add(tag.getTagCode());
            } else {

            }
//			if(codeList.size()>10){
//				break;
//			}
        }
        return codeList;
    }
}
