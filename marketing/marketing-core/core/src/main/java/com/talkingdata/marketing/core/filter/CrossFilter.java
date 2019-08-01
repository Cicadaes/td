package com.talkingdata.marketing.core.filter;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * The type Cross filter.
 * @author xiaoming.kang
 * @create 2017 -04-27-上午11:20
 * @since JDK 1.8
 */
@Configuration
public class CrossFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type,AC");
        //30 min
        response.addHeader("Access-Control-Max-Age", "1800");
        filterChain.doFilter(request, response);
    }
}
