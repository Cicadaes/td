package com.talkingdata.marketing.core.exception;

import java.util.Locale;
import javax.annotation.Resource;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

/**
 * The type Exception builder.
 * @author xiaoming.kang
 */
@Component
public class ExceptionBuilder {

    @Resource
    private MessageSource messageSource;

    /**
     * Build mkt exception mkt exception.
     *
     * @param exceptionMessage the exception message
     * @param param            the param
     * @return the mkt exception
     */
    public MktException buildMktException(ExceptionMessage exceptionMessage, Object... param) {
        String codeStr = String.valueOf(exceptionMessage.getCode());
        String val = getMessage(codeStr, param, "");
        return new MktException(exceptionMessage.getCode(), val);
    }

    /**
     * Gets message.
     *
     * @param exceptionMessage the exception message
     * @param param            the param
     * @return the message
     */
    public String getMessage(ExceptionMessage exceptionMessage, Object... param) {
        String codeStr = String.valueOf(exceptionMessage.getCode());
        return getMessage(codeStr, param, "");
    }

    /**
     * Get message string.
     *
     * @param key            ：对应messages配置的key.
     * @param args           : 数组参数.
     * @param defaultMessage : 没有设置key的时候的默认值.
     * @return string
     */
    public String getMessage(String key,Object[] args,String defaultMessage){
        return messageSource.getMessage(key, args, defaultMessage, new Locale("zh"));
    }
}
