package td.enterprise.wanalytics.etl.common.tags;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.entity.DmkLog;
import td.enterprise.service.DmkLogService;
import td.enterprise.wanalytics.etl.bean.*;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DMKUtils;
import td.enterprise.wanalytics.etl.util.JacksonMapper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

/**
 * Created by junmin.li on 2017/6/21.
 */
public class TagsCallable implements Callable<List> {
    public static Logger logger = Logger.getLogger(TagsCallable.class);

    private String id;

    private DmkInputTypeEnum inputType;

    TagsCallable(String id,DmkInputTypeEnum inputType) {
        this.id = id;
        this.inputType = inputType;
    }

    public List call() throws Exception {
          List list =new ArrayList();
          List<DmkTag> t0 = getTagsById(id);
          List<DmkDevice> t1 = getDeviceById(id);
          list.add(t0);
          list.add(t1);
          return list;
    }

    /**
     * 根据mac获取标签
     * @param id
     * @return
     * @throws Exception
     */
    private List<DmkTag> getTagsById(String id) throws Exception{
        List<DmkTag> list = new ArrayList<DmkTag> ();
        List<DmkTag>  demoList = getTagDemographicById(id);
        List<DmkTag>  appList = getTagAppById(id);
        if(demoList != null){
            list.addAll(demoList);
        }
        if(appList != null){
            list.addAll(appList);
        }
        return list;
    }

