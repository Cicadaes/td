package td.enterprise.common.util;

/**
 * Created by Yan on 2017/3/6.
 */

import org.apache.log4j.Logger;
import td.enterprise.common.constant.SystemMessage;
import td.enterprise.common.exception.BusinessException;

import java.util.Map;


public class MessageHelper {

    private static Logger logger = Logger.getLogger(MessageHelper.class);

    private static Map<String, String> systemMessage = LoadPropertiesUtil.loadProperties("message_system.properties");

    public static String getSystemMessage(String messageKey) {
        return MessageHelper.systemMessage.get(messageKey);
    }

    public static String getSystemMessage(SystemMessage systemMessage) {
        String key = systemMessage.messageKey();
        return MessageHelper.systemMessage.get(key);
    }

    public static String getSystemMessage(BusinessException businessException) {
        return getSystemMessage(businessException.getSystemMessage());
    }

// e
}


