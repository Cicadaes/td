package td.enterprise.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.aop.interceptor.SimpleAsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import td.enterprise.async.ExceptionHandlingAsyncTaskExecutor;

import javax.inject.Inject;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfiguration implements AsyncConfigurer {

    private final Logger log = LoggerFactory.getLogger(AsyncConfiguration.class);

    @Inject
    private Environment env;

    private static String ASYNC_COREPOOLSIZE = "async.corePoolSize";
    private static String ASYNC_MAXPOOLSIZE= "async.maxPoolSize";
    private static String ASYNC_QUEUECAPACITY = "async.queueCapacity";

    @Override
    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        log.debug("Creating Async Task Executor");
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(Integer.parseInt(env.getRequiredProperty(ASYNC_COREPOOLSIZE)));
        executor.setMaxPoolSize(Integer.parseInt(env.getRequiredProperty(ASYNC_MAXPOOLSIZE)));
        executor.setQueueCapacity(Integer.parseInt(env.getRequiredProperty(ASYNC_QUEUECAPACITY)));
        executor.setThreadNamePrefix("KeYuan-Executor-");
        return new ExceptionHandlingAsyncTaskExecutor(executor);
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new SimpleAsyncUncaughtExceptionHandler();
    }
}
