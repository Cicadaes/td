package com.talkingdata.marketing.web.exception;

import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagramException;
import com.talkingdata.marketing.core.exception.MktException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.*;

/**
 * @author chunyan.ji
 */
@ControllerAdvice
public class ExceptionTranslator {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionTranslator.class);

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity defaultErrorHandler(HttpServletRequest req, Exception e) throws Exception {
        logger.error("服务器内部错误: ", e);
        String[] errMsgArray = genErrorMsgArray("服务器内部错误");
        return new ResponseEntity<>(errMsgArray, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = PipelineDiagramException.class)
    public ResponseEntity pipelineDiagramHandler(HttpServletRequest req, Exception e) throws Exception {
        logger.error("PipelineDiagramException: ", e);
        return new ResponseEntity<>(getExceptionCause(e), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = MissingServletRequestParameterException.class)
    public ResponseEntity missParamHandler(HttpServletRequest req, Exception e) throws Exception {
        logger.error("缺少参数: ", e);
        String[] errMsgArray = genErrorMsgArray("缺少参数");
        return new ResponseEntity<>(errMsgArray, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = MethodArgumentTypeMismatchException.class)
    public ResponseEntity argMisHandler(HttpServletRequest req, Exception e) throws Exception {
        logger.error("参数类型不匹配: ", e);
        String[] errMsgArray = genErrorMsgArray("参数类型不匹配");
        return new ResponseEntity<>(errMsgArray, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = NumberFormatException.class)
    public ResponseEntity numFormatHandler(HttpServletRequest req, Exception e) throws Exception {
        logger.error("参数类型不匹配: ", e);
        String[] errMsgArray = genErrorMsgArray("参数类型不匹配");
        return new ResponseEntity<>(errMsgArray, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity modelArgNotValidHandler(HttpServletRequest req, MethodArgumentNotValidException e) throws Exception {
        logger.error("MethodArgumentNotValidException: ", e);
        List<ObjectError> allErrors = e.getBindingResult().getAllErrors();
        int size = allErrors.size();
        String[] errMsgArray = new String[size];
        for (int i = 0; i < size; i++) {
            errMsgArray[i] = allErrors.get(i).getDefaultMessage();
        }
        return new ResponseEntity<>(errMsgArray, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = ConstraintViolationException.class)
    public ResponseEntity methodArgNotValidHandler(HttpServletRequest req, ConstraintViolationException e) throws Exception {
        logger.error("ConstraintViolationException: ", e);
        Set<ConstraintViolation<?>> constraintViolations = e.getConstraintViolations();
        String errMsg = "";
        for (ConstraintViolation violation : constraintViolations) {
            errMsg += ("," + violation.getMessage());
        }
        String[] errMsgArray = genErrorMsgArray(errMsg.substring(1));
        return new ResponseEntity<>(errMsgArray, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity illegalArgumentExceptionHandler(HttpServletRequest req, IllegalArgumentException e) throws Exception {
        logger.error("IllegalArgumentException: ", e);
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = MktException.class)
    @ResponseBody
    public Map<String, Object> jsonErrorHandler(HttpServletRequest req, MktException e) throws Exception {
        Map<String, Object> result = new HashMap<>(16);
        result.put("retCode", e.getRetCode());
        result.put("msgDes", e.getMsgDes());
        return result;
    }

    private String[] genErrorMsgArray(String msg) {
        String[] errMsg = new String[1];
        errMsg[0] = msg;
        return errMsg;
    }

    private String getExceptionCause(Exception e) {
        return e.toString() + "\n" + "\t" + e.getCause().getMessage() + "\n";
    }
}
