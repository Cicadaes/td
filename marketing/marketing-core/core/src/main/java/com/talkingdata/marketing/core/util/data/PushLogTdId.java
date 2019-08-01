package com.talkingdata.marketing.core.util.data;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.annotation.Order;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * The type Push log td id.
 *
 * @author hongsheng
 * @create 2017 -06-06-下午7:48
 * @since JDK 1.8
 */
@Lazy(false)
@Order(value = 1)
public class PushLogTdId {

    private static final Logger logger = LoggerFactory.getLogger(PushLogTdId.class);

	/**
	 * The constant TD_ID.
	 */
	public static final List<String> TD_ID = new ArrayList<>();

    static {
        logger.info("初始化TD_ID数据，开始");
        try (
            InputStream stream = PushLogTdId.class.getClassLoader().getResourceAsStream("td_id_data.txt");
            BufferedReader bReader = new BufferedReader(new InputStreamReader(stream));
        ){
            String result;
            while ((result = bReader.readLine()) != null) {
                TD_ID.add(result);
            }
        } catch (Exception e) {
            logger.info("初始化TD_ID数据发生异常", e);
        }
        logger.info("初始化TD_ID数据，结束");
    }
}
