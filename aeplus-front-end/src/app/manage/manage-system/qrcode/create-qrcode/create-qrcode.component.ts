import {Component, OnInit, ValueProvider, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators
} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {QrcodeService} from '../qrcode.service';
import {NzMessageService} from 'ng-cosmos-ui';

@Component({
    selector: 'app-create-qrcode',
    templateUrl: './create-qrcode.component.html',
    styleUrls: ['./create-qrcode.component.less']
})
export class CreateQrcodeComponent implements OnInit {
    createForm: FormGroup;
    secretInputType: string;
    qrcodeType: number;
    qrcodeParams: any[];
    channel: string;
    appIdErr: boolean;
    appIdErrMessage: string;
    isParamsNameErr: any;    // 判断是否输入错误
    isParamsNumberErr: any;
    paramsNameErrMessage: string;
    paramsNumberErrMessage: string;
    isPathLengthErr: boolean;
    isUtmSourceErr: boolean;
    isUtmSourceNull: boolean;
    isUrlParamsLengthErr: boolean;
    urlParamsLengthErrMessage: string;
    isNoUtmSource: boolean;

    @Input() productId: number;
    @Input() appId: string;
    @Input() secret: string;

    @Output() closeModel = new EventEmitter<boolean>();
    @Output() showNext = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
                public service: QrcodeService,
                public message: NzMessageService) {
        const that = this;
        that.qrcodeType = 1;
        that.secretInputType = 'password';
        that.channel = '0';
        that.createForm = fb.group({
            qrcodeName: ['', [Validators.required, that.checkQrocdeName, that.inputCheck1], that.checkQrcodeName],
            // appId: ['', [Validators.required, Validators.maxLength(18)]],
            // appSecret: ['', [Validators.required, Validators.maxLength(32)]],
            appId: ['', [Validators.required]],
            appSecret: ['', [Validators.required]],
            qrcodePath: ['', [Validators.required, that.inputCheckPath]],
            channel: '',
            utmSource: ['', [Validators.maxLength(42), that.inputCheck2]]
        });
        that.qrcodeParams = [{paramName: '', paramValue: ''}];
        that.appIdErrMessage = '';
        that.paramsNameErrMessage = '';
        that.isParamsNameErr = [];
        that.isParamsNumberErr = [];
        that.isUrlParamsLengthErr = false;
        that.isPathLengthErr = false;
        that.isUtmSourceErr = false;
        that.urlParamsLengthErrMessage = '';
        that.isNoUtmSource = false;
        that.isUtmSourceNull = false;
    }

    ngOnInit() {
    }

    checkQrocdeName = (control: FormControl): {[key: string]: any} => {
        const that = this;
        let flag = false;
        const controlV = control.value;
        const length = that.getLength(controlV);
        if (length > 42) {
            flag = true;
        }
        return flag ? {'length': {value: control.value}} : null;
    }

    inputCheckPath = (control: FormControl): {[key: string]: any} => {
//        const that = this;
        let flag = false;
        const controlV = control.value;
        const tmp = new RegExp('^[-A-Za-z0-9\/\_]+$');
        if (tmp.test(controlV)) {
            flag = false;
        } else if (!tmp.test(controlV)) {
            flag = true;
        }
        if (controlV === null || controlV === '' || controlV === undefined) {
            flag = false;
        }
        return flag ? {'auto': {value: control.value}} : null;
    }

    // 包含数字、字母和中文
    inputCheck1 = (control: FormControl): {[key: string]: any} => {
//        const that = this;
        let flag = false;
        const controlV = control.value;
        const tmp = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$');
        if (tmp.test(controlV)) {
            flag = false;
        } else if (!tmp.test(controlV)) {
            flag = true;
        }
        if (controlV === null || controlV === '' || controlV === undefined) {
            flag = false;
        }
        return flag ? {'auto': {value: control.value}} : null;
    }

    // 包含数字和字母
    inputCheck2 = (control: FormControl): {[key: string]: any} => {
//        const that = this;
        let flag = false;
        const controlValue = control.value;
        const tmp = new RegExp('^[A-Za-z0-9]+$');
        if (tmp.test(controlValue)) {
            flag = false;
        } else if (!tmp.test(controlValue)) {
            flag = true;
        }
        if (controlValue === null || controlValue === '' || controlValue === undefined) {
            flag = false;
        }
        return flag ? {'auto': {value: control.value}} : null;
    }

    checkQrcodeName = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
        const that = this;
        that.service.checkQrcodeName(control.value, that.productId).subscribe((data: any) => {
            if (data.code === 200 && data.data.count === 0) {
                observer.next(null);
            } else {
                observer.next({'error': true, 'duplicated': true});
            }
            observer.complete();
        });
    })

    /**
     * 点击显示或隐藏APPSecret显示
     */
    changeSecretType() {
        const that = this;
        if (that.secretInputType === 'password') {
            that.secretInputType = 'text';
        } else if (that.secretInputType === 'text') {
            that.secretInputType = 'password';
        }
    }

    /**
     * 选择二维码样式
     */
    selectQrcode(value: number) {
        const that = this;
        that.qrcodeType = value;
    }

    /**
     * 占时无用
     */
    changeSelectChannel(e: any) {
//        const that = this;
    }

    /**
     * 添加参数
     */
    addParams() {
        const that = this;
        const length = that.qrcodeParams.length;
        let flag = true;
        for (let i = 0; i < length; i++) {
            if (!that.qrcodeParams[i].paramName) {
                flag = false;
                that.isParamsNameErr[i] = true;
                that.paramsNameErrMessage = '请输入参数名';
            }
            if (!that.qrcodeParams[i].paramValue) {
                flag = false;
                that.isParamsNumberErr[i] = true;
                that.paramsNumberErrMessage = '请输入参数值';
            }
        }
        if (flag) {
            that.qrcodeParams.push({paramName: '', paramValue: ''});
        }
    }

    /**
     * 删除一条参数
     * @param index
     */
    removeParams(index: number) {
        const that = this;
        that.qrcodeParams.splice(index, 1);
        that.checkUrlParamsLength('param');
    }

    createQrcode() {
        const that = this;
        if(that.createForm.get('qrcodeName').dirty && that.createForm.get('qrcodeName').errors || that.createForm.get('qrcodeName').pending){
            return;
        }
        for (const i in that.createForm.controls) {
            if (that.createForm.controls.hasOwnProperty(i)) {
                that.createForm.controls[i].markAsDirty();
                // that.createForm.controls[i].updateValueAndValidity();
            }
        }
        if (that.createForm.invalid) {
            return;
        }
        const json = JSON.parse(JSON.stringify(that.createForm.value));
        json['qrcodeParams'] = JSON.parse(JSON.stringify(that.qrcodeParams));
        for (let i = 0; i < that.qrcodeParams.length; i++) {
            if (!that.qrcodeParams[i].paramName && !that.qrcodeParams[i].paramValue && i === 0) {
                json['qrcodeParams'].pop();
                break;
            }
            if (!that.qrcodeParams[i].paramName) {
                that.isParamsNameErr[i] = true;
                that.paramsNameErrMessage = '请输入参数名';
            }
            if (!that.qrcodeParams[i].paramValue) {
                that.isParamsNumberErr[i] = true;
                that.paramsNumberErrMessage = '请输入参数值';
            }
        }
        if (that.appIdErr || that.arrayCheck(that.isParamsNameErr) || that.arrayCheck(that.isParamsNumberErr)) {
            return;
        }
        if (that.channel === '1' && !that.createForm.value.utmSource) {
            that.isUtmSourceNull = true;
            return;
        }
        if (that.channel === '1' && that.isUtmSourceNull) {
            return;
        }
        json['productId'] = +that.productId;
        json['qrcodeType'] = that.qrcodeType;
        if (that.channel === '0') {
            delete json.utmSource;
        }
        delete json.channel;
        that.service.createQrocde(json).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.data) {
                    that.showNext.emit(res.data);
                } else {
                    that.closeModel.emit(true);
                }
            } else {
                if (res.code === 7003) {
                    that.appIdErr = true;
                    that.appIdErrMessage = res.message;
                } else {
                    that.message.create('warning', res.message);
                }
            }
        }, (error: any) => {
            console.log('error=>>', error);
        });
    }

    arrayCheck(list: any) {
        let flag = false;
        const length = list.length;
        for (let i = 0; i < length; i++) {
            if (list[i]) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    changeAppId() {
        const that = this;
        if (that.appIdErr) {
            that.appIdErr = false;
        }
    }

    checkParamName(data: any, index: number) {
        const that = this;
        if (!data.paramValue && !data.paramName) {
            that.isParamsNameErr[index] = false;
            that.isParamsNumberErr[index] = false;
            return;
        }
        if (data.paramValue && !data.paramName) {
            that.isParamsNameErr[index] = true;
            that.paramsNameErrMessage = '请输入参数名';
            return;
        }
        const reg = /^[a-zA-Z]+$/;
        if (!reg.test(data.paramName)) {
            that.isParamsNameErr[index] = true;
            that.paramsNameErrMessage = '请输入字母';
            return;
        }
        that.isParamsNameErr[index] = false;
        that.checkUrlParamsLength('param');
    }

    checkParamValue(data: any, index: number) {
        const that = this;
        if (!data.paramValue && !data.paramName) {
            that.isParamsNameErr[index] = false;
            that.isParamsNumberErr[index] = false;
            return;
        }
        if (data.paramName && !data.paramValue) {
            that.isParamsNumberErr[index] = true;
            that.paramsNumberErrMessage = '请输入参数值';
            return;
        }
        const reg = /^[0-9a-zA_Z]+$/;
        if (!reg.test(data.paramValue)) {
            that.isParamsNumberErr[index] = true;
            that.paramsNumberErrMessage = '请输入字母或者数字';
            return;
        }
        that.isParamsNumberErr[index] = false;
        that.checkUrlParamsLength('param');
    }

    checkUrlParamsLength(type: any) {
        const that = this;
        let tmpStr = '';
        tmpStr = tmpStr + that.createForm.value.qrcodePath;
        if (type === 'path') {
            if (tmpStr.length > 128) {
                that.isPathLengthErr = true;
                that.urlParamsLengthErrMessage = '长度限制在128个字符 ，可包含数字或英文';
            } else {
                that.isPathLengthErr = false;
                that.urlParamsLengthErrMessage = '';
            }
        }
        if (that.channel === '1') {
            if (type === 'utmSource' && !that.createForm.value.utmSource) {
                that.isUtmSourceNull = true;
            }
            tmpStr = tmpStr + '?utmSource=' + that.createForm.value.utmSource;
        }
        if (type === 'utmSource') {
            if (tmpStr.length > 128) {
                that.isUtmSourceErr = true;
                that.urlParamsLengthErrMessage = '页面路径和参数长度限制在128个字符 ，可包含数字或英文';
            } else {
                that.isUtmSourceErr = false;
                that.urlParamsLengthErrMessage = '';
            }
            if (tmpStr.length) {
                that.isUtmSourceNull = false;
            }
        }
        if (that.qrcodeParams && that.qrcodeParams.length > 0) {
            for (let i = 0; i < that.qrcodeParams.length; i++) {
                if (!that.qrcodeParams[i].paramName && !that.qrcodeParams[i].paramValue) {
                    continue;
                }
                tmpStr += `&${that.qrcodeParams[i].paramName}=${that.qrcodeParams[i].paramValue}`;
            }
        }
        if (tmpStr.length > 128) {
            that.isUrlParamsLengthErr = true;
            that.urlParamsLengthErrMessage = '页面路径和参数长度限制在128个字符 ，可包含数字或英文';
        } else {
            that.isUrlParamsLengthErr = false;
        }
    }

    getLength(str) {
        const l = str.length;
        let unicodeLen = 0;
        for (let i = 0; i < l; i++) {
            if ((str.charCodeAt(i) > 127)) {
                unicodeLen++;
            }
            unicodeLen++;
        }
        return unicodeLen;
    }

    /**
     * 关闭弹框
     */
    cancel() {
        const that = this;
        that.closeModel.emit(true);
    }
}
