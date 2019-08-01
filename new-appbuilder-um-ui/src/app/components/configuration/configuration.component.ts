import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { NzModalService } from 'ng-cosmos-ui';
import { pageLogeThumbUrl } from './configuration.assets';
import { pageBackgroundThumbUrl } from './configuration.assets';

@Component({
    selector: 'configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css'],
})

export class ConfigurationComponent implements OnInit {
    validateForm: FormGroup;
    errorlogo: boolean = false;
    errorbackground: boolean = false
    baseMap: any;//默认底图
    text: boolean//false
    title: any;//页面标题
    resultValue: any = {
        logo: pageLogeThumbUrl,
        background: pageBackgroundThumbUrl
    };//保存数据
    pageLoge: any = {
        list: [{
            uid: -1,
            name: 'logo.svg',
            status: 'done',
            thumbUrl: pageLogeThumbUrl
        }],
        number: 1,
        apiUrl: `${document.location.origin}/console-api/attachmentController/uploadImage`,
    };
    pageBackground: any = {
        list: [{
            uid: -2,
            name: 'background.svg',
            status: 'done',
            thumbUrl: pageBackgroundThumbUrl
        }],
        number: 1,
        apiUrl: `${document.location.origin}/console-api/attachmentController/uploadImage`,
    };
    toggle: boolean = false;
    cpPresetColors: string[] = ['#ffffff', '#000000', '#2d8cf0', '#2de2c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];;//要在颜色选择器对话框中显示的预设颜色数组。
    color: any;
    cpOutputFormat: any = 'hex';//颜色格式
    widths: any;//宽
    heights: any//高
    cont: any = {
        logo: '',
        background: '',
        type: false
    };
    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
    }
    constructor(private fb: FormBuilder, private service: ConfigurationService, private confirmServ: NzModalService) {
        let request: any = { "appCode": "portal" };
        this.service.pageConfigurationRead(request).then((data: any) => {
            if (data.success == true) {
                this.validateForm = this.fb.group({
                    title: [data.data.title, [Validators.required, Validators.maxLength(100), Validators.minLength(2), this.folderName]],
                    baseMap: [data.data.backgroundType ? 'color' : 'img'],
                });
                this.baseMap = data.data.backgroundType ? 'color' : 'img';
                this.pageLoge = {
                    list: [{
                        uid: -1,
                        name: 'logo.svg',
                        status: 'done',
                        thumbUrl: data.data.logo
                    }]
                }
                this.resultValue.logo = data.data.logo;
                if (data.data.backgroundType) {
                    this.pageBackground.list[0].thumbUrl = this.resultValue.background;
                    this.pageBackground = {
                        list: [{
                            uid: -2,
                            name: 'background.svg',
                            status: 'done',
                            thumbUrl: this.resultValue.background
                        }]
                    };
                    this.resultValue.background = data.data.background;
                    this.color = data.data.background
                } else {
                    this.pageBackground = {
                        list: [{
                            uid: -2,
                            name: 'background.svg',
                            status: 'done',
                            thumbUrl: data.data.background
                        }]
                    };
                    this.resultValue.background = data.data.background;
                    this.color = '#5bb6fd'
                }
                this.cont.logo = data.data.logo;
                this.cont.background = this.pageBackground.list[0].thumbUrl;
                this.cont.type = true;
            } else {
                this.initialization()
                this.pageLoge.list[0].thumbUrl = this.resultValue.logo;
                this.pageBackground.list[0].thumbUrl = this.resultValue.background;
            }
        }).catch((err: any) => {
            console.log('请求错误')
        });
    }
    ngOnChanges() {
        this.pageLoge.list[0].thumbUrl = this.resultValue.logo;
    }
    ngOnInit(): void {
        this.initialization();
    }
    /**
     * 名称验证
     */
    folderName = (control: FormControl): any => {
        const FOLDERname_REGEXP1 = new RegExp(/^([\u4E00-\u9FA5]|[A-Za-z]|[0-9]|[ ]|[-_&])+$/);
        if (!FOLDERname_REGEXP1.test(control.value)) {
            if (control.value.length) {
                return { duplicated: true }
            }
        }
        const FOLDERname_REGEXP2 = new RegExp(/^[ ]*$/);
        if (FOLDERname_REGEXP2.test(control.value)) {
            if (control.value.length) {
                return { duplicated: true }
            }
        }
    }
    /**
     * 初始化
     */
    initialization(cont?: any) {
        if (cont) {
            this.pageLoge.list[0].thumbUrl = this.cont.logo;
            this.pageBackground.list[0].thumbUrl = this.cont.background;
        } else {
            this.pageBackground.list[0].thumbUrl = this.resultValue.background;
            this.validateForm = this.fb.group({
                title: ['TalkingData 统一门户', [Validators.required, Validators.maxLength(100), Validators.minLength(2), this.folderName]],
                baseMap: ['img'],
            });
            this.baseMap = 'img';
            this.color = '#5bb6fd';
        }
    }
    /**
    * 移除图片
    * @param files 
    */
    onRemovepageLoge(files: any[]) {
        this.errorlogo = true;
        this.resultValue.logo = null;
    }
    /**
     * 判断图片格式
     * @param type 
     */
    onErrorpageLoge(type: any) { //type == true 格式错误
        // this.imageErrorlogo = type;
        if (type) {
            this.errorlogo = false;
        }
    }

