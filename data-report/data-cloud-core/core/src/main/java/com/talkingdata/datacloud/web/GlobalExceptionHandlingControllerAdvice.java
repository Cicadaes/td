package com.talkingdata.datacloud.web;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.talkingdata.datacloud.exception.DatapipelineException;
import com.talkingdata.datacloud.exception.DatapipelineRuntimeException;
import com.talkingdata.datacloud.exception.FormException;
import com.talkingdata.datacloud.exception.OperatorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandlingControllerAdvice {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandlingControllerAdvice.class);

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /* . . . . . . . . . . . . . EXCEPTION HANDLERS. . . . . . . . . . . . . . */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public Object handleException(HttpServletRequest req, Exception exception)
            throws Exception {
        // Re-throw annotated exceptions or they will be processed here instead.
        if (AnnotationUtils.findAnnotation(exception.getClass(), ResponseStatus.class) != null) {
            throw exception;
        }
        if(exception instanceof DatapipelineException){
            DatapipelineException datapipelineException = (DatapipelineException) exception;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("status","failure");
            jsonObject.put("nodeId",datapipelineException.getNodeId());
            jsonObject.put("parameterName",datapipelineException.getParameterName());
            jsonObject.put("message",datapipelineException.getErrorMessage());
            return jsonObject;
        }
        if(exception instanceof OperatorException){
            OperatorException operatorException = (OperatorException) exception;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("status","failure");
            jsonObject.put("message",operatorException.getErrorMessage());
            return jsonObject;
        }
        if(exception instanceof FormException){
            FormException formException = (FormException)exception;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("status","failure");
            jsonObject.put("message",formException.getMessage());
            jsonObject.put("field",formException.getErrorField());
            return jsonObject;
        }
        if(exception instanceof IllegalArgumentException){
            IllegalArgumentException argumentException = (IllegalArgumentException)exception;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("status","failure");
            jsonObject.put("message",argumentException.getMessage());
            return jsonObject;
        }
        if(exception instanceof DatapipelineRuntimeException){
            DatapipelineRuntimeException argumentException = (DatapipelineRuntimeException)exception;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("status","failure");
            jsonObject.put("message",argumentException.getMessage());
            return jsonObject;
        }
        logger.error("Request: " + req.getRequestURI() + " raised exception", exception);
        return exception.getMessage();
    }

}
