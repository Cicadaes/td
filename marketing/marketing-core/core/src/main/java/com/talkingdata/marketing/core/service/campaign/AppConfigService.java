package com.talkingdata.marketing.core.service.campaign;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.AppConfigConstants;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.dao.campaign.AppConfigDao;
import com.talkingdata.marketing.core.entity.campaign.AppAndroidChannelConfig;
import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import com.talkingdata.marketing.core.entity.campaign.AppIosChannelConfig;
import com.talkingdata.marketing.core.entity.dto.AppConfDto;
import com.talkingdata.marketing.core.entity.thirdmodel.push.AppConfReq;
import com.talkingdata.marketing.core.entity.thirdmodel.push.ProductSyncReq;
import com.talkingdata.marketing.core.entity.thirdmodel.push.UploadPemResp;
import com.talkingdata.marketing.core.middleware.AppConfApi;
import com.talkingdata.marketing.core.page.campaign.AppConfigPage;
import com.talkingdata.marketing.core.util.DateUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_APP_CONFIG AppConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppConfigService extends BaseService<AppConfig, Integer> {
    private static final String EXPIRY_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final Logger logger = LoggerFactory.getLogger(AppConfigService.class);

    @Autowired private AppConfigDao dao;

    @Autowired private AppConfApi appConfApi;
    @Autowired AppIosChannelConfigService appIosChannelConfigService;
    @Autowired AppAndroidChannelConfigService appAndroidChannelConfigService;

    @Override public AppConfigDao getDao() {
        return dao;
    }

    public UploadPemResp uploadPem(MultipartFile file, String pwd, String appId, int prod) throws Exception {
        UploadPemResp uploadPemResp = new UploadPemResp();
        uploadPemResp.setEt(DateUtil.date2String(EXPIRY_DATE_FORMAT, new Date()));
        uploadPemResp.setDesc("ok");
        /**
         * 没有推送服务，暂时注释
         */
        //        try {
        //            uploadPemResp = appConfApi.uploadPem(pwd, file, appId, prod);
        //            if (!"ok".equals(uploadPemResp.getDesc())) {
        //                return uploadPemResp;
        //            }
        //        } catch (Exception e) {
        //            logger.info("sync ios cert to gateway err:{}",e);
        //            uploadPemResp = new UploadPemResp();
        //            uploadPemResp.setDesc("向推送系统同步ios证书报错");
        //            return uploadPemResp;
        //        }

        AppConfig appConfig = getDao().getByAppId(appId);
        AppIosChannelConfig appIosChannelConfig = new AppIosChannelConfig();
        appIosChannelConfig.setAppConfigId(appConfig.getId());
        appConfig.setAppId(appId);
        if (prod == 0) {
            appIosChannelConfig.setDevFileName(file.getOriginalFilename());
            if (!StringUtils.isEmpty(uploadPemResp.getEt())) {
                appIosChannelConfig.setDevExpiryDate(DateUtil.string2Date(EXPIRY_DATE_FORMAT, uploadPemResp.getEt()));
            }
            appIosChannelConfig.setDevPem(file.getBytes());
        } else {
            appIosChannelConfig.setProdFileName(file.getOriginalFilename());
            if (!StringUtils.isEmpty(uploadPemResp.getEt())) {
                appIosChannelConfig.setProdExpiryDate(DateUtil.string2Date(EXPIRY_DATE_FORMAT, uploadPemResp.getEt()));
            }
            appIosChannelConfig.setProdPem(file.getBytes());
        }
        appIosChannelConfigService.insertOrUpdate(appIosChannelConfig);
        return uploadPemResp;
    }

    public void emptyGetuiJpushConfig(String appId, Integer channel) throws Exception {
        AppConfig appConfig = getDao().getByAppId(appId);
        if (channel == AppConfigConstants.PUSH_THIRD_GETUI) {
            AppAndroidChannelConfig appAndroidChannelConfig = appAndroidChannelConfigService.getByAppConfigIdAndChannel(appConfig.getId(), "getui");
            if (appAndroidChannelConfig != null) {
                appAndroidChannelConfig.setThirdAppId("");
                appAndroidChannelConfig.setKey("");
                appAndroidChannelConfig.setSecret("");
                appAndroidChannelConfigService.updateByPrimaryKeySelective(appAndroidChannelConfig);
            }
        } else if (channel == AppConfigConstants.PUSH_THIRD_JPUSH) {
            AppAndroidChannelConfig appAndroidChannelConfig = appAndroidChannelConfigService.getByAppConfigIdAndChannel(appConfig.getId(), "jiguang");
            if (appAndroidChannelConfig != null) {
                appAndroidChannelConfig.setKey("");
                appAndroidChannelConfig.setSecret("");
                appAndroidChannelConfigService.updateByPrimaryKeySelective(appAndroidChannelConfig);
            }
        }
    }

    public String thirdChannelConfigure(AppConfReq req) {
        String success = "success";
        String ok = "ok";
        try {
            String desc = appConfApi.updateChannelConf(req);
            if (!success.equals(desc) && !ok.equals(desc)) {
                return desc;
            }
        } catch (Exception e) {
            logger.info("sync third channel config to gateway err:" + e.getMessage());
            return "fail";
        }

        AppConfig config = getDao().getByAppId(req.getApp());
        AppAndroidChannelConfig appAndroidChannelConfig = new AppAndroidChannelConfig();
        appAndroidChannelConfig.setAppConfigId(config.getId());
        switch (req.getChannel()) {
            case AppConfigConstants.PUSH_THIRD_GETUI:
                appAndroidChannelConfig.setName(AppConfigConstants.CHANNEL_GETUI_NAME);
                appAndroidChannelConfig.setCode(AppConfigConstants.CHANNEL_GETUI_CODE);
                appAndroidChannelConfig.setThirdAppId(req.getThirdApp());
                appAndroidChannelConfig.setKey(req.getThirdKey());
                appAndroidChannelConfig.setSecret(req.getThirdSecret());
                break;
            case AppConfigConstants.PUSH_THIRD_JPUSH:
                appAndroidChannelConfig.setName(AppConfigConstants.CHANNEL_JIGUANG_NAME);
                appAndroidChannelConfig.setCode(AppConfigConstants.CHANNEL_JIGUANG_CODE);
                appAndroidChannelConfig.setKey(req.getThirdKey());
                appAndroidChannelConfig.setSecret(req.getThirdSecret());
                break;
            case AppConfigConstants.PUSH_THIRD_HUAWEI:
                appAndroidChannelConfig.setName(AppConfigConstants.CHANNEL_HUAWEI_NAME);
                appAndroidChannelConfig.setCode(AppConfigConstants.CHANNEL_HUAWEI_CODE);
                appAndroidChannelConfig.setThirdAppId(req.getThirdApp());
                appAndroidChannelConfig.setSecret(req.getThirdSecret());
                break;
            case AppConfigConstants.PUSH_THIRD_XIAOMI:
                appAndroidChannelConfig.setName(AppConfigConstants.CHANNEL_XIAOMI_NAME);
                appAndroidChannelConfig.setCode(AppConfigConstants.CHANNEL_XIAOMI_CODE);
                appAndroidChannelConfig.setThirdAppId(req.getThirdApp());
                appAndroidChannelConfig.setSecret(req.getThirdSecret());
                break;
            default:
                break;
        }
        appAndroidChannelConfigService.insertOrUpdate(appAndroidChannelConfig);
        return "success";
    }

    public List<AppConfig> getList() {
        AppConfigPage page = new AppConfigPage();
        page.setPageSize(Integer.MAX_VALUE);
        List<AppConfig> appConfigs = getDao().queryByList(page);
        return appConfigs;
    }

    public void syncAppToPush(boolean syncAll) throws JsonProcessingException {
        AppConfigPage page = new AppConfigPage();
        if (!syncAll) {
            //sync last 1 day app
            Date now = new Date();
            Date yesterday = DateUtil.getHoursBefore(now, 24);
            page.setUpdateTime(DateUtil.date2String("yyyy-MM-dd HH:mm:ss", yesterday));
            page.setUpdateTimeOperator(">=");
        }
        page.setPageSize(Integer.MAX_VALUE);
        List<AppConfig> appConfigs = getDao().queryByList(page);
        List<ProductSyncReq> productSyncReqList = buildParam(appConfigs);
        appConfApi.syncAppToPush(productSyncReqList);
    }

    private List<ProductSyncReq> buildParam(List<AppConfig> appConfigs) {
        List<ProductSyncReq> productSyncReqList = new ArrayList();
        for (AppConfig p : appConfigs) {
            ProductSyncReq req = getProductSyncReq(p);
            productSyncReqList.add(req);
        }
        return productSyncReqList;
    }

    private ProductSyncReq getProductSyncReq(AppConfig p) {
        ProductSyncReq req = new ProductSyncReq();
        req.setAppid(p.getAppId());
        req.setAppname(p.getAppName());
        req.setPid(String.valueOf(p.getProductId()));
        req.setSource(PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE);
        return req;
    }

    public List<AppConfig> queryByAppIdOrPid(String appId, Integer productId) {
        return getDao().queryByAppIdOrPid(appId, productId);
    }

    public AppConfDto selectByAppId(String appId) {
        AppConfDto appConfDto = new AppConfDto();
        AppConfig appConfig = getDao().getByAppId(appId);
        if (null != appConfig) {
            appConfDto.setAppId(appConfig.getAppId());
            appConfDto.setAppName(appConfig.getAppName());
            List<AppAndroidChannelConfig> appAndroidChannelConfigList = appAndroidChannelConfigService.getByAppConfigId(appConfig.getId());
            if (appAndroidChannelConfigList != null && appAndroidChannelConfigList.size() > 0) {
                for (AppAndroidChannelConfig appAndroidChannelConfig : appAndroidChannelConfigList) {
                    if (AppConfigConstants.CHANNEL_GETUI_CODE.equals(appAndroidChannelConfig.getCode())) {
                        appConfDto.setGetuiApp(appAndroidChannelConfig.getThirdAppId());
                        appConfDto.setGetuiKey(appAndroidChannelConfig.getKey());
                        appConfDto.setGetuiSecret(appAndroidChannelConfig.getSecret());
                    }
                    if (AppConfigConstants.CHANNEL_JIGUANG_CODE.equals(appAndroidChannelConfig.getCode())) {
                        appConfDto.setJpushKey(appAndroidChannelConfig.getKey());
                        appConfDto.setJpushSecret(appAndroidChannelConfig.getSecret());
                    }
                    if (AppConfigConstants.CHANNEL_HUAWEI_CODE.equals(appAndroidChannelConfig.getCode())) {
                        appConfDto.setHwApp(appAndroidChannelConfig.getThirdAppId());
                        appConfDto.setHwSecret(appAndroidChannelConfig.getSecret());
                    }
                    if (AppConfigConstants.CHANNEL_XIAOMI_CODE.equals(appAndroidChannelConfig.getCode())) {
                        appConfDto.setXmApp(appAndroidChannelConfig.getThirdAppId());
                        appConfDto.setXmSecret(appAndroidChannelConfig.getSecret());
                    }
                }
            }
            AppIosChannelConfig iosChannelConfig = appIosChannelConfigService.getByAppConfigId(appConfig.getId());
            if (iosChannelConfig != null) {
                appConfDto.setProdPem(iosChannelConfig.getProdPem());
                appConfDto.setProdFilename(iosChannelConfig.getProdFileName());
                if (iosChannelConfig.getProdExpiryDate() != null) {
                    appConfDto.setProdExpiryDate(DateUtil.date2String("yyyy-MM-dd HH:mm:ss", iosChannelConfig.getProdExpiryDate()));
                }
                appConfDto.setDevPem(iosChannelConfig.getDevPem());
                appConfDto.setDevFilename(iosChannelConfig.getDevFileName());
                if (iosChannelConfig.getDevExpiryDate() != null) {
                    appConfDto.setDevExpiryDate(DateUtil.date2String("yyyy-MM-dd HH:mm:ss", iosChannelConfig.getDevExpiryDate()));
                }
            }
        }
        return appConfDto;
    }

    public void save(AppConfig appConfig) throws JsonProcessingException {
        getDao().insert(appConfig);
        ProductSyncReq productSyncReq = getProductSyncReq(appConfig);
        List<ProductSyncReq> productSyncReqList = new ArrayList<ProductSyncReq>(Arrays.asList(productSyncReq));
        appConfApi.syncAppToPush(productSyncReqList);
    }
}
