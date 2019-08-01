package com.talkingdata.marketing.core.adapter;

import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import java.util.Map;

/**
 * 统一投放入口抽象接口
 * @author tao.yang
 */
public interface IAdapter {
    /**
     * 投放入口，如推送，短信和广告等
     *
     * @param context    投放配置信息，比如地址，端口，用户名和密码等信息。
     * @param deviceText 设备资源，比如设备信息，手机号等
     * @param segment    具体投放内容
     * @param fileUpload 投放人群资源是否以文件上传方式
     * @throws Exception the exception
     */
    void send(Map<String, Object> context, String deviceText, Segment segment, boolean fileUpload) throws Exception;

    /**
     * 根据文件进行投放
     *
     * @param context           上下文，存储了设备文件路径，用于如果是push则为tdid设备列表，如果是短信则为手机号设备列表
     * @param channelDefinition 渠道
     * @param segment           投放
     */
    void send(Map<String, Object> context, ChannelDefinition channelDefinition, Segment segment);

    /**
     * 根据设备id进行投放
     * 设备id是唯一标识，例如：当为设备的时候为tdid，当为短信时为手机号
     *
     * @param context           the context
     * @param channelDefinition 渠道
     * @param id                设备id是唯一标识，例如：当为设备的时候为tdid，当为短信时为手机号
     * @param segment           投放
     */
    void testSend(Map<String, Object> context, ChannelDefinition channelDefinition, String id, Segment segment);
}
