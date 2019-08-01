package com.talkingdata.marketing.core.datasource;


import com.alibaba.druid.pool.DruidDataSourceFactory;
import java.util.Properties;
import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

/**
 * 数据库配置类
 * @author tao.yang
 */
@Configuration
@MapperScan(basePackages = "com.talkingdata.marketing.core.dao",sqlSessionTemplateRef = "marketingSqlSessionTemplate")
public class DataSourceMarketingConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceMarketingConfig.class);
    @Autowired
    private Environment environment;

    /**
     * Marketing data source data source.
     *
     * @return the data source
     * @throws Exception the exception
     */
    @Bean(name = "marketingDataSource")
    @Primary
    public DataSource marketingDataSource() throws Exception {
        Properties properties = new Properties();
        properties.put("driverClassName", environment.getProperty("spring.datasource.marketing.driverClassName"));
        properties.put("url", environment.getProperty("spring.datasource.marketing.url"));
        properties.put("username", environment.getProperty("spring.datasource.marketing.username"));
        properties.put("password", environment.getProperty("spring.datasource.marketing.password"));
        properties.put("filters", environment.getProperty("spring.datasource.marketing.filters"));
        properties.put("maxActive", environment.getProperty("spring.datasource.marketing.maxActive"));
        properties.put("initialSize", environment.getProperty("spring.datasource.marketing.initialSize"));
        properties.put("maxWait", environment.getProperty("spring.datasource.marketing.maxWait"));
        properties.put("minIdle", environment.getProperty("spring.datasource.marketing.minIdle"));
        properties.put("timeBetweenEvictionRunsMillis", environment.getProperty("spring.datasource.marketing.timeBetweenEvictionRunsMillis"));
        properties.put("minEvictableIdleTimeMillis", environment.getProperty("spring.datasource.marketing.minEvictableIdleTimeMillis"));
        properties.put("validationQuery", environment.getProperty("spring.datasource.marketing.validationQuery"));
        properties.put("testWhileIdle", environment.getProperty("spring.datasource.marketing.testWhileIdle"));
        properties.put("testOnBorrow", environment.getProperty("spring.datasource.marketing.testOnBorrow"));
        properties.put("testOnReturn", environment.getProperty("spring.datasource.marketing.testOnReturn"));
        properties.put("poolPreparedStatements", environment.getProperty("spring.datasource.marketing.poolPreparedStatements"));
        properties.put("maxOpenPreparedStatements", environment.getProperty("spring.datasource.marketing.maxOpenPreparedStatements"));
        logger.info("primaryDataSource config is [{}]", properties.toString());
        return DruidDataSourceFactory.createDataSource(properties);
    }

    /**
     * Marketing sql session factory sql session factory.
     *
     * @param dataSource the data source
     * @return the sql session factory
     * @throws Exception the exception
     */
    @Bean(name = "marketingSqlSessionFactory")
    @Primary
    public SqlSessionFactory marketingSqlSessionFactory(@Qualifier("marketingDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setTypeAliasesPackage(environment.getProperty("mybatis.type-aliases-package"));
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/mapper/*/*.xml"));
        return bean.getObject();
    }

    /**
     * Marketing transaction manager data source transaction manager.
     *
     * @param dataSource the data source
     * @return the data source transaction manager
     */
    @Bean(name = "marketingTransactionManager")
    @Primary
    public DataSourceTransactionManager marketingTransactionManager(@Qualifier("marketingDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    /**
     * Marketing sql session template sql session template.
     *
     * @param sqlSessionFactory the sql session factory
     * @return the sql session template
     * @throws Exception the exception
     */
    @Bean(name = "marketingSqlSessionTemplate")
    @Primary
    public SqlSessionTemplate marketingSqlSessionTemplate(@Qualifier("marketingSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}