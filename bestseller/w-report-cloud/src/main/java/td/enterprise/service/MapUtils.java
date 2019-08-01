package td.enterprise.service;

import td.enterprise.service.DTO.ProjectOrder;

import java.util.*;


/**
 * 排序公共类
 *
 * @author junmin.li
 */
public class MapUtils {

    public static List<ProjectOrder> sortByRate(Map<String, Integer> source, Map<String, Integer> compare) {
        if (null == source || compare == null) {
            return new ArrayList<ProjectOrder>();
        }
        List<ProjectOrder> list = new ArrayList<ProjectOrder>();
        for (String key : source.keySet()) {
            Integer temp1 = source.get(key);
            Integer temp2 = compare.get(key);
            double rate = 0.0;
            if (temp1 != null && temp2 != null) {
                rate = temp1 * 10.0 / temp2;
            }
            ProjectOrder po = new ProjectOrder();
            po.setId(key);
            po.setValue(rate);
            list.add(po);
        }
        Collections.sort(list);
        return list;
    }

    public static Map<String, Integer> sortByRateTop10(Map<String, Integer> source, Map<String, Integer> compare) {
        List<ProjectOrder> list = sortByRate(source, compare);
        if (list.size() > 10) {
            list = list.subList(0, 10);
        }
        Map<String, Integer> resultMap = new LinkedHashMap<String, Integer>();
        for (ProjectOrder po : list) {
            resultMap.put(po.getId(), 0);
        }
        return resultMap;
    }

    /**
     * 两个map 的平均值
     *
     * @param source
     * @param compare
     * @return
     */
    public static Map<String, Integer> avarage(Map<String, Integer> source, Map<String, Integer> compare) {
        Map<String, Integer> resultMap = new LinkedHashMap<String, Integer>();
        if (null == source || compare == null) {
            return resultMap;
        }
        for (String key : source.keySet()) {
            Integer temp1 = source.get(key);
            Integer temp2 = compare.get(key);
            int avarage = 0;
            if (temp1 != null && temp2 != null && temp2 != 0) {
                avarage = temp1 / temp2;
            }
            resultMap.put(key, avarage);
        }
        return resultMap;
    }

    /**
     * 两个map 的平均值
     *
     * @param source
     * @param compare
     * @return
     */
    public static Map<String, Double> avarageDouble(Map<String, Integer> source, Map<String, Integer> compare) {
        Map<String, Double> resultMap = new LinkedHashMap<String, Double>();
        if (null == source || compare == null) {
            return resultMap;
        }
        for (String key : source.keySet()) {
            Integer temp1 = source.get(key);
            Integer temp2 = compare.get(key);
            double avarage = 0.0;
            if(temp1!=null&& temp2!=null) {
                avarage = temp1 * 10.0 / temp2 / 10.0;
            }
            resultMap.put(key, avarage);
        }
        return resultMap;
    }

    public static Map<String, Integer> sortDoubleByRateTop10(Map<String, Double> source, Map<String, Integer> compare) {
        if (null == source || compare == null) {
            return new HashMap<String, Integer>();
        }
        List<ProjectOrder> list = new ArrayList<ProjectOrder>();
        for (String key : source.keySet()) {
            Double temp1 = source.get(key);
            Integer temp2 = compare.get(key);
            double rate = 0.0;
            if (temp1 != null && temp2 != null) {
                rate = temp1 * 10.0 / temp2;
            }
            ProjectOrder po = new ProjectOrder();
            po.setId(key);
            po.setValue(rate);
            list.add(po);
        }
        Collections.sort(list);
        if (list.size() > 10) {
            list = list.subList(0, 10);
        }
        Map<String, Integer> resultMap = new LinkedHashMap<String, Integer>();
        for (ProjectOrder po : list) {
            resultMap.put(po.getId(), 0);
        }
        return resultMap;
    }
}