    /**
     * 上传
     * @param files 
     */
    onUploadpageLoge(files: any[]) {
        if (files.length > 0 && files[0].thumbUrl) {
            this.resultValue.logo = files[0].thumbUrl;
            this.errorlogo = false;
        }
    }

    /**
     * 移除图片
     * @param files 
     */
    onRemovepageBackground(files: any[]) {
        this.errorbackground = true;
        this.resultValue.background = null;
    }
    /**
    * 判断图片格式
    * @param type 
    */
    onErrorpageBackground(type: any) { //type == true 格式错误
        // this.imageErrorbackground = type;
        if (type) {
            this.errorbackground = false;
        }
    }

    /**
     * 上传
     * @param files 
     */
    onUploadpageBackground(files: any[]) {
        if (files.length > 0 && files[0].thumbUrl) {
            this.pageBackground.list[0].thumbUrl = files[0].thumbUrl;
            this.resultValue.background = files[0].thumbUrl;
            this.errorbackground = false;
        }
    }
    /**
     *验证 
     * @param name 
     */
    getFormControl(name: string) {
        return this.validateForm && this.validateForm.controls && this.validateForm.controls[name];
    }
    /**
     * 点击
     */
    select(data: any) {
        this.baseMap = data;
    }
    /**
     * 页面地图checbox改变
     */
    pagePicture() {
        if (this.baseMap == "img") {
            this.resultValue.background = this.pageBackground.list[0].thumbUrl
        }
    }
    /**
     * 确定
     */
    determine() {
        let background: any;
        if (this.validateForm.value.baseMap == "img") {
            background = this.resultValue.background
        } else {
            background = this.color
        }
        let resultValues: any;
        resultValues = {
            title: this.validateForm.value.title.replace(/(^\s*)|(\s*$)/g, ""),
            logo: this.resultValue.logo,
            background: background,
            backgroundType: this.validateForm.value.baseMap == "img" ? 0 : 1,
            appCode: "portal",
        }
        this.title = resultValues.title;
        let Exbox = /^([\u4E00-\u9FA5]|[A-Za-z]|[0-9]|[ ]|[-_&])+$/;
        if (resultValues.title && resultValues.title.length >= 2 && resultValues.title.length <= 100 && Exbox.test(resultValues.title)) {
            if (resultValues.title && resultValues.logo && resultValues.background && (this.validateForm.value.baseMap == "img" ? !this.errorbackground : true) && !this.errorlogo) {
                this.service.pageConfigurationSave(resultValues).then((data: any) => {
                    if (data.success) {
                        this.confirmServ.success({
                            nzTitle: data.msg,
                        });
                        this.title = resultValues.title;
                    } else {
                        this.confirmServ.error({
                            nzTitle: data.msg,
                        });
                    }
                }).catch((err: any) => {
                    this.confirmServ.error({
                        nzTitle: '请求错误',
                    });
                });
            }
        }

    }
}