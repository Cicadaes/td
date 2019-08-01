import {Component, Input, Output, EventEmitter} from '@angular/core';
// import {AppConfigService} from "../../../../../services/marketing/create-put/app-config.communication.service";
import {Message} from 'primeng/primeng';
import { AppConfResourceService } from "../../../../../../../../../services/campaign/app_conf.resource.service";
import { SegmentCommunicationService } from "../../../../../../../../../services/communication/segment.communication.service";

@Component({
	selector: 'ios-push-config',
	templateUrl: 'ios-push-config.component.html',
	styleUrls: ['ios-push-config.component.css'],
	providers: []
})
export class IOSPushConfigComponent {
	private show: boolean;

	uploadFiles: any[] = [];

	file:any;

	pwd:any;

	file1:any;

	file2:any;

	testPwd :string;

	proPwd:string;

	appConf:any = {};

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

	//绑定配置时选择的app TODO:值
	@Input() app:string;

	//TODO 输出数据
	@Input()
	// showDialog: Boolean = false;
	set showDialog(bl: boolean) {
		this.show = bl;
	}

	@Output() hideDialog = new EventEmitter<boolean>();

	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private appConfResourceService: AppConfResourceService
	) {
		if (!segmentCommunicationService.appConf[0]) {
			segmentCommunicationService.appConf[0] = {};
		}
		if (segmentCommunicationService.appConf[0].devExpiryDate) {
			this.editDevStatus = false;
			if(segmentCommunicationService.appConf[0].devExpiryDate > Date.now()) {
				this.devIsExpiration = true;
			} else {
				this.devIsExpiration = false;
			}
		}
		if (segmentCommunicationService.appConf[0].prodExpiryDate) {
			this.editDevStatus = false;
			if (segmentCommunicationService.appConf[0].prodExpiryDate > Date.now()) {
				this.prodIsExpiration = true;
			} else {
				this.prodIsExpiration = false;
			}
		}
	}

	ngOnInit(){
		// this.appConfigService.getAppConfInfo(this.app).then((data:any)=>{
		// 	this.appConf = data;
		// 	if(data.pemd_endtime){
		// 		this.editDevStatus = false;
		// 	}
		// 	if(data.pemp_endtime){
		// 		this.editProStatus = false;
		// 	}
		// });
	}

	selectedTestFile(event:any){
		if(this.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			this.segmentCommunicationService.appConf[0].devFilename = infos[infos.length-1];
			this.file1 = event.target.files[0];
			this.testTipShow = false;
			this.pwdTestShow = true;
		}else{
			//this.showErrorInfo("上传的证书文件格式不正确");
			this.testTipShow = true;
			this.testPasswordTip = false;
		}
	}

	selectedProFile(event:any){
		if(this.checkFileName(event.target.value)) {
			let infos = event.target.value.split('\\');
			this.segmentCommunicationService.appConf[0].prodFilename = infos[infos.length-1];
			this.file2 = event.target.files[0];
			this.pwdProShow = true;
			this.proTipShow = false;
		}else{
			//this.showErrorInfo("上传的证书文件格式不正确");
			this.proTipShow = true;
			this.prodPasswordTip = false;
		}
	}

	upload(tp: number){
		//tp:0：开发证书，1：生产证书
		let that = this;
		if (tp === 0){
			this.file = this.file1;
			if (!this.testPwd) {
				this.testPasswordTip = true;
				return;
			}
			this.pwd = this.testPwd;
		}else{
			this.file = this.file2;
			if (!this.proPwd) {
				this.prodPasswordTip = true;
				return;
			}
			this.pwd = this.proPwd;
		}
		//加提示file为空
		if(this.file){
			that.appConfResourceService.upload(this.beforUpload(this.file, this.pwd), this.app, tp).then(data => {
				if(data.desc == 'ok') {
					this.testTipShow = false;
					this.proTipShow = false;
					if (tp === 0) {
						that.segmentCommunicationService.appConf[0].devExpiryDate = data.et;
						that.testPwd = "";
						that.editDevStatus = false;
					} else if (tp === 1) {
						that.segmentCommunicationService.appConf[0].prodExpiryDate = data.et;
						that.proPwd = "";
						that.editProStatus = false;
					}
				} else {
					that.showErrorInfo(data.desc);
				}
			});
		}else{
			that.showErrorInfo('请上传证书。');
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

	showErrorInfo(info:any){
		this.msgs = [];
		this.msgs.push({severity:'error', summary:'Error Message', detail:info});
		return false;
	}

	afterHide(){
		this.hideDialog.emit(this.show);
	}
	cancel (){
		this.editProStatus = false;
		//console.log(this.segmentCommunicationService.appConf[0],this.segmentCommunicationService.appConf[0].prodExpiryDate);
	}
}