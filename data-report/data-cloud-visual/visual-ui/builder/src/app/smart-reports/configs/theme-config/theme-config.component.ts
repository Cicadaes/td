import {Component, OnInit, OnDestroy} from '@angular/core';
import {SelectItem} from 'primeng/primeng';

@Component({
    selector: 'theme-config',
    templateUrl: 'theme-config.component.html',
    styles: [`
    	   .double li {
	       width: 80px;
	       height: 54px;
	       margin: 0 10px;
	       float: left;
	   }	   
	    .double li span {
	       display: block;
	       padding: 20px 0 0 0;
	       font-family: PingFangSC-Regular;
	       font-size: 12px;
	       color: #657180;
	       letter-spacing: 0;
	       line-height: 12px;
	   }
	   
	    .double li input {
	       width: 100%;
	       padding: 10px 0 0 0;
	       border-bottom: 1px solid #DEE0E3;
	       font-family: PingFangSC-Regular;
	       font-size: 14px;
	       color: #464C5B;
	       letter-spacing: 0;
	   }
	   
	  .clear {
	       clear: both;
	   }
	   
	 .regular-radio {
	       margin-top: -5px;
	   }
	   
	   .indent {
	       width: 260px;
	       border-bottom: none;
	   }
	   
	 .smart-ctab .explore_graph_style dl:not(:last-child) {
	       border-bottom: 0 !important;
	   }
	   
	   .indent dd,
	   .indent dt {
	       margin-left: 10px;
	       width: 100%;
	   }
	   
	  .indent dd li {
	       width: 30%;
	       box-sizing: border-box;
	       height: auto;
	       float: left;
	   }
	   
	 .indent dt {
	       font-family: PingFangSC-Semibold;
	       font-size: 12px;
	       color: #657180;
	       letter-spacing: 0;
	       line-height: 12px;
	       padding: 10px 0;
	   }
	   
	  .indent dd label {
	       font-family: PingFangSC-Regular;
	       font-size: 12px;
	       color: #657180;
	       letter-spacing: 0;
	       line-height: 12px;
	   }
	   
	  h6 {
	       margin: 10px 0 20px -5px;
	       font-family: PingFangSC-Regular;
	       font-size: 12px;
	       color: #657180;
	       letter-spacing: 0;
	       line-height: 12px;
	       font-weight: normal;
	   }   
	 .drop-down dt {
	       font-family: PingFangSC-Regular;
	       font-size: 12px;
	       color: #657180;
	       letter-spacing: 0;
	       line-height: 12px;
	       font-weight: normal !important;
	   }
	   .ui-dropdown .ui-widget .ui-state-default .ui-corner-all .ui-helper-clearfix .ui-dropdown-open{
           width:120px !important;
       }
	  :host /deep/.ui-dropdown.ui-dropdown-label {
	       font-size: 14px !important;   
	   }	   
	 .all,
	  .all-small {
	       width: 100%;
	       margin-top: 29px;
	   }   
	   .all span,
	  .all-small span {
	       width: 20%;
	       margin-right: 8px;
	   }
	   
	    :host /deep/  .all-small .ui-dropdown.ui-widget.ui-state-default.ui-corner-all {      
	   }
	   
	  :host /deep/  .ui-dropdown.ui-widget.ui-state-default.ui-corner-all {
	       width:auto !important;
	       margin-right: 8px;
	   }
       :host /deep/  #theme-one .ui-dropdown .ui-widget .ui-state-default .ui-corner-all {
           width: 200px !important;
	       border: none !important;
       }
       :host /deep/  #theme-one .ui-dropdown .ui-dropdown-label  {
	       width: 200px !important;
	         
	   }
         :host /deep/  .font .ui-dropdown .ui-dropdown-label  {
	       width:168px !important;
	      
	   }
        :host /deep/  .fontStyle .ui-dropdown .ui-dropdown-label  {
	       width:88px !important;
	     
	   }
       :host /deep/ .ui-dropdown {
	       width: auto !important;
	       border: none !important;
	       border-bottom: 1px solid #ccc !important;
	   }
	   :host /deep/.ui-dropdown {
    width: 200px !important;
    border: none !important;
    border-bottom: 1px solid #ccc !important;
}
:host/deep/.smart-ctab .ui-tabview-nav li.ui-state-default{
    float:left !important;
}
:host /deep/  .ui-dropdown-panel .ui-dropdown-items .ui-dropdown-item.ui-state-highlight{
    background: rgba(28,36,56,0.03) !important;
      color:#5679F1;
}
:host /deep/  .ui-dropdown-panel .ui-dropdown-items .ui-dropdown-item.ui-state-hover{
    background: rgba(28,36,56,0.03) !important;
      color:#5679F1;
}
:host /deep/  .ui-dropdown-panel .ui-dropdown-items .ui-dropdown-item.ui-state-highlight{
      background: rgba(28,36,56,0.03) !important;
       color:#5679F1;
}
:host /deep/  body .ui-state-active, body .ui-state-highlight{
     background: rgba(28,36,56,0.03) !important;
     color:#5679F1;
}
:host /deep/ .ui-dropdown-item .ui-corner-all .ui-state-highlight{
  background:#eee !important;
   color:#5679F1;
}
:host /deep/  .ui-dropdown .ui-state-hover .ui-dropdown-label{
    background:#ccc;
}

:host /deep/ .ui-dropdown .ui-dropdown-label{
     background:none !important;
 }
:host /deep/ input{
    background:none;
}
:host/deep/ .ui-dropdown .ui-dropdown-trigger{
     background:none !important;
}
    `]
})

