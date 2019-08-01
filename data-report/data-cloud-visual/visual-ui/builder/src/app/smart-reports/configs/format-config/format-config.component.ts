import {StageService} from './../../services/stage.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'format-config',
    templateUrl: 'format-config.component.html',
    styles: [`
    .double {
    width: 260px;
}

.double li {
    width: 44%;
    height: 54px;
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
}
 :host/deep/ .ui-radiobutton .ui-radiobutton-box.ui-state-active{
   color:#5f93e1;
   width: 14px;
   height: 14px;
   border-radius: 50%;
   position:relative;
   left:0px;
   top:0px;
   border:2px solid #fff;
 } 

 :host/deep/ .fa-circle:before {
    content: "";
}
 .ui-radiobutton-box .ui-widget .ui-state-default{
    background: #fff;
    border: 1px solid #c0c7d0;
    border-radius: 50%;
    position: relative;
    padding: 6px;
    display: inline-block;
    cursor: pointer;
    -webkit-transition: background .5s linear;
    -moz-transition: background .5s linear;
    transition: background .5s linear;
    -webkit-transition: border-color .5s linear;
    -moz-transition: border-color .5s linear;
    transition: border-color .5s linear;
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
    margin-top:2px;
    width: 90%;
    border:none;
    border-bottom: 1px solid #DEE0E3;
    background:none !important;
}
.indent {
    clear: both;
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
    width: 48%;
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
    font-weight: normal !important;
}
.indent dd label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #464C5B;
    line-height: 14px;
}
h6 {
    margin: 20px 0 16px -5px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: normal !important;
    color: #657180;
    letter-spacing: 0;
    line-height: 12px;
}
.drop-down dt {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #657180;
    letter-spacing: 0;
    line-height: 12px;
    font-weight: normal !important;
}

:host /deep/.ui-dropdown {
    width: 200px !important;
    border: none !important;
    border-bottom: 1px solid #ccc !important;
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
:host /deep/ input#w,input#h{
    background:none !important;
}
:host/deep/ .ui-dropdown .ui-dropdown-trigger{
     background:none !important;
}

`]
})
export class FormatConfigComponent {
    private dataStyleView: Array<any> = []

    private marginValue: any = {code: '', value: ''};
    private sizeValue: any = {code: '', value: ''};
    private formatObject: any = {};
    private selectedWidth: any;
    private selectedHeight: string = "";
    private saveSizeWidth: string;
    private saveSizeHeight: string;
    private saveStageSize: any;
    private saveStage: any;
    private canvasSize: string = "屏幕（16:9）横向";
    private canvasSizeList: Array<any> = [
        {label: '屏幕（16:9）横向', value: [{code: 'width', value: '1366'}, {code: 'height', value: '768'}]},
        {label: '屏幕（16:9）竖向', value: [{code: 'width', value: '768'}, {code: 'height', value: '1366'}]},
        {label: '自定义', value: [{code: 'width', value: ''}, {code: 'height', value: ''}]}
    ];
    private canvalBool: boolean = false;
    private dataConfig: any = "";

    constructor(private stageService: StageService) {

        let that = this;
        this.stageService.missionStageDataFormat$.subscribe(() => {
            // stageService.formatData[0].value = JSON.stringify(document.getElementById('smartStage').offsetWidth);
            that.setFormatData(stageService.formatData);
            that.formatObject = stageService.HandleData(stageService.formatData);

            let currentIndex = stageService.stagePages.currentIndex;
            if (stageService.StageBaseData.stages.length > 0) {
                that.dataConfig = stageService.StageBaseData.stages[currentIndex].backgroundImage;
            }

            stageService.triggerChange(3, {result: that.formatObject});
        });

    }

    ngOnInit() {
        this.saveStage = document.getElementById('smartStage');
        this.saveStageSize = (this.saveStage.offsetWidth) - 40;
    }

    canvasChange() {
        this.canvalBool = this.canvalBool ? false : true;
    }

