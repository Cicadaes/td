package com.talkingdata.marketing.web.conf;

import com.talkingdata.marketing.web.security.*;
import org.jasig.cas.client.validation.Cas20ServiceTicketValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAssertionAuthenticationToken;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.inject.Inject;

/**
 * @author chunyan.ji
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String CAS_URL_LOGIN = "sso.client.casServerLoginUrl";
    private static final String CAS_URL_LOGOUT = "sso.client.casServerLogoutUrl";
    private static final String CAS_URL_PREFIX = "sso.client.casServer";
    private static final String CAS_SERVICE_URL = "sso.client.security";
    private static final String APP_SERVICE_HOME = "sso.client.serverName";
    private static final String CAS_ENABLE = "sso.client.enable";

    @Inject
    private Environment env;

    @Inject
    private AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler;

    @Inject
    private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;

    @Inject
    private AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler;

    @Bean
    public AuthenticationUserDetailsService<CasAssertionAuthenticationToken> customUserDetailsService() {
        return new UserDetailsServiceImpl();
    }

    @Bean
    public ServiceProperties serviceProperties() {
        ServiceProperties sp = new ServiceProperties();
        sp.setService(env.getRequiredProperty(CAS_SERVICE_URL));
        sp.setSendRenew(false);
        return sp;
    }

    @Bean
    public RememberCasAuthenticationProvider casAuthenticationProvider() {
        RememberCasAuthenticationProvider casAuthenticationProvider = new RememberCasAuthenticationProvider();
        casAuthenticationProvider.setAuthenticationUserDetailsService(customUserDetailsService());
        casAuthenticationProvider.setServiceProperties(serviceProperties());
        casAuthenticationProvider.setTicketValidator(cas20ServiceTicketValidator());
        casAuthenticationProvider.setKey("an_id_for_this_auth_provider_only");
        return casAuthenticationProvider;
    }

    @Bean
    public SessionAuthenticationStrategy sessionStrategy() {
        SessionFixationProtectionStrategy sessionStrategy = new CustomSessionFixationProtectionStrategy();
        sessionStrategy.setMigrateSessionAttributes(false);
        return sessionStrategy;
    }


    @Bean
    public Cas20ServiceTicketValidator cas20ServiceTicketValidator() {
        return new Cas20ServiceTicketValidator(env.getRequiredProperty(CAS_URL_PREFIX));
    }

    @Bean
    public CasAuthenticationFilter casAuthenticationFilter() throws Exception {
        CasAuthenticationFilter casAuthenticationFilter = new CasAuthenticationFilter();
        casAuthenticationFilter.setAuthenticationManager(authenticationManager());
        casAuthenticationFilter.setAuthenticationDetailsSource(new RememberWebAuthenticationDetailsSource());
        casAuthenticationFilter.setSessionAuthenticationStrategy(sessionStrategy());
        casAuthenticationFilter.setAuthenticationFailureHandler(ajaxAuthenticationFailureHandler);
        casAuthenticationFilter.setAuthenticationSuccessHandler(ajaxAuthenticationSuccessHandler);
        return casAuthenticationFilter;
    }

    @Bean
    public RememberCasAuthenticationEntryPoint casAuthenticationEntryPoint() {
        RememberCasAuthenticationEntryPoint casAuthenticationEntryPoint = new RememberCasAuthenticationEntryPoint();
        casAuthenticationEntryPoint.setLoginUrl(env.getRequiredProperty(CAS_URL_LOGIN));
        casAuthenticationEntryPoint.setServiceProperties(serviceProperties());
        casAuthenticationEntryPoint.setPathLogin("/api/login");
        return casAuthenticationEntryPoint;
    }

    @Bean
    public CustomSingleSignOutFilter singleSignOutFilter() {
        CustomSingleSignOutFilter singleSignOutFilter = new CustomSingleSignOutFilter();
        singleSignOutFilter.setCasServerUrlPrefix(env.getRequiredProperty(CAS_URL_PREFIX));
        return singleSignOutFilter;
    }

    @Bean
    public LogoutFilter requestCasGlobalLogoutFilter() {
        LogoutFilter logoutFilter = new LogoutFilter(env.getRequiredProperty(CAS_URL_LOGOUT) + "?service="
                + env.getRequiredProperty(APP_SERVICE_HOME), new SecurityContextLogoutHandler());
        logoutFilter.setLogoutRequestMatcher(new AntPathRequestMatcher("/api/logout", "POST"));
        return logoutFilter;
    }

    @Inject
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(casAuthenticationProvider());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web
                .ignoring()
                .antMatchers("/webjars/springfox-swagger-ui/**/*.{js,html,css}")
                .antMatchers("/druid2/**/*.{js,html,css}")
                .antMatchers("/swagger-ui.html")
                .antMatchers("/index.html")
                .antMatchers("/app.js")
                .antMatchers("/css/**")
                .antMatchers("/data/**")
                .antMatchers("/libs/**")
                .antMatchers("/html/**")
                .antMatchers("/images/**")
                .antMatchers("/app/**")
                .antMatchers("/i18n/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        if (Boolean.parseBoolean(env.getRequiredProperty(CAS_ENABLE))){
            http
                    .csrf().disable()
                    .addFilterBefore(casAuthenticationFilter(), BasicAuthenticationFilter.class)
                    .addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class)
                    .addFilterBefore(requestCasGlobalLogoutFilter(), LogoutFilter.class)
                    .exceptionHandling()
                    .authenticationEntryPoint(casAuthenticationEntryPoint())

                    .and()
                    .headers().frameOptions().disable()
                    .and()
                    .authorizeRequests()
                    .antMatchers("/v2/api-docs/**").permitAll()
                    .antMatchers("/druid2/**").permitAll()
                    .antMatchers("/swagger-resources/**").permitAll()
                    .antMatchers("/test/**").permitAll()
                    .antMatchers("/cas").permitAll()
                    .antMatchers("/diplomacy/**").permitAll()
                    .antMatchers("/**").authenticated()

                    .and()
                    .logout()
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler(ajaxLogoutSuccessHandler)
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                    .permitAll();
        }else{
            http
                    .csrf().disable()
                    .addFilterBefore(casAuthenticationFilter(), BasicAuthenticationFilter.class)
                    .addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class)
                    .addFilterBefore(requestCasGlobalLogoutFilter(), LogoutFilter.class)
                    .exceptionHandling()
                    .authenticationEntryPoint(casAuthenticationEntryPoint())

                    .and()
                    .headers().frameOptions().disable()
                    .and()
                    .authorizeRequests()
                    .antMatchers("/v2/api-docs/**").permitAll()
                    .antMatchers("/druid2/**").permitAll()
                    .antMatchers("/swagger-resources/**").permitAll()
                    .antMatchers("/test/**").permitAll()
                    .antMatchers("/cas").permitAll()
                    .antMatchers("/**").permitAll()

                    .and()
                    .logout()
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler(ajaxLogoutSuccessHandler)
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                    .permitAll();
        }
    }
}
