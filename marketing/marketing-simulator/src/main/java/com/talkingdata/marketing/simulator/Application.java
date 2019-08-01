package com.talkingdata.marketing.simulator;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.net.UnknownHostException;

@SpringBootApplication
@Slf4j
public class Application {

    public static void main(String[] args) throws UnknownHostException {

        SpringApplication app = new SpringApplication(Application.class);
        ConfigurableApplicationContext context = app.run(args);
    }
}
