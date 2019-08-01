package com.talkingdata.datacloud.visual.entity.report;

/**
 * Created by yangruobin on 2017/8/16.
 */
public class ReportPrivilege {
    Integer roleId;
    Integer read=0;
    Integer download=0;
    Integer saveAs=0;


    public String privilege2Bitmap(){
        String bitmap = "";
        bitmap += read;
        bitmap += download;
        bitmap += saveAs;
        if (bitmap.length() < 32){
            for (int i = bitmap.length(); i < 32; i++){
                bitmap = "0" + bitmap;//补0操作
            }
        }
        return bitmap;
    }
    private static String addZero(String bitmap) {
        while(bitmap.length()<32){
            bitmap = "0"+bitmap;
        }
        return bitmap;
    }
    /**
     * @param bitmap
     * @return
     */
    public static String[] bitmap2Array(String bitmap) {
        if (bitmap == null || "".equals(bitmap)) {
            return null;
        }
        String[] returnArray = new String[32];
        char[] chars = bitmap.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            returnArray[i] = String.valueOf(chars[i]);
        }
        return returnArray;
    }

    /**
     * 判断某一位为真,即某一位为1
     *
     * @param bitmapArray
     * @param index
     * @return
     */
    public static boolean bitTrue(String[] bitmapArray, int index) {
        return "1".equals(bitmapArray[index]);
    }

    public static ReportPrivilege getPrivilageByBitmap(String bitmap,Integer roleId){
        ReportPrivilege reportPrivilege = new ReportPrivilege();
        bitmap = addZero(bitmap);
        String[] privilegeBitmapArray = bitmap2Array(bitmap);
        reportPrivilege.setRoleId(roleId);
        if (bitTrue(privilegeBitmapArray, 29)) { // read
            reportPrivilege.setRead(1);
        }
        if (bitTrue(privilegeBitmapArray, 30)) {// download
            reportPrivilege.setDownload(1);
        }
        if (bitTrue(privilegeBitmapArray, 31)) { // saveAs
            reportPrivilege.setSaveAs(1);
        }
        return reportPrivilege;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getRead() {
        return read;
    }

    public void setRead(Integer read) {
        this.read = read;
    }

    public Integer getDownload() {
        return download;
    }

    public void setDownload(Integer download) {
        this.download = download;
    }

    public Integer getSaveAs() {
        return saveAs;
    }

    public void setSaveAs(Integer saveAs) {
        this.saveAs = saveAs;
    }
}
