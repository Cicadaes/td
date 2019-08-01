import { Component } from '@angular/core';
import { 
    DropdownModule,
    Message,
    DialogModule,
    ButtonModule,
    SelectItem
} from 'primeng/primeng';
import { ConfirmationService } from "primeng/components/common/api";
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';
import { AppConfResourceService } from './../../../services/campaign/app_conf.resource.service';

@Component({
    selector: 'apply-push-config',
    templateUrl: 'apply-push-config.component.html',
    styleUrls: ['apply-push-config.component.css'],
    providers: [ConfirmationService,ErrorHandlingService,AppConfResourceService]
})

export class ApplyPushConfigComponent {

	appConfList: SelectItem[];//App列表
	selectedAppConf: any = {};//选中的app
	pid: any;//选中app的productId
	appConf:any = {};//app配置信息

	newDisplay:boolean = false; //新建弹框显隐
	appInfo: any = {};//新建appInfo
	desWarnShow: boolean = false;//描述错误显示

    //推送配置
    private pushConfigList: any = [];
	defaultPushPlatform: SelectItem[] = []; //推送通道列表
	pushPlatform: any = [];
	isError: any = {}

    //增强通道配置
    appConfReq:any;
    des: any = {};  //绑定后的提示文字
	error: any = {}; //错误

    // IOS推送配置
    uploadFiles: any[] = [];
	file:any;
	pwd:any;
	file1:any;
	file2:any;
	testPwd :string;
	proPwd:string;
	msgs: Message[] = [];
	editDevStatus:boolean = true;
	editProStatus:boolean = true;
	testTipShow:boolean = false; //测试证书格式提示
	proTipShow:boolean = false;  //生产证书格式提示
	pwdProShow:boolean = false;
	pwdTestShow:boolean = false;
	devIsExpiration: boolean = false;  //判断测试证书是否过期
	prodIsExpiration: boolean = false;  //判断生产证书是否过期
	testPasswordTip: boolean = false; //测试证书 密码为空提示
    prodPasswordTip: boolean = false; //生产证书 密码为空提示
    
    oldProdFilename: string = '';
    oldDevFilename: string = '';

    constructor (
        private confirmationService:ConfirmationService,
        public errorHandlingService: ErrorHandlingService,
        private appConfResourceService: AppConfResourceService,
    ) {
        let that = this;

        /*this.defaultPushPlatform.push({label: '个推', value: '3'});
		this.defaultPushPlatform.push({label: '极光推送', value: '4'});
		this.pushPlatform.push(this.defaultPushPlatform);*/
    }

    ngOnInit(){
        let that = this;
		that.getAppList();
    }

	newApp(){
		this.newDisplay = true;
		this.appInfo = {};
	}

