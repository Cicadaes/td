package com.talkingdata.datacloud.vo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by gjqiao on 2017/9/4.
 */
public class RunScriptBean {
    private static final Logger logger = LoggerFactory.getLogger(RunScriptBean.class);

//    private List<Script> preShellScript = new ArrayList<>();
//    private Script sparkScript = null;
//    private List<Script> postShellScript = new ArrayList<>();
//
//    public RunScriptBean(){
//
//    }
//
//    public RunScriptBean(List<Script> scripts) {
//        logger.info("Original RunScriptBean is {}", scripts);
//        boolean touchSpark = false;
//        for (Script each : scripts) {
//            if (each.isShell() && !touchSpark) {
//                preShellScript.add(each);
//            } else if (each.isSpark()) {
//                touchSpark = true;
//                sparkScript = each;
//            } else if (each.isShell() && touchSpark) {
//                postShellScript.add(each);
//            }
//        }
//        logger.info("Parsed RunScriptBean are: \n {} \n {} \n {}", preShellScript, sparkScript, postShellScript);
//    }
//
//    public List<Script> getPreShellScript() {
//        return preShellScript;
//    }
//
//    public Script getSparkScript() {
//        return sparkScript;
//    }
//
//    public List<Script> getPostShellScript() {
//        return postShellScript;
//    }
//
//    public void setPreShellScript(List<Script> preShellScript) {
//        this.preShellScript = preShellScript;
//    }
//
//
//    public void setSparkScript(Script sparkScript) {
//        this.sparkScript = sparkScript;
//    }
//
//
//    public void setPostShellScript(List<Script> postShellScript) {
//        this.postShellScript = postShellScript;
//    }
//
//    public String preNodeList(){
//        return getNodeList(preShellScript);
//    }
//    public String postNodeList(){
//        return getNodeList(postShellScript);
//    }
//
//    private String getNodeList(List<Script> scriptList) {
//        if(scriptList==null){
//            return null;
//        }
//        int size = scriptList.size();
//        if(size ==1){
//            return scriptList.get(0).getUuid();
//        }
//        StringBuilder builder = new StringBuilder();
//        for(int index = 0; index< size; index++){
//            Script script = scriptList.get(index);
//            builder.append(script.getUuid());
//            if(index!= size -1){
//                builder.append(",");
//            }
//        }
//        return builder.toString();
//    }
}
