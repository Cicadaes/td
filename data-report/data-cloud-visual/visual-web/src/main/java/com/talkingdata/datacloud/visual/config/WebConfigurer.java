package com.talkingdata.datacloud.visual.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * Created by Yan on 2017/3/2.
 */
@Configuration
@Slf4j
public class WebConfigurer implements ServletContextInitializer {
    @Value("${appcode}")
    public String appCode;
    @Value("${apptaken}")
    public String appTaken;
    @Value("${menu}")
    public String menu;
    @Value("${button}")
    public String button;
    @Value("${typeList}")
    public String typeList;
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        log.info("Web application fully configured");
    }


    @Bean(name = "menuFilter")
    public Filter menuFilter() {
        return new MenuFilter();
    }

    @Bean
    public FilterRegistrationBean someFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(menuFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("appcode", appCode);
        registration.addInitParameter("apptaken", appTaken);
        registration.addInitParameter("menu", menu);
        registration.addInitParameter("button", button);
        registration.addInitParameter("typeList", typeList);
        registration.setName("menuFilter");
        registration.setOrder(10);
        return registration;
    }

    @Bean(name = "urlRewriteFilter")
    public Filter urlRewriteFilter() {
        return new UrlRewriteFilter();
    }

    @Bean
    public FilterRegistrationBean urlRewriteFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(urlRewriteFilter());
        registration.addUrlPatterns("/*");
        registration.setName("urlRewriteFilter");
        registration.setDispatcherTypes(DispatcherType.REQUEST,DispatcherType.FORWARD);
        registration.setOrder(1);
        return registration;
    }
//    @Bean(name = "authExcludeFilter")
//    public Filter authExcludeFilter() {
//        return new AuthExcludeUrlFilter();
//    }
//
//    @Bean
//    public FilterRegistrationBean authExcludeFilterRegistration() {
//        FilterRegistrationBean registration = new FilterRegistrationBean();
//        registration.setFilter(authExcludeFilter());
//        registration.addUrlPatterns("/*");
//        registration.setName("authExcludeFilter");
//        registration.setOrder(2);
//        return registration;
//    }
}
