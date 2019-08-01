import { SelectItem } from 'primeng/primeng';
import { Component, Input } from '@angular/core';
import { Message } from 'primeng/primeng';
import { CrowdResourceService } from "../../../../services/campaign/crowd.resource.service";
import { PipelineNodeCommunicationService } from "../../../../services/communication/pipeline-node.communication.service";
import { AuthResourceService } from '../../../../services/admin/auth.resource.service';
import { PipelineDefinitionResourceService } from '../../../../services/admin/pipeline-definition.resource.service';

@Component({
	selector: 'inlet-pipe',
	templateUrl: 'inlet-pipe.component.html',
	styleUrls: ['inlet-pipe.component.scss'],
	providers: [ CrowdResourceService, AuthResourceService ]
})

//入口管道
export class InletPipeComponent {

	msgs: Message[] = [];  //检测成功\系统报错 使用

	showDialog: boolean = false; //是否显示新建人群弹框

	dialogData: any;   //新建人群需要数据

	noEntryRules: any = [];

	userCrowds: SelectItem[] = [];//用户人群
	selectCrowdData: any; //选中的用户人群
	selectCrowdName: string; //选中的用户名称
	page: number = 1; //获取人群下拉列表默认第一页
	pageSize: number = 10; //获取人群下拉列表默认一次十条

	/**
	 * crowdType
	 * 1 looklike人群
	 * 2 精细化人群 场景人群
	 * 3 用户运营人群
	 * 4 一方人群
	 * 5 子人群
	 */
	crowdType: any = '1';//人群类型

	lessThanDaysSelect: boolean; //进入规则 选择不超过多少天

	lessThanTimesSelect: boolean; //进入规则 选择不超过多少次

	lessThanDays: any; //n天内不再进入

	lessThanTimes: any; //不能超过n次

	//TODO 禁止规则 input框 暂时绑定数据
	test1: any;
	test2: any;
	terminationNoEntryRelation: any;  //禁止规则 关系
	fristeNoEntry: SelectItem[] = [];   //禁止规则第一个下拉菜单列表
    secondNoEntry: SelectItem[] = [];   //禁止规则第二个下拉菜单列表
    
	authOfDMP: any =  undefined; // 用户运营权限
	
	showDropdown: boolean = false; //是否显示人群下拉框

	readyRequest: boolean = true; //是否可以请求 防止重复请求

	isRequest: boolean = true;  //用于当数据全部获取后继续发送请求

	@Input() nodeData: any;

	constructor(
		public crowdResourceService: CrowdResourceService,
        public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		public authResourceService: AuthResourceService,
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService
	){
		let that = this;
		that.terminationNoEntryRelation = {label: '或者', value: '||'};
		that.fristeNoEntry.push({label: '发生', value: '发生'});
		that.fristeNoEntry.push({label: '未发生', value: '未发生'});
		that.secondNoEntry.push({label: '收到推送消息', value: 'getPush'});
		that.secondNoEntry.push({label: '点击推送消息', value: 'clickPush'});
		that.secondNoEntry.push({label: '点击短信链接', value: 'clickSms'});
	}

	ngOnChanges() {
		let that = this;
		that.noEntryRules = [];
		that.lessThanDaysSelect = false;
		that.lessThanTimesSelect = false;

		if (!that.nodeData.crowdType) {
			that.pipelineNodeCommunicationService.nodeData.crowdType = '1';
		} else {
			that.pipelineNodeCommunicationService.nodeData.crowdType += '';
		}
        if (that.pipelineNodeCommunicationService.nodeData.calcType) {
            that.pipelineNodeCommunicationService.nodeData.calcType += '';
        }
        
		if (!that.nodeData.unlimited || that.nodeData.unlimited !== false) {
			that.pipelineNodeCommunicationService.nodeData['unlimited'] = true;	
		}
		if (that.nodeData.lessThanDays) {
			that.pipelineNodeCommunicationService.nodeData['unlimited'] = false;
			that.lessThanDays = that.pipelineNodeCommunicationService.nodeData.lessThanDays;
			that.lessThanDaysSelect = true;
		}
		if (that.nodeData.lessThanTimes) {
			that.pipelineNodeCommunicationService.nodeData['unlimited'] = false;
			that.lessThanTimes = that.pipelineNodeCommunicationService.nodeData.lessThanTimes;
			that.lessThanTimesSelect = true;
		}
		that.choosCrowdType(that.nodeData.crowdType);   //默认选中looklike人群
    }	
    
