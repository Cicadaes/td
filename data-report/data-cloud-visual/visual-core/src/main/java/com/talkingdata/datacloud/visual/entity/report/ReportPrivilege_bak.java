package com.talkingdata.datacloud.visual.entity.report;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by yangruobin on 2017/8/16.
 */
public class ReportPrivilege_bak {
    List<String> read=new ArrayList<>();
    List<String> download=new ArrayList<>();
    List<String> saveAs=new ArrayList<>();


    public String privilege2Bitmap(String roleId){
        String bitmap = "";
        bitmap += read.contains(roleId) ?  "1" :  "0";
        bitmap += download.contains(roleId) ?  "1" :  "0";
        bitmap += saveAs.contains(roleId) ?  "1" :  "0";
        if (bitmap.length() < 32){
            for (int i = bitmap.length(); i < 32; i++){
                bitmap = "0" + bitmap;//补0操作
            }
        }
        return bitmap;
    }

    public void addRead(String roleId){
        if (read.contains(roleId)){
            return ;
        }
        read.add(roleId);
    }

    public void addDownload(String roleId){
        if (download.contains(roleId)){
            return ;
        }
        download.add(roleId);
    }

    public void addSaveAs(String roleId){
        if (saveAs.contains(roleId)){
            return ;
        }
        saveAs.add(roleId);
    }

    public String[] toAllRole(){
        Set<String> set = new HashSet<>();
        set.addAll(read);
        set.addAll(download);
        set.addAll(saveAs);
        return set.toArray(new String[set.size()]);
    }

    public List<String> getRead() {
        return read;
    }

    public void setRead(List<String> read) {
        this.read = read;
    }

    public List<String> getDownload() {
        return download;
    }

    public void setDownload(List<String> download) {
        this.download = download;
    }

    public List<String> getSaveAs() {
        return saveAs;
    }

    public void setSaveAs(List<String> saveAs) {
        this.saveAs = saveAs;
    }
}
