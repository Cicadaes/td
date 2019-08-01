package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.util.JsonUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The type Definition builder.
 * @author xiaoming.kang
 */
public class DefinitionBuilder {
    /**
     * Build definition definition.
     *
     * @param crowd        the crowd
     * @param behaviorCode the behavior code
     * @return the definition
     */
    public static Definition buildDefinition(CrowdInfoResp crowd, String behaviorCode) {
        String conditionName1 = "condition1";
        String conditionName2 = "condition2";

        Filter f1 = buildFilter1(conditionName1);
        Filter f2 = buildFilter2(conditionName2);
        List<Filter> filterList = new ArrayList();
        filterList.add(f1);
        filterList.add(f2);
        Filter parent = new Filter();
        parent.setAnd(filterList);

        Map<String, Condition> conditionMap = new HashMap(16);
        Query q1 = buildQuery(buildRange(), null);
        Indice indice1 = buildIndice(crowd.getTouchPointType(), behaviorCode, "MetaBehavior");
        Condition condition1 = buildCondition(indice1, q1);
        conditionMap.put(conditionName1, condition1);

        Query q2 = buildQuery(null, buildTerm(crowd.getId().toString()));
        Indice indice2 = buildIndice(crowd.getTouchPointType(), crowd.getCode().toString(), "MetaCrowd");
        Condition condition2 = buildCondition(indice2, q2);
        conditionMap.put(conditionName2,condition2);

        Definition definition = new Definition();
        definition.setFilter(parent);
        definition.setCondition(conditionMap);

        return definition;
    }

    /**
     * Build filter 1 filter.
     *
     * @param condition the condition
     * @return the filter
     */
    public static Filter buildFilter1(String condition) {
        Filter f = new Filter();
        f.setCondition(condition);

        List<Filter> l = new ArrayList();
        l.add(f);

        Filter f1 = new Filter();
        f1.setAnd(l);

        Filter f2 = new Filter();
        f2.setNot(f1);

        List<Filter> l1 = new ArrayList();
        l1.add(f2);

        Filter f3 = new Filter();
        f3.setOr(l1);

        List<Filter> l2 = new ArrayList();
        l2.add(f3);

        Filter f4 = new Filter();
        f4.setAnd(l2);

        return f4;
    }

    /**
     * Build filter 2 filter.
     *
     * @param condition the condition
     * @return the filter
     */
    public static Filter buildFilter2(String condition) {
        Filter f = new Filter();
        f.setCondition(condition);

        List<Filter> l = new ArrayList();
        l.add(f);

        Filter f1 = new Filter();
        f1.setOr(l);

        return f1;
    }

    /**
     * Build condition condition.
     *
     * @param indice the indice
     * @param q      the q
     * @return the condition
     */
    public static Condition buildCondition(Indice indice, Query q) {
        Condition condition = new Condition();
        condition.setIndice(indice);
        condition.setQuery(q);
        return condition;
    }

    /**
     * Build indice indice.
     *
     * @param objectIdType the object id type
     * @param objectCode   the object code
     * @param objectType   the object type
     * @return the indice
     */
    public static Indice buildIndice(String objectIdType, String objectCode, String objectType) {
        Indice indice = new Indice();
        indice.setObjectCode(objectCode);
        indice.setObjectIdType(objectIdType);
        indice.setObjectType(objectType);
        return indice;
    }

    /**
     * Build query query.
     *
     * @param range the range
     * @param term  the term
     * @return the query
     */
    public static Query buildQuery(Map<String, OperatorValue> range, Map<String, OperatorValue> term) {
        Qualifier qualifier = new Qualifier();
        qualifier.setRange(range);
        qualifier.setTerm(term);

        List<Qualifier> l = new ArrayList();
        l.add(qualifier);

        BoolFilter boolFilter = new BoolFilter();
        boolFilter.setMust(l);

        Query query = new Query();
        query.setBool(boolFilter);
        return query;
    }

    /**
     * Build range map.
     *
     * @return the map
     */
    public static Map<String, OperatorValue> buildRange() {
        OperatorValue operatorValue = new OperatorValue();
        operatorValue.setGte("date_sub(from_unixtime(unix_timestamp(), 'yyyy-MM-dd'), 7)");
        operatorValue.setLte("date_sub(from_unixtime(unix_timestamp(), 'yyyy-MM-dd'),1)");

        Map<String, OperatorValue> m = new HashMap(16);
        m.put("event_time", operatorValue);
        return m;
    }

    /**
     * Build term map.
     *
     * @param userCloudId the user cloud id
     * @return the map
     */
    public static Map<String, OperatorValue> buildTerm(String userCloudId) {
        OperatorValue operatorValue = new OperatorValue();
        operatorValue.setEq(userCloudId);
        Map<String, OperatorValue> m = new HashMap(16);
        m.put("tag_id", operatorValue);
        return m;
    }

