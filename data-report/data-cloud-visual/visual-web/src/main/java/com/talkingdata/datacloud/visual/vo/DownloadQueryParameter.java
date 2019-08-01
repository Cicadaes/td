package com.talkingdata.datacloud.visual.vo;

import com.talkingdata.datacloud.adapter.entity.QueryParameter;

/**
 * Created by yangruobin on 2017/11/7.
 */
public class DownloadQueryParameter extends QueryParameter{
    @Deprecated
    // 弃用
    String downloadName;

   // 生效
    protected Integer exportExcelType;

    public Integer getExportExcelType() {
        return exportExcelType;
    }

    public void setExportExcelType(Integer exportExcelType) {
        this.exportExcelType = exportExcelType;
    }

    public String getDownloadName() {
        return downloadName;
    }

    public void setDownloadName(String downloadName) {
        this.downloadName = downloadName;
    }
}
