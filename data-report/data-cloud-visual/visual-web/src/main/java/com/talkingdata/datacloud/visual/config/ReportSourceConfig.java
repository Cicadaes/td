package com.talkingdata.datacloud.visual.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.talkingdata.datacloud.visual.dao.report",sqlSessionFactoryRef="reportSqlSessionFactory")
public class ReportSourceConfig {

    @Bean(name = "reportDataSource")
    @ConfigurationProperties(prefix="spring.datasource.report")
    public DataSource dataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean(name="reportSqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        sessionFactory.setConfigLocation(new ClassPathResource("com/talkingdata/datacloud/visual/mybatis-config.xml"));
        sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver()
                .getResources("classpath:com/talkingdata/datacloud/visual/mapper/report/*.xml"));

        return sessionFactory.getObject();
    }
}