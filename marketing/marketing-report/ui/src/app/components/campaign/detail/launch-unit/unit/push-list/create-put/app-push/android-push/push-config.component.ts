import {Component, Input, EventEmitter, Output} from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { AppConfResourceService } from "../../../../../../../../../services/campaign/app_conf.resource.service";
import { SegmentCommunicationService } from "../../../../../../../../../services/communication/segment.communication.service";

@Component({
	selector: 'android-push-config',
	templateUrl: 'push-config.component.html',
	styleUrls: ['push-config.component.css'],
	// providers: [AppConfigService]
})
export class AndroidPushConfigComponent {
	private show: boolean;
	private pushConfigList: any = [];
	defaultPushPlatform: SelectItem[] = []; //默认推送通道列表
	pushPlatform: any = [];
	isError: any = {}; 

	//TODO 输出数据
	@Input()
	// showDialog: Boolean = false;
	set showDialog(bl: boolean) {
		this.show = bl;
	}

	@Input()  //推送app配置
	set appConf(data: any) {
		if (data && data[0]){
			this.config = data;
			this.pushConfigList = [];
			if (data[0].jpushKey || data[0].jpushSecret) {
				let json: any = {
					'app': data[0].appId,
					'channel': 4,
					'thirdApp': '',
					'thirdKey': data[0].jpushKey,
					'thirdSecret': data[0].jpushSecret,
					'pid': this.segmentCommunicationService.pid,
					'editStatus': 1
				}
				this.pushConfigList.push(json);
			}
			if (data[0].getuiApp || data[0].getuiKey || data[0].getuiSecret) {
				let json: any = {
					'app': data[0].appId,
					'channel': 3,
					'thirdApp': data[0].getuiApp,
					'thirdKey': data[0].getuiKey,
					'thirdSecret': data[0].getuiSecret,
					'pid': this.segmentCommunicationService.pid,
					'editStatus': 1
				}
				this.pushConfigList.push(json);
			}
		}
	}

	//绑定配置时选择的app TODO:值
	// @Input() app:string;

	@Output() hideDialog = new EventEmitter<boolean>();

	config: any;

	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private appConfResourceService: AppConfResourceService
	) {
		this.defaultPushPlatform.push({label: '个推', value: '3'});
		this.defaultPushPlatform.push({label: '极光推送', value: '4'});
		this.pushPlatform.push(this.defaultPushPlatform);
	}

	ngOnInit(){
		// this.appConfigService.getAppConfInfo(this.app).then((data:any)=>{
		// 	this.appConf = data;
		// 	if(this.appConf){
		// 		if(this.appConf.getui_app&&''!=this.appConf.getui_app){
		// 			this.respTransToView(3,this.appConf.getui_app,this.appConf.getui_key,this.appConf.getui_secret);
		// 		}
		// 		if(this.appConf.jpush_key&&''!=this.appConf.jpush_secret){
		// 			this.respTransToView(4,'',this.appConf.jpush_key,this.appConf.jpush_secret);
		// 		}
		// 	}
		// });
	}

	bind(index: number) {
		let that = this;
		let data = Object.assign({}, that.pushConfigList[index]);
		delete data.editStatus;
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
			that.pushConfigList[index].editStatus = 1;
		}).catch(err => {});
		// data.app = this.app;
		// this.appConfigService.updateThirdchannelConfig(data).then((data:any)=>{
		// 	this.pushConfigList[index].editStatus = 1;//已绑定
		// });
	}

	//删除推送通道配置
	del(index: number){
		let that = this;
		let data = that.pushConfigList[index];
		delete that.isError[index];
		that.appConfResourceService.clearApp(that.config[0].appId, +data.channel).then(result => {
			let json = {
				label: data.channel == '3' ? '个推' : '极光推送',
				value: data.channel
			};
			//如果配置有两条的情况下 pushPlatform也有两个数组 删除一跳配置 需要修改pushPlatform
			//当配置只有一条的情况下 不用修改pushPlatform
			if (that.pushConfigList.length == 2) {
				if (index === 1) {
					that.pushPlatform[0].push(json);
					that.pushPlatform.pop();
				} else {
					that.pushPlatform[1].push(json);
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
		} else {  //没有推送通道配置 添加 默认先添加极光推送
			channel = 4;
		}
		let data: any = {
			'app': this.config[0].appId,
			'channel': channel,
			'thirdApp': '',
			'thirdKey': '',
			'thirdSecret':'',
			'pid': this.segmentCommunicationService.pid,
			'editStatus':0
		}
		this.pushConfigList.push(data);
	}

	afterHide(){
		this.hideDialog.emit(this.show);
	}
}