    ngOnInit() {
		let that = this;

        that.authResourceService.getAppList().then((data: any) => {
            let authData = [];
            if (data && Object.prototype.toString.call(data)=='[object Array]') {
                authData = data;
            }
            that.authOfDMP = data.find((el: any) => {
                return el['appCode'] === 'DMP';
            });
        });
	}
	
	ngOnDestroy() {
		let that = this;
		that.hideDropDown();
	}

	//选择人群
	selectCrowd(data: any) {
		let that = this;
		that.selectCrowdName = data.label;
		that.selectCrowdData = data.value;
		if (that.pipelineNodeCommunicationService.nodeData.crowdType === '3') {
			that.pipelineNodeCommunicationService.nodeData['refId'] = data.value.id;
			that.pipelineNodeCommunicationService.nodeData['crowdId'] = null;
		} else {
			that.pipelineNodeCommunicationService.nodeData['crowdId'] = data.value.id;
			that.pipelineNodeCommunicationService.nodeData['refId'] = data.value.refId;
		}
		that.pipelineNodeCommunicationService.nodeData['crowdName'] = data.value.refName || data.value.name;
		that.pipelineNodeCommunicationService.nodeData['crowdDescription'] = data.value.description;
		that.pipelineNodeCommunicationService.nodeData['selectCrowdData'] = that.selectCrowdData;
	}

    CrowdTypeData(data: any[]) {
        let that = this;
        if (!data) {
            data = [];
        }
        if (data && data.length > 0) {
            let length = data.length;
            for (let i = 0; i < length; i++) {
                that.userCrowds.push({label: data[i].refName || data[i].name, value: data[i]});
			}
        }
    }

	//选择人群类型
	choosCrowdType(data: any){
		let that = this;
		that.selectCrowdName = '';
		if (that.pipelineNodeCommunicationService.nodeData.crowdType != data) {
			that.pipelineNodeCommunicationService.nodeData['crowdId'] = null;
			that.pipelineNodeCommunicationService.nodeData['refId'] = null;
			that.pipelineNodeCommunicationService.nodeData['crowdName'] = null;
			that.pipelineNodeCommunicationService.nodeData['crowdDescription'] = null;
        }
		if (data == '4') {
			that.pipelineNodeCommunicationService.nodeData.calcType = '1';
		} else if (data == '3') {
			delete that.pipelineNodeCommunicationService.nodeData.calcType;
		} else {
            that.pipelineNodeCommunicationService.nodeData.calcType = that.nodeData.calcType;
        }
		that.pipelineNodeCommunicationService.nodeData.crowdType = data;
        
		if (that.selectCrowdData) {
			that.selectCrowdData.description = '';
		}
		that.selectCrowdData = null;
		that.userCrowds = [];

        if (data == '3') {
			if (that.nodeData.refId) {
				that.crowdResourceService.query({refId: that.nodeData.refId})
				.then((data: any) => {
					that.selectCrowdData = data[0];
					that.selectCrowdName = data[0].refName;
					that.crowdResourceService.getPreciseCrowdHistory({name: that.selectCrowdName, campaignId: that.pipelineNodeCommunicationService.campaignId}).then((result: any) => {
						if (result && (result.retCode || result.msgDes)) {
							that.showMessageNews('info', result.msgDes||'获取用户运营人群失败');
							return;
						}
						that.CrowdTypeData(result.rows);
					}).catch();
				}).catch();
			} else {
				that.crowdResourceService.getPreciseCrowdHistory({name: '', campaignId: that.pipelineNodeCommunicationService.campaignId}).then((result: any) => {
					if (result && (result.retCode || result.msgDes)) {
						that.showMessageNews('info', result.msgDes||'获取用户运营人群失败');
						return;
					}
					that.CrowdTypeData(result.rows);
				}).catch();
			}
        } else {
			if (that.nodeData.crowdId) {
				that.crowdResourceService.getCrowdDetail(that.nodeData.crowdId)
				.then((data: any) => {
					that.selectCrowdData = data;
					that.selectCrowdName = data.name || data.refName;
					let json = {
						crowdTp: +that.pipelineNodeCommunicationService.nodeData.crowdType,
						refName: that.selectCrowdName
					};
					that.crowdResourceService.searchCrowdList(that.pipelineNodeCommunicationService.campaignId, json).then((data: any) => {
						that.CrowdTypeData(data.data);
					}).catch();
				}).catch();
			} else {
				let json = {
					crowdTp: +that.pipelineNodeCommunicationService.nodeData.crowdType
				};
				that.crowdResourceService.searchCrowdList(that.pipelineNodeCommunicationService.campaignId, json).then((data: any) => {
					that.CrowdTypeData(data.data);
				}).catch();
			}
        }
	}

