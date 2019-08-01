package td.enterprise.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import td.enterprise.web.filter.MenuFilter;

import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * Created by Yan on 2017/3/2.
 */
@Configuration
@Slf4j
public class WebConfigurer implements ServletContextInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        log.info("Web application fully configured");
    }

    @Inject
    private Environment env;


    @Bean(name = "menuFilter")
    public Filter menuFilter() {
        return new MenuFilter();
    }

    @Bean
    public FilterRegistrationBean menuFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(menuFilter());
        registration.addUrlPatterns("/api/*");
        registration.addInitParameter("appcode", env.getRequiredProperty("appcode"));
        registration.addInitParameter("apptaken", env.getRequiredProperty("apptaken"));
        registration.addInitParameter("menu", env.getRequiredProperty("menu"));
        registration.addInitParameter("button", env.getRequiredProperty("button"));

        registration.setName("menuFilter");
        registration.setOrder(10);
        return registration;
    }
}
