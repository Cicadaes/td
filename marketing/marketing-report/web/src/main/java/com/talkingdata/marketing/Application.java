package com.talkingdata.marketing;

import com.talkingdata.marketing.core.task.JobEntrance;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author chunyan.ji
 */
@SpringBootApplication
@EnableScheduling
@EnableCaching
@Slf4j
public class Application {

    public static void main(String[] args) throws UnknownHostException {

        SpringApplication app = new SpringApplication(Application.class);
        ConfigurableApplicationContext context = app.run(args);
        SpringContextUtil.setApplicationContext(context);
        JobEntrance jobEntrance = (JobEntrance)SpringContextUtil.getBean("jobEntrance");
        jobEntrance.execute();

        Environment env = context.getEnvironment();
        log.info("\n----------------------------------------------------------\n\t" +
                        "Application '{}' is running! Access URLs:\n\t" +
                        "Local: \t\thttp://localhost:{}{}\n\t" +
                        "External: \thttp://{}:{}{}\n----------------------------------------------------------",
                env.getProperty("spring.application.name"),
                env.getProperty("server.port"),
                env.getProperty("server.context-path"),
                InetAddress.getLocalHost().getHostAddress(),
                env.getProperty("server.port"),
                env.getProperty("server.context-path"));
    }
}
