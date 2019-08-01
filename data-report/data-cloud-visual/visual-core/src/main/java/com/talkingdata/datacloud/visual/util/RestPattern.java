package com.talkingdata.datacloud.visual.util;

/**
 * Created by Ocean on 2016/11/19.
 */
public class RestPattern {
    String restPath;
    String restMethod;
    String privilegePoint;

    public RestPattern(String restMethod, String restPath, String privilegePoint) {
        this.restMethod = restMethod;
        this.restPath = restPath;
        this.privilegePoint = privilegePoint;
    }

    @Override
    public int hashCode(){
        return restPath.hashCode();
    }

    @Override
    public boolean equals(Object object){
        return object instanceof RestPattern
            && ((RestPattern)object).restMethod.equals(this.restMethod)
            && ((RestPattern)object).restPath.equals(this.restPath);
    }
}
