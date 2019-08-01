package com.talkingdata.datacloud.visual.config;

import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.visual.util.UserInfoUtil;
import java.lang.reflect.Method;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

@Component
public class DatareportKeyGenerator implements KeyGenerator {

  @Override
  public Object generate(Object target, Method method, Object... params) {
    QueryParameter key = (QueryParameter) params[0];
    key.setTenantId(UserInfoUtil.getCurrentTenantId());
    return key;
  }

}