	//添加禁止进入规则
	addNoEntryRule(rules: any){
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		if (that.noEntryRules.length > 9) {
			that.showMessageNews('error', '最多可以添加10条');
			return;
		}
		that.noEntryRules.push({});
	}

	//删除禁止进入规则
	delNoEntryRule(index: number){
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.noEntryRules.splice(index,1);
	};

	//新建人群 显示新建人群弹出框
	createCrowd() {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.showDialog = true;
		that.dialogData = {};
		if (that.pipelineNodeCommunicationService.nodeData.crowdType === '1') {
			that.dialogData['tp'] = 'lookalike';
		} else if (that.pipelineNodeCommunicationService.nodeData.crowdType === '4') {
			that.dialogData['tp'] = 'precise';
		} else if (that.pipelineNodeCommunicationService.nodeData.crowdType === '2') {
			that.dialogData['tp'] = 'scene';
		}
	}

	hideDialog(bl: boolean) {
		let that = this;
		that.showDialog = bl;
	}

	//创建了新的人群
	isCreate(data: any) {
		let that = this;
		that.showDialog = false;
		that.choosCrowdType(that.pipelineNodeCommunicationService.nodeData.crowdType);
	}

	//选择规则
	selectRule(e: any, data: any) {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		if (!that.lessThanDaysSelect && !that.lessThanTimesSelect) {
			that.pipelineNodeCommunicationService.nodeData.unlimited = true;
		} else {
			that.pipelineNodeCommunicationService.nodeData.unlimited = false;
		}
		if (data == '1') {
			that.lessThanDaysSelect = !that.lessThanDaysSelect;
			if (!that.lessThanDaysSelect) {
				that.pipelineNodeCommunicationService.nodeData.lessThanDays = '';
			}
		} else {
			that.lessThanTimesSelect = !that.lessThanTimesSelect;
			if (!that.lessThanTimesSelect) {
				that.pipelineNodeCommunicationService.nodeData.lessThanTimes = '';
			}
		}
	}

	//修改规则
	changeRule(e: any) {
		let that = this;
		if (that.pipelineNodeCommunicationService.nodeData.lessThanDays) {
			that.pipelineNodeCommunicationService.nodeData.unlimited = false;
		} else if(that.pipelineNodeCommunicationService.nodeData.lessThanTimes){
			that.pipelineNodeCommunicationService.nodeData.unlimited = false;
		}
	}

