"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/20.
 */
var template_base_1 = require("../../base/template.base");
var ComponentTemplate = (function (_super) {
    __extends(ComponentTemplate, _super);
    function ComponentTemplate(scopeID) {
        return _super.call(this, "<div component-container=" + scopeID + " style=\"position: \n                    absolute;width: 350px;height: 350px;z-index:1;cursor:move\">\n                <div style=\"width:100%;height:100%;position:absolute;z-index:3\">                     \n               <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; top:-8px;\n   right:-8px;\"></span>\n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; bottom:-8px;\n   right:-8px;\"></span>\n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; bottom:-8px;\n    left:-8px;\"></span>\n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF; top:-8px;\n   left:-8px;\"></span>  \n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;bottom:-8px;\n right:calc(50% - 6px);\"></span>\n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;left: -8px;top:calc(50% - 6px)\n    \"></span>\n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;right: -8px;top:calc(50% - 6px)\n    \"></span>\n                    <span  style=\"width:10px; height:10px;border-radius:100%;position:absolute;z-index:3;background:#5f93e1;border: 2px solid #FFFFFF;top:-8px;\n    right:calc(50% - 6px);\"></span>\n                </div>\n                <div style=\"width: 100%;height: 100%;position:relative;\">                  \n                     <div data-error style=\"position: absolute;background-color: #e7ebef;width: 100%;height: 100%;\n                        color: #657180;font-size: 16px;z-index:2;display: none;overflow:hidden\">\n                        <div style=\"position: relative;width: 100%;height: 100%;z-index:1;\">\n                            <div style=\"position: absolute;padding: 10px;left:50%;top:50%;\n                            transform: translate(-50%,-50%)\">\u914D\u7F6E\u9519\u8BEF</div>\n                        </div>\n                    </div>\n                    \n                    <div direction=\"left-top\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    left: 0;top:0;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:\n                     0 solid #cc0033;cursor:nw-resize \"></div>\n                     <div direction=\"left-center\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    left: -5px;top:calc(50% - 5px);z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:\n                     0 solid #cc0033;cursor:w-resize \"></div>\n                     <div direction=\"top-center\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    left: calc(50% - 5px);top:-5px;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:\n                     0 solid #cc0033;cursor:n-resize \"></div>\n                    <div direction=\"left-bottom\"  style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    left: 0;bottom:0;z-index: 3;position: absolute;border-bottom: 0 solid #cc0033;border-left:\n                     0 solid #cc0033;cursor: sw-resize\"></div>\n                    <div direction=\"right-top\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    right: 0;top:0;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-right:\n                     0 solid #cc0033;cursor: ne-resize\"></div>\n                     <div direction=\"right-center\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                     right: -8px;bottom:calc(50% - 5px); z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-right:\n                     0 solid #cc0033;cursor: e-resize\"></div>\n                     <div direction=\"bottom-center\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    left: calc(50% - 5px);bottom:-5px;z-index: 3;position: absolute;border-top: 0 solid #cc0033;border-left:\n                     0 solid #cc0033;cursor:s-resize \"></div>\n                    <div direction=\"right-bottom\" style=\"width: 10px;height: 10px;background-color: rgba(0,0,0,0);\n                    right: 0;bottom:0;z-index: 3;position: absolute;border-bottom: 0 solid #cc0033;border-right:\n                     0 solid #cc0033;cursor: se-resize\"></div>   \n\n                    <div container=" + scopeID + " componentContainer style=\"width: 100%;height: 100%;position: relative;background: #fff;border-radius:5px;z-index:1\">\n                        <div componentTitle  class=\"component_title\">\n                            <div componentTitleHelp class=\"component_help r component_icon\">\n                                <span class=\"icon_help_button\"></span>\n                                <p componentTitleHelpText></p>\n                            </div>\n                            <div componentTitleDownload class=\"component_download r component_icon\"></div>\n                            <div componentTitleText class=\"component_title_text\"></div>\n                        </div>\n                    </div>\n                    \n                \n                </div>\n              </div>") || this;
    }
    return ComponentTemplate;
}(template_base_1.BaseTemplate));
exports.ComponentTemplate = ComponentTemplate;
//# sourceMappingURL=component.template.js.map