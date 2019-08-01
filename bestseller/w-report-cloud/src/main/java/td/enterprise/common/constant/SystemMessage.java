package td.enterprise.common.constant;

/**
 * Created by Yan on 2017/3/6.
 */

import lombok.extern.slf4j.Slf4j;
import td.enterprise.common.exception.BusinessException;
import td.enterprise.common.exception.MessageCode;
import td.enterprise.constant.WifipixTaskConstant;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Slf4j
public enum SystemMessage {

    /**
     * ERROR 错误消息
     */
    E_DO_NOT_USE_ME(MessageCode.E0000, "E.do_not_use_me"),

    E_SYSTEM_MESSAGE_CODE_DUPLICATE(MessageCode.E1001, "E.common.messagecode_duplicate"),
    E_SUBMIT_CHECK_NAME(MessageCode.E9001, "E.web.submit_check_name"),
    E_SUBMIT_CHECK_CODE(MessageCode.E9002, "E.web.submit_check_code"),

    E_GET_CACHE_EL_KEY_DICTREE_ERROR(MessageCode.E9003, "E.datacloud.get_cache_el_key_dictree_error"),
    /**
     * WARN 警告消息
     */
    W_AZKABAN_TASK_EFFECTIVE(MessageCode.W8001, "W.task.azkaban_task_effective"),;
    /**
     * 消息号
     */
    private MessageCode messageCode;
    private String messageKey;

    SystemMessage(MessageCode messageCode, String messageKey) {
        this.messageCode = messageCode;
        this.messageKey = messageKey;
    }

    public MessageCode messageCode() {
        return messageCode;
    }


    /**
     * 消息国际化key 用于{@link td.enterprise.common.util.MessageHelper#getSystemMessage(String messageKey)}
     */
    public String messageKey() {
        return messageKey;
    }

    public static void main(String[] args) {
        try{
            SystemMessage.verifyDuplicateCode();
            log.info("SystemMessage verifyDuplicateCode success");
        }catch (Exception e){
            log.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    /**
     * 验证是否包含重复MessageCode
     *
     * @throws Exception
     */
    public static void verifyDuplicateCode() throws BusinessException {
        SystemMessage[] systemMessages = SystemMessage.values();
        List<SystemMessage> list = Arrays.asList(systemMessages);
        Set<String> codes = new HashSet<String>();
        StringBuffer sb = new StringBuffer();
        for (SystemMessage systemMessage : list) {
            if (codes.contains(systemMessage)) {
                sb.append(systemMessage);
            }
            codes.add(systemMessage.messageCode.name());
        }
        if (sb.length() > 0) {
            throw new BusinessException("DuplicateCode: " + sb.toString(),
                    SystemMessage.E_SYSTEM_MESSAGE_CODE_DUPLICATE);
        }
    }
}
