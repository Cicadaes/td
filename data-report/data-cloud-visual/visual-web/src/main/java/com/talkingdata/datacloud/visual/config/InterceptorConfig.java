package com.talkingdata.datacloud.visual.config;

import com.talkingdata.datacloud.visual.security.FactoryAuthenticationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Interceptor的总配置
 * Created by tend on 2017/7/21.
 */
@Configuration
public class InterceptorConfig extends WebMvcConfigurerAdapter {

    @Bean
    public FactoryAuthenticationInterceptor factoryAuthenticationInterceptor() {
        return new FactoryAuthenticationInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(factoryAuthenticationInterceptor())
                // 拦截工厂的所有project请求
                .addPathPatterns("/**/factory/projects/**")
                // 拦截工厂的所有datapipelines请求
                .addPathPatterns("/**/factory/datapipelines/**");
        super.addInterceptors(registry);
    }
}
