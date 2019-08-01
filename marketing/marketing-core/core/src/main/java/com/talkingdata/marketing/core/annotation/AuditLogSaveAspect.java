package com.talkingdata.marketing.core.annotation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.constant.SessionConstants;
import com.talkingdata.marketing.core.entity.dto.AuditLogDto;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.tendcloud.enterprise.um.umic.entity.User;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.ClassUtils;
import org.apache.commons.lang.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author xiaoming.kang
 * @date 2018/01/18
 */

@Aspect
@Component
public class AuditLogSaveAspect {

    ExpressionParser parser = new SpelExpressionParser();
    LocalVariableTableParameterNameDiscoverer discoverer = new LocalVariableTableParameterNameDiscoverer();

    @Autowired
    private ConfigApi configApi;

    private final String SUCCESS ="success";
    private final String ERROR = "error";
    private final String RETURN_TYPE_VOID = "void";


    private static final Logger logger = LoggerFactory.getLogger(AuditLogSaveAspect.class);

    @Around(value = "@annotation(auditLogSave)")
    public Object auditLogSave(final ProceedingJoinPoint joinPoint,AuditLogSave auditLogSave) throws Throwable {
        AuditLogDto dto = new AuditLogDto();
        Object[] args = joinPoint.getArgs();
        //获取request
        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        User user = (User) req.getSession().getAttribute(SessionConstants.SESSION_USER);
        if(null != user) {
            dto.setActorUmId(user.getUmid());
            dto.setActorName(user.getUserName());
        }
        dto.setOperationType(auditLogSave.opType().name());
        dto.setTargetType(auditLogSave.targetType().name());

        MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();
        Method targetMethod = methodSignature.getMethod();

        //设置targetId
        if(StringUtils.isNotBlank(auditLogSave.targetId())){
            String spel = auditLogSave.targetId();
            String[] params = discoverer.getParameterNames(targetMethod);
            EvaluationContext context = new StandardEvaluationContext();
            for (int i = 0; i < params.length; i++) {
                context.setVariable(params[i], args[i]);
            }
            Expression expression = parser.parseExpression(spel);
            dto.setTargetId(String.valueOf(expression.getValue(context,Integer.class)));
        }


        dto.setResult(ERROR);
        //根据期望返回类型判断结果.并且设置设置targetId
        Object result = null;
        try{
            result = joinPoint.proceed();
        }catch(Exception exception){
            dto.setDescription(JsonUtil.toJson(exception));
            configApi.saveAuditLog(dto);
            throw exception;
        }

        Class expectType = targetMethod.getReturnType();
        if(RETURN_TYPE_VOID.equals(expectType.getName())){
            if(null == result){
                dto.setResult(SUCCESS);
                buildDescriptionFromArgs(dto, args);
            }else{
                dto.setDescription(JsonUtil.toJson(result));
            }
        }else{//成功的情况
            if(null != result && ClassUtils.primitiveToWrapper(result.getClass()).equals(ClassUtils.primitiveToWrapper(expectType))){
                dto.setResult(SUCCESS);
                buildDescriptionFromArgs(dto, args,true);
                if(StringUtils.isBlank(dto.getDescription())){
                    dto.setDescription(JsonUtil.toJson(result));
                }
                if(StringUtils.isBlank(dto.getTargetId())) {
                    buildTargetIdFromResult(dto, result);
                }
                if(StringUtils.isBlank(dto.getTargetId())){
                    buildTargetIdFromArgs(dto, args,auditLogSave.targetType().name());
                }
            }else{//失败的情况
                if(null == result){
                    //把参数放到description
                    buildDescriptionFromArgs(dto, args);
                }else{
                    dto.setDescription(JsonUtil.toJson(result));
                }
            }
        }
        configApi.saveAuditLog(dto);
        return result;
    }

    private void buildTargetIdFromResult(AuditLogDto dto, Object result) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Class resultClass = result.getClass();
        try {
            Object obj = result;
            if(result instanceof ResponseEntity) {
                obj = ((ResponseEntity) result).getBody();
            }
            Method idMethod = obj.getClass().getMethod("getId");
            Object idresult = idMethod.invoke(obj);
            if (null != idresult) {
                dto.setTargetId(String.valueOf(idresult));
            }
        }catch (Exception e){
            logger.info("返回值没有找到getId方法.");
        }
    }

    private void buildDescriptionFromArgs(AuditLogDto dto, Object[] args) throws JsonProcessingException {
        buildDescriptionFromArgs(dto,args,false);
    }

    private void buildDescriptionFromArgs(AuditLogDto dto, Object[] args,boolean ignoreSimpleType) throws JsonProcessingException {
        List<Object> simpleValueList = new ArrayList<>();
        for(Object obj : args){
            if(obj instanceof HttpServletRequest ||obj instanceof HttpServletResponse || obj instanceof MultipartFile){
                continue;
            }else if(BeanUtils.isSimpleValueType(obj.getClass())){
                simpleValueList.add(obj);
            }else{
                try {
                    Map<String, Object> descMap = transBean2Map(obj);
                    descMap.remove("pager");
                    dto.setDescription(JsonUtil.toJson(descMap));
                }catch (Exception e){
                }
            }
        }
        if(!ignoreSimpleType && StringUtils.isBlank(dto.getDescription()) && CollectionUtils.isNotEmpty(simpleValueList)){
            dto.setDescription(JsonUtil.toJson(simpleValueList.get(0)));
        }
    }


    public static Map<String, Object> transBean2Map(Object obj) throws Exception {
        if (obj == null) {
            return null;
        } else {
            Map<String, Object> map = new HashMap(30);
            BeanInfo beanInfo = Introspector.getBeanInfo(obj.getClass());
            PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
            PropertyDescriptor[] arr = propertyDescriptors;
            int len = propertyDescriptors.length;

            for(int i = 0; i < len; ++i) {
                PropertyDescriptor property = arr[i];
                String key = property.getName();
                if (!"class".equals(key)) {
                    Method getter = property.getReadMethod();
                    Object value = getter.invoke(obj);
                    if (value != null && value.toString().length() > 0) {
                        map.put(key, value.toString());
                    }
                }
            }

            return map;
        }
    }

    private void buildTargetIdFromArgs(AuditLogDto dto, Object[] args,String targetTypeName) {
        for(Object arg : args){
            try {
                if(StringUtils.containsIgnoreCase(arg.getClass().getName(),targetTypeName)){
                    buildTargetIdFromResult(dto, arg);
                }
            }catch (Exception e){
                continue;
            }
            if(StringUtils.isNotBlank(dto.getTargetId())){
                break;
            }
        }
    }
}
