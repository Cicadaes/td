import { Message } from 'primeng/primeng';
import { Component } from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import { SegmentCommunicationService } from './../../../../../../../../services/communication/segment.communication.service';
import { ChannelDefinitionResourceService } from './../../../../../../../../services/admin/channel_definition.resource.service';
import { UtilesService } from '../../../../../../../../common/utiles.service';
@Component({
	selector: 'create-put-event-msg',
	templateUrl: 'create-put-event-msg.component.html',
	styleUrls: ['create-put-event-msg.component.css'],
	providers: [
		ChannelDefinitionResourceService,
		UtilesService
	]
})
export class CreatePutEventMsgComponent {
	eventName: String;
	channels: SelectItem[] = [];
	selectedChannel: string;
	show:boolean = false;
	msgs: Message[] = [];
	//上传黑名单
	maxFileSize :number=2*1024*1024;//文件大小
	uploadBlacklist: string = '';
	// uploadBlacklist :string=`${this.smsPromotionService.baseUrl}/file/upload`;
	//上传状态
	uploadStatus:boolean;
	uploadFileName:string;
	promotionSms :any = {};
	textIndex: number = 0; //记录插入活动链接位置
	dateRange: any;
	
	csvFileName: string = ""; // 黑名单文件名称
	csvEquityFileName: string = ""; // 权益文件名称
	faultUrl: boolean = false;
	wordLimit: number = 500; //短信内容可输入的字数
	limitSize: number = 500; //显示在页面的可输入字数
	errUrlInfo: string;//插入链接后的错误提示
	pieceIndex: number = 0;//A/B test 的时候用下标区分
	channelList: any;//后端返回的渠道列表
	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private channelDefinitionResourceService: ChannelDefinitionResourceService,
		public utiles: UtilesService
	){
		let that = this;
		if (segmentCommunicationService.startDate && segmentCommunicationService.endDate) {
            that.dateRange = {
                startDate: segmentCommunicationService.startDate,
                endDate: segmentCommunicationService.endDate
            };
        }
		that.promotionSms = segmentCommunicationService.smsSegmentInfo;
		if(segmentCommunicationService.isUpdate == 2){
			that.initSmsPromotion(that.promotionSms);
		}
	};
	ngOnInit(){
		let that = this;
		that.getChannelList();
	}
	//更换渠道时修改内容字数限制
	changeChannel(){
		let that = this;
		that.segmentCommunicationService.isError['channelCode'] = false;
		that.getWordLimit(that.channelList);
		//字数限制变化时，需要重新截取内容
		that.smsContentChange();
	}
	//初始化短信投放 （编辑或新增切换push和短信时）
	initSmsPromotion(data: any){
		let that = this;
		that.promotionSms['name'] = data.name;
	}
	//获取渠道信息
	getChannelList(){
		let that = this;
		let channelType = 2;//和后端约定，channelType为2是查询短信投放渠道
		that.channelDefinitionResourceService.getChanelList(channelType).then((res:any)=>{
			if(res.data){
				let data = res.data;
				that.channelList = res.data;
				for(let i=0;i<data.length;i++){
					that.channels.push({label:data[i].name, value:data[i].code});
				}
				//设置默认渠道
				if(data.length > 0 && !that.promotionSms['channelCode']){
					that.promotionSms['channelCode'] = data[0]['code'];
				}
				that.getWordLimit(data);
				that.smsContentChange();
			}
		});
	}
	//获取内容长度限制字符
	getWordLimit(channelList: any){
		let that = this;
		if(!channelList || channelList.length == 0){
			return ;
		}
		for(let i = 0;i < channelList.length;i++){
			if(that.promotionSms['channelCode'] == channelList[i]['code'] && channelList[i]['sendParam']){
				that.wordLimit = JSON.parse(channelList[i]['sendParam'])['wordLimit'];
				that.limitSize = that.wordLimit;
				break;
			}
		}
	}
	inputChange(){
		let that = this;
		that.faultUrl = false;
	}
	cancel(){
		//TODO取消
		let that = this;
		that.show = !that.show;
	}
	
	save(){
		let that = this;
		if(!that.isURL(that.promotionSms['linkAddress'])){
			that.faultUrl = true;
			return ;
		}
		let content = that.promotionSms.content;//短信没有A/B Test 先先死为0
		if(!content) {
			content = that.promotionSms['linkAddress'];
		} else {
			let length = content.length;
			content = content.substring(0 ,that.textIndex) + that.promotionSms['linkAddress'] + content.substring(that.textIndex, length);
		}
		that.promotionSms.content = content;
		that.promotionSms['linkAddress'] = '';//插入短信内容后清空链接内容
		that.smsContentChange();//插入链接后，若过长会重新截取内容
		that.show = !that.show;
	}
	/**
	 * 校验是否是Url
	 */
	isURL(str_url:string) {// 验证url
		var strRegex = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
			var re=new RegExp(strRegex); 
			//re.test() 
			if (re.test(str_url)) { 
				return true; 
			} else { 
				return false; 
			} 
	}
	//显示添加活动链接浮层
	addLink() {
		let that = this;
		if(that.segmentCommunicationService.isUpdate === 0){
			that.show = false;	
		}else{
			that.show = !that.show;
		}
		
		let content = that.promotionSms.content;
		// if(that.promotionSms['content']) {
		// 	that.textIndex = that.promotionSms['content'].length;
		// 	let inputText = document.getElementById('smsContent');
		// 	that.textIndex = that.doGetCaretPosition(inputText);
		// }
		if(content) {
			that.textIndex = content.length;
			let inputText = document.getElementById('smsContent');
			that.textIndex = that.doGetCaretPosition(inputText);
		}
	}
	doGetCaretPosition(oField: any) {
        let iCaretPos = 0;
        if (document['selection']) { // IE
            oField.focus();
            let oSel = document['selection'].createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') { // Firefox suppor  测试chrome v56.0.2924.87无问题
            iCaretPos = oField.selectionStart;
        }
        return iCaretPos;
    }
	//textarea 数据变化赋值处理
	smsContentChange(){
		let that = this;
		let contentLenth,smsContent;
		if(that.segmentCommunicationService.quoteList.length > 0){ //插入变量的时候，不计算可输入的字数。
			return;
		}
		that.segmentCommunicationService.isError.content = false
		smsContent = that.promotionSms.content;
		contentLenth = that.utiles.getChartLenth(smsContent);
		that.limitSize = that.wordLimit - contentLenth;
		if(that.limitSize <= 0){
			smsContent = that.utiles.cutByte(smsContent,that.wordLimit);
			that.promotionSms.content = smsContent;
			that.limitSize = 0;
		}else{
			that.promotionSms.content = smsContent;
		}
	}
	//插入Json变量
	jsonInsert(data: string) {
		let that = this;
        let inputText = document.getElementById('smsContent');
		that.textIndex = that.doGetCaretPosition(inputText);
		let content = that.promotionSms.content;//短信没有A/B Test 先先死为0
		if(!content) {
			content = data;
		} else {
			let length = content.length;
			content = content.substring(0 ,that.textIndex) + data + content.substring(that.textIndex, length);
		}
		that.promotionSms.content = content;
    }
	//判断上传的文件名称
    checkFileName(fileName:string){
		if(fileName){
			let tp = fileName.substr(fileName.length-3,3);
			if(tp.toUpperCase() == 'CSV'){
				return true;
			}
		}
		return false;
	}
    //选择文件时触发 （黑名单）
    selectFile(event: any){
        let that = this;
        if(that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			that.csvFileName = infos[infos.length - 1];
		}else{
			that.error("上传的文件格式不正确");
		}
    }
	//选择文件时触发 （权益）
    selectEquityFile(event: any){
        let that = this;
        if(that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			that.csvEquityFileName = infos[infos.length - 1];
		}else{
			that.error("上传的文件格式不正确");
		}
    }
	//清空文件（黑名单）
	clearFile(){
		let that = this;
		that.csvFileName = "";
	}
	//清空文件（权益）
	clearEquityFile(){
		let that = this;
		that.csvEquityFileName = "";
	}
	//error处理
    error(err: any) {
        let that = this;
        that.msgs.push({severity: 'error', summary: '错误', detail: err});
    }
}