    /**
     * 根据mac获取设备属性
     * @param id
     * @return
     * @throws Exception
     */
    private List<DmkDevice> getDeviceById(String id) throws Exception{
        List<DmkDevice> list = new ArrayList<DmkDevice> ();
        //数据库里没有查询到，进行接口查询
        DmkLog dmkLog = DmkLogService.getLogDataForTag(inputType,id,DmkEnum.TAG_DEVICE);
        //返回数据 无论失败或者成功，只调用一次
        String data = null;
        if(null == dmkLog ){
            logger.info("数据库不存在，调用接口请求设备标签");
            DmkResponse response = DMKUtils.queryTagDevice(id,inputType.getCode());
            data = response.getData();
            DmkLogService.insertTagData(inputType,id,DmkEnum.TAG_DEVICE,response);
        }else {
            logger.info("从数据库获取设备标签" + id);
            data = dmkLog.getData() ;
        }
        if(StringUtils.isNotBlank(data)){
            DeviceBean bean = JacksonMapper.getObjectMapper().readValue(data, DeviceBean.class);
            if(bean != null && bean.getData() != null ){
                List<Device> resultList = bean.getData().getTags();
                list = new ArrayList<DmkDevice> ();
                for(Device d : resultList){
                    DmkDevice tmp = new DmkDevice();
                    tmp.setDeviceType(d.getDeviceType());
                    tmp.setOriginModel(d.getOriginModel());
                    tmp.setStandardModel(d.getStandardModel());
                    tmp.setScreen(d.getScreen());
                    tmp.setPrice(d.getPrice());
                    tmp.setFunctionType(d.getFunctionType());
                    tmp.setHardwareType(d.getHardwareType());
                    tmp.setStandardBrand(d.getStandardBrand());
                    if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                        tmp.setMac(id);
                    }
                    tmp.setTdid(bean.getTdid());
                    tmp.setSyncDate(new Date());
                    tmp.setDmkCode(bean.getCode() + "");
                    tmp.setDmkMsg(bean.getMsg());
                    tmp.setDmkSeq(bean.getSeq());
                    if(null != d.getPrice() && null != d.getStandardBrand()){
                        list.add(tmp);
                    }
                }
            }
        }
        return list;
    }

    /**
     * 获取人口属性标签
     * @param id
     * @return
     * @throws Exception
     */
    private List<DmkTag> getTagDemographicById(String id) throws Exception{
        List<DmkTag> list = new ArrayList<DmkTag> ();
        //数据库里没有查询到，进行接口查询
        DmkLog dmkLog = DmkLogService.getLogDataForTag(inputType,id,DmkEnum.TAG_DEMOGRAPHIC);
        //返回数据 无论失败或者成功，只调用一次
        String data = null;
        if(null == dmkLog ){
            logger.info("数据库不存在，调用接口请求人口属性");
            DmkResponse response = DMKUtils.queryTagDemographic(id,inputType.getCode());
            data = response.getData();
            DmkLogService.insertTagData(inputType,id,DmkEnum.TAG_DEMOGRAPHIC,response);
        }else {
            logger.info("从数据库获取人口属性" + id);
            data = dmkLog.getData();
        }
        if(StringUtils.isNotBlank(data)){
            TagsBean bean = JacksonMapper.getObjectMapper().readValue(data, TagsBean.class);
            if(bean != null && bean.getData() != null ){
                List<Tags> resultList = bean.getData().getTags();
                list = new ArrayList<DmkTag> ();
                for(Tags d : resultList){
                    DmkTag tmp = new DmkTag();
                    if(6 == d.getLabel().length()){
                        tmp.setTdid(bean.getData().getTdid());
                        tmp.setSyncDate(new Date());
                        tmp.setDmkCode(bean.getCode() + "");
                        tmp.setDmkMsg(bean.getMsg());
                        tmp.setDmkSeq(bean.getSeq());
                        if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                            tmp.setMac(id);
                        }
                        tmp.setLabel(d.getLabel().substring(0,4));
                        tmp.setName(d.getLabel());
                        tmp.setWeight(d.getWeight());
                        tmp.setTagType(WifipixTaskConstant.TagType.DEMOGRAPHIC.getText());
                        list.add(tmp);
                    }
                }
            }
        }
        return  list;
    }

    /**
     * 兴趣偏好
     * @param id
     * @return
     * @throws Exception
     */
    private List<DmkTag> getTagAppById(String id) throws Exception{
        List<DmkTag> list = new ArrayList<DmkTag> ();
        //数据库里没有查询到，进行接口查询
        DmkLog dmkLog = DmkLogService.getLogDataForTag(inputType,id,DmkEnum.TAG_APP);
        String data = null;
        if(null == dmkLog ){
            logger.info("数据库不存在，调用接口请求兴趣偏好");
            DmkResponse response = DMKUtils.queryTagApp(id,inputType.getCode());
            data = response.getData();
            DmkLogService.insertTagData(inputType,id,DmkEnum.TAG_APP,response);
        }else {
            logger.info("从数据库获取兴趣偏好" + id);
            data = dmkLog.getData();
        }
        if(StringUtils.isNotBlank(data)){
            TagsBean bean = JacksonMapper.getObjectMapper().readValue(data, TagsBean.class);
            if(bean != null && bean.getData() != null ){
                List<Tags> resultList = bean.getData().getTags();
                list = new ArrayList<DmkTag> ();
                for(Tags d : resultList){
                    DmkTag tmp = new DmkTag();
                    tmp.setTdid(bean.getData().getTdid());
                    tmp.setSyncDate(new Date());
                    tmp.setDmkCode(bean.getCode() + "");
                    tmp.setDmkMsg(bean.getMsg());
                    tmp.setDmkSeq(bean.getSeq());
                    tmp.setMac(null);
                    if(6 == d.getLabel().length()){ //兴趣偏好仅返回前6位的信息
                        tmp.setLabel(d.getLabel());
                    }else if( 8 == d.getLabel().length()){
                        tmp.setLabel(d.getLabel().substring(0,6));
                    }
                    if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                        tmp.setMac(id);
                    }
                    tmp.setName(d.getName());
                    tmp.setWeight(d.getWeight());
                    tmp.setTagType(WifipixTaskConstant.TagType.TAGAPP.getText());
                    list.add(tmp);
                }
            }
        }
        return  list;
    }

}
