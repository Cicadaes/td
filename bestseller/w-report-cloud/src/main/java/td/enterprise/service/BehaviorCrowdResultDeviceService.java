package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import td.enterprise.dao.BehaviorCrowdResultDeviceDao;
import td.enterprise.entity.BehaviorCrowdResultDevice;
import td.olap.query.runscript.bean.ResultBean;

import java.util.*;

/**
 * <br>
 * <b>功能：</b>自定义行为客群-人群消费结果表 BehaviorCrowdResultDeviceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("behaviorCrowdResultDeviceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BehaviorCrowdResultDeviceService extends BaseService<BehaviorCrowdResultDevice> {
    public final static Logger logger = Logger.getLogger(BehaviorCrowdResultDeviceService.class);

    @Autowired
    private BehaviorCrowdResultDeviceDao dao;

    public BehaviorCrowdResultDeviceDao getDao() {
        return dao;
    }

    private List<BehaviorCrowdResultDevice> selectBehaviorCrowdResultDeviceData(Map params) {
        Map _params = new HashMap<>();
        List<BehaviorCrowdResultDevice> list = new ArrayList<>();
        _params = params;
        list = dao.selectByCodesIn(_params);
        return list;
    }

    /**
     * 查询 手机品牌
     * <p>
     * '99060','99873','99002','99004','99003','99024'
     * 苹果  99060
     *
     * @return
     */
    public Map<String, Map<String, Object>> queryPhoneTypeByCounter(Map params) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        params.put("deviceAttrType", 2);
        List<BehaviorCrowdResultDevice> list = selectBehaviorCrowdResultDeviceData(params);//tenantDeviceCountDao.selectByCodesIn(params);

        Map<String, Object> agedistributeResultMap = new LinkedHashMap<>();
//		List<ResultBean> agedistributeResultBeanList = new ArrayList<>();
        //bean value 為null，sort排序會異常
        for (BehaviorCrowdResultDevice bean : list) {
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
            BehaviorCrowdResultDevice bean = list.get(i);
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
     * 1～499	    090901
     * 500～999 	090902
     * 1000~1999	090903
     * 2000~3999	090904
     * 4000以上	090905
     *
     * @return
     */
    public Map<String, Map<String, Object>> queryPhonePriceByCounter(Map params) {
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
        List<BehaviorCrowdResultDevice> list = selectBehaviorCrowdResultDeviceData(params);//tenantDeviceCountDao.selectByCodesIn(params);

        Map<String, Object> phonePriceMap = new HashMap<>();
        String value1 = "0";
        int sum = 0;

        for (BehaviorCrowdResultDevice bean : list) {
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
}