	//获取app列表
	getAppList() {
		let that = this;
		that.appConfList = [];
		that.appConfResourceService.getAppList().then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				let err = that.errorHandlingService.getMsg(data);
                that.showErrorInfo("warn",err.message);
                return;
			}
			if (data) {
				for (let i = 0; i < data.length; i++) {
					that.appConfList.push({label: data[i].appName, value: data[i]});
				}
				that.pid = data[0].productId;
				that.appConfResourceService.getAppByAppId(data[0].appId).then((data: any) => {
					if (data && (data.retCode || data.msgDes)) {
						let err = that.errorHandlingService.getMsg(data);
						that.showErrorInfo("warn",err.message);
						return;
					}
					if (data) {
						that.appConf = data;
					} else {
						that.appConf = {};
					}
					that.initAndroidPushConfig([data]);
					that.initIOSPushConfig();
				}).catch(err => {})
			}
		}).catch(err => {})
	}

	//改变app
	changeApp(e: any) {
		let that = this;
		that.appConfResourceService.getAppByAppId(e.value.appId).then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				let err = that.errorHandlingService.getMsg(data);
				that.showErrorInfo("warn",err.message);
				return;
			}
			if (data) {
				that.appConf = data;
			} else {
				that.appConf = {};
			}
			that.pid = e.value.productId;
			that.initAndroidPushConfig([data]);
			that.initIOSPushConfig();
		}).catch(err => {})
		that.initError();
	}

	//初始化错误提示
	initError(){
		let that = this;
		that.desWarnShow = false;//描述错误显示
		that.testTipShow = false; //测试证书格式提示
		that.proTipShow = false;  //生产证书格式提示
		that.pwdProShow = false;
		that.pwdTestShow = false;
		that.devIsExpiration = false;  //判断测试证书是否过期
		that.prodIsExpiration = false;  //判断生产证书是否过期
		that.testPasswordTip = false; //测试证书 密码为空提示
		that.prodPasswordTip = false; //生产证书 密码为空提示
	}
	
	confirmNew (){
        //调提交接口
        let that = this;
		if(!that.appInfo.appId){
			that.showErrorInfo("warn","请输入appID");
			return ;
		}
		if(!that.appInfo.productId){
			that.showErrorInfo("warn","请输入产品ID");
			return ;
		}
        if(that.appInfo.appName){
            if(that.appInfo.appName.length > 32){
                that.showErrorInfo("warn","名称长度不能超过32！");
				return ;
            }
            if(that.appInfo.description && that.appInfo.description.length > 240){
                that.desWarnShow = true;
            }else{
                that.desWarnShow = false;
				that.appConfResourceService.createApp(that.appInfo).then((data:any)=>{
					if(data && (data.retCode || data.msgDes)) {
						let err = that.errorHandlingService.getMsg(data);
						that.showErrorInfo("warn",err.message);
						return;
					}
					if(data.id){
						that.showErrorInfo("success","添加成功!");
						that.newDisplay = false;
						that.getAppList();
						that.selectedAppConf = data;
						delete that.selectedAppConf._$visited;
						// console.log("添加后设置selected====>",that.selectedAppConf);
					}
				}).catch();
			}
        }else{
            this.showErrorInfo("warn","名称不能为空!");
        }
        
    }
	
	//新建取消
    cancelNew (){
        this.newDisplay = false;
    }

	//描述修改时触发
	textareaChange (){
        this.desWarnShow = false;
    }



	//初始化安卓推送配置
	initAndroidPushConfig(data: any) {
		this.pushConfigList = [];
		//清空下拉选择的推送平台
		this.defaultPushPlatform = [];
		this.pushPlatform = [];
		if (data && data[0]) {
			if(!(data[0].jpushKey || data[0].jpushSecret) && !(data[0].getuiApp || data[0].getuiKey || data[0].getuiSecret)){
				this.defaultPushPlatform.push({label: '个推', value: '3'});
				this.defaultPushPlatform.push({label: '极光推送', value: '4'});
				this.pushPlatform.push(this.defaultPushPlatform);
				// console.log("this.pushPlatform111",this.pushPlatform);
			}
			if (data[0].jpushKey || data[0].jpushSecret) {
				let json: any = {
					'app': data[0].appId,
					'channel': 4,
					'thirdApp': '',
					'thirdKey': data[0].jpushKey,
					'thirdSecret': data[0].jpushSecret,
					'pid': this.pid,
					'editStatus': 1
				}
				this.pushConfigList.push(json);
				this.defaultPushPlatform.push({label: '极光推送', value: '4'});
				this.pushPlatform.push(this.defaultPushPlatform);
				// console.log("this.pushPlatform222",this.pushPlatform);
				
			}
			if (data[0].getuiApp || data[0].getuiKey || data[0].getuiSecret) {
				let json: any = {
					'app': data[0].appId,
					'channel': 3,
					'thirdApp': data[0].getuiApp,
					'thirdKey': data[0].getuiKey,
					'thirdSecret': data[0].getuiSecret,
					'pid': this.pid,
					'editStatus': 1
				}
				 this.pushConfigList.push(json);
				this.defaultPushPlatform.push({label: '个推', value: '3'});
				// console.log("this.defaultPushPlatformaaa",this.defaultPushPlatform);
				
				 this.pushPlatform.push(this.defaultPushPlatform);
				// console.log("this.pushPlatform333",this.pushPlatform); 
				
				
			}
		}
		else {
			 this.defaultPushPlatform.push({label: '个推', value: '3'});
			this.defaultPushPlatform.push({label: '极光推送', value: '4'});
			this.pushPlatform.push(this.defaultPushPlatform);
				// console.log("this.pushPlatform444",this.pushPlatform);
			
		}
	}

	//绑定推送配置
    bind(index: number) {
		let that = this;
		let data = Object.assign({}, that.pushConfigList[index]);
		delete data.editStatus;
		data['app'] = that.appConf['appId'];
		if (data.channel == 3 && !data.thirdApp) {
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
		that.appConfResourceService.updateApp(data).then(result => {
			let info = result._body;
			if('success' == info){
				that.pushConfigList[index].editStatus = 1;
				that.showErrorInfo("success","绑定成功！");
			}else if("fail" == info){
				that.showErrorInfo("erro","系统错误！");
			}else{//其他错误
				that.showErrorInfo("warn",info);
			}
		}).catch(err => {});
	}

	//删除推送通道配置
	del(index: number){
		let that = this;
		let data = that.pushConfigList[index];
		delete that.isError[index];
		that.appConfResourceService.clearApp(that.appConf.appId, +data.channel).then(result => {
			if(result && 'success' != result._body){
				that.showErrorInfo("erro","删除失败");
				return ;
			}
			let json = {
				label: data.channel == '3' ? '个推' : '极光推送',
				value: data.channel
			};
			//如果配置有两条的情况下 pushPlatform也有两个数组 删除一跳配置 需要修改pushPlatform
			//当配置只有一条的情况下 不用修改pushPlatform
			if (that.pushConfigList.length == 2) {
				if (index === 1) {
					if(that.pushPlatform[0].length != 2){
						that.pushPlatform[0].push(json);
					}
					that.pushPlatform.pop();
				} else {
					if(that.pushPlatform[1].length != 2){
						that.pushPlatform[1].push(json);
					}
					that.pushPlatform.shift();
				}
			}
			that.pushConfigList.splice(index, 1);
		});
	}

	addConf() {
		let channel:any;
        if (this.pushConfigList[0] && this.pushConfigList[0].channel == 3) {   //当已有一条推送通道配置时 再添加 需要修改pushPlatform来让下拉框内容改变
			channel = 4;
			let arry: SelectItem[] = [];
			arry.push({label: '极光推送', value: '4'});
			this.pushPlatform.push(arry);
			for (let i = 0; i < this.pushPlatform[0].length; i++) {
				if (this.pushPlatform[0][i].value == '4') {
					this.pushPlatform[0].splice(i, 1);
					break;
				}
			}
		} else if (this.pushConfigList[0] && this.pushConfigList[0].channel == 4) {
			channel = 3;
			let arry: SelectItem[] = [];
			arry.push({label: '个推', value: '3'});
			this.pushPlatform.push(arry);
			for (let i = 0; i < this.pushPlatform[0].length; i++) {
				if (this.pushPlatform[0][i].value == '3') {
					this.pushPlatform[0].splice(i, 1);
					break;
				}
			}
		}
		else{//没有推送通道配置 添加 默认先添加极光推送
            channel = 4;
        }
		let data: any = {
			'app': this.appConf['appId'],
			'channel': channel,
			'thirdApp': '',
			'thirdKey': '',
			'thirdSecret':'',
			'pid': this.pid,
			'editStatus':0
		}
		this.pushConfigList.push(data);
	}
   


    bindXm() {
		//channel：1：小米  2华为 3个推  4极光
		let channel = 1;
		if (!this.appConf.xmApp) {
			this.error['xm'] = 'appId';
			this.showErrorInfo("info","请输入小米appId");
			return;
		}
		if (!this.appConf.xmSecret) {
			this.error['xm'] = 'secret';
			this.showErrorInfo("info","请输入小米secret");
			return;
		}
		this.transDataToReq(channel, this.appConf.xmApp, this.appConf.xmSecret);
	}

	bindHw() {
		let channel = 2;
		if (!this.appConf.hwApp) {
			this.error['hw'] = 'appId';
			this.showErrorInfo("info","请输入华为appId");
			return;
		}
		if (!this.appConf.hwSecret) {
			this.error['hw'] = 'secret';
			this.showErrorInfo("info","请输入华为secret");
			return;
		}
		this.transDataToReq(channel, this.appConf.hwApp, this.appConf.hwSecret);
	}

	transDataToReq(channel:number,app:string,secret:string){
		let that = this;
		let json = {
			app: that.appConf['appId'],
			pid: that.pid,
			channel: channel,
			thirdApp: app,
			thirdSecret: secret
		}
		that.appConfResourceService.updateApp(json).then((data:any) => {
			if (data && (data.retCode && data.msgDes)) {
				let err = that.errorHandlingService.getMsg(data);
                that.showErrorInfo("warn",err.message);
                return;
			}
			if (data && data._body === 'success') {
				if (channel === 1) {
					that.des['xm'] = '绑定成功';
					that.des['hw'] = '';
					that.error['xm'] = '';
				} else if (channel === 2) {
					that.des['xm'] = '';
					that.des['hw'] = '绑定成功';
					that.error['hw'] = '';
				}
				that.des['tp'] = true;
			} else if (data && data._body === 'fail') {
				if (channel === 1) {
					that.des['xm'] = '绑定失败';
					that.des['hw'] = ''
				} else if (channel === 2) {
					that.des['xm'] = ''
					that.des['hw'] = '绑定失败';
				}
				that.des['tp'] = false;
			}
		}).catch(err => {})
	}



	//初始化IOS推送通道
	initIOSPushConfig(){
        let that = this;
		if (that.appConf.devExpiryDate) {
			this.editDevStatus = false;
			if(that.appConf.devExpiryDate > Date.now()) {
				this.devIsExpiration = true;
			} else {
				this.devIsExpiration = false;
			}
		}
		if (that.appConf.prodExpiryDate) {
			this.editProStatus = false;
			if (that.appConf.prodExpiryDate > Date.now()) {
				this.prodIsExpiration = true;
			} else {
				this.prodIsExpiration = false;
			}
		}
	}

    selectedTestFile(event:any){
		if(!event.target.value) {
			return;
		}
		if(this.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			this.appConf.devFilename = infos[infos.length-1];
			this.file1 = event.target.files[0];
			this.testTipShow = false;
			this.pwdTestShow = true;
		}else{
			this.showErrorInfo("error","上传的证书文件格式不正确");
			this.testTipShow = true;
			this.testPasswordTip = false;
			this.pwdTestShow = false;
		}
	}

	selectedProFile(event:any){
		if(!event.target.value) {
			return;
		}
		if(this.checkFileName(event.target.value)) {
			let infos = event.target.value.split('\\');
			this.appConf.prodFilename = infos[infos.length-1];
			this.file2 = event.target.files[0];
			this.pwdProShow = true;
			this.proTipShow = false;
		}else{
			this.showErrorInfo("error","上传的证书文件格式不正确");
			this.proTipShow = true;
			this.prodPasswordTip = false;
			this.pwdProShow = false;
		}
	}

	upload(tp: number){
		//tp:0：开发证书，1：生产证书
		let that = this;
		if (tp === 0){
			this.file = this.file1;
			this.pwd = this.testPwd;
		}else{
			this.file = this.file2;
			this.pwd = this.proPwd;
		}
		if(!that.pwd) {
			that.pwd = "";
		}
		//加提示file为空
		if(this.file){
			that.appConfResourceService.upload(this.beforUpload(this.file, this.pwd), this.appConf['appId'], tp).then(data => {
				if(data.desc == 'ok') {
					this.testTipShow = false;
					this.proTipShow = false;
					if (tp === 0) {
						that.appConf.devExpiryDate = data.et;
						that.testPwd = "";
						that.editDevStatus = false;
					} else if (tp === 1) {
						that.appConf.prodExpiryDate = data.et;
						that.proPwd = "";
						that.editProStatus = false;
					}
				} else {
					that.showErrorInfo('error',data.desc);
				}
			});
		}else{
			that.showErrorInfo('warn','请上传证书。');
		}
		
	}

	cancel(type: number) {
		let that = this;
		if(type === 1) {
			that.editProStatus = false;
            that.pwdProShow = false;
            that.appConf.prodFilename = that.oldProdFilename;
			if(that.appConf && null == that.appConf.prodExpiryDate) {
				that.appConf.prodFilename = "";
			}
		}else if(type === 0) {
			that.editDevStatus = false;
            that.pwdTestShow = false;
            that.appConf.devFilename = that.oldDevFilename;
			if(that.appConf && null == that.appConf.devExpiryDate) {
				that.appConf.devFilename = "";
			}
		}
    }
    
    update(type: number) {
        let that = this;
		if(type === 1) {
            that.file2 = null;
			that.editProStatus = true;
            that.pwdProShow = true;
            that.oldProdFilename = that.appConf.devFilename; 
			that.appConf.prodFilename = "";
		}else if(type === 0) {
            that.file1 = null;
			that.editDevStatus = true;
            that.pwdTestShow = true;
            that.oldDevFilename = that.appConf.devFilename;    
            that.appConf.devFilename = "";
		}
    }

	checkFileName(fileName:string){
		if(fileName){
			let tp = fileName.substr(fileName.length-3,3);
			if(tp == 'p12'){
				return true;
			}
		}
		return false;
	}

	beforUpload(file:any,pwd:string){
		let formData = new FormData();
		formData.append("file", file);
		formData.append("pwd", pwd);
		return formData;
	}

	showErrorInfo(msgType:string,info:any){
		this.msgs = [];
		let summary = '';
		if (msgType === 'error' || msgType === 'warn') {
			summary = '错误';
		} else if (msgType === 'info') {
			summary = '成功';
		}
		this.msgs.push({severity: msgType, summary:summary, detail:info});
		return false;
	}
	
}