    /**
     * 创建一个crowd子人群作为副本
     *
     * @param crowd the crowd
     * @return definition
     */
    public static Definition buildCopyDefinition(CrowdInfoResp crowd) {
        Indice indice = new Indice(crowd.getTouchPointType(),crowd.getCode(),"MetaCrowd");
        OperatorValue operatorValue = new OperatorValue(crowd.getId());
        Map map = new HashMap<String, OperatorValue>(16);
        map.put("tag_id",operatorValue);
        ArrayList<Qualifier> qualifiers = new ArrayList<>();
        qualifiers.add(new Qualifier(map));
        Query query = new Query(new BoolFilter(qualifiers));
        Map<String, Condition> conditionMap = new HashMap<>(16);
        conditionMap.put("condition1",new Condition(indice,query));
        ArrayList<Filter> filtersAnd = new ArrayList<>();
        ArrayList<Filter> andOr = new ArrayList<>();
        Filter deepFilter = new Filter();
        deepFilter.setCondition("condition1");
        andOr.add(deepFilter);
        filtersAnd.add(new Filter(null,andOr));
        return new Definition(new Filter(filtersAnd),conditionMap);
    }

    /**
     * 在crowd2,不在crowd1中的记录
     *
     * @param crowd1 the crowd 1
     * @param crowd2 the crowd 2
     * @return definition
     */
    public static Definition buildComplementDefinition(CrowdInfoResp crowd1, CrowdInfoResp crowd2) {
        Filter filter = new Filter();
        filter.setCondition("condition1");
        Filter filter1 = new Filter();
        Filter filter2 = new Filter();
        Filter filter3 = new Filter();
        Filter filter4 = new Filter();
        filter1.setNot(filter);
        filter2.setCondition("condition2");
        List<Filter> filters = new ArrayList<>();
        filters.add(filter1);
        filters.add(filter2);
        filter3.setAnd(filters);
        List<Filter> filters1 = new ArrayList<>();
        filters1.add(filter3);
        filter4.setAnd(filters1);
        Condition condition1 = new Condition();
        Indice indice = new Indice(crowd1.getTouchPointType(),crowd1.getCode(),"MetaCrowd");
        condition1.setIndice(indice);
        Map<String, OperatorValue> term = new HashMap(16);
        OperatorValue operator_term = new OperatorValue(crowd1.getId());
        term.put("tag_id",operator_term);
        List<Qualifier> must = new ArrayList();
        must.add(new Qualifier(term));
        Query query = new Query();
        query.setBool(new BoolFilter(must));
        condition1.setQuery(query);
        Condition condition2 = new Condition();
        Indice indice1 = new Indice(crowd2.getTouchPointType(),crowd2.getCode(),"MetaCrowd");
        Map<String, OperatorValue> term1 = new HashMap(16);
        OperatorValue operator_term1 = new OperatorValue(crowd2.getId());
        term1.put("tag_id",operator_term1);
        List<Qualifier> must1 = new ArrayList();
        must1.add(new Qualifier(term1));
        Query query1 = new Query();
        query1.setBool(new BoolFilter(must1));
        condition2.setIndice(indice1);
        condition2.setQuery(query1);
        Map<String, Condition> conditions = new HashMap(16);
        conditions.put("condition1",condition1);
        conditions.put("condition2",condition2);
        Definition definition = new Definition(filter4, conditions);
        return definition;
    }

    /**
     * 取多个人群的并集
     *
     * @param crowdList the crowd list
     * @return definition
     */
    public static Definition buildUnionDefinition(List<CrowdInfoResp> crowdList) {
        int leastSize = 2;
        if (crowdList == null || crowdList.size()<leastSize){
            return null;
        }
        List<Filter> filters = new ArrayList<>();
        HashMap<String, Condition> map = new HashMap<>(16);
        for (int i =0;i<crowdList.size();i++){
            Filter filter = new Filter();
            String condition = "condition" + (i + 1);
            filter.setCondition(condition);
            filters.add(filter);

            Map<String, OperatorValue> term = new HashMap(16);
            OperatorValue operator_term = new OperatorValue(crowdList.get(i).getId());
            term.put("tag_id",operator_term);
            List<Qualifier> must = new ArrayList();
            must.add(new Qualifier(term));
            Query query = new Query();
            query.setBool(new BoolFilter(must));
            Indice indice = new Indice(crowdList.get(i).getTouchPointType(), crowdList.get(i).getCode(), "MetaCrowd");
            map.put(condition,new Condition(indice,query));
        }
        Filter filter = new Filter(null,filters);
        List<Filter> filters1 = new ArrayList<>();
        filters1.add(filter);
        Filter filter1 = new Filter(filters1,null);
        return new Definition(filter1,map);
    }

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     */
    public static void main(String[] args) throws JsonProcessingException {
        CrowdInfoResp resp1 = new CrowdInfoResp();
        resp1.setId(1647);
        resp1.setTouchPointType("METAACCOUNT20170117001");
        resp1.setCode("TB20170526005");

        CrowdInfoResp resp2 = new CrowdInfoResp();
        resp2.setId(1646);
        resp2.setTouchPointType("METAACCOUNT20170117001");
        resp2.setCode("TC20170526003");

        CrowdInfoResp resp3 = new CrowdInfoResp();
        resp3.setId(1588);
        resp3.setTouchPointType("METAACCOUNT20170117001");
        resp3.setCode("TC20170526003");

        ArrayList<CrowdInfoResp> crowdInfoResps = new ArrayList<>();
        crowdInfoResps.add(resp1);
        crowdInfoResps.add(resp2);
        crowdInfoResps.add(resp3);

        Definition definition = buildUnionDefinition(crowdInfoResps);
        String s = JsonUtil.toJson(definition);
        System.out.println("main:"+s);
    }
}