package td.enterprise.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import td.enterprise.security.AjaxAuthenticationFailureHandler;
import td.enterprise.security.AjaxLogoutSuccessHandler;
import td.enterprise.security.saas.AjaxSaasAuthenticationSuccessHandler;
import td.enterprise.security.saas.Http401UnauthorizedEntryPoint;
import td.enterprise.security.saas.TDAuthenticationProvider;

import javax.inject.Inject;

@Configuration
@EnableWebSecurity
@Profile(Constants.SPRING_PROFILE_SAAS)
public class SaasSecurityConfiguration extends WebSecurityConfigurerAdapter {


    @Inject
    private Environment env;

    @Inject
    private AjaxSaasAuthenticationSuccessHandler ajaxSaasAuthenticationSuccessHandler;

    @Inject
    private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;

    @Inject
    private AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler;

    @Inject
    private Http401UnauthorizedEntryPoint authenticationEntryPoint;

    @Inject
    private TDAuthenticationProvider tdAuthenticationProvider;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .authenticationProvider(this.tdAuthenticationProvider);
    }


    @Override
    public void configure(WebSecurity web) throws Exception {
        web
                .ignoring()
                .antMatchers("/webjars/springfox-swagger-ui/**/*.{js,html,css}")
                .antMatchers("/druid2/**/*.{js,html,css}")
                .antMatchers("/swagger-ui.html")
                .antMatchers("/index.html")
                .antMatchers("/loginSaas.html")
                .antMatchers("/loginSaas/**")
                .antMatchers("/loginSaas/images/**")
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
        http
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)
            .and()
                .headers().frameOptions().disable()

            .and().formLogin()
                .loginProcessingUrl("/api/authentication")
                .permitAll()
                .successHandler(ajaxSaasAuthenticationSuccessHandler)
                .failureHandler(ajaxAuthenticationFailureHandler)
            .and()
                .authorizeRequests()
                .antMatchers("/v2/api-docs/**").permitAll()
                .antMatchers("/druid2/**").permitAll()
                .antMatchers("/swagger-resources/**").permitAll()
                .antMatchers("/test/**").permitAll()
                .antMatchers("/api/parameters").permitAll()
                .antMatchers("/**").authenticated()
            .and()
                .logout()
                .logoutUrl("/api/logout")
                .logoutSuccessHandler(ajaxLogoutSuccessHandler)
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll();
    }
}
