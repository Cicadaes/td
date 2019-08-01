package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.CSVFileUtil;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.ExcelUtil;
import td.enterprise.common.util.SequenceUtil;
import td.enterprise.dao.CrowdDao;
import td.enterprise.dao.TenantDeviceCountDao;
import td.enterprise.dao.TenantTagsCountDao;
import td.enterprise.entity.*;
import td.enterprise.entity.type.CrowdTypeEnum;
import td.enterprise.page.CrowdPage;
import td.enterprise.service.DTO.Tag;
import td.enterprise.web.util.UserInfoUtil;
import td.enterprise.web.vm.AgeDistributionVM;
import td.enterprise.web.vm.MarryCarChildVM;
import td.enterprise.web.vm.PeopleAttributesVM;
import td.enterprise.web.vm.SexVM;
import td.olap.query.runscript.bean.ResultBean;

import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>人群 CrowdService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("crowdService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CrowdService extends BaseService<Crowd> {
    public final static Logger logger = Logger.getLogger(CrowdService.class);

    @Autowired
    private CrowdDao dao;
    @Autowired
    private TagsInfoService tagsInfoService;
    @Autowired
    private TenantTagsCountDao tenantTagsCountDao;
    @Autowired
    private TenantDeviceCountDao tenantDeviceCountDao;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private BehaviorCrowdResultDeviceService behaviorCrowdResultDeviceService;
    @Autowired
    private ProjectAttachmentService attachmentService;

    public CrowdDao getDao() {
        return dao;
    }

    public Crowd selectByPrimaryKey(String id) {
        return dao.selectByPrimaryKey(id);
    }

    /**
     * 查询手机价格的bitmap
     *
     * @return
     */
    public Map<String, List<Tag>> queryPhonePrice(Map params, boolean isAzkabanResult) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        if (isAzkabanResult) {
            map = behaviorCrowdResultDeviceService.queryPhonePriceByCounter(params);
        } else {
            map = queryPhonePriceByCounter(params);
        }
        String key = "";
        Map<String, List<Tag>> resultMap = new HashMap<>();
        String type = "phoneprice";
        Map<String, Object> valueMap = map.get("phoneprice");
        Iterator<String> iterator = valueMap.keySet().iterator();//map.keySet().iterator();
        Float value = 0f;
        List<Tag> list = new ArrayList<>();
        while (iterator.hasNext()) {
            Tag tag = new Tag();
            key = iterator.next();
            if (!key.equalsIgnoreCase("sum")) {
                String data = "";
                int sum = 100;
                if (valueMap.containsKey("sum")) {
                    sum = (int) valueMap.get("sum");
                }
                if (valueMap.get(key) != null) {
                    value = Float.valueOf(String.valueOf(valueMap.get(key)));
                }
                data = String.format("%.2f", value / sum * 100);
                tag.setTag_name(key);
                tag.setSta_value(data);
                list.add(tag);
            }
        }
        resultMap.put(type, list);
        return resultMap;
    }

    /**
     * 查询手机品牌的bitemap
     *
     * @return
     */
    public Map<String, List<Tag>> queryPhoneType(Map<String, Object> params, boolean isAzkbanResult) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        if (isAzkbanResult) {
            map = behaviorCrowdResultDeviceService.queryPhoneTypeByCounter(params);
        } else {
            map = queryPhoneTypeByCounter(params);
        }
        Map<String, Object> valueMap = map.get("agedistribute");
        @SuppressWarnings("unchecked")
        Iterator<String> iterator = valueMap.keySet().iterator();
        String key = "";
        Map<String, List<Tag>> resultMap = new HashMap<>();
        String type = "phonebrand";
        List<Tag> list = new ArrayList<>();
        Float value = 0f;
        while (iterator.hasNext()) {
            key = iterator.next();
            if (!key.equalsIgnoreCase("sum")) {
                Tag tag = new Tag();
                String data = "";
                int sum = 100;
                if (valueMap.containsKey("sum")) {
                    sum = (int) valueMap.get("sum");
                }
                if (valueMap.get(key) != null) {
                    value = Float.valueOf(String.valueOf(valueMap.get(key)));
                }
                data = String.format("%.2f", value / sum * 100);
                tag.setTag_name(key);
                tag.setSta_value(data);
                list.add(tag);
            }
        }
        resultMap.put(type, list);
        return resultMap;
    }

    /**
     * 获取进店人群及竞品的人群
     *
     * @param projectId
     * @return
     * @throws Exception
     */
    public List<Crowd> findAllCrowdWithCompetitive(String projectId) throws Exception {
        Crowd crowd = null;
        List<Crowd> crowds = new ArrayList<>();
        //1. 获取进店人群
        crowd = getDao().findOneByProjectIdAndType(projectId, "AU");
        if (crowd != null) {
            crowds.add(crowd);
        }
        //2. 获取竞品项目
        List<Project> projects = projectService.findAllCompetitiveProjectByRelatedId(projectId);
        //3. 获取竞品项目人群
        for (Project project : projects) {
            crowd = getDao().findOneByProjectIdAndType(project.getId() + "", "TU");
            if (crowd != null) {
                crowd.setName(project.getProjectName());
                crowds.add(crowd);
            }
        }

        //

        return crowds;
    }

    /**
     * 从结果map中，过滤掉部分特殊数据。
     *
     * @param resultMap
     */
    public static void filter(Map<String, List<Tag>> resultMap) {
        List<Tag> tagList = resultMap.get("person");
        List<Tag> newTagList = new ArrayList<>();
        Tag newTag = new Tag();
        newTag.setTag_name("育儿");
        Float num = 0f;
        Tag tag = new Tag();
        for (int index = 0; index < tagList.size(); index++) {
            tag = tagList.get(index);
            if (tag.getTag_name() != null &&
                    (tag.getTag_name().indexOf("宝宝") != -1 ||
                            tag.getTag_name().indexOf("婴") != -1 ||
                            tag.getTag_name().indexOf("育儿") != -1)) {
                //合并
                num = num + Float.valueOf(tag.getSta_value());
            } else {
                newTagList.add(tag);
            }
        }
        newTag.setSta_value(String.format("%.2f", num));
        if (newTagList.size() != 0) {
            newTagList.add(newTag);
        }
        resultMap.remove("person");
        resultMap.put("person", newTagList);
    }

    /**
     * 人群对比-人口属性
     * <p>
     * 男	030101
     * 女	030102
     * <p>
     * <p>
     * 家有宝宝	080302
     * 育儿阶段	08030201
     * 家有大宝宝	08030202
     * 家有小宝宝	08030203
     * 孕婴童	080303
     * <p>
     * <p>
     * 人生阶段	0302
     * 19-25岁	030207
     * 26-35岁	030208
     * 36-45岁	030209
     * 46-55岁	030210
     * 55岁以上	030211
     * 19岁以下	030212
     * <p>
     * <p>
     * 婚育情况	0304
     * 未婚	030401
     * 已婚	030402
     * <p>
     * <p>
     * 车辆情况	0305
     * 有车	030501
     * 无车	030502
     *
     * @return
     */
    public Map<String, List<Tag>> queryPeopleProp(Map params) {
        Map<String, Map<String, Object>> map = queryCrowProperties(params);
        Iterator<String> iterator = map.keySet().iterator();
        String key = "";
        String key1 = "";
        List<String> codeList = null;
        Map<String, Object> valueMap = new HashMap<>();
        List<TagsInfo> tagsInfoList = new ArrayList<>();
        Map<String, List<Tag>> resultMap = new HashMap<>();
        String type = "";
        List<Tag> tagList = new ArrayList<>();

        while (iterator.hasNext()) {
            key = iterator.next();
            codeList = new ArrayList<>();
            valueMap = map.get(key);
            Iterator<String> iter = valueMap.keySet().iterator();
            while (iter.hasNext()) {
                key1 = iter.next();
                if (!"sum".equals(key1)) {
                    codeList.add(key1);
                }
            }
            if (codeList.size() != 0)
                tagsInfoList = tagsInfoService.queryByCodeList(codeList);
            switch (key) {
                case "sex":
                    type = "sexscale";
//					countTotalPeople(valueMap, totalPeople);
                    generateDataMap(tagsInfoList, valueMap, resultMap, type, null);
                    break;
                case "age":
                    type = "agedistribute";
                    generateDataMap(tagsInfoList, valueMap, resultMap, type, null);
                    break;
                default:
                    type = "person";
                    generateDataMap(tagsInfoList, valueMap, resultMap, type, tagList);
                    break;
            }
        }

        filter(resultMap);

        return resultMap;
    }

    /**
     * 批量导入人群导入（mac地址）
     *
     * @param file
     * @param projectId
     * @return
     * @throws Exception
     */
    public List<String> batchImport(MultipartFile file, String projectId) throws Exception {
        User user = UserInfoUtil.getUser();
        List<String> errMsgList = new ArrayList<>();
        String errorMsg = "";
        if (file != null) {
            logger.info("sensor.batchImport.file=" + file.getOriginalFilename() + " ,size=" + file.getSize());
            InputStream is = file.getInputStream();
            String sheetName = "Sheet1";
            int startRowNum = 1;
//			String str = new CSVFileUtil(is).readLine();
            List<String> strList = new CSVFileUtil(is).getCSVDataArray();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            if (strList != null && !strList.isEmpty()) {
                for (String str : strList) {
                    if (!str.isEmpty() && str.indexOf("mac") == -1) {
                        errorMsg = ExcelUtil.checkExcelMacValid(str);
                        if (!errorMsg.isEmpty()) {
                            logger.error(errorMsg);
                            errMsgList.add(errorMsg);
                        }
                    }
                }
                if (errMsgList.size() == 0) {
                    ProjectAttachment t = new ProjectAttachment();
                    t.setCreateBy(user.getUmid());
                    t.setCreator(user.getUmid());
                    t.setName("人群导入_" + DateUtil.format(new Date(), "yyyyMMdd"));
                    t.setTenantId(UserInfoUtil.getCurrentUserTenantId());
                    t.setData(file.getBytes());
                    t.setStatus(ReportConstants.ProjectAttachmentStatus.NO_CALC);  //未计算
                    t.setAttr1(getImportCrowdId(projectId, user));  //标签ID
                    t.setAttr2(projectId);  //项目ID，Projectid
                    attachmentService.insert(t);
                }
            }
        }
        return errMsgList;
    }

    /**
     * 把人口属性画像 转化为对应的字段
     *
     * @param params
     * @return
     */
    public PeopleAttributesVM getPeopleAttributesVM(Map params) {
        Map<String, List<Tag>> map = queryPeopleProp(params);
        PeopleAttributesVM attributesVM = convertAttributesVM(map);
        return attributesVM;
    }

    /**
     * 把人口画像转化为对应的bean
     *
     * @return
     */
    public PeopleAttributesVM convertAttributesVM(Map<String, List<Tag>> map) {
        PeopleAttributesVM attributesVM = new PeopleAttributesVM();
        //设置默认值
        String malePercent = "0";
        String femalePercent = "0";

        if (null != map.get("sexscale")) {
            //男女比例
            List<Tag> sexscaleList = map.get("sexscale");
            for (Tag tag : sexscaleList) {
                String key = tag.getTag_name();
                switch (key) {
                    case "男":
                        malePercent = tag.getSta_value();
                        break;
                    case "女":
                        femalePercent = tag.getSta_value();
                        break;
                }
            }
        }
        String age19Percent = "0";  //19岁以下比例
        String age25Percent = "0";  //19-25岁以下比例
        String age35Percent = "0";  //26-35岁以下比例
        String age45Percent = "0";  //36-45岁以下比例
        String age55Percent = "0";  //46-55岁以下比例
        String ageAbove55Percent = "0";  //55岁以上比例

        if (null != map.get("agedistribute")) {
            //年龄布局
            List<Tag> ageDistributeList = map.get("agedistribute");
            for (Tag tag : ageDistributeList) {
                String key = tag.getTag_name();
                switch (key) {
                    case "19岁以下":
                        age19Percent = tag.getSta_value();
                        break;
                    case "19-25岁":
                        age25Percent = tag.getSta_value();
                        break;
                    case "26-35岁":
                        age35Percent = tag.getSta_value();
                        break;
                    case "36-45岁":
                        age45Percent = tag.getSta_value();
                        break;
                    case "46-55岁":
                        age55Percent = tag.getSta_value();
                        break;
                    case "55岁以上":
                        ageAbove55Percent = tag.getSta_value();
                        break;
                }
            }
        }

        String marriedPercent = "0";    //已婚
        String unmarriedPercent = "0";  //未婚
        String haveChildrenPercent = "0"; //有车比例
        String noChildrenPercent = "0";   //无车比例
        String haveCarPercent = "0";//有车比例
        String noCarPercent = "0";  //无车比例

        if (null != map.get("person")) {
            List<Tag> personList = map.get("person");
            for (Tag tag : personList) {
                String key = tag.getTag_name();
                switch (key) {
                    case "有车":
                        haveCarPercent = tag.getSta_value();
                        break;
                    case "无车":
                        noCarPercent = tag.getSta_value();
                        break;
                    case "已婚":
                        marriedPercent = tag.getSta_value();
                        break;
                    case "未婚":
                        unmarriedPercent = tag.getSta_value();
                        break;
                    case "育儿":
                        haveChildrenPercent = tag.getSta_value();
                        break;
                }
            }
        }

        attributesVM.setFemalePercent(femalePercent);
        attributesVM.setMalePercent(malePercent);
        attributesVM.setMarriedPercent(marriedPercent);
        attributesVM.setUnmarriedPercent(unmarriedPercent);
        attributesVM.setHaveCarPercent(haveCarPercent);
        attributesVM.setHaveChildrenPercent(haveChildrenPercent);
        attributesVM.setAge19Percent(age19Percent);
        attributesVM.setAge25Percent(age25Percent);
        attributesVM.setAge35Percent(age35Percent);
        attributesVM.setAge45Percent(age45Percent);
        attributesVM.setAge55Percent(age55Percent);
        attributesVM.setAgeAbove55Percent(ageAbove55Percent);
        attributesVM.setNoCarPercent(noCarPercent);
        attributesVM.setNoChildrenPercent(noChildrenPercent);
        return attributesVM;
    }

    /**
     * 根据类型列表创建默认客群
     */
    public static void generateDataMap(List<TagsInfo> tagsList, Map<String, Object> valueMap, Map<String, List<Tag>> resultMap, String type, List<Tag> tagList) {
        String data = "";
        List<Tag> list = new ArrayList<>();
        Tag tag = null;
        int sum = 100;
        if (valueMap.containsKey("sum")) {
            sum = (int) valueMap.get("sum");
        }
        Float value = 0f;
        for (TagsInfo tagsInfo : tagsList) {
            tag = new Tag();
            if (valueMap.isEmpty()) {  //没数据时，map为null，需要处理
                value = 0f;
            } else {
                value = Float.valueOf(valueMap.get(tagsInfo.getTagCode()).toString());
            }
            data = String.format("%.2f", value / sum * 100);
//			data = String.valueOf(valueMap.get(tagsInfo.getTagCode()));
            tag.setTag_name(tagsInfo.getTagName());
            tag.setSta_value(data);
            list.add(tag);
        }
        if (tagList != null && "person".equalsIgnoreCase(type)) {
            tagList.addAll(list);
            resultMap.put(type, tagList);
        } else {
            resultMap.put(type, list);
        }
    }

    public int createDefaultCrowdsByTypeList(List<String> crowdTypeList, String projectId, String tenantId, String umid) throws BusinessException {
        int defaultCrowd = -1;
        try {
            Crowd record = null;
            CrowdPage page = new CrowdPage();
            page.setAttr1(projectId);
            page.setTenantId(tenantId);
            for (String type : crowdTypeList) {
                page.setType(type);
                if (dao.queryByCount(page) != 0) {
                    //projectId tenantId, type 已存在对应用户标签
                    continue;
                } else {
                    record = new Crowd();
                    switch (type) {
                        case "NU":
                            //新客
                            record.setName("新客群");
                            break;
                        case "OU":
                            //老客
                            record.setName("老客群");
                            break;
                        case "AU":
                            //到访客群
                            record.setName("到访客群");
                            break;
                        case "TU":
                            //竞品客群
                            record.setName("竞品客群");
                            break;
                    }
                    record.setSource(5);  //定义人群 5: 第三方导入人群(客缘创建）
                    record.setCode(SequenceUtil.getSequenceCode(type));
                    record.setType(type);
                    record.setAttr1(projectId);
                    record.setTenantId(tenantId);
                    record.setStatus(ReportConstants.ProjectCrowdStatus.AVALIABLE);
                    record.setCreateBy(umid);
                    record.setCreator(umid);
                    dao.insert(record);
                    if (type.equals(CrowdTypeEnum.AU.toString())) {//默认人群
                        defaultCrowd = record.getId();
                    } else if (type.equals(CrowdTypeEnum.TU.toString())) {
                        defaultCrowd = record.getId();
                    }
                }
            }
        } catch (Exception e) {
            throw new BusinessException("同步项目客群标签异常", e);
        }
        return defaultCrowd;
    }


    /**
     * 查询 手机品牌
     * <p>
     * '99060','99873','99002','99004','99003','99024'
     * 苹果  99060
     *
     * @return
     */
    private Map<String, Map<String, Object>> queryPhoneTypeByCounter(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        params.put("deviceAttrType", 2);
        List<TenantDeviceCount> list = selectTenantDeviceCountLatestData(params);//tenantDeviceCountDao.selectByCodesIn(params);

        Map<String, Object> agedistributeResultMap = new LinkedHashMap<>();
//		List<ResultBean> agedistributeResultBeanList = new ArrayList<>();
        //bean value 為null，sort排序會異常
        for (TenantDeviceCount bean : list) {
            if (bean.getMetricValue() == null) {
                bean.setMetricValue(0);
            }
        }
        Collections.sort(list);
        List<ResultBean> agedistributeResultBeanListTop5 = new ArrayList<ResultBean>();
        ResultBean otherBrand = new ResultBean();
        otherBrand.setKey("其它");  //其它品牌
        otherBrand.setValue(0);
        boolean containsOtherBrand = false;
        for (int i = list.size() - 1; i > -1; i--) {
            TenantDeviceCount bean = list.get(i);
            if (i > list.size() - 7) {  //取前4+其他，共5个品牌
                if ("其它".equals(bean.getDeviceAttrName())) {
                    containsOtherBrand = true;
                    otherBrand.setValue(Integer.valueOf(otherBrand.getValue().toString()) + bean.getMetricValue());
                } else {
                    agedistributeResultBeanListTop5.add(new ResultBean(bean.getDeviceAttrName(), bean.getMetricValue()));
                }
            } else {
                otherBrand.setValue(Integer.valueOf(otherBrand.getValue().toString()) + bean.getMetricValue());
            }
        }
        if (!containsOtherBrand && agedistributeResultBeanListTop5.size() > 5) {
            ResultBean forthBean = agedistributeResultBeanListTop5.get(5);
            otherBrand.setValue(Integer.valueOf(otherBrand.getValue().toString()) + Integer.valueOf(forthBean.getValue().toString()));
            agedistributeResultBeanListTop5.remove(5);
        }
        if (agedistributeResultBeanListTop5.size() != 0) {
            //排序后再把‘其他’放到最后
            Collections.sort(agedistributeResultBeanListTop5);
            agedistributeResultBeanListTop5.add(otherBrand);
        }

        String value1 = "0";
        int sum = 0;

        for (ResultBean bean : agedistributeResultBeanListTop5) {
            if (bean.getValue() != null) {
                value1 = bean.getValue().toString();
            }
            agedistributeResultMap.put(bean.getKey(), value1);
            sum = sum + Integer.valueOf(value1);
        }

        if (sum != 0) {
            agedistributeResultMap.put("sum", sum);
        }
        map.put("agedistribute", agedistributeResultMap);
        return map;
    }

    /**
     * 查询 手机价格
     * 1-499	    090901
     * 1-499 	090902
     * 1000-1999	090903
     * 2000-3999	090904
     * 4000及以上	090905
     *
     * @return
     */
    private Map<String, Map<String, Object>> queryPhonePriceByCounter(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();

        List<String> codes = new ArrayList();
        String code1 = "1-499";
        String code2 = "500-999";
        String code3 = "1000-1999";
        String code4 = "2000-3999";
        String code5 = "4000及以上";
        codes.add(code1);
        codes.add(code2);
        codes.add(code3);
        codes.add(code4);
        codes.add(code5);
        params.put("list", codes);
        params.put("deviceAttrType", null);
        List<TenantDeviceCount> list = selectTenantDeviceCountLatestData(params);//tenantDeviceCountDao.selectByCodesIn(params);

        Map<String, Object> phonePriceMap = new HashMap<>();
        String value1 = "0";
        int sum = 0;

        for (TenantDeviceCount bean : list) {
            if (bean.getMetricValue() != null) {
                value1 = bean.getMetricValue().toString();
            }
            phonePriceMap.put(bean.getDeviceAttrName(), value1);
            sum = sum + Integer.valueOf(value1);
        }


        Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
        resultMap.put(code1, phonePriceMap.get(code1));
        resultMap.put(code2, phonePriceMap.get(code2));
        resultMap.put(code3, phonePriceMap.get(code3));
        resultMap.put(code4, phonePriceMap.get(code4));
        resultMap.put(code5, phonePriceMap.get(code5));
        if (sum != 0) {
            resultMap.put("sum", sum);
        }
        map.put("phoneprice", resultMap);
        return map;
    }

    /**
     * 性别比例
     *
     * @param params
     * @return
     */
    public SexVM getSexRateVM(Map params) {
        String startDate = (String) params.get("startDate");
        String endDate = (String) params.get("endDate");
        List<String> codes = new ArrayList();
        codes.add("030102");//女
        codes.add("030101");//男
        params.put("list", codes);
        List<TenantTagsCount> list = queryLatestDataByParams(params);
        int sexSum = 0;
        int maleCount = 0;
        int femaleCount = 0;

        for (TenantTagsCount bean : list) {
            int temp = 0;
            if (bean.getMetricValue() != null) {
                temp = bean.getMetricValue();
            }
            if ("030101".equals(bean.getTagCode())) {
                maleCount = temp;
            } else if ("030102".equals(bean.getTagCode())) {
                femaleCount = temp;
            }
            sexSum = sexSum + temp;
        }

        //性别比例
        SexVM sexVM = new SexVM();
        String maleRate = "0";
        String femaleRate = "0";
        String unknownRate = "0";
        if (sexSum != 0) {
            DecimalFormat decimalFormat = new DecimalFormat("0.00");
            maleRate = decimalFormat.format(maleCount * 100.0 / sexSum);
            femaleRate = decimalFormat.format(femaleCount * 100.0 / sexSum);
            unknownRate = decimalFormat.format((sexSum-femaleCount-maleCount) * 100.0 / sexSum);
        }
        sexVM.setFemaleRate(femaleRate);
        sexVM.setMaleRate(maleRate);
        sexVM.setUnknownRate(unknownRate);
        return sexVM;
    }

    /**
     * 年龄分布
     *
     * @param params
     * @return
     */
    public AgeDistributionVM queryAgeDistribution(Map params) {
        params.put("tagName",null);
        List<String> ageCodes = new ArrayList();
        ageCodes.add("030207");//19-25岁
        ageCodes.add("030208");
        ageCodes.add("030209");
        ageCodes.add("030210");
        ageCodes.add("030211");
        ageCodes.add("030212");
        params.put("list", ageCodes);
        List<TenantTagsCount> ageList = queryLatestDataByParams(params);
        int ageSum = 0;

        int age19 = 0;
        int age25 = 0;
        int age35 = 0;
        int age45 = 0;
        int age55 = 0;
        int ageAbove55 = 0;
        for (TenantTagsCount bean : ageList) {
            int temp = 0;
            if (bean.getMetricValue() != null) {
                temp = bean.getMetricValue();
            }
            if ("030207".equals(bean.getTagCode())) {       //19-25岁
                age25 = temp;
            } else if ("030208".equals(bean.getTagCode())) { //26-35岁
                age35 = temp;
            } else if ("030209".equals(bean.getTagCode())) {
                age45 = temp;
            } else if ("030210".equals(bean.getTagCode())) {
                age55 = temp;
            } else if ("030211".equals(bean.getTagCode())) {
                ageAbove55 = temp;
            } else if ("030212".equals(bean.getTagCode())) {
                age19 = temp;
            }
            ageSum = ageSum + temp;
        }
        //性别比例
        AgeDistributionVM ageVM = new AgeDistributionVM();
        String maleRate = "0";
        String femaleRate = "0";

        String age19Percent = "0";    //19岁以下比例
        String age25Percent = "0";   //19-25岁以下比例
        String age35Percent = "0";   //26-35岁以下比例
        String age45Percent = "0";   //36-45岁以下比例
        String age55Percent = "0";   //46-55岁以下比例
        String ageAbove55Percent = "0";   //55岁以上比例

        if (ageSum != 0) {
            DecimalFormat decimalFormat = new DecimalFormat("0.00");
            age19Percent = decimalFormat.format(age19 * 100.0 / ageSum);
            age25Percent = decimalFormat.format(age25 * 100.0 / ageSum);
            age35Percent = decimalFormat.format(age35 * 100.0 / ageSum);
            age45Percent = decimalFormat.format(age45 * 100.0 / ageSum);
            age55Percent = decimalFormat.format(age55 * 100.0 / ageSum);
            ageAbove55Percent = decimalFormat.format(ageAbove55 * 100.0 / ageSum);
        }

        ageVM.setAge19Percent(age19Percent);
        ageVM.setAge25Percent(age25Percent);
        ageVM.setAge35Percent(age35Percent);
        ageVM.setAge45Percent(age45Percent);
        ageVM.setAge55Percent(age55Percent);
        ageVM.setAgeAbove55Percent(ageAbove55Percent);
        return ageVM;
    }

    /**
     * 人口属性  已婚 育儿 有车
     *
     * @param params
     * @return
     */
    public MarryCarChildVM getMarryCarChild(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        String startDate = (String) params.get("startDate");
        String endDate = (String) params.get("endDate");
        //married
        setMarried(params, map);

        setBaby(params, map);

        Map<String, Object> babyMap = map.get("baby");

        setCar(params, map);

        Map<String, Object> marryMap = map.get("marry");
        Map<String, Object> carMap = map.get("car");

        int marriedCount = marryMap.get("030402") == null ? 0 : Integer.parseInt(marryMap.get("030402") + "");//已婚
        int unmarriedCount = marryMap.get("-1") == null ? 0 : Integer.parseInt(marryMap.get("-1") + "");//未婚
        int marriedSum = marryMap.get("sum") == null ? 0 : Integer.parseInt(marryMap.get("sum") + "");//结婚总数

        int haveCarCount = carMap.get("030501") == null ? 0 : Integer.parseInt(carMap.get("030501") + "");//有车
        int noCarCount = carMap.get("-1") == null ? 0 : Integer.parseInt(carMap.get("-1") + "");//无车
        int carSum = carMap.get("sum") == null ? 0 : Integer.parseInt(carMap.get("sum") + "");//有车总数

        int babySum = babyMap.get("sum") == null ? 0 : (int) babyMap.get("sum");
        int unknowBaby =  babyMap.get("-1") == null ? 0 : (int) babyMap.get("-1");
        int prepareBaby = babyMap.get("080301") == null ? 0 : (int) babyMap.get("080301");
        int noBaby = unknowBaby + prepareBaby;
        int haveBaby = babySum - noBaby;

        String marriedPercent = "0.0";    //已婚
        String unmarriedPercent = "0.0";  //未婚
        String haveChildrenPercent = "0.0"; //有车比例
        String noChildrenPercent = "0.0";   //无车比例
        String haveCarPercent = "0.0";//有车比例
        String noCarPercent = "0.0";  //无车比例

        DecimalFormat decimalFormat = new DecimalFormat("0.00");

        if (marriedSum != 0) {
            marriedPercent = decimalFormat.format(marriedCount * 100.0 / marriedSum);
            unmarriedPercent = decimalFormat.format(unmarriedCount * 100.0 / marriedSum);
        }

        if (carSum != 0) {
            haveCarPercent = decimalFormat.format(haveCarCount * 100.0 / carSum);
            noCarPercent = decimalFormat.format(noCarCount * 100.0 / carSum);
        }

        if (babySum != 0) {
            haveChildrenPercent = decimalFormat.format(haveBaby * 100.0 / babySum);
            noChildrenPercent = decimalFormat.format(noBaby * 100.0 / babySum);
        }

        MarryCarChildVM vm = new MarryCarChildVM();
        vm.setHaveCarPercent(haveCarPercent);
        vm.setNoCarPercent(noCarPercent);
        vm.setHaveChildrenPercent(haveChildrenPercent);
        vm.setNoChildrenPercent(noChildrenPercent);
        vm.setMarriedPercent(marriedPercent);
        vm.setUnmarriedPercent(unmarriedPercent);
        return vm;
    }

    private void setCar(Map params, Map<String, Map<String, Object>> map) {
        //car
        List<String> carCodes = new ArrayList();
        String tagName = "0305";
        carCodes.add("030501");
        carCodes.add("-1");
        params.put("tagName", tagName);
        params.put("list", carCodes);
        List<TenantTagsCount> carList = queryLatestDataByParams(params);
        Map<String, Object> carResultMap = new HashMap<>();
        int carSum = 0;
        for (TenantTagsCount bean : carList) {
            int value5 = 0;
            if (bean.getMetricValue() != null) {
                value5 = bean.getMetricValue();
            }
            carResultMap.put(bean.getTagCode(), value5);
            carSum = carSum + value5;
        }
        carResultMap.put("sum", carSum);
        map.put("car", carResultMap);
    }

    private void setBaby(Map params, Map<String, Map<String, Object>> map) {
        //baby
//		 家有宝宝	080302
//			育儿阶段	08030201
//			家有大宝宝	08030202
//			家有小宝宝	08030203
//			孕婴童	080303
        String tagName = "0803";
        List<String> babyCodes = new ArrayList();
        babyCodes.add("08030201");
        babyCodes.add("08030202");
        babyCodes.add("08030203");
        babyCodes.add("080303");
        babyCodes.add("080302");
        babyCodes.add("080301");
        babyCodes.add("-1");
        params.put("tagName", tagName);
        params.put("list", babyCodes);
        List<TenantTagsCount> babyList = queryLatestDataByParams(params);
        Map<String, Object> babyResultMap = new HashMap<>();
        int sum = 0;
        for (TenantTagsCount bean : babyList) {
            int value4 = 0;
            if (bean.getMetricValue() != null) {
                value4 = bean.getMetricValue();
            }
            babyResultMap.put(bean.getTagCode(), value4);
            sum += value4;
        }

        babyResultMap.putIfAbsent("-1", 0);

        babyResultMap.put("sum", sum);
        map.put("baby", babyResultMap);
    }

    private void setMarried(Map params, Map<String, Map<String, Object>> map) {
        List<String> marriedCodes = new ArrayList();

        String tagName = "0304";
        marriedCodes.add("030402");
        marriedCodes.add("-1");
        params.put("tagName", tagName);
        params.put("list", marriedCodes);
        List<TenantTagsCount> marriedList = queryLatestDataByParams(params);
        Map<String, Object> marryResultMap = new HashMap<>();
        int marrySum = 0;
        String value3 = "0";
        for (TenantTagsCount bean : marriedList) {
            if (bean.getMetricValue() != null) {
                value3 = bean.getMetricValue().toString();
            }
            marryResultMap.put(bean.getTagCode(), value3);
            marrySum = marrySum + Integer.valueOf(value3);
        }
        marryResultMap.put("sum", marrySum);
        map.put("marry", marryResultMap);
    }

    /**
     * 获取男，女总人数
     *
     * @param params
     * @return
     */
    public int getSexSum(Map params) {
        List<String> codes = new ArrayList();
        codes.add("030102");
        codes.add("030101");
        params.put("list", codes);
        List<TenantTagsCount> list = queryLatestDataByParams(params);
        Map<String, Object> sexResultMap = new HashMap<>();
        int sexSum = 0;

        for (TenantTagsCount bean : list) {
            int value1 = 0;
            if (bean.getMetricValue() != null) {
                value1 = bean.getMetricValue();
            }
            sexResultMap.put(bean.getTagCode(), value1);
            sexSum = sexSum + value1;
        }
        sexResultMap.put("sum", sexSum);
        return sexSum;
    }


    /**
     * 获取男，女总人数,包括未知
     *
     * @param params
     * @return
     */
    public int getAllCount(Map params) {
//        List<String> codes = new ArrayList();
//        codes.add("030102");
//        codes.add("030101");

        // codes.add("-1");//男女总数 + 未知总数
//        params.put("list", codes);
        String tagName = "0301";
        List<TenantTagsCount> list = queryLatestDataByTagName(params,tagName);

        Map<String, Object> sexResultMap = new HashMap<>();
        int sexSum = 0;

        for (TenantTagsCount bean : list) {
            int value1 = 0;
            if (bean.getMetricValue() != null) {
                value1 = bean.getMetricValue();
            }
            sexResultMap.put(bean.getTagCode(), value1);
            sexSum = sexSum + value1;
        }
        sexResultMap.put("sum", sexSum);
        return sexSum;
    }

    /**
     * 根据单个标签名称和code 查询
     * @param tagName
     * @return
     */
    private List<TenantTagsCount> queryLatestDataByTagName(Map params,String tagName) {
        params.put("tagName", tagName);
        Map _params = new HashMap<>();
        List<TenantTagsCount> list = new ArrayList<>();
        _params = params;
        list = tenantTagsCountDao.selectByCodesIn(_params);
        if (list.size() == 0) {
            logger.info("#########  runDate=" + params.get("runDate") + " 日期间隔的数据为空，parmas=" + params + "#########");
            TenantTagsCount tenantTagsCount = tenantTagsCountDao.selectLatestDataByCodesIn(_params);
            if (tenantTagsCount != null) {
                _params.put("runDate", tenantTagsCount.getRunDate());
                list = tenantTagsCountDao.selectByCodesIn(_params);
                logger.info("#########  返回" + tenantTagsCount.getStartDate() + "~" + tenantTagsCount.getEndDate() + " 日期间隔的数据#########");
            }
        }

        return list;
    }

    /**
     * 人口属性，总的汇总
     *
     * @param params
     * @return
     */
    private Map<String, Map<String, Object>> queryCrowProperties(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        String startDate = (String) params.get("startDate");
        String endDate = (String) params.get("endDate");
        //age
        setAge(params, map);

        //married
        setMarried(params, map);
        //baby
//		 家有宝宝	080302
//			育儿阶段	08030201
//			家有大宝宝	08030202
//			家有小宝宝	08030203
//			孕婴童	080303
        setBaby(params, map);
        //car
        setCar(params, map);
        return map;
    }

    private void setAge(Map params, Map<String, Map<String, Object>> map) {
        List<String> ageCodes = new ArrayList();
        ageCodes.add("030207");
        ageCodes.add("030208");
        ageCodes.add("030209");
        ageCodes.add("030210");
        ageCodes.add("030211");
        ageCodes.add("030212");
        params.put("list", ageCodes);
        List<TenantTagsCount> ageList = queryLatestDataByParams(params);
        Map<String, Object> ageResultMap = new HashMap<>();
        int ageSum = 0;
        String value2 = "0";
        for (TenantTagsCount bean : ageList) {
            if (bean.getMetricValue() != null) {
                value2 = bean.getMetricValue().toString();
            }
            ageResultMap.put(bean.getTagCode(), value2);
            ageSum = ageSum + Integer.valueOf(value2);
        }
        if (ageSum != 0) {
            ageResultMap.put("sum", ageSum);
        }
        map.put("age", ageResultMap);
    }

    /**
     * 查询客群的人口属性数据
     *
     * @param params
     * @return
     */
    private List<TenantTagsCount> queryLatestDataByParams(Map params) {
//        params.put("tagName", null);
        params.put("startDate", null);
        params.put("endDate", null);
        Map _params = new HashMap<>();
        List<TenantTagsCount> list = new ArrayList<>();
        _params = params;
        list = tenantTagsCountDao.selectByCodesIn(_params);
        if (list.size() == 0) {
            logger.info("#########  runDate=" + params.get("runDate") + " 日期间隔的数据为空，parmas=" + params + "#########");
            TenantTagsCount tenantTagsCount = tenantTagsCountDao.selectLatestDataByCodesIn(_params);
            if (tenantTagsCount != null) {
                _params.put("runDate", tenantTagsCount.getRunDate());
                list = tenantTagsCountDao.selectByCodesIn(_params);
                logger.info("#########  返回" + tenantTagsCount.getStartDate() + "~" + tenantTagsCount.getEndDate() + " 日期间隔的数据#########");
            }
        }

        return list;
    }

    /**
     * 查询客群的手机品牌，分布数据等
     *
     * @param params
     * @return
     */
    private List<TenantDeviceCount> selectTenantDeviceCountLatestData(Map params) {
        @SuppressWarnings("rawtypes")
        Map _params = new HashMap<>();
        List<TenantDeviceCount> list = new ArrayList<>();
//		int days = Integer.valueOf(params.get("cycleStatistics").toString());
//		params.put("cycleStatistics", RunDateUtil.getInstance().getCycleStatistics(days));
        _params = params;

        list = tenantDeviceCountDao.selectByCodesIn(_params);
        if (list.size() == 0) {
            logger.info("######### runDate= " + params.get("runDate") + " 日期间隔的数据为空，parmas=" + params + "#########");
            //根据projectId，crowdid，cycle_statistics查询最近一次的数据
            TenantDeviceCount tenantDeviceCount = tenantDeviceCountDao.selectLatestDataByCodesIn(_params);
            if (tenantDeviceCount != null) {
                _params.put("startDate", tenantDeviceCount.getStartDate());
                _params.put("endDate", tenantDeviceCount.getEndDate());
                _params.put("runDate", tenantDeviceCount.getRunDate());
                list = tenantDeviceCountDao.selectByCodesIn(_params);
                logger.info("#########  返回" + tenantDeviceCount.getStartDate() + "~" + tenantDeviceCount.getEndDate() + " 日期间隔的数据#########");
            }
        }
        return list;
    }

    /**
     * 获取客户导入人群标签id
     *
     * @param projectId
     * @param user
     * @return
     */
    private String getImportCrowdId(String projectId, User user) {
        CrowdPage page = new CrowdPage();
        String id = "";
        page.setAttr1(projectId);
        page.setTenantId(UserInfoUtil.getCurrentUserTenantId());
        page.setType(ReportConstants.CrowdType.CROWD_TYPE_CU);
        List<Crowd> list;
        try {
            list = dao.queryByList(page);
            if (list != null && list.size() > 0) {
                id = list.get(0).getId().toString();
            } else {
                Crowd record = new Crowd();
                record.setAttr1(projectId);
                record.setTagType("6");
                record.setName("用户导入");
                record.setSource(5);
                record.setCode(SequenceUtil.getSequenceCode(ReportConstants.CrowdType.CROWD_TYPE_CU));
                record.setType(ReportConstants.CrowdType.CROWD_TYPE_CU); //用户上传
                record.setAttr1(projectId);
                record.setTenantId(UserInfoUtil.getCurrentUserTenantId());
                record.setStatus(ReportConstants.ProjectCrowdStatus.NO_AVALIABLE); //未生效
                record.setCreateBy(user.getUmid());
                record.setCreator(user.getUmid());
                dao.insert(record);
                id = record.getId().toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return id;
    }

    public int updateCrowdsById(Crowd record) {
        return dao.updateCrowdsById(record);
    }
}
