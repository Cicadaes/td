import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';

import { MetadataRestapiService } from './metadata-restapi-test.service';
import { MetadataCreateService } from '../metadata-create.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';


import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
  } from '@angular/forms';

@Component({
    selector: 'metadata-restapi-test',
    templateUrl: './metadata-restapi-test.component.html',
    styleUrls: ['./metadata-restapi-test.component.less']
})
export class MetadataRestapiTestComponent implements OnInit, OnDestroy {
    isVisibleTop = false;
    isVisibleMiddle = false;
    // 代码块配置
    private config: any = {
        lineNumbers: false,
        mode: 'application/json',
        fixedGutter: true,
        readOnly: true,
        lineWrapping:true
    }
    testData:any = {};
    postBody:any = '';
    response:any = '';
    validateForm: FormGroup;
    datasourceUrl:string;
    datasourceId:number;
    @ViewChild('code') code: any;
    // codemirror编辑器
    private cEditor: any = null;
    @ViewChild('resBox') resBox: any;
    private resEditor: any = null;

    showModalTop = () => {
        this.isVisibleTop = true;
    };


    showModalMiddle = () => {
        this.isVisibleMiddle = true;
        if(this.code && !this.cEditor){
            this.codemirrorInit(this.code.nativeElement, this.config, this.postBody);
        }
        if(this.resBox && !this.resEditor){
            this.resCodemirrorInit(this.resBox.nativeElement, this.config, this.response);
        }

        if(this.metadataCreateService.metadataObjId){//修改
            this.datasourceUrl = this.metadataCreateService.metadataObj['dataSourceUrl'];
            this.datasourceId = this.metadataCreateService.metadataObj['dataSourceId'];
            this.testData["physicalMetaObjectName"] = this.metadataCreateService.metadataObj["physicalMetaObjectName"];
            this.testData["physicalMetaObjectAttributeTable"] = {};
            this.testData["physicalMetaObjectAttributeTable"] = this.metadataCreateService.metadataObj["attributes"];
        }else{
            this.datasourceUrl = this.metadataCreateService._metadataStep1Obj['url'];
            this.datasourceId = this.metadataCreateService._metadataStep1Obj['id'];
            this.testData = this.metadataCreateService._metadataStep2Obj;
        }

        this.postBody = JSON.stringify(this.buildPostBody());
        this.response = '';
        if(this.cEditor)this.cEditor.setValue(this.postBody);
        if(this.resEditor)this.resEditor.setValue(this.response);

    };

    //点击测试
    handleOkMiddle = (e: any) => {
        this.metadataRestapiService.test(this.datasourceId , JSON.parse(this.postBody)).then((res:any) => {
            if(res.success){
                this.response = JSON.stringify(res.data);
                this.resEditor.setValue(this.response)
            }else{
                this.response = res.msg;
            }
        }).catch((err:any) => {
            // this._notification.error('错误', err);
        });
    };


    handleCancelTop = (e: any) => {
        this.isVisibleTop = false;
    };


    handleCancelMiddle = (e: any) => {
        this.isVisibleMiddle = false;
    };
    constructor(
        private metadataRestapiService: MetadataRestapiService,
        private metadataCreateService: MetadataCreateService,
        private _notification: CmNotificationService,
        private fb: FormBuilder
    ) {
        this.validateForm = this.fb.group({
            response: '',
            postBody:''
          });
    }

    ngOnInit() {
        
    }

    /**
     * 构建body
     */
    buildPostBody(){
        let body = {
            "dimensions": [
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "aggregator": "sum",
                    "alias": "sum_sales_amount"
                }
            ]
        }
        if(this.testData['physicalMetaObjectAttributeTable']){
            let attributes = this.testData['physicalMetaObjectAttributeTable']['parameter']? this.testData['physicalMetaObjectAttributeTable']['parameter']:  this.testData['physicalMetaObjectAttributeTable'];
            let len = attributes.length;
            let hasDimensions = false;
            let hasMetrics = false;
            if(attributes.length > 0 && attributes[0]['name']){
                for( let i = 0; i < len; i++ ){
                    if(attributes[i]['isInput'] && !hasDimensions){
                        body['dimensions'][0]['field'] = attributes[i]['name'];
                        hasDimensions = true;
                    }else if(!attributes[i]['isInput'] && !hasMetrics){
                        body['metrics'][0]['field'] = attributes[i]['name'];
                        body['metrics'][0]['aggregator'] = attributes[i]['aggregators'] && attributes[i]['aggregators'][0];
                        body['metrics'][0]['alias'] =  body['metrics'][0]['aggregator'] && `${body['metrics'][0]['aggregator']}_${ body['metrics'][0]['field']}`;
                        hasMetrics = true;
                    }
                }
    
            }else{
                for( let i = 0; i < len; i++ ){
                    if(attributes[i]['isInput'] && !hasDimensions){
                        body['dimensions'][0]['field'] = attributes[i]['metaAttributeName'];
                        hasDimensions = true;
                    }else if(!attributes[i]['isInput'] && !hasMetrics){
                        body['metrics'][0]['field'] = attributes[i]['physicalMetaAttributeName'];
                        body['metrics'][0]['aggregator'] = attributes[i]['aggregators'][0];
                        body['metrics'][0]['alias'] = `${body['metrics'][0]['aggregator']}_${ body['metrics'][0]['field']}`;
                        hasMetrics = true;
                    }
                }
            }
            
            if(hasDimensions && hasMetrics){
                return body;
            }
        }
        

    }

    ngOnDestroy() {
        if(this.cEditor)this.cEditor.setValue('');
        if(this.resEditor)this.resEditor.setValue('');
        
    }

    /**
   * 初始化codemirror
   * @param  {any}    el [绑定元素]
   * @param  {any}    config [配置信息]
   */
    codemirrorInit(el: any, config: any,defaultVal:any): void {
        this.cEditor = CodeMirror.fromTextArea(el, config);
        this.refreshCM(this.cEditor);
        this.cEditor.setValue(defaultVal);
        this.cEditor.on('change', () => {
            this.postBody = this.cEditor.getValue();
            this.refreshCM(this.cEditor);
        })

    }

    resCodemirrorInit(el: any, config: any,defaultVal:any): void {
        this.resEditor = CodeMirror.fromTextArea(el, config);
        this.refreshCM(this.resEditor);
        this.resEditor.setValue(defaultVal);
        this.resEditor.on('change', () => {
            this.response = this.resEditor.getValue();
            this.refreshCM(this.resEditor);
        })

    }

    /**
   * 刷新codemirror
   */
    refreshCM(cEditor:any): void {
        setTimeout(() => {
        cEditor.refresh();
        }, 0)
    }

}