		// 右上角提示信息
	showMessageNews(type: any, detail: any) {
		let that = this;
		let message = '';
		if (type === 'info') {
			message = '成功';
		} else if (type === 'error') {
			message = '失败';
		}
		that.msgs.push({severity: type, summary: message, detail: detail})
	}

	//修改规则之间的关系
	changeRuleRelation(data: any) {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		if (data.value === '||') {
			data.label = '并且';
			data.value = '&&';
		} else if (data.value === '&&') {
			data.label = '或者';
			data.value = '||';
		}
	}

	//显示人群下拉列表
	showDropDown(e: any) {
		e.stopPropagation();
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return
		}
		that.showDropdown = !that.showDropdown;
	}

	//关闭人群下拉列表
	hideDropDown() {
		let that = this;
		that.showDropdown = false;
	}

	//根据input框输入内容搜索
	searchCrowd(e: any) {
		let that = this;
		let searchName = e.data;
		that.isRequest = true;
		if (!searchName) {
			searchName = that.selectCrowdName;
		}
		let json = {
			page: 1,
			pageSize: that.pageSize,
			refName: that.selectCrowdName
		}
		if (that.pipelineNodeCommunicationService.nodeData.crowdType == '3') {
			json['campaignId'] = that.pipelineNodeCommunicationService.campaignId;
            that.crowdResourceService.getPreciseCrowdHistory(json).then((result: any) => {
                if (result && (result.retCode || result.msgDes)) {
                    that.showMessageNews('info', result.msgDes||'获取用户运营人群失败');
                    return;
				}
				that.page = 1;
                that.formatCrowdList(result.rows);
            }).catch();
        } else {
			json['crowdType'] = +that.pipelineNodeCommunicationService.nodeData.crowdType;
            that.crowdResourceService.searchCrowdList(that.pipelineNodeCommunicationService.campaignId, json).then((data: any) => {
				that.page = 1;
                that.formatCrowdList(data.data);
            }).catch();
        }
	}

	//选中input框时 查询下拉列表
	getCrowdList() {
		let that = this;
		that.isRequest = true;
		let json = {
			page: 1,
			pageSize: that.pageSize,
			refName: that.selectCrowdName || ''
		};
		if (that.pipelineNodeCommunicationService.nodeData.crowdType == '3') {
			json['campaignId'] = that.pipelineNodeCommunicationService.campaignId;
            that.crowdResourceService.getPreciseCrowdHistory(json).then((result: any) => {
                if (result && (result.retCode || result.msgDes)) {
                    that.showMessageNews('info', result.msgDes||'获取用户运营人群失败');
                    return;
				}
				that.page = 1;
                that.formatCrowdList(result.rows);
            }).catch();
        } else {
			json['crowdType'] = +that.pipelineNodeCommunicationService.nodeData.crowdType;
            that.crowdResourceService.searchCrowdList(that.pipelineNodeCommunicationService.campaignId, json).then((data: any) => {
				that.page = 1;
                that.formatCrowdList(data.data);
            }).catch();
        }
	}

	formatCrowdList(data: any) {
		let that = this;
		if (!data || data.length === 0) {
			that.userCrowds = [{label: '无', value: ''}];
        }
        if (data && data.length > 0) {
			let length = data.length;
			that.userCrowds = [];
            for (let i = 0; i < length; i++) {
                that.userCrowds.push({label: data[i].refName || data[i].name, value: data[i]});
			}
        }
	}

	//根据scroll滚动位置获取更多数据
	getMoreCrowdList(e: any) {
		let that = this;
		if (!that.isRequest) {
			return;
		}
		if (that.page == 1) {
			if (e.target.scrollTop >= (+e.target.scrollHeight - 200) && that.readyRequest) {
				that.readyRequest = false;
				let json = {
					page: 2,
					pageSize: that.pageSize,
					refName: that.selectCrowdName
				}
				if (that.pipelineNodeCommunicationService.nodeData.crowdType == '3') {
					json['campaignId'] = that.pipelineNodeCommunicationService.campaignId;
					that.crowdResourceService.getPreciseCrowdHistory(json).then((result: any) => {
						that.readyRequest = true;
						that.page = 2;
						if (result && (result.retCode || result.msgDes)) {
							that.showMessageNews('info', result.msgDes||'获取用户运营人群失败');
							return;
						}
						if (result && result.rows && result.rows.length > 0) {
							if (result.rows.length < 10) {
								that.isRequest = false;
							}
							let length = result.rows.length;
							for (let i = 0; i < length; i++) {
								that.userCrowds.push({label: result.rows[i].refName || result.rows[i].name, value: result.rows[i]});
							}
						}
					}).catch();
				} else {
					json['crowdType'] = +that.pipelineNodeCommunicationService.nodeData.crowdType;
					that.crowdResourceService.searchCrowdList(that.pipelineNodeCommunicationService.campaignId, json).then((data: any) => {
						that.readyRequest = true;
						that.page = 2;
						if (data.data && data.data.length > 0) {
							if (data.data.length < 10) {
								that.isRequest = false;
							}
							let length = data.data.length;
							for (let i = 0; i < length; i++) {
								that.userCrowds.push({label: data.data[i].refName || data.data[i].name, value: data.data[i]});
							}
						}
					}).catch();
				}
			}
		} else {
			if (e.target.scrollTop >= (+e.target.scrollHeight - 200) && that.readyRequest) {
				that.readyRequest = false;
				let json = {
					page: that.page + 1,
					pageSize: that.pageSize
				}
				if (that.pipelineNodeCommunicationService.nodeData.crowdType == '3') {
					json['name'] = that.selectCrowdName;
					json['campaignId'] = that.pipelineNodeCommunicationService.campaignId;
					that.crowdResourceService.getPreciseCrowdHistory(json).then((result: any) => {
						that.readyRequest = true;
						that.page = that.page + 1;
						if (result && (result.retCode || result.msgDes)) {
							that.showMessageNews('info', result.msgDes||'获取用户运营人群失败');
							return;
						}
						if (result && result.rows && result.rows.length > 0) {
							if (result.rows.length < 10) {
								that.isRequest = false;
							}
							let length = result.rows.length;
							for (let i = 0; i < length; i++) {
								that.userCrowds.push({label: result.rows[i].refName || result.rows[i].name, value: result.rows[i]});
							}
						}
					}).catch();
				} else {
					json['refName'] = that.selectCrowdName;
					json['crowdType'] = +that.pipelineNodeCommunicationService.nodeData.crowdType;
					that.crowdResourceService.searchCrowdList(that.pipelineNodeCommunicationService.campaignId, json).then((data: any) => {
						that.readyRequest = true;
						that.page = that.page + 1;
						if (data.data && data.data.length > 0) {
							if (data.data.length < 10) {
								that.isRequest = false;
							}
							let length = data.data.length;
							for (let i = 0; i < length; i++) {
								that.userCrowds.push({label: data.data[i].refName || data.data[i].name, value: data.data[i]});
							}
						}
					}).catch();
				}
			}
		}
	}

	/**
	 * 禁止规则 选择条件
	 */
	selectNoEntry(e: any, rule: any) {
		let that = this;
		let type = 'push';
		if (e.value === 'clickSms') {
			type = 'shortMessage';
		}
		that.pipelineDefinitionResourceService.getForbidRuleList(that.pipelineNodeCommunicationService.pipeLineId, type)
		.then((data: any) => {
			//TODO 数据结构未确定
			let list: SelectItem[] = []
			for (let i = 0; i < data.length; i++) {
				let json = {
					label: data[i].name,
					value: data[i].id,
				};
				list.push(json);
			}
			rule['forbidRuleList'] = list;
		}).catch();
	}
}