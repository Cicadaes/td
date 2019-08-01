package marketing;

import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author hongsheng
 * @create 2017-11-17-下午5:41
 * @since JDK 1.8
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:marketing-core-spring-config.xml"})
public class BaseTest {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

}
