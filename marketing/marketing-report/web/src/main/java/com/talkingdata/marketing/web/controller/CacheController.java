package com.talkingdata.marketing.web.controller;

import com.talkingdata.marketing.core.commons.cache.MktEhcacheWrapper;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * Cache Rest server Api
 * @author hongsheng
 * @create 2017-09-07-下午4:33
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/cache")
public class CacheController {

    private static final Logger logger = LoggerFactory.getLogger(CacheController.class);

    @Autowired
    private MktEhcacheWrapper mktEhcacheWrapper;
    @Autowired
    private ExceptionBuilder exceptionBuilder;

    /**
     * 刷新部分缓存
     * @param cacheName
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "刷新部分缓存", notes = "刷新指定名称的缓存区")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "缓存区名称", name = "cacheName", paramType = "path", dataType = "string", required = true)
    })
    @RequestMapping(value = "/refresh/{cacheName}", method = PUT, consumes = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity refreshCache(String cacheName) throws Exception {
        boolean refresh = false;
        try {
            refresh = mktEhcacheWrapper.refreshCache(MktEhcacheWrapper.MktCacheNameEnum.parse(cacheName));
        } catch (Exception e) {
            logger.error("刷新部分缓存发生异常：", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.EHCACHE_REFRESH_FAIL);
        }
        String result = refresh == true ? "刷新成功" : "刷新失败";
        return new ResponseEntity(result, HttpStatus.OK);
    }

    /**
     * 刷新全部缓存
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "刷新全部缓存", notes = "刷新全部缓存区")
    @RequestMapping(value = "/refresh/full", method = PUT)
    @ResponseBody
    public ResponseEntity refreshCacheFull() throws Exception {
        boolean refresh = false;
        try {
            refresh = mktEhcacheWrapper.refreshCacheAll();
        } catch (Exception e) {
            logger.error("刷新全部缓存发生异常：", e);
            throw exceptionBuilder.buildMktException(ExceptionMessage.EHCACHE_REFRESH_FAIL);
        }
        String result = refresh == true ? "刷新成功" : "刷新失败";
        return new ResponseEntity(result, HttpStatus.OK);
    }
}
