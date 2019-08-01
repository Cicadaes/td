import {Component, OnInit, Injector, OnChanges} from '@angular/core';
import {BaseComponent} from '../../../common/base-component';
import {ApplyManageService} from '../apply-manage.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-app-push',
    templateUrl: './app-push.component.html',
    styleUrls: ['./app-push.component.less']
})
export class AppPushComponent extends BaseComponent implements OnInit, OnChanges {
    appConf: any = {
        appConfig: {},
        iosChannelConfig: {}
    };                                              // app配置信息
    pushConfigList: any = [];                       // android推送配置
    pushPlatform: any = [];
    defaultPushPlatform: any = [];
    pid: any = 1;
    isError: any = {};
    edTestFile: any;
    channelValue: any;
    msgs: any[];
    error: any = {};
    des: any;
    testTipShow: boolean;
    testPasswordTip: boolean;
    pwdTestShow: boolean;
    pwdProShow: boolean;
    proTipShow: boolean;
    prodPasswordTip: boolean;
    file1: any;
    file2: any;
    editProStatus: boolean;
    oldProdFilename: any;
    editDevStatus: boolean;
    file: any;
    pwd: any;
    testPwd: any;
    proPwd: any;
    devFileFlag: boolean;
    proFileFlag: boolean;
    devIsExpiration: boolean;
    prodIsExpiration: boolean;
    oldDevFilename: any;
    appKey: any;
    itemObj: any;                           // 删除相关信息
    removeFlag = false;                     // 删除弹框
    _item: any;                             // 待删除的某条数据
    deleteIndex: any;

    constructor(private applyManageService: ApplyManageService,
                private injector: Injector,
                private nzMessageService: NzMessageService) {
        super(injector);
    }

    ngOnInit() {
        if (this.commonService.productId) {
            this.productId = Number(this.commonService.productId);
        }
        const appKey = localStorage.getItem('appkey');
        this.appKey = appKey;
        this.getAppConfig();
    }

