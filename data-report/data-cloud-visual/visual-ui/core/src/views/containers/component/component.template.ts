/**
 * Created by wangshouyun on 2017/3/20.
 */
import {BaseTemplate} from "../../base/template.base";

export class ComponentTemplate extends BaseTemplate {

    constructor(scopeID: String) {
        super(`<div component-container=${scopeID} style="position: 
                    absolute;width: 350px;height: 350px;z-index:1;cursor:move">
                <div style="width:100%;height:100%;position:absolute;z-index:3">                     
               <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; top:-8px;
   right:-8px;"></span>
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; bottom:-8px;
   right:-8px;"></span>
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; bottom:-8px;
    left:-8px;"></span>
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; top:-8px;
   left:-8px;"></span>  
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;bottom:-8px;
 right:calc(50% - 6px);"></span>
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;left: -8px;top:calc(50% - 6px)
    "></span>
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;right: -8px;top:calc(50% - 6px)
    "></span>
                    <span  style="width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;top:-8px;
    right:calc(50% - 6px);"></span>
                </div>
                <div style="width: 100%;height: 100%;position:relative;">                  
                     <div data-error style="position: absolute;background-color: #e7ebef;width: 100%;height: 100%;
                        color: #657180;font-size: 16px;z-index:2;display: none">
                        <div style="position: relative;width: 100%;height: 100%;z-index:1;">
                            <div style="position: absolute;padding: 10px;left:50%;top:50%;
                            transform: translate(-50%,-50%)">配置错误</div>
                        </div>
                    </div>
                    
                    <div direction="left-top" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    left: 0;top:0;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:
                     0 solid #cc0033;cursor:nw-resize "></div>
                     <div direction="left-center" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    left: -5px;top:calc(50% - 5px);z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:
                     0 solid #cc0033;cursor:w-resize "></div>
                     <div direction="top-center" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    left: calc(50% - 5px);top:-5px;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:
                     0 solid #cc0033;cursor:n-resize "></div>
                    <div direction="left-bottom"  style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    left: 0;bottom:0;z-index: 3;position: absolute;border-bottom: 0 solid #cc0033;border-left:
                     0 solid #cc0033;cursor: sw-resize"></div>
                    <div direction="right-top" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    right: 0;top:0;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-right:
                     0 solid #cc0033;cursor: ne-resize"></div>
                     <div direction="right-center" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                     right: -8px;bottom:calc(50% - 5px); z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-right:
                     0 solid #cc0033;cursor: e-resize"></div>
                     <div direction="bottom-center" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    left: calc(50% - 5px);bottom:-5px;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:
                     0 solid #cc0033;cursor:s-resize "></div>
                    <div direction="right-bottom" style="width: 10px;height: 10px;background-color: rgba(0,0,0,0);
                    right: 0;bottom:0;z-index: 3;position: absolute;border-bottom: 0 solid #cc0033;border-right:
                     0 solid #cc0033;cursor: se-resize"></div>   

                    <div container=${scopeID} style="width: 100%;height: 100%;position: relative;background: #fff;z-index:1">
                        <div componentTitle  class="component_title">
                            <div componentTitleHelp class="component_help r component_icon">
                                <span class="icon_help_button"></span>
                                <p componentTitleHelpText></p>
                            </div>
                            <div componentTitleDownload class="component_download r component_icon"></div>
                            <div componentTitleText class="component_title_text"></div>
                        </div>
                    </div>
                    
                
                </div>
              </div>`);

    }

}