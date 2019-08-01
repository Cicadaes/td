package com.talkingdata.marketing.web.model;

/**
 * @author chunyan.ji
 * @create 2017-07-20-下午12:00
 * @since JDK 1.8
 */
public class PasswordParam {

    private String oldPassword;

    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
