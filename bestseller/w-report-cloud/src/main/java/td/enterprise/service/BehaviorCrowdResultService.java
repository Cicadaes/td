package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.util.DateUtil;
import td.enterprise.common.util.RunDateUtil;
import td.enterprise.dao.BehaviorCrowdResultDao;
import td.enterprise.dao.ProjectDao;
import td.enterprise.entity.BehaviorCrowdResult;
import td.enterprise.entity.CityAppIntrestCount;
import td.enterprise.entity.Project;
import td.enterprise.entity.TagsInfo;
import td.enterprise.page.BehaviorCrowdResultPage;
import td.enterprise.page.CityAppIntrestCountPage;
import td.enterprise.service.DTO.Tag;
import td.enterprise.web.vm.AgeDistributionVM;
import td.enterprise.web.vm.MarryCarChildVM;
import td.enterprise.web.vm.SexVM;

import java.text.DecimalFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>自定义行为客群计算结果表 BehaviorCrowdResultService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("behaviorCrowdResultService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BehaviorCrowdResultService extends BaseService<BehaviorCrowdResult> {
    public final static Logger logger = Logger.getLogger(BehaviorCrowdResultService.class);
    public final static String pattern = "yyyy-MM-dd";
    @Autowired
    private BehaviorCrowdResultDao dao;
    @Autowired
    private CrowdService crowdService;
    @Autowired
    private TagsInfoService tagsInfoService;
    @Autowired
    private CityAppIntrestCountService cityAppIntrestCountService;
    @Autowired
    private ProjectDao projectDao;

    public BehaviorCrowdResultDao getDao() {
        return dao;
    }

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
                    CrowdService.generateDataMap(tagsInfoList, valueMap, resultMap, type, null);
                    break;
                case "age":
                    type = "agedistribute";
                    CrowdService.generateDataMap(tagsInfoList, valueMap, resultMap, type, null);
                    break;
                default:
                    type = "person";
                    CrowdService.generateDataMap(tagsInfoList, valueMap, resultMap, type, tagList);
                    break;
            }
        }

        CrowdService.filter(resultMap);

        return resultMap;
    }

    /**
     * 人口属性  已婚 育儿 有车
     *
     * @param params
     * @return
     */
    public MarryCarChildVM getMarryCarChild(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();
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
        List<BehaviorCrowdResult> carList = queryLatestDataByParams(params);
        Map<String, Object> carResultMap = new HashMap<>();
        int carSum = 0;
        for (BehaviorCrowdResult bean : carList) {
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
        List<BehaviorCrowdResult> babyList = queryLatestDataByParams(params);
        Map<String, Object> babyResultMap = new HashMap<>();
        int sum = 0;
        for (BehaviorCrowdResult bean : babyList) {
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

        List<BehaviorCrowdResult> marriedList = queryLatestDataByParams(params);
        Map<String, Object> marryResultMap = new HashMap<>();
        int marrySum = 0;
        String value3 = "0";
        for (BehaviorCrowdResult bean : marriedList) {
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
     * @param map
     * @return
     */
    private int getSexSum(Map params, Map<String, Map<String, Object>> map) {
        List<String> codes = new ArrayList();
        codes.add("030102");
        codes.add("030101");
        params.put("list", codes);
        List<BehaviorCrowdResult> list = queryLatestDataByParams(params);
        Map<String, Object> sexResultMap = new HashMap<>();
        int sexSum = 0;

        for (BehaviorCrowdResult bean : list) {
            int value1 = 0;
            if (bean.getMetricValue() != null) {
                value1 = bean.getMetricValue();
            }
            sexResultMap.put(bean.getTagCode(), value1);
            sexSum = sexSum + value1;
        }
        sexResultMap.put("sum", sexSum);
        map.put("sex", sexResultMap);
        return sexSum;
    }


    /**
     * 年龄分布
     *
     * @param params
     * @return
     */
    public AgeDistributionVM queryAgeDistribution(Map params) {
        List<String> ageCodes = new ArrayList();
        ageCodes.add("030207");//19-25岁
        ageCodes.add("030208");
        ageCodes.add("030209");
        ageCodes.add("030210");
        ageCodes.add("030211");
        ageCodes.add("030212");
        params.put("list", ageCodes);
        List<BehaviorCrowdResult> ageList = queryLatestDataByParams(params);
        int ageSum = 0;

        int age19 = 0;
        int age25 = 0;
        int age35 = 0;
        int age45 = 0;
        int age55 = 0;
        int ageAbove55 = 0;
        for (BehaviorCrowdResult bean : ageList) {
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
     * 性别比例
     *
     * @param params
     * @return
     */
    public SexVM getSexRateVM(Map params) {
        List<String> codes = new ArrayList();
        codes.add("030102");//女
        codes.add("030101");//男
        params.put("list", codes);
        List<BehaviorCrowdResult> list = queryLatestDataByParams(params);
        int sexSum = 0;
        int maleCount = 0;
        int femaleCount = 0;

        for (BehaviorCrowdResult bean : list) {
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
        if (sexSum != 0) {
            DecimalFormat decimalFormat = new DecimalFormat("0.00");
            maleRate = decimalFormat.format(maleCount * 100.0 / sexSum);
            femaleRate = decimalFormat.format(femaleCount * 100.0 / sexSum);
        }
        sexVM.setFemaleRate(femaleRate);
        sexVM.setMaleRate(maleRate);
        return sexVM;
    }

    public Map<String, Map<String, Object>> queryCrowProperties(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        List<String> codes = new ArrayList();
        codes.add("030102");
        codes.add("030101");
        params.put("list", codes);
        List<BehaviorCrowdResult> list = queryLatestDataByParams(params);
        Map<String, Object> sexResultMap = new HashMap<>();
        int sexSum = 0;
        String value1 = "0";
        for (BehaviorCrowdResult bean : list) {
            if (bean.getMetricValue() != null) {
                value1 = bean.getMetricValue().toString();
            }
            sexResultMap.put(bean.getTagCode(), value1);
            sexSum = sexSum + Integer.valueOf(value1);
        }
        if (sexSum != 0) {
            sexResultMap.put("sum", sexSum);
        }
        map.put("sex", sexResultMap);

        //age
        List<String> ageCodes = new ArrayList();
        ageCodes.add("030207");
        ageCodes.add("030208");
        ageCodes.add("030209");
        ageCodes.add("030210");
        ageCodes.add("030211");
        ageCodes.add("030212");
        params.put("list", ageCodes);
        List<BehaviorCrowdResult> ageList = queryLatestDataByParams(params);
        Map<String, Object> ageResultMap = new HashMap<>();
        int ageSum = 0;
        String value2 = "0";
        for (BehaviorCrowdResult bean : ageList) {
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

        //married
        List<String> marriedCodes = new ArrayList();
        marriedCodes.add("030401");
        marriedCodes.add("030402");
        params.put("list", marriedCodes);
        List<BehaviorCrowdResult> marriedList = queryLatestDataByParams(params);
        Map<String, Object> marryResultMap = new HashMap<>();
        int marrySum = 0;
        String value3 = "0";
        for (BehaviorCrowdResult bean : marriedList) {
            if (bean.getMetricValue() != null) {
                value3 = bean.getMetricValue().toString();
            }
            marryResultMap.put(bean.getTagCode(), value3);
            marrySum = marrySum + Integer.valueOf(value3);
        }
        if (marrySum != 0) {
            marryResultMap.put("sum", marrySum);
        }
        map.put("marry", marryResultMap);

        //baby
//		 家有宝宝	080302
//			育儿阶段	08030201
//			家有大宝宝	08030202
//			家有小宝宝	08030203
//			孕婴童	080303
        List<String> babyCodes = new ArrayList();
        babyCodes.add("08030201");
        babyCodes.add("08030202");
        babyCodes.add("08030203");
        babyCodes.add("080303");
        babyCodes.add("080302");
        params.put("list", babyCodes);
        List<BehaviorCrowdResult> babyList = queryLatestDataByParams(params);
        Map<String, Object> babyResultMap = new HashMap<>();
        String value4 = "0";
        for (BehaviorCrowdResult bean : babyList) {
            if (bean.getMetricValue() != null) {
                value4 = bean.getMetricValue().toString();
            }
            babyResultMap.put(bean.getTagCode(), value4);
        }
        if (sexSum != 0) {
            babyResultMap.put("sum", sexSum);
        }
        map.put("baby", babyResultMap);

        //car
        List<String> carCodes = new ArrayList();
        carCodes.add("030501");
        carCodes.add("030502");
        params.put("list", carCodes);
        List<BehaviorCrowdResult> carList = queryLatestDataByParams(params);
        Map<String, Object> carResultMap = new HashMap<>();
        int carSum = 0;
        String value5 = "0";
        for (BehaviorCrowdResult bean : carList) {
            if (bean.getMetricValue() != null) {
                value5 = bean.getMetricValue().toString();
            }
            carResultMap.put(bean.getTagCode(), value5);
            carSum = carSum + Integer.valueOf(value5);
        }
        if (carSum != 0) {
            carResultMap.put("sum", carSum);
        }
        map.put("car", carResultMap);

        return map;
    }

    private List<BehaviorCrowdResult> queryLatestDataByParams(Map params) {
        Map _params = new HashMap<>();
        List<BehaviorCrowdResult> list = new ArrayList<>();
        _params = params;
        list = dao.selectByCodesIn(_params);
        return list;
    }

    public List<BehaviorCrowdResult> selectForRadar(Map params) {
        List<BehaviorCrowdResult> list = selectForRadarTrue(params);

        boolean bottomIsNull = false;
        for (BehaviorCrowdResult BehaviorCrowdResult : list) {
            if ("000000".equals(BehaviorCrowdResult.getTagCode())) {
                if (BehaviorCrowdResult.getMetricValue() == 0) {
                    bottomIsNull = true;
                    break;
                }
            }
        }
        if (bottomIsNull) {
            params.put("tagCode", "");
            list = selectForRadarTrue(params);
        }
        return list;
    }

    public List<BehaviorCrowdResult> selectForRadarTrue(Map params) {
        List<BehaviorCrowdResult> result = getDao().selectForRadar(params);
        int peopleNum = getDao().selectForRadarPeopleNum(params);
        if (result.size() == 0) {
            BehaviorCrowdResultPage page = new BehaviorCrowdResultPage();
            page.setProjectId((Integer) params.get("projectId"));
            page.setExecId((int) params.get("execId"));
            page = filter(page);
            result = getDao().selectForRadar(params);

            //拿到总人群数
            peopleNum = getDao().selectForRadarPeopleNum(params);
        }
        if (result.size() != 0) {
            BehaviorCrowdResult peopleTag = new BehaviorCrowdResult();
            peopleTag.setTagName("人群总数");
            peopleTag.setTagCode("000000");
            peopleTag.setMetricValue(peopleNum);
            result.add(peopleTag);
        }
        return result;
    }

    //去数据库中检索有数据的有效日期区间
    private BehaviorCrowdResultPage filter(BehaviorCrowdResultPage page) {
        try {
            Map<String, String> map = new HashMap<>();
            //runDate 是endDate的前一天
            Date runDate = DateUtil.format(page.getRunDate(), pattern);
            map = getValiableRunDate(runDate, page.getCycleStatistics(), page.getTenantId(), page.getProjectId(), page.getCrowdId(), page.getExecId());
            if (map.size() > 0) {
                //page.setStartDate(map.get("startDate"));
                //page.setEndDate(map.get("endDate"));
                page.setRunDate(map.get("runDate"));
                // if (map.containsKey("cycleStatistics")) {
                //     page.setCycleStatistics(Integer.valueOf(map.get("cycleStatistics")));
                // }
                logger.info(" ####### filter之后 runDate=" + map.get("runDate") + " #######");
            }
        } catch (Exception e) {
            logger.error("getValiableRunDate方法异常, ");
        }

        return page;
    }

    @SuppressWarnings("finally")
    public Map<String, String> getValiableRunDate(Date runDate, Integer cycleStatistics, String tenantId, int projectId, int crowdId, int execId) {
        BehaviorCrowdResultPage page = new BehaviorCrowdResultPage();
        Map<String, String> map = new HashMap<>();
        //map.put("startDate", sdf.format(startDate));
        //map.put("endDate", sdf.format(endDate));
        try {
            int dateLength = cycleStatistics;
            if (dateLength != 30 &&
                    dateLength != 60 &&
                    dateLength != 90 &&
                    dateLength != 180) {
                dateLength = RunDateUtil.getInstance().getCycleStatistics(dateLength);
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
            BehaviorCrowdResultPage tenantJobHousingCountPage = new BehaviorCrowdResultPage();
            tenantJobHousingCountPage.setRunDate(DateUtil.format(runDate, pattern));
            tenantJobHousingCountPage.setCycleStatistics(dateLength);
            tenantJobHousingCountPage.setCrowdId(crowdId);
            tenantJobHousingCountPage.setProjectId(projectId);
            tenantJobHousingCountPage.setTenantId(tenantId);
            tenantJobHousingCountPage.setExecId(execId);
            //查找同等计算周期下，计算日期在当前参数run_date之前记录
            BehaviorCrowdResult count = dao.queryLatestRow(tenantJobHousingCountPage);
            if (count != null) {
                //map.put("startDate", count.getStartDate());
                //map.put("endDate",  count.getEndDate());
                map.put("runDate", count.getRunDate());
                // map.put("cycleStatistics", String.valueOf(dateLength));
            }
        } catch (Exception e) {
            throw new BusinessException(e);
        } finally {
            return map;
        }
    }

    /**
     * 城市app提升度
     *
     * @param params
     * @return
     */
    public List<BehaviorCrowdResult> selectAppPreference(Map params) {
        List<BehaviorCrowdResult> result = selectForRadar(params);
        Integer projectId = (Integer) params.get("projectId");
        Project project = projectDao.selectByPrimaryKey(projectId);
        String cityName = project.getCity();
        CityAppIntrestCountPage cityAppIntrestCountPage = new CityAppIntrestCountPage();
        cityAppIntrestCountPage.setCityName(cityName);
        cityAppIntrestCountPage.setPageEnabled(false);
        List<BehaviorCrowdResult> BehaviorCrowdResultList = new ArrayList<>();
        List<CityAppIntrestCount> cityAppIntrestCountsList = cityAppIntrestCountService.queryListByPage(cityAppIntrestCountPage);
        Map<String, CityAppIntrestCount> cityTagDataMap = new HashMap<>();
        for (CityAppIntrestCount cityAppIntrestCount : cityAppIntrestCountsList) {
            cityTagDataMap.put(cityAppIntrestCount.getTagName(), cityAppIntrestCount);
        }

        BehaviorCrowdResult peopleTag = new BehaviorCrowdResult();
        Double peopleTagMetricValue = 0.0d;
        for (BehaviorCrowdResult count : result) {
            if ("人群总数".equalsIgnoreCase(count.getTagName()) &&
                    "000000".equalsIgnoreCase(count.getTagCode())) {
                peopleTag = count;
                peopleTagMetricValue = Double.valueOf(count.getMetricValue());
            }
        }

        BehaviorCrowdResult BehaviorCrowdResult = null;
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        for (BehaviorCrowdResult BehaviorCrowdResultObj : result) {
            if (!"000000".equalsIgnoreCase(BehaviorCrowdResultObj.getTagCode())) {
                BehaviorCrowdResult = BehaviorCrowdResultObj;
                Double tagCountMetricValue = Double.valueOf(BehaviorCrowdResultObj.getMetricValue());
                Double tagCountValue = peopleTagMetricValue == 0 ? 0.0d : (tagCountMetricValue / peopleTagMetricValue);
                if (cityTagDataMap.containsKey(BehaviorCrowdResultObj.getTagName())) {
                    CityAppIntrestCount cityAppIntrestCount = cityTagDataMap.get(BehaviorCrowdResultObj.getTagName());
                    int cityAppInMetricValue = cityAppIntrestCount.getMetricValue();
                    Double dvalue = 0.0d;
                    if (cityAppInMetricValue != 0) {
                        logger.info(((tagCountValue * 100) / cityAppInMetricValue) + "  , " + (((tagCountValue * 100) / cityAppInMetricValue) - 1));
                        dvalue = ((tagCountValue * 100) / cityAppInMetricValue) - 1.0d;
                    }
                    BehaviorCrowdResult.setCityPreValue(decimalFormat.format(dvalue * 100));
                } else {
                    //没有匹配到，默认提升度为0
                    BehaviorCrowdResult.setCityPreValue("0.0");
                }
                BehaviorCrowdResultList.add(BehaviorCrowdResult);
            }
        }
        return BehaviorCrowdResultList;
    }
}
