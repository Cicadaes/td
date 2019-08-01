package com.talkingdata.datacloud.vo;

/**
 * Created by xuan on 2017/1/11.
 */
@Deprecated
public class ScriptBean {
   public String language;
    public String script;
    public ScriptBean(String language, String script){
        this.language = language;
        this.script = script;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }
}