export class ThemeConfigComponent {
    private dataStyleView: Array<any> = []
    private theme: any[];
    style: SelectItem[];
    linestyle: SelectItem[];
    borderstyle: SelectItem[];
    opacity: SelectItem[];
    fontstyle: SelectItem[];
    fontstyle1: SelectItem[];
    num: SelectItem[];
    selectedstyle: any;
    selectedfontstyle: any;
    selectedfontstyle1: any;
    selectednum: any;
    selectedopacity: any;
    selectedlinestyle: any;
    selectedborderstyle: any;

    constructor() {
        this.style = [];
        this.style.push({label: '简约', value: {id: 1, name: '简约'}});
        this.style.push({label: '纯深色', value: {id: 1, name: '纯深色'}});
        this.style.push({label: '自定义', value: {id: 1, name: '自定义'}});
        this.fontstyle = [];
        this.fontstyle.push({label: '微软雅黑', value: {id: '2', name: '微软雅黑'}})
        this.fontstyle.push({label: '宋体', value: {id: '2', name: '宋体'}})
        this.fontstyle.push({label: '黑体', value: {id: '2', name: '黑体'}})
        this.fontstyle.push({label: '楷体', value: {id: '2', name: '楷体'}})
        this.fontstyle.push({label: '隶书', value: {id: '2', name: '隶书'}})
        this.fontstyle.push({label: '微软简综艺', value: {id: '2', name: '微软简综艺'}})
        this.fontstyle.push({label: '华文行楷', value: {id: '2', name: '华文行楷'}})
        this.fontstyle.push({label: '华文隶书', value: {id: '2', name: '华文隶书'}})
        this.num = [];
        this.num.push({label: '1', value: {id: '3', name: '1'}})
        this.num.push({label: '2', value: {id: '3', name: '2'}})
        this.num.push({label: '自定义', value: {id: '3', name: '自定义'}})
        this.opacity = [];
        this.opacity.push({label: '0%', value: {id: '4', name: '0%'}})
        this.opacity.push({label: '25%', value: {id: '4', name: '25%'}})
        this.opacity.push({label: '50%', value: {id: '4', name: '50%'}})
        this.opacity.push({label: '自定义', value: {id: '4', name: '自定义'}})
        this.linestyle = [];
        this.linestyle.push({label: '粗', value: {id: '5', name: '粗'}})
        this.linestyle.push({label: '细', value: {id: '5', name: '细'}})
        this.borderstyle = [];
        this.borderstyle.push({label: '实线', value: {id: '6', name: '实线'}})
        this.borderstyle.push({label: '虚线', value: {id: '6', name: '虚线'}})
        this.borderstyle.push({label: '自定义', value: {id: '6', name: '自定义'}})
        this.theme = [];
    }

    onChange(event: any) {
        let data = {code: event.value.name, name: event.value.id};
        this.theme.push(data)
    }

}