    // 获取当前APP下的相关配置
    getAppConfig() {
//        const that = this;
        this.applyManageService.getAppConfig().subscribe((response) => {
            if (response.code === 200) {

                if (Object.keys(response.data).length > 0) {
                    this.appConf['appConfig'].appId = this.appKey;
                    this.appConf['iosChannelConfig'] = response.data.iosChannelConfig;
                }

                this.initAndroidPushConfig([response.data]);
                this.initIOSPushConfig();

            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 初始化安卓推送配置
    initAndroidPushConfig(appData: any) {
        const that = this;
        this.pushConfigList = [];
        // 清空下拉选择的推送平台
        this.defaultPushPlatform = [];
        this.pushPlatform = [];
        const androidData = appData[0].androidChannelConfigList || [];
        const data = [];
        data[0] = {};
        for (let i = 0; i < androidData.length; i++) {
            if (androidData[i].code.split('.')[1] === 'jiguang') {
                data[0]['jpushKey'] = androidData[i].key;
                data[0]['jpushSecret'] = androidData[i].secret;
            }

            if (androidData[i].code.split('.')[1] === 'getui') {
                data[0]['getuiApp'] = androidData[i].thirdAppId;
                data[0]['getuiKey'] = androidData[i].key;
                data[0]['getuiSecret'] = androidData[i].secret;
            }

            if (androidData[i].code.split('.')[1] === 'xiaomi') {
                that.appConf.appConfig['xmApp'] = androidData[i].thirdAppId;
                that.appConf.appConfig['xmSecret'] = androidData[i].secret;
            }

            if (androidData[i].code.split('.')[1] === 'huawei') {
                that.appConf.appConfig['hwApp'] = androidData[i].thirdAppId;
                that.appConf.appConfig['hwSecret'] = androidData[i].secret;
            }
        }
        if (data && data[0]) {
            if (!(data[0].jpushKey || data[0].jpushSecret) && !(data[0].getuiApp || data[0].getuiKey || data[0].getuiSecret)) {
                this.defaultPushPlatform.push({label: '个推', value: '3'});
                this.defaultPushPlatform.push({label: '极光推送', value: '4'});
                this.pushPlatform.push(this.defaultPushPlatform);
            }
            if (data[0].jpushKey || data[0].jpushSecret) {
                const json: any = {
                    'app': this.appKey,
                    'channel': 4,
                    'value': '极光推送',
                    'thirdApp': '',
                    'thirdKey': data[0].jpushKey,
                    'thirdSecret': data[0].jpushSecret,
                    'pid': this.pid,
                    'editStatus': 1
                };
                this.pushConfigList.push(json);
                this.defaultPushPlatform.push({label: '极光推送', value: '4'});
                this.pushPlatform.push(this.defaultPushPlatform);

            }
            if (data[0].getuiApp || data[0].getuiKey || data[0].getuiSecret) {
                const json: any = {
                    'app': this.appKey,
                    'channel': 3,
                    'value': '个推',
                    'thirdApp': data[0].getuiApp,
                    'thirdKey': data[0].getuiKey,
                    'thirdSecret': data[0].getuiSecret,
                    'pid': this.pid,
                    'editStatus': 1
                };
                this.pushConfigList.push(json);
                this.defaultPushPlatform.push({label: '个推', value: '3'});
                this.pushPlatform.push(this.defaultPushPlatform);
            }
        } else {
            this.defaultPushPlatform.push({label: '个推', value: '3'});
            this.defaultPushPlatform.push({label: '极光推送', value: '4'});
            this.pushPlatform.push(this.defaultPushPlatform);
        }
    }

    // 初始化IOS推送通道
    initIOSPushConfig() {
        const that = this;
        if (that.appConf.iosChannelConfig.devExpiryDate) {
            this.editDevStatus = false;
            if (new Date(that.appConf.iosChannelConfig.devExpiryDate) < new Date()) {
                this.devIsExpiration = true;
            } else {
                this.devIsExpiration = false;
            }
        }
        if (that.appConf.iosChannelConfig.prodExpiryDate) {
            this.editProStatus = false;
            if (new Date(that.appConf.iosChannelConfig.prodExpiryDate) < new Date()) {
                this.prodIsExpiration = true;
            } else {
                this.prodIsExpiration = false;
            }
        }
    }

    /** ========================  Android推送配置 ===========================*/
    // 选择android推送配置
    chooseOne(value: any, one: any) {
        if (value === '个推') {
            one.channel = 3;
        } else {
            one.channel = 4;
        }
    }

    // bind android推送配置
    bind(index: any) {
        const that = this;
        const data = Object.assign({}, that.pushConfigList[index]);
        delete data.editStatus;
        data['app'] = this.appKey,
            data['pid'] = that.productId;
        if (data.channel === 3 && !data.thirdApp) {
            that.isError[index] = '请先填写appId';
            return;
        }
        if (!data.thirdKey) {
            that.isError[index] = '请先填写appKey';
            return;
        }
        if (!data.thirdSecret) {
            that.isError[index] = '请先填写MasterSecret';
            return;
        }
        that.isError[index] = '';
        if (data.value) {
            delete data.value;
        }
        this.applyManageService.updateAndroidPush(data).subscribe((response) => {
            if (response.code === 200) {
                that.pushConfigList[index].editStatus = 1;
                this.notification.create('success', '提示信息', '绑定成功');
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // delete android推送配置
    delete(index: any) {
        const that = this;
        this.removeFlag = true;
        this.itemObj = {
            type: 'delete',
            message: `请确认是否删除此Android推送配置?`
        };
        this.deleteIndex = index;
        this._item = that.pushConfigList[index];
    }

    // 确定删除
    confirmHideDialog(type: any) {
        const that = this;
        delete that.isError[this.deleteIndex];
        this.applyManageService.deleteAndroidPush(this.appKey, this._item.channel).subscribe((response) => {
            if (response.code === 200) {
//                const json = {
//                    label: this._item.channel === '3' ? '个推' : '极光推送',
//                    value: this._item.channel
//                };
                // 如果配置有两条的情况下 pushPlatform也有两个数组 删除一跳配置 需要修改pushPlatform
                // 当配置只有一条的情况下 不用修改pushPlatform
                if (that.pushConfigList.length === 2) {
                    this.pushPlatform = [];
                    this.defaultPushPlatform = [];
                    this.defaultPushPlatform.push({label: '个推', value: '3'});
                    this.defaultPushPlatform.push({label: '极光推送', value: '4'});
                    this.pushPlatform.push(this.defaultPushPlatform);
                }
                that.pushConfigList.splice(this.deleteIndex, 1);
                this.removeFlag = false;
            } else {
                this.removeFlag = false;
                this.notification.create('warning', '错误提示', response.message);
            }
        }, (err: any) => {
            this.removeFlag = false;
        });
    }

    // 取消删除
    hideItemDialog(type: any) {
        this.removeFlag = false;
    }

    // 添加android推送配置
    addConf() {
        let channel: any;
        let value: any;
        if (this.pushConfigList[0] && this.pushConfigList[0].channel === 3) {   // 当已有一条推送通道配置时 再添加 需要修改pushPlatform来让下拉框内容改变
            channel = 4;
            value = '极光推送';
            const arry = [];
            arry.push({label: '极光推送', value: '4'});
            this.pushPlatform.push(arry);
            for (let i = 0; i < this.pushPlatform[0].length; i++) {
                if (this.pushPlatform[0][i].value === '4') {
                    this.pushPlatform[0].splice(i, 1);
                    break;
                }
            }
        } else if (this.pushConfigList[0] && this.pushConfigList[0].channel === 4) {
            channel = 3;
            value = '个推';
            const arry = [];
            arry.push({label: '个推', value: '3'});
            this.pushPlatform.push(arry);
            for (let i = 0; i < this.pushPlatform[0].length; i++) {
                if (this.pushPlatform[0][i].value === '3') {
                    this.pushPlatform[0].splice(i, 1);
                    break;
                }
            }
        } else { // 没有推送通道配置 添加 默认先添加极光推送
            channel = 4;
            value = '极光推送';
        }
        const data: any = {
            'app': this.appKey,
            'channel': channel,
            'value': value,
            'thirdApp': '',
            'thirdKey': '',
            'thirdSecret': '',
            'editStatus': 0
        };
        this.pushConfigList.push(data);
    }

    /** ========================  Android增强配置 ===========================*/
    bindAndroid(type: any) {
        if (type === 'xm') {
            // channel：1：小米  2华为 3个推  4极光
            const channel = 1;
            if (!this.appConf.appConfig.xmApp) {
                this.error['xm'] = '请输入小米appID';
                return;
            }
            if (!this.appConf.appConfig.xmSecret) {
                this.error['xm'] = '请输入小米Secret';
                return;
            }

            this.error['xm'] = '';
            this.transDataToReq(channel, this.appConf.appConfig.xmApp, this.appConf.appConfig.xmSecret);
        } else {
            const channel = 2;
            if (!this.appConf.appConfig.hwApp) {
                this.error['hw'] = '请输入华为appID';
                return;
            }
            if (!this.appConf.appConfig.hwSecret) {
                this.error['hw'] = '请输入华为Secret';
                return;
            }

            this.error['hw'] = '';
            this.transDataToReq(channel, this.appConf.appConfig.hwApp, this.appConf.appConfig.hwSecret);
        }
    }

    transDataToReq(channel: number, app: string, secret: string) {
        const that = this;
        const json = {
            app: this.appKey,
            pid: that.productId,
            channel: channel,
            thirdApp: app,
            thirdSecret: secret
        };

        this.applyManageService.updateAndroidPush(json).subscribe((response) => {
            if (response.code === 200) {
                this.notification.create('success', '提示信息', '绑定成功');
            } else {
                this.notification.create('warning', '错误提示', '绑定失败');
            }
        });
    }

    /** ========================  IOS推送配置 ===========================*/

    selectedTestFile(event: any) {
        if (!event.target.value) {
            return;
        }
        if (this.checkFileName(event.target.value)) {
            const infos = event.target.value.split('\\');
            this.appConf.iosChannelConfig.devFileName = infos[infos.length - 1];
            this.file1 = event.target.files[0];
            this.testTipShow = false;
            this.pwdTestShow = true;
            this.devFileFlag = false;
        } else {
            this.devFileFlag = true;
            this.testTipShow = true;
            this.testPasswordTip = false;
            this.pwdTestShow = false;
        }
    }

    selectedProFile(event: any) {
        if (!event.target.value) {
            return;
        }
        if (this.checkFileName(event.target.value)) {
            const infos = event.target.value.split('\\');
            this.appConf.iosChannelConfig.prodFileName = infos[infos.length - 1];
            this.file2 = event.target.files[0];
            this.pwdProShow = true;
            this.proTipShow = false;
            this.proFileFlag = false;
        } else {
            this.proFileFlag = true;
            this.proTipShow = true;
            this.prodPasswordTip = false;
            this.pwdProShow = false;
        }
    }

    // 选择文件
    checkFileName(fileName: string) {
        if (fileName) {
            const tp = fileName.substr(fileName.length - 3, 3);
            if (tp === 'p12') {
                return true;
            }
        }
        return false;
    }

    // 更新文件
    update(type: number) {
        const that = this;
        if (type === 1) {
            that.file2 = null;
            that.editProStatus = true;
            that.pwdProShow = true;
            that.oldProdFilename = that.appConf.iosChannelConfig.prodFileName;
            that.appConf.iosChannelConfig.prodFileName = '';
        } else if (type === 0) {
            that.file1 = null;
            that.editDevStatus = true;
            that.pwdTestShow = true;
            that.oldDevFilename = that.appConf.iosChannelConfig.devFileName;
            that.appConf.iosChannelConfig.devFileName = '';
        }
    }

    // 输入密码后的确定
    upload(tp: number) {
        // tp:0：开发证书，1：生产证书
        const that = this;
        if (tp === 0) {
            this.file = this.file1;
            this.pwd = this.testPwd;
        } else {
            this.file = this.file2;
            this.pwd = this.proPwd;
        }
        if (!that.pwd) {
            that.pwd = '';
        }
        // 加提示file为空
        if (this.file) {
            this.applyManageService.updateIOS(this.beforUpload(this.file, this.pwd), this.appKey, tp).subscribe((response) => {
                if (response.code === 200) {
                    this.testTipShow = false;
                    this.proTipShow = false;
                    if (tp === 0) {
                        that.appConf.iosChannelConfig.devExpiryDate = response.data.et;
                        that.testPwd = '';
                        that.editDevStatus = false;
                    } else if (tp === 1) {
                        that.appConf.iosChannelConfig.prodExpiryDate = response.data.et;
                        that.proPwd = '';
                        that.editProStatus = false;
                    }
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else {
            this.notification.create('warning', '错误提示', '请上传证书');
        }
    }

    beforUpload(file: any, pwd: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pwd', pwd);
        return formData;
    }

    // 输入密码后的取消
    cancel(type: number) {
        const that = this;
        if (type === 1) {
            that.editProStatus = false;
            that.pwdProShow = false;
            that.appConf.iosChannelConfig.prodFileName = that.oldProdFilename;
            if (that.appConf && null == that.appConf.iosChannelConfig.prodExpiryDate) {
                that.appConf.iosChannelConfig.prodFileName = '';
            }
        } else if (type === 0) {
            that.editDevStatus = false;
            that.pwdTestShow = false;
            that.appConf.iosChannelConfig.devFileName = that.oldDevFilename;
            if (that.appConf && null == that.appConf.iosChannelConfig.devExpiryDate) {
                that.appConf.iosChannelConfig.devFileName = '';
            }
        }
    }

}