    setFormatData(formatArray: Array<any>) {
        for (let item of formatArray) {
            switch (item.code) {
                case "margin":
                    this.marginValue = {
                        code: item.code,
                        value: item.value
                    };
                    if (item.value == 'true') {
                        this.saveStage.className = "smart-stage stage";
                    } else {
                        this.saveStage.className = "smart-stage stage edge_distance";
                    }
                    break;
                case "width":
                    this.selectedWidth = item.value;
                    this.saveSizeWidth = item.value;
                    break;
                case "height":
                    this.selectedHeight = item.value;
                    this.saveSizeHeight = item.value;
                    break;
                case "size":
                    this.sizeValue = {
                        code: item.code,
                        value: item.value
                    };
                    break;
            }
        }
        this.setSize(this.selectedWidth);
    }

    setSize(width: any) {
        if (width == Number("1366").toString()) {
            this.canvasSize = '屏幕（16:9）横向'
        } else if (width == Number("768").toString()) {
            this.canvasSize = '屏幕（16:9）竖向'
        } else {
            this.canvasSize = '自定义'
        }
    }

    setHeightSize(width: any) {
        if (width == Number("1366").toString()) {
            this.canvasSize = '屏幕（16:9）竖向'
        } else if (width == Number("768").toString()) {
            this.canvasSize = '屏幕（16:9）横向'
        } else {
            this.canvasSize = '自定义'
        }
    }

    dataConfigChange() {
        let currentIndex = this.stageService.stagePages.currentIndex;
        if (this.stageService.StageBaseData.stages.length > 0) {
            this.stageService.StageBaseData.stages[currentIndex].backgroundImage = this.dataConfig;
        }
    }

    changeSizeRadio(e: any) {
        switch (e) {
            case 'true':
                this.sizeValue.value = true;
                break;
            case 'false':
                this.sizeValue.value = false;
                break;
        }
        this.publicObj(this.sizeValue.code, e)
    }

    changeRadio(e: any) {
        switch (e) {
            case 'true':
                this.marginValue.value = true;
                this.saveStage.className = "smart-stage stage";
                break;
            case 'false':
                this.marginValue.value = false;
                this.saveStage.className = "smart-stage stage edge_distance";
                break;
        }

        this.publicObj(this.marginValue.code, e)
    }

    publicObj(value: any, e: any) {
        let styleObj: any = StageService.transformInput(value, e);
        this.changeFormat(styleObj, this.stageService.formatData);
        this.stageService.triggerChange(3, {result: styleObj});
    }

    changeFormat(formatObj: any, formatArr: Array<any>) {
        for (let item of formatArr) {
            for (let key in formatObj) {
                if (item.code == key) {
                    item.value = formatObj[key]
                }
            }
        }
    }

    //输入尺寸
    getSelectedSize(event: any, type: any) {
        let getValue: any = event.target.value;
        if (type == 'width') {
            this.setSize(getValue);
            if (getValue < 100 || getValue > this.saveStageSize) {
                this.publicObj('width', this.saveSizeWidth)
                Object.assign(this.formatObject, StageService.transformInput('width', this.saveSizeWidth))
            } else {
                this.publicObj('width', getValue)
                Object.assign(this.formatObject, StageService.transformInput('width', getValue))
            }
        }
        if (type == 'height') {
            this.setHeightSize(getValue);
            if (getValue < 100 || getValue > 10000) {
                this.publicObj('width', this.saveSizeHeight)
                Object.assign(this.formatObject, StageService.transformInput('height', this.saveSizeHeight))
            } else {
                this.publicObj('height', getValue)
                Object.assign(this.formatObject, StageService.transformInput('height', getValue))
            }
        }
        console.log(event.target.value)
        this.stageService.triggerChange(3, {result: this.formatObject});
    }

    onChange(event: any) {
        this.canvasSize = event.label;

        for (let item of event.value) {
            if (item.value !== '') {
                switch (item.code) {
                    case "width":
                        this.selectedWidth = item.value;
                        this.saveSizeWidth = item.value;
                        break;
                    case "height":
                        this.selectedHeight = item.value;
                        this.saveSizeHeight = item.value;
                        break;
                }
            }
            Object.assign(this.formatObject, StageService.transformInput(item.code, item.value))
        }
        this.changeFormat(this.formatObject, this.stageService.formatData);
        this.stageService.triggerChange(3, this.formatObject);
        this.canvalBool = false;
    }
}
 