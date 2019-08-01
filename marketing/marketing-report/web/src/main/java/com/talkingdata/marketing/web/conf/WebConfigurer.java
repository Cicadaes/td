package com.talkingdata.marketing.web.conf;

import com.talkingdata.marketing.web.filter.MenuFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * @author Yan
 * Created by Yan on 2017/3/2.
 */
@Configuration
public class WebConfigurer implements ServletContextInitializer {
    private static final Logger logger = LoggerFactory.getLogger(WebConfigurer.class);
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        logger.info("Web application fully configured");
    }

    @Inject
    private Environment env;


    @Bean(name = "menuFilter")
    public Filter menuFilter() {
        return new MenuFilter();
    }

    @Bean
    public FilterRegistrationBean someFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(menuFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("appcode", env.getRequiredProperty("appcode"));
        registration.addInitParameter("apptaken", env.getRequiredProperty("apptaken"));
        registration.addInitParameter("menu", env.getRequiredProperty("menu"));
        registration.addInitParameter("button", env.getRequiredProperty("button"));

        registration.setName("menuFilter");
        registration.setOrder(10);
        return registration;
    }

}
