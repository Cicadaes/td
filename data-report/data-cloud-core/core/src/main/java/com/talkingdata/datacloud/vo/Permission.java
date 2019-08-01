package com.talkingdata.datacloud.vo;

/**
 * Created by tend on 2017/5/18.
 */
public class Permission {

    private boolean createSubCatalog = false;
    private boolean createDataset = false;
    private boolean update = false;
    private boolean delete = false;
    private boolean read = false;
    private boolean grant = false;
    private boolean refresh = false;

    public boolean isCreateSubCatalog() {
        return createSubCatalog;
    }

    public void setCreateSubCatalog(boolean createSubCatalog) {
        this.createSubCatalog = createSubCatalog;
    }

    public boolean isCreateDataset() {
        return createDataset;
    }

    public void setCreateDataset(boolean createDataset) {
        this.createDataset = createDataset;
    }

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }

    public boolean isDelete() {
        return delete;
    }

    public void setDelete(boolean delete) {
        this.delete = delete;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isGrant() {
        return grant;
    }

    public void setGrant(boolean grant) {
        this.grant = grant;
    }

    public boolean isRefresh() {
        return refresh;
    }

    public void setRefresh(boolean refresh) {
        this.refresh = refresh;
    }
}
