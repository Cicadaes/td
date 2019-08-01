package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.annotation.Message;

import java.io.IOException;

/**
 * @author sheng.hong
 */
@Message
public class InitProfile implements TDMessagePackable {
    /**
     * 手机的CPU信息
     */
    public String mCpuDiscription = "";
    /**
     * CPU核数
     */
    public int mCpuCoreNum;
    /**
     * 主频，单位MHz
     */
    public float mCpuFrequency;
    /**
     * CPU implementor
     */
    public String mCpuImplementor = "";

    /**
     * 手机GPU信息
     */
    public String mGpuVendor = "";
    public String mGpuRenderer = "";
    /**
     * 手机RAM信息,KB
     */
    public int mMemoryTotal;
    public int mMemoryFree;
    /**
     * 机身存储
     */
    public int mMobileStorageTotal;
    public int mMobileStorageFree;
    /**
     * SD 卡
     */
    public int mSDCardStorageTotal;
    public int mSDCardStorageFree;

    /**
     * 电量mAh
     */
    public int mBatteryCapacity;

    /**
     * dpi 及物理尺寸单位英尺
     */
    public float mDisplaMetricWidth;
    public float mDisplaMetricHeight;
    public int mDisplayMetricDensity;

    /**
     * 手机rom版本
     */
    public String mRomInfo = "";
    /**
     * 基带版本
     */
    public String mBaseBand = "";

    /**
     * 手机的IMEI或MAC地址如果可以拿到的话
     */
    public String mIMEI = "";
    public String mMACAddress = "";

    /**
     * 默认接入点相关设定
     */
    public String mApnName = "";
    public String mApn_mcc = "";
    public String mApn_mnc = "";

    public boolean mApn_proxy = false;

    public String mIMSI = "";

    public String mUpid = "";

    public String mSimId = "";
    /**
     * added 2015/10/16
     */
    public String mAndroidId = "";
    /**
     * added 2015/10/16
     */
    public String mNfcHce = "";

    @Override
    public void messagePack(final TDPacker pk) throws IOException {
        pk.packArray(29);
        pk.pack(mCpuDiscription);
        pk.pack(mCpuCoreNum);
        pk.pack(mCpuFrequency);
        //CPU implementor
        pk.pack(mCpuImplementor);

		/*
		 * 手机GPU信息
		 */
        pk.pack(mGpuVendor);
        pk.pack(mGpuRenderer);
        /*
         * 手机RAM信息,KB
		 */
        pk.pack(mMemoryTotal);
        pk.pack(mMemoryFree);
        /*
         * 机身存储
		 */
        pk.pack(mMobileStorageTotal);
        pk.pack(mMobileStorageFree);
        //SD 卡
        pk.pack(mSDCardStorageTotal);
        pk.pack(mSDCardStorageFree);

        //电量mAh
        pk.pack(mBatteryCapacity);

        /**
         * dpi 及物理尺寸单位英尺
         */
        pk.pack(mDisplaMetricWidth);
        pk.pack(mDisplaMetricHeight);
        pk.pack(mDisplayMetricDensity);

        //手机rom版本
        pk.pack(mRomInfo);
        //基带版本
        pk.pack(mBaseBand);

        //手机的IMEI或MAC地址如果可以拿到的话
        pk.pack(mIMEI);
        pk.pack(mMACAddress);

        //默认接入点相关设定
        pk.pack(mApnName);
        pk.pack(mApn_mcc);
        pk.pack(mApn_mnc);
        pk.pack(mApn_proxy);
        pk.pack(mIMSI);
        pk.pack(mUpid);
        pk.pack(mSimId);

        pk.pack(mAndroidId);
        pk.pack(mNfcHce);
    }

    @Override
    public String toString() {
        return new StringBuilder("InitProfile").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mCpuDiscription").append(Printag.STARTAG)
                .append(mCpuDiscription).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                .append("mCpuCoreNum").append(Printag.STARTAG).append(mCpuCoreNum).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE)
                .append(Printag.SPACE).append("mCpuFrequency").append(Printag.STARTAG).append(mCpuFrequency).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mCpuImplementor").append(Printag.STARTAG)
                .append(mCpuImplementor).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mGpuVendor")
                .append(Printag.STARTAG).append(mGpuVendor).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                .append("mGpuRenderer").append(Printag.STARTAG).append(mGpuRenderer).append(Printag.ENDTAG).append(Printag.SPACE)
                .append(Printag.SPACE).append(Printag.SPACE).append("mMemoryTotal").append(Printag.STARTAG).append(mMemoryTotal)
                .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mMemoryFree")
                .append(Printag.STARTAG).append(mMemoryFree).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                .append("mMobileStorageTotal").append(Printag.STARTAG).append(mMobileStorageTotal).append(Printag.ENDTAG).append(Printag.SPACE)
                .append(Printag.SPACE).append(Printag.SPACE).append("mMobileStorageFree").append(Printag.STARTAG).append(mMobileStorageFree)
                .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mSDCardStorageTotal")
                .append(Printag.STARTAG).append(mSDCardStorageTotal).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE)
                .append(Printag.SPACE).append("mSDCardStorageFree").append(Printag.STARTAG).append(mSDCardStorageFree).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mBatteryCapacity").append(Printag.STARTAG)
                .append(mBatteryCapacity).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                .append("mDisplaMetricWidth").append(Printag.STARTAG).append(mDisplaMetricWidth).append(Printag.ENDTAG).append(Printag.SPACE)
                .append(Printag.SPACE).append(Printag.SPACE).append("mDisplaMetricHeight").append(Printag.STARTAG).append(mDisplaMetricHeight)
                .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mDisplayMetricDensity")
                .append(Printag.STARTAG).append(mDisplayMetricDensity).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE)
                .append(Printag.SPACE).append("mRomInfo").append(Printag.STARTAG).append(mRomInfo).append(Printag.ENDTAG).append(Printag.SPACE)
                .append(Printag.SPACE).append(Printag.SPACE).append("mBaseBand").append(Printag.STARTAG).append(mBaseBand).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mIMEI").append(Printag.STARTAG).append(mIMEI)
                .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mMACAddress")
                .append(Printag.STARTAG).append(mMACAddress).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                .append("mApnName").append(Printag.STARTAG).append(mApnName).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE)
                .append(Printag.SPACE).append("mApn_mcc").append(Printag.STARTAG).append(mApn_mcc).append(Printag.ENDTAG).append(Printag.SPACE)
                .append(Printag.SPACE).append(Printag.SPACE).append("mApn_mnc").append(Printag.STARTAG).append(mApn_mnc).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mApn_proxy").append(Printag.STARTAG)
                .append(String.valueOf(mApn_proxy)).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE)
                .append("mIMSI").append(Printag.STARTAG).append(mIMSI).append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE)
                .append(Printag.SPACE).append("mUpid").append(Printag.STARTAG).append(mUpid).append(Printag.ENDTAG).append(Printag.SPACE)
                .append(Printag.SPACE).append(Printag.SPACE).append("mSimId").append(Printag.STARTAG).append(mSimId).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mAndroidId").append(Printag.STARTAG).append(mAndroidId)
                .append(Printag.ENDTAG).append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("mNfcHce").append(Printag.STARTAG)
                .append(mNfcHce).append(Printag.ENDTAG).toString();
    }
}
