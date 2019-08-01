import { Component, OnInit, OnChanges, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Message, ConfirmationService, DialogModule } from 'primeng/primeng';
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';

import { UtilesService } from './../../../common/utiles.service';
import { CampaignResourceService } from "../../../services/campaign/campaign.resource.service";
import { AppConfResourceService } from './../../../services/campaign/app_conf.resource.service';
import { PipelineDefinitionResourceService } from "../../../services/admin/pipeline-definition.resource.service";
import { PipelineNodeCommunicationService } from "../../../services/communication/pipeline-node.communication.service";
import { PipelineOperatorResourceService } from '../../../services/admin/pipeline-operator.resource.service';
import { CampaignDetailExceptionalCommunication } from "../../../services/exceptional/campaign-detail-exceptional.service";
import { CampaignDetailDataCommunication } from '../../../services/communication/campaign-detail-data.communication.service';
import { ErrorHandlingService } from '../../../services/exceptional/error-handling.service';
import { CrowdResourceService } from "../../../services/campaign/crowd.resource.service";
import { PipelineCommunicationService } from '../../../services/communication/pipeline.communication.service';

var joint = require('jointjs');

@Component({
	selector: 'automation',
	templateUrl: 'automation.component.html',
	styleUrls: ['automation.component.css'],
	providers: [
        UtilesService,
		ConfirmationService, 
		CrowdResourceService,
		CampaignResourceService, 
		PipelineDefinitionResourceService, 
		PipelineNodeCommunicationService, 
		AppConfResourceService, 
		PipelineOperatorResourceService, 
		CampaignDetailExceptionalCommunication,
		PipelineCommunicationService
	]
})

export class AutomationComponent implements OnInit, OnChanges {
	isOperatorShow: boolean = true; //是否显示左边栏 默认显示
	msgs: Message[] = [];  //检测成功\系统报错 使用
	pipeLineName: string = '新建营销流程';    //营销流程名称
	oldPipeLineName: string;    //修改之前的营销流程名称
	isEdit: boolean = false;  //是否修改营销流程名称
	pipelineComponentArr: any;  // 算子列表
	isDetail: boolean = false; // 控制右侧的content
	graph = new joint.dia.Graph;  //新建svg图表对象	
	paper: any;	 // 用来全局保存joint画布的对象
	showRightContent: any; // 保存算子类型
	status: number = 0;    //pipeLine保存的状态 0 为保存为草稿 1 为创建
	reqData: any;  //传给后端的数据
	pipeLineDefinition: any;  //pipeLine数据
	selectNodeData: any; //当前节点信息
    campaignId: any;  //活动Id
    campaignStatus: number; // 营销活动状态 1 等待开始 2 进行中  3 已结束
	pipeLineId: any;  //pipeLineId
	campaignData: any; //营销活动详情
	linkSetTimeoutId: any = {};   //连线时setTimeout的id
	moveNodeSetTimeoutId: any; //移动节点时setTimeout的id
	moveLinkSetTimeoutId: any; //移动线试setTimeout的id
	nodeMap: any = {};   //存放自己生成的nodeId和svg画布需要的id的Map key为自己生成的nodeId
	errNodeList: any = [];  //存放检测报错的节点 再次检测通过后会去掉已改正的
    curNodeIsEndFlag: boolean; // 判断是否能够添加end组件
    curNodeIsEntranceFlag: boolean;
	titleNameWidth: number = 0; // 营销流程名的长度
	overflow: boolean = true;
	noticeShow: boolean = false; //提示信息弹出框
    removeFlag: boolean = false; 
    editFlag: boolean = false;
	typeList: any = [
		{ name: 'entrance', desc: '入口' },
		{ name: 'hourMeter', desc: '计时器' },
		{ name: 'filter', desc: '过滤器'},
		{ name: 'generate', desc: '生成人群' },
		{ name: 'split', desc: '分流器' },
		{ name: 'trigger', desc: '触发器' },
		{ name: 'push', desc: '应用推送' },
		{ name: 'shortMessage', desc: '短信通知' },
		{ name: 'end', desc: '结束' }
	];
    marketingValue: any = { //时间插件使用数据 测试用
        showIcon: true,
        ranges: [{
            label: '今天', day: 1
        },
        {
            label: '最近七天', day: 7
        },
        {
            label: '最近一个月', day: 30
        },
        {
            label: '季度', day: 90
        }],
		dateRanges: { },
		data: { }
	};
	reportNodeData: any;  //push或短信节点数据 用于显示报告页
	title: string; //报告弹框title
	showReportDialog: boolean = false; //是否显示报告弹框

	textDes: string = '';
	deleteStyle: string = 'none';  //删除浮层样式 是否显示 ‘none’ || ‘block’;
	top: string = '0';   //删除浮层样式 所在位置距上边框
	left: string = '0';  //删除浮层样式 所在位置距下边框
	deleteNodeId: string;  //显示浮层的node节点Id jointjs生成的id
    lastDeleteNodeId: string;  //上次浮层的node节点Id jointjs生成的id
    orignX: number = 0;  //pipeline origin横坐标
	orignY: number = 0;  //pipeline origin纵坐标
	private _isShow: boolean = false;  //是否显示删除按钮浮层

	constructor(
		private route: ActivatedRoute,
		private router: Router,
        public utilesService: UtilesService,
		public confirmationService: ConfirmationService,
		public crowdResourceService: CrowdResourceService,
		public campaignResourceService: CampaignResourceService,
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
		public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		public pipelineOperatorResourceService: PipelineOperatorResourceService,
        public campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
		public errorHandlingService: ErrorHandlingService,
		public pipelineCommunicationService: PipelineCommunicationService
	) {
		let that = this;
		that.campaignId = that.route.params['value']['id'];
		that.pipeLineId = that.route.params['value']['pipeLineId'];
		that.pipelineNodeCommunicationService.campaignId = that.campaignId;
		that.pipelineNodeCommunicationService.pipeLineId = that.pipeLineId;
		
		campaignDetailExceptionalCommunication.missionExceptional$.subscribe(data => {
			that.showMessageNews('error', data);
		});
		
		pipelineCommunicationService.lineChange$.subscribe((data: any) => {
			that.createLines(data);
		});

        that.initEditFlag();
	}

	ngOnChanges() {
		let that = this;
	}

	ngOnInit() {
        let that = this;
		
		let defaultPaper: any = {
			el: $('#pipeline'),
			width: '100%',
			height: '100%',
			model: that.graph,
			gridSize: 1,
			clickThreshold: 1,//解决部分window电脑点击算子没反应的问题
			// linkPinning: false,
			validateConnection: function(cellViewS: any, magnetS: any, cellViewT: any, magnetT: any, end: any, linkView: any) {
				// Prevent linking from input ports.
				// if (magnetS && magnetS.getAttribute('port-group') === 'inPorts') return false;
				// Prevent linking from output ports to input ports within one element.
				if (cellViewS === cellViewT) return false;
				// Prevent linking to input ports.
				return magnetT && magnetT.getAttribute('port-group') === 'inPorts';
			},
			defaultLink: new joint.dia.Link({
				'router': {
					name: 'manhattan',
				},
				'connector': {
				  name: 'normal', 
				},
				attrs: { 
				  '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', stroke: '#C3CBD6', fill: '#C3CBD6'},
				  '.connection': {
					'stroke': '#C3CBD6',
					'stroke-width': 1
				  }
				}
			}),
		};
		
		that.pipelineOperatorResourceService.query().then((data: any) => {
			that.pipelineComponentArr = data;
			//获取活动详情
			return that.campaignResourceService.get(that.campaignId);
		}).then((data: any) => {
            that.campaignData = data;
            let time = Date.now();

            if (data.startTime < time && time < data.endTime) { // 进行中
                that.campaignStatus = 2;
            } else if (data.startTime > time) {                 // 未开始
                that.campaignStatus = 1;
            } else {                                            // 已结束
                that.campaignStatus = 3;              
            }

			let startTime = new Date(data.startTime);           // 这里获取活动的时间

			if (startTime < new Date(moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'))) {                       // 如果活动已经开始了 营销活动开始时间必须大于当前时间
				startTime = new Date(moment().startOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss'));
			}
			that.marketingValue.dateRanges.min = startTime;
			that.marketingValue.dateRanges.max = new Date(data.endTime);
			return that.pipelineDefinitionResourceService.findPipeLine(that.pipeLineId);
		}).then((pipelineData: any) => {
			that.reqData = pipelineData;
			if (that.reqData.status === 5) {
				let time = Math.floor((that.reqData.startTime - Date.now()) / (60 * 60 * 1000));
				let day = Math.floor(time / 24);
				let hour = time % 24;
				that.textDes = `距离流程开始还有${day}天${hour}小时`;
			} else if (that.reqData.status === 6) {
				let time = Math.floor((Date.now() - that.reqData.startTime) / (60 * 60 * 1000));
				let day = Math.floor(time / 24);
				let hour = time % 24;
				that.textDes = `已进行${day}天${hour}小时`;
			}
			that.campaignResourceService.exceptionalMission(that.reqData);
			
			if (!that.pipelineNodeCommunicationService.editFlag) {
				defaultPaper['interactive'] = function(cellView: any) {
					return cellView.model.isElement();
				};
			}
			that.paper = new joint.dia.Paper(defaultPaper);

			if (!that.reqData.campaignId) {
				that.reqData.campaignId = that.campaignId;
			}
			if (that.reqData.name) {
				that.checkTitleNameWidth(that.reqData.name);
				that.pipeLineName = that.reqData.name;
			}
			if (that.reqData.startTime && that.reqData.endTime) {
				// 这里获取流程的时间
				let curStartTime = moment(that.reqData.startTime).format('YYYY-MM-DD');
				let curEndTime = moment(that.reqData.endTime).format('YYYY-MM-DD');
				that.marketingValue.placeholder = `${curStartTime}~${curEndTime}`;
				that.marketingValue.data.start = new Date(curStartTime);
				that.marketingValue.data.end = new Date(curEndTime);
				that.pipelineNodeCommunicationService.startTime = new Date(moment(curStartTime).startOf('day').valueOf());
                that.pipelineNodeCommunicationService.endTime = new Date(moment(curEndTime).endOf('day').valueOf());
			}
			that.pipeLineDefinition = JSON.parse(pipelineData.diagram);
			that.pipelineNodeCommunicationService.rule.pipelineTerminationRuleDefinition = that.pipeLineDefinition.pipelineTerminationRuleDefinition || {};
			that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition = that.pipeLineDefinition.pipelineEnterRuleDefinition || {};
			that.pipelineNodeCommunicationService.rule.pipelineForbiddenRuleDefinition = that.pipeLineDefinition.pipelineForbiddenRuleDefinition || {};
			let nodeList: any[] = [];
			//第一次创建时 添加入口组件
			if (!that.pipeLineDefinition['nodeDefinitionList'] || that.pipeLineDefinition['nodeDefinitionList'].length == 0) {
				that.pipeLineDefinition['nodeDefinitionList'] = [];
				let firstModel = that.initOperatorModel('entrance');
				let firstNode = that.createOperator(firstModel, {X: 100, Y: 100, name: that.pipelineComponentArr[0].name, icon: that.pipelineComponentArr[0].icon});
				let inletNode = {
					id: that.createNodeId(),
					pipelineDefinitionId: that.pipeLineId,
					icon: that.pipelineComponentArr[0].icon,
					name: '入口',
					type: 'entrance',
					x: 100,
					y: 100,
					width: 52,
					height: 64
				};
				that.pipelineNodeCommunicationService.nodeData = inletNode;
				firstNode.data = inletNode;
				firstNode.data['index'] = 0;
				that.nodeMap[inletNode.id] = firstNode.id;
				that.graph.addCells([firstNode]);
				that.pipeLineDefinition.nodeDefinitionList.push(_.cloneDeep(inletNode));
				that.pipeLineDefinition['pipelineId'] = that.pipeLineId;
				that.reqData['diagram'] = JSON.stringify(that.pipeLineDefinition);
			} else {  //修改pipeLine
				let nodeLength = that.pipeLineDefinition.nodeDefinitionList.length;
				let nodeDefinitionList = that.pipeLineDefinition.nodeDefinitionList;
				let noRouteNode: any = []; //用于存放
  				for (let i = 0; i < nodeLength; i++) {
					let nodeModel = that.initOperatorModel(nodeDefinitionList[i].type);
					let labelText: string;
					//将分流器和触发器的nodeId存放起来
					if (nodeDefinitionList[i].type == 'split' || nodeDefinitionList[i].type == 'trigger') {
						noRouteNode.push(nodeDefinitionList[i].id);
					}
					if (nodeDefinitionList[i].name) {
                        labelText = nodeDefinitionList[i].name;
					} else {
                        labelText = that.findLabelText(nodeDefinitionList[i].type);
					}
					let node = that.createOperator(nodeModel, {
						X: parseInt(nodeDefinitionList[i].x), 
						Y: parseInt(nodeDefinitionList[i].y), 
						name: labelText, 
						icon: nodeDefinitionList[i].icon
					});
					let tempData = _.cloneDeep(nodeDefinitionList[i]);
					tempData['index'] = i;
					node.data =	tempData;
					that.nodeMap[tempData.id] = node.id;
					nodeList.push(node);
				}
				if (that.pipeLineDefinition['edgeDefinitionList'] && that.pipeLineDefinition['nodeDefinitionList'].length !== 0) {
					that.pipeLineDefinition.edgeDefinitionList.map((data: any) => {
						let link
						if (noRouteNode.indexOf(data.sourceNodeId) != -1) {
							link = that.createLink(data, 'splitOrTrigger');
						} else {
							link = that.createLink(data);
						}
						link.data = data;
						nodeList.push(link);
					})
				}
				that.graph.addCells(nodeList);
			}
			if (!that.pipeLineDefinition['edgeDefinitionList']) {
				that.pipeLineDefinition['edgeDefinitionList'] = [];
			}

			// 改变link获取对象
			that.graph.on('change:source change:target', function(link: any){
				if (that.showRightContent && (that.selectNodeData.type == 'split' || that.selectNodeData.type == 'trigger')) {
					that.processPipeNode(that.selectNodeData.id);
				}
				if (that.linkSetTimeoutId[link.id]) {
					clearTimeout(that.linkSetTimeoutId[link.id]);
				}
				that.linkSetTimeoutId[link.id] = setTimeout(function () {
					let sourceId = link.attributes.source.id;
					let targetId = link.attributes.target.id;
					if (sourceId === targetId) {
						that.removeFlag = true;
						that.graph.removeCells([link]);
						that.removeFlag = false;
						return;
					}
					let sourceNode = that.graph.getCell(sourceId);
					let targetNode = that.graph.getCell(targetId);
					//如果是分流器和触发器 改变分支targetNode或者 移动到taget到空白处 不会删除线
					if (link.data && link.data.id && sourceNode.data && (sourceNode.data.type == 'split' || sourceNode.data.type == 'trigger')) {
						let length = that.pipeLineDefinition.edgeDefinitionList.length;
						for (let i = 0; i < length; i++) {
							if (that.pipeLineDefinition.edgeDefinitionList[i].id === link.data.id) {
								if (sourceNode && targetNode) {
									link.data['targetNodeId'] = targetNode.data.id;
									delete link.data.x;
									delete link.data.y;
								} else {
									link.data.x = link.attributes.target.x;
									link.data.y = link.attributes.target.y;
									delete link.data['targetNodeId'];
								}
								that.pipeLineDefinition.edgeDefinitionList[i] = link.data;
								break;
							}
						}
						that.updatePipeLine();
						return;
					}
					if (sourceId && targetId) {
						//如果是自己从分流器或者触发器拉出的线 需要删除
						if (sourceNode.data && (sourceNode.data.type == 'split' || sourceNode.data.type == 'trigger')) {
							that.removeFlag = true;
							that.graph.removeCells([link]);
							that.removeFlag = false;
							return;
						}
						//如果已经有从该节点到结束节点的连线 则删除当前连线
						if (targetNode && targetNode.data && targetNode.data.type == 'end') {
							let linkList = that.graph.getConnectedLinks(targetNode, {inbound: true});
							let length = linkList.length;
							let connectCount = 0;   //判断有几条线
							for (let i = 0; i < length; i++) {
								if (linkList[i].attributes.source.id === sourceNode.id) {
									connectCount++ ;
									if (connectCount > 1) {
										that.removeFlag = true;
										that.graph.removeCells([link]);
										that.removeFlag = false;
										break;
									}
								}
							}
							if (connectCount > 1) {
								return;
							}
						}
						if (link.data && link.data.id) {
							//如果是修改连线 修改传给后端数据的targetId
							for (let i = 0; i < that.pipeLineDefinition.edgeDefinitionList.length; i++) {
								if (that.pipeLineDefinition.edgeDefinitionList[i].id == link.data.id) {
									that.pipeLineDefinition.edgeDefinitionList[i].targetNodeId = targetNode.data.id;
									break;
								}
							}
						} else {
							let edgeDefinition = {
								id: that.createNodeId(),
								pipelineDefinitionId: that.pipeLineId,
								name: link.data && link.data.name || ''
							};
							edgeDefinition['sourceNodeId'] = sourceNode.data.id;
							edgeDefinition['targetNodeId'] = targetNode.data.id;
							if (!that.pipeLineDefinition.edgeDefinitionList) {
								that.pipeLineDefinition.edgeDefinitionList = [];
							}
							that.pipeLineDefinition.edgeDefinitionList.push(edgeDefinition);
							link.data = edgeDefinition;
						}
						that.updatePipeLine();
					} else {
						if (link.data && link.data.name && sourceNode.data && (sourceNode.data.type == 'split' || sourceNode.data.type == 'trigger')) {
							return;
						}
						that.removeFlag = true;
						that.graph.removeCells([link]);
						that.removeFlag = false;
					}
				}, 1000);
			});

			/**
			 * 修改线的位置
			 */
			that.graph.on('change:vertices', (link: any) => {
				if (that.moveLinkSetTimeoutId) {
					clearTimeout(that.moveLinkSetTimeoutId);
				}
				that.moveLinkSetTimeoutId = setTimeout(() => {
					if (link.data) {
						for (let i = 0; i < that.pipeLineDefinition.edgeDefinitionList.length; i++) {
							if (that.pipeLineDefinition.edgeDefinitionList[i].id === link.data.id) {
								that.pipeLineDefinition.edgeDefinitionList[i]['vertices'] = _.cloneDeep(link.attributes.vertices);
								break;
							}
						}
						that.updatePipeLine();
					}
				}, 1000)
			});

			/* 删除事件 */
			that.graph.on('remove', (e: any) => {
				if (e.isLink()) {
					if (e.data && e.data.id) {
						let flag = false;
						let node = that.graph.getCell(that.nodeMap[e.data.sourceNodeId]);
						let nodeData = node && node.data;

						let targetNode = that.graph.getCell(that.nodeMap[e.data.targetNodeId]);
						if (targetNode && that.deleteNodeId && that.deleteNodeId == targetNode.id) {    //判断是不是删除该线指向的目标节点导致指向该线被删除
							flag = true;
						}
						if (nodeData && (nodeData.type === 'trigger' || nodeData.type === 'split') && !that.removeFlag) {
							if (!flag) {
								if (nodeData.type === 'split') {
									that.splitNodeDeleteLine(e, nodeData, node);
								} else if (nodeData.type === 'trigger') {
									that.triggerNodeDeleteLine(e, node);
								}
							} else {
								if (targetNode && targetNode.data) {        //将线指向原节点的位置
									delete e.attributes.target;
									e.attributes['target'] = {
										x: targetNode.data.x,
										y: targetNode.data.y
									};
									e.data.x = targetNode.data.x;
									e.data.y = targetNode.data.y;
									delete e.data.targetNodeId;
								}
								that.noticeShow = true;
								that.graph.addCell(e);
							}
							return;
						}
						let i;
						for (i = 0; i < that.pipeLineDefinition.edgeDefinitionList.length; i++) {
							if (that.pipeLineDefinition.edgeDefinitionList[i].id === e.data.id) {
								break;
							}
						}
						that.pipeLineDefinition.edgeDefinitionList.splice(i, 1);

						if (!that.removeFlag) {
							that.updatePipeLine();
						}
					}
				}
			});

			// 添加单元时
			that.graph.on('add', (cell: any)=>{
				if (cell.isLink()) {
					if (that.linkSetTimeoutId[cell.id]) {
						clearTimeout(that.linkSetTimeoutId[cell.id]);
					}
					//防止点击节点右边output点 出现指向自己的线
					that.linkSetTimeoutId[cell.id] = setTimeout(function () {
						let sourceId = cell.attributes.source.id;
						let targetId = cell.attributes.target.id;
						if (sourceId === targetId) {
							that.removeFlag = true;
							that.graph.removeCells([cell]);
							that.removeFlag = false;
							return;
						}
						let sourceNode = that.graph.getCell(sourceId);
						let targetNode = that.graph.getCell(targetId);
						if ((!sourceNode || !targetNode) && sourceNode.data.type !== 'trigger' && sourceNode.data.type !== 'split') {
							that.removeFlag = true;
							that.graph.removeCells([cell]);
							that.removeFlag = false;
						}
					}, 1000);
				}
			});

			// 算子点击事件
			that.paper.on('cell:pointerclick', (e: any) => {
				if (!e.model.attributes || e.model.attributes.type === 'link') {
					return;
				}
				let index = e.model.data && e.model.data.index;
				if (e.model.data && that.selectNodeData && e.model.data.id === that.selectNodeData.id) {
					that.processPipeNode(that.selectNodeData.id, e.model.data);
					that.updatePipeLine();
					return;
				}
				if (that.pipeLineDefinition.nodeDefinitionList[index]) {
					e.model.data = _.cloneDeep(that.pipeLineDefinition.nodeDefinitionList[index]);
					e.model.data['index'] = index;
				}
				let nodeData = e.model.data;
				if (that.selectNodeData && that.showRightContent && that.selectNodeData.index != nodeData.index) {
					//判断是否是全局规则设置
					if (that.showRightContent === 'rule') {
						that.pipeLineDefinition = Object.assign(that.pipeLineDefinition, that.pipelineNodeCommunicationService.rule);
						if (nodeData.type && nodeData.type != 'end') {
							that.showRightContent = nodeData.type;
							that.showDetail();
						} else {
							that.hideDetail();
						}
					} else {
						//更新节点信息
						that.processPipeNode(that.selectNodeData.id, nodeData);
						that.updatePipeLine();
					}
				} else {
					if (nodeData.type && nodeData.type != 'end') {
						that.showRightContent = nodeData.type;
						that.selectNodeData = that.pipelineNodeCommunicationService.nodeData = nodeData;
						let node = that.graph.getCell(that.nodeMap[nodeData.id]);
						let links = that.graph.getConnectedLinks(node, {outbound: true}); // 获取当前组件出去的线
						that.pipelineNodeCommunicationService.nodeLinks = links;
						that.showDetail();
					} else {
						that.hideDetail();
					}
				}
			});

			//画布除算子之外点击事件
			that.paper.on("blank:pointerclick", (e: any) => {
				let flag = that.editFlag;

				if (!flag) {
					that.hideDetail();
					return;
				}
				if (that.selectNodeData && that.selectNodeData.index >= 0) {
					that.processPipeNode(that.selectNodeData.id);
					that.updatePipeLine();
				}
				if (that.showRightContent === 'rule' && that.isDetail) {
					that.pipeLineDefinition = Object.assign(that.pipeLineDefinition, that.pipelineNodeCommunicationService.rule);
					that.updatePipeLine();
				}
				that.hideDetail();
			});

			//点击画布空白处
			that.paper.on('blank:pointerdown', (e: any, x: any, y: any) => {
				var svg = joint.V(that.paper.svg);
				svg.node.onmousemove = (e: any) => {
					that.orignX = parseInt(e.offsetX) - parseInt(x);
					that.orignY = parseInt(e.offsetY) - parseInt(y);
					that.paper.setOrigin(that.orignX, that.orignY);
				}
			});

			//节点移动事件
			that.paper.on('cell:pointermove', (e: any) => {
				if (!e.model.attributes || e.model.attributes.type === 'link') {
					return;
				}
				if (that.isShow) {
					that.top = (parseInt(e.model.attributes.position.y) + 37 +that.orignY) + 'px';
					that.left = (parseInt(e.model.attributes.position.x) + 2 + that.orignX) + 'px';
				}
				if (that.moveNodeSetTimeoutId) {
					clearTimeout(that.moveNodeSetTimeoutId);
				}
				that.moveNodeSetTimeoutId = setTimeout(function () {
					let tempNode = e.model.data;
					//TODO 这里需要将数据给放到 nodeDefinitionList里
					that.pipeLineDefinition.nodeDefinitionList[tempNode.index]['x'] = parseInt(e.model.attributes.position.x);
					that.pipeLineDefinition.nodeDefinitionList[tempNode.index]['y'] = parseInt(e.model.attributes.position.y);
					that.status = 0;
					that.updatePipeLine();
				}, 1000);
			});

			//鼠标移动到节点上触发
			that.paper.on('cell:mouseover', (e: any) => {
				if (e && e.model && (e.model.attributes.type === 'link' ||  e.model.data.type === 'entrance')) {
					return;
				}
				if (e.model.data.type === 'push' || e.model.data.type === 'shortMessage') {
					that.reportNodeData = e.model.data;
					if (e.model.data.type === 'push') {
						that.title = 'push投放报告';
					} else {
						that.title = '短信投放报告';
					}
				} else {
					that.reportNodeData = null;
				}
				if ((that.reqData.status == '6' || that.reqData.status == '8') && e.model.data.type !== 'push' && e.model.data.type !== 'shortMessage' || that.reqData.status == '3' || that.reqData.status == '5') {
					return;
				}
				that.isShow = true;
				that.deleteStyle = 'block';
				that.top = (+e.model.attributes.position.y + 37 + +that.orignY) + 'px';
				that.left = (+e.model.attributes.position.x + 2 + +that.orignX) + 'px';
				that.deleteNodeId = e.model.id;
				that.lastDeleteNodeId = '';
			});

			//鼠标离开节点触发
			that.paper.on('cell:mouseout', (e: any) => {
				that.isShow = false;
				that.lastDeleteNodeId = that.deleteNodeId;
				that.deleteNodeId = '';
			});

			that.paper.on('blank:pointerup', (e: any) => {
				var svg = joint.V(that.paper.svg);
				svg.node.onmousemove = '';
			})
		}).catch((err: any) => {
			let error = that.errorHandlingService.getMsg(err);
			that.showMessageNews('error', error.message);
		});
    }

    /* 鼠标移到删除浮层div上 */
    mouserover() {
        let that = this;
        that.deleteNodeId = that.lastDeleteNodeId;
        that.lastDeleteNodeId = '';
        that.isShow = true;
    }

    /* 鼠标离开删除浮层div */
    mouseout() {
        let that = this;
        that.isShow = false;
    }

    /* 修改isShow 触发样式变化 */
    set isShow(show: boolean) {
        let that = this;
        that._isShow = show;
        if (!show) {
            setTimeout(() => {
                if (!that._isShow) {
                    that.deleteStyle = 'none';
                    that.top = '0';
                    that.left = '0';
                }
            }, 0);
        }
    }

    get isShow(): boolean {
        return this._isShow;
    }

    /* 复位pipeLine Origin */
    resetOrigin() {
        let that = this;
        that.orignX = 0;
        that.orignY = 0;
        that.paper.setOrigin(that.orignX, that.orignY);
    }

    //删除算子
    deleteNode() {
        let that = this;
        if (that.deleteNodeId) {
            that.confirmationService.confirm({
                message: '当前操作不可逆，是否确定删除节点？',
                header: '提示',
                accept: () => {
                    that.removeFlag = true;  //可以删除线
                    let cell = that.graph.getCell(that.deleteNodeId);
                    let index = cell.data && cell.data.index;
                    that.pipeLineDefinition.nodeDefinitionList.splice(index, 1);

                    let links = that.graph.getConnectedLinks(cell, {outbound: true});
                    if (links.length) {
                        that.graph.removeCells(links);
                    }
                    that.removeFlag = false;  //禁止删除线
                    let length = that.pipeLineDefinition.nodeDefinitionList.length;
                    for (let i = index; i < length; i++) {
                        let node = that.graph.getCell(that.nodeMap[that.pipeLineDefinition.nodeDefinitionList[i].id]);
                        if (node && node.data) {
                            node.data.index = node.data.index - 1;
                        }
                    }
                    //隐藏删除浮层
                    that.deleteStyle = 'none';
                    that.top = '0';
                    that.left = '0';
                    that.graph.removeCells([cell]);
                    that.deleteNodeId = '';
                    that.updatePipeLine();
                    that.hideDetail();
                },
                reject: () => {
                }
            })
        }
    }

	findLabelText(name: string): string {
		let that = this;
		for (let type of that.typeList) {
			if (type.name === name) {
				return type.desc;
			}
		}
		return "";
	}

	//不同的组件不同的处理
    processPipeNode(id: any, data?: any) {
		let that = this;
        let labelText: string;
        let pipelineDesc: string;

        that.status = 0;

		let node = that.graph.getCell(that.nodeMap[id]);
		if (!node) {
		    return;
        }
		// 找到和当前组件类型一致的描述（其实就是组件名称未写时显示的名称）
		if (node.data) {
            pipelineDesc = that.findLabelText(node.data.type);
        }

		if (that.pipelineNodeCommunicationService.nodeData.name) {
			labelText = that.pipelineNodeCommunicationService.nodeData.name;
		} else {
			labelText = pipelineDesc;
		}

		if (that.selectNodeData.type == 'split') {
			that.processSplitNode(node);
		} else if (that.selectNodeData.type == 'trigger') {
			that.processTriggerNode(node);
		} else if (that.selectNodeData.type === 'push') {
			that.processPushNode(node);
		} else if (that.selectNodeData.type === 'entrance') {
			that.processInletNode(node);
		}

        // 这里更改了组件的名称
        node.attr({
            '.label': {
                text: labelText
            },
        });

        that.pipeLineDefinition.nodeDefinitionList[that.selectNodeData.index] = _.cloneDeep(that.pipelineNodeCommunicationService.nodeData);

        if (data && data.type && data.type != 'end') {    //判断是否是切换节点 切换节点 将节点信息保存到selectNodeData中
            that.showRightContent = data.type;
            that.selectNodeData = that.pipelineNodeCommunicationService.nodeData = data;
            let node = that.graph.getCell(that.nodeMap[data.id]);
            let links = that.graph.getConnectedLinks(node, {outbound: true}); // 获取当前组件出去的线
            that.pipelineNodeCommunicationService.nodeLinks = links;
            that.showDetail();
        } else {
            that.hideDetail();
        }
	}

	/**
	 * 处理分流器组件数据
	 */
	processSplitNode(node: any) {
		let that = this;

		// if (!that.selectNodeData || !that.selectNodeData.branchList) {
		// 	return;
		// }

		// let linkList = [];
		// let count = that.selectNodeData.count;      //当前保存的分流器分支个数
		// let links = that.graph.getConnectedLinks(node, {outbound: true});       //获取从当前组件出去线
		// let linksLength = links.length;

		// if (that.selectNodeData['changeType']) {
		// 	that.removeFlag = true;     //可以删除线
		// 	that.graph.removeCells(links);
		// 	that.removeFlag = false;    //禁止删除线

		// 	for (let i = 0; i < count; i++) {
		// 		let link = {
		// 			id: that.createNodeId(),
		// 			pipelineDefinitionId: that.pipeLineId,
		// 			sourceNodeId: that.selectNodeData.id,
		// 			x: parseInt(that.selectNodeData.x) + 250,
		// 			y: parseInt(that.selectNodeData.y) - Math.min(parseInt(that.selectNodeData.y)/2, 100) + i * 40,
		// 			name: that.selectNodeData.branchList[i] && that.selectNodeData.branchList[i].name,
		// 			expression: that.selectNodeData.branchList[i] && that.selectNodeData.branchList[i].name,
		// 			// vertices: [{x: parseInt(that.selectNodeData.x) + 100, y: parseInt(that.selectNodeData.y) - Math.min(parseInt(that.selectNodeData.y)/2, 100) + i * 40}],
		// 			index: i
		// 		};
		// 		that.pipeLineDefinition.edgeDefinitionList.push(link);
		// 		let linkNode = that.createLink(link, 'split');
		// 		linkNode.data = link;
		// 		linkList.push(linkNode);
		// 	}
		// 	if (linkList.length) {
        //         that.graph.addCells(linkList);
        //     }
		// } else if (that.selectNodeData.splitType == '3' && count === linksLength) {
		// 	for (let i = 0; i < linksLength; i++) {
		// 		if (links[i].data.name !== that.selectNodeData.branchList[i].name) {
		// 			links[i].data.expression = that.selectNodeData.branchList[i].name;
		// 			links[i].data.name = that.selectNodeData.branchList[i].name;
		// 			that.removeFlag = true;     //可以删除线
		// 			that.graph.removeCells([links[i]]);
		// 			that.removeFlag = false;    //禁止删除线
		// 			that.pipeLineDefinition.edgeDefinitionList.push(links[i].data);
		// 			let linkNode = that.createLink(links[i].data, 'split');
		// 			linkNode.data = links[i].data;
		// 			that.graph.addCell([linkNode]);
		// 		}
		// 	}
		// } else {
        //     if (count < linksLength && that.selectNodeData.splitType == '3') {
		// 		for (let i = 0; i < count; i++) {
		// 			if (links[i].data.name !== that.selectNodeData.branchList[i].name) {
		// 				links[i].data.expression = that.selectNodeData.branchList[i].name;
		// 				links[i].data.name = that.selectNodeData.branchList[i].name;
		// 				that.removeFlag = true;     //可以删除线
		// 				that.graph.removeCells([links[i]]);
		// 				that.removeFlag = false;    //禁止删除线
		// 				that.pipeLineDefinition.edgeDefinitionList.push(links[i].data);
		// 				let linkNode = that.createLink(links[i].data, 'split');
		// 				linkNode.data = links[i].data;
		// 				that.graph.addCell([linkNode]);
		// 			}
		// 		}
		// 		let rmlinks: any = [];
        //         for (let i = linksLength; i > count; i--) {
        //             rmlinks.push(links[i-1]);
        //         }
        //         that.removeFlag = true;  //可以删除线
        //         that.graph.removeCells(rmlinks);
        //         that.removeFlag = false;  //禁止删除线
		// 	} else if (count < linksLength) {
        //         let rmlinks: any = [];
        //         for (let i = linksLength; i > count; i--) {
        //             rmlinks.push(links[i-1]);
        //         }
        //         that.removeFlag = true;  //可以删除线
        //         that.graph.removeCells(rmlinks);
        //         that.removeFlag = false;  //禁止删除线
        //     } else if (count > linksLength && that.selectNodeData.splitType == '3') {
		// 		for (let i = 0; i < linksLength; i++) {
		// 			if (links[i].data.name !== that.selectNodeData.branchList[i].name) {
		// 				links[i].data.expression = that.selectNodeData.branchList[i].name;
		// 				links[i].data.name = that.selectNodeData.branchList[i].name;
		// 				that.removeFlag = true;     //可以删除线
		// 				that.graph.removeCells([links[i]]);
		// 				that.removeFlag = false;    //禁止删除线
		// 				that.pipeLineDefinition.edgeDefinitionList.push(links[i].data);
		// 				let linkNode = that.createLink(links[i].data, 'split');
		// 				linkNode.data = links[i].data;
		// 				that.graph.addCell([linkNode]);
		// 			}
		// 		}

		// 		let maxIndex = 0, maxAxisY = 0;

        //         if (linksLength) {
        //             for (let i = 0; i < linksLength; i++) {
        //                 let axisY = 0;

        //                 if (!links[i].data) {
        //                     continue;
        //                 }
        //                 if (links[i].data.index > maxIndex) {
        //                     maxIndex = links[i].data.index;
        //                 }

        //                 if (0 == links[i].data.y || links[i].data.y) {   //不为null || "" || undefined
        //                     axisY = parseInt(links[i].data.y);
        //                 } else {
        //                     if (links[i].data.targetNodeId) {
        //                         if (links[i].attributes.target && links[i].attributes.target.y) {
        //                             axisY = parseInt(links[i].attributes.target.y);
        //                         } else {
        //                             let targetNode = that.graph.getCell(that.nodeMap[links[i].data.targetNodeId]);
        //                             if (targetNode && targetNode.attributes.position) {
        //                                 axisY = parseInt(targetNode.attributes.position.y);
        //                             }
        //                         }
        //                     }
        //                 }
        //                 if (axisY > maxAxisY) {
        //                     maxAxisY = axisY;
        //                 }
        //             }
        //             maxIndex += 1;
		// 		}
				
		// 		for (let i = linksLength; i < count; i++) {
        //             let AxisY: number;
		// 		    if (maxIndex) {
        //                 AxisY = maxAxisY + ((i - linksLength) + 1) * 40;
        //             } else {
        //                 AxisY = parseInt(that.selectNodeData.y) + (maxIndex + (i - linksLength)) * 40;
        //             }
		// 			let link = {
		// 				id: that.createNodeId(),
		// 				pipelineDefinitionId: that.pipeLineId,
		// 				sourceNodeId: that.selectNodeData.id,
		// 				x: parseInt(that.selectNodeData.x) + 300,
		// 				y: AxisY,
		// 				name: that.selectNodeData.branchList[i].name,
		// 				expression: that.selectNodeData.branchList[i].name,
		// 				// vertices: [{x: parseInt(that.selectNodeData.x) + 100, y: AxisY}],
		// 				index: maxIndex + (i - linksLength)
		// 			};
		// 			that.pipeLineDefinition.edgeDefinitionList.push(link);
		// 			let linkNode = that.createLink(link, 'split');
		// 			linkNode.data = link;
		// 			linkList.push(linkNode);
		// 		}
		// 		that.graph.addCells(linkList);
		// 	} else if (count > linksLength) {
        //         let minIndex = 0, maxIndex = 0, maxAxisY = 0;

        //         if (linksLength) {
        //             for (let i = 0; i < linksLength; i++) {
        //                 let axisY = 0;

        //                 if (!links[i].data) {
        //                     continue;
        //                 }
        //                 if (links[i].data.index > maxIndex) {
        //                     maxIndex = links[i].data.index;
        //                 }
        //                 if (links[i].data.index < minIndex) {
        //                     minIndex = links[i].data.index;
        //                 }

        //                 if (0 == links[i].data.y || links[i].data.y) {   //不为null || "" || undefined
        //                     axisY = parseInt(links[i].data.y);
        //                 } else {
        //                     if (links[i].data.targetNodeId) {
        //                         if (links[i].attributes.target && links[i].attributes.target.y) {
        //                             axisY = parseInt(links[i].attributes.target.y);
        //                         } else {
        //                             let targetNode = that.graph.getCell(that.nodeMap[links[i].data.targetNodeId]);
        //                             if (targetNode && targetNode.attributes.position) {
        //                                 axisY = parseInt(targetNode.attributes.position.y);
        //                             }
        //                         }
        //                     }
        //                 }
        //                 if (axisY > maxAxisY) {
        //                     maxAxisY = axisY;
        //                 }
        //             }
        //             maxIndex += 1;
        //         }

		// 		for (let i = linksLength; i < count; i++) {
        //             let AxisY: number;
		// 		    if (maxIndex) {
        //                 AxisY = maxAxisY + ((i - linksLength) + 1) * 40;
        //             } else {
        //                 AxisY = parseInt(that.selectNodeData.y) + (maxIndex + (i - linksLength)) * 40;
        //             }
		// 			let link = {
		// 				id: that.createNodeId(),
		// 				pipelineDefinitionId: that.pipeLineId,
		// 				sourceNodeId: that.selectNodeData.id,
		// 				x: parseInt(that.selectNodeData.x) + 300,
		// 				y: AxisY,
		// 				name: that.selectNodeData.branchList[i].name,
		// 				expression: that.selectNodeData.branchList[i].name,
		// 				// vertices: [{x: parseInt(that.selectNodeData.x) + 100, y: AxisY}],
		// 				index: maxIndex + (i - linksLength)
		// 			};
		// 			that.pipeLineDefinition.edgeDefinitionList.push(link);
		// 			let linkNode = that.createLink(link, 'split');
		// 			linkNode.data = link;
		// 			linkList.push(linkNode);
		// 		}
		// 		that.graph.addCells(linkList);
		// 	}
		// }
		delete that.pipelineNodeCommunicationService.nodeData['changeType'];
	}

    /**
     * @param nodeData 当前修改的组件
     * 处理触发器组件同时满足条件数据
     */
    TriggerMeetConditions(nodeData: any) {
        if (!nodeData) {
            return;
        }

        nodeData.additionExpression = []; // 同时满足条件
        if (nodeData.conditions && nodeData.conditions.length) {
            nodeData.conditions.map((data: any, index: number) => {
                if (data) {
                    if (data.code !== '&&') {
                        nodeData.additionExpression.push(`'${data.target}' : '${data.code}' : ${data.number || undefined}`);
                    } else {
                        nodeData.additionExpression.push(`'${data.target}' : > : ${data.first || undefined} : '${data.code}' : '${data.target}' : < : ${data.second || undefined}`);
                    }
				}
            });
        }
    }

    /**
     * @param nodeData 当前修改的组件
     * 处理触发器组件触发条件数据
     */
    TriggerExpression(nodeData: any) {
        let branchList: any[] = [];

        if (!nodeData) {
            return branchList;
        }

        nodeData.mainExpression = [];
        if (nodeData.targetType === 'event') {
            if (nodeData.branchType == '1') { // 单分支
                branchList = nodeData.eventList;
                nodeData.eventList.map((data: any, index: number) => {
                    data && nodeData.mainExpression.push(`${data.code} : == : ${data.name}`);
                });
                nodeData.mainExpression.push(`${nodeData.otherName || 'undefined'}`);
            } else if (nodeData.branchType == '2') { // 多分支
                branchList = nodeData.eventMultipleBranchList;
                nodeData.eventMultipleBranchList.map((data: any, index: number) => {
                    data && nodeData.mainExpression.push(`${data.code} : == : ${data.name}`);
                });
            }
        }
        else if (nodeData.targetType === 'target') {
            if (nodeData.branchType == '1') {
                branchList = nodeData.targetList;
                nodeData.targetList.map((data: any, index: number) => {
                    if (data) {
                        if (data.code !== '&&') {
                            nodeData.mainExpression.push(`'${nodeData.otherTarget}' : '${data.code}' : ${data.number || undefined} : == : '${data.name || undefined}'`);
                        } else {
                            nodeData.mainExpression.push(`'${nodeData.otherTarget}' : > : ${data.first || undefined} : '${data.code}' : '${nodeData.otherTarget}' : < : ${data.second || undefined} : == : '${data.name || undefined}'`);
                        }
                    }
                });
                nodeData.mainExpression.push(`'${nodeData.otherName || undefined}'`);
            } else if (nodeData.branchType == '2') {
                branchList = nodeData.targetMultipleBranchList;
                nodeData.targetMultipleBranchList.map((data: any, index: number) => {
                    if (data) {
                        if (data.code !== '&&') {
                            nodeData.mainExpression.push(`'${nodeData.otherTarget}' : '${data.code}' : ${data.number || undefined} : == : '${data.name || undefined}'`);
                        } else {
                            nodeData.mainExpression.push(`'${nodeData.otherTarget}' : > : ${data.first || undefined} : '${data.code}' : '${nodeData.otherTarget}' : < : ${data.second || undefined} : == : '${data.name || undefined}'`);
                        }
                    }
                });
            }
        }
        return branchList;
    }

	/**
     * @param node 当前修改的组件
	 * 处理触发器组件数据
	 */
	processTriggerNode(node: any) {
		let that = this;

        let nodeData = that.pipelineNodeCommunicationService.nodeData; // 当前修改组件diagram信息

        that.TriggerMeetConditions(nodeData);

        let branchList = that.TriggerExpression(nodeData);

        if (!nodeData || !nodeData.mainExpression || !nodeData.mainExpression.length) {
            return;
        }

        let length = nodeData.mainExpression.length; // 所有分支长度
		//如果是单分支 事件  最后一个分支可能没有名字 并且没有放到 mainExpression里面
		if (length >= 1 && nodeData.branchType == '1' && nodeData.mainExpression[length - 1].split(' : ').length > 1) {
			length = length + 1;
		}

        let links = that.graph.getConnectedLinks(node, {outbound: true}); // 获取当前组件出去的线
        let linksLength = links.length; // 线的总数

        if (links.length) {
            that.removeFlag = true;  // 可以删除线
            that.graph.removeCells(links);
            that.removeFlag = false;  // 禁止删除线
        }

        let linkList: any[] = [];
		for (let i = 0; i < length; i++) {
			let link = {
				id: that.createNodeId(),
				pipelineDefinitionId: that.pipeLineId,
				sourceNodeId: nodeData.id,
				x: parseInt(nodeData.x) + 250,
				y: parseInt(nodeData.y) - Math.min(parseInt(nodeData.y)/2, 100) + i * 40,
				// vertices: [{x: parseInt(that.selectNodeData.x) + 100, y: parseInt(nodeData.y) - Math.min(parseInt(nodeData.y)/2, 100) + i * 40}],
				index: i
            };

			if (branchList[i] && branchList[i].id) {
                for (let j = 0; j < linksLength; j++) {
                    if (!links[j] || !links[j].data) {
                        continue;
                    }
                    if (branchList[i].id == links[j].data.id) {
                        if (links[j].data.targetNodeId) {
                            link['targetNodeId'] = links[j].data.targetNodeId;
                            delete link.x;
                            delete link.y;
                        }
                        break;
                    }
                }
            }

			if (nodeData.mainExpression[i]) {
				if (nodeData.mainExpression[i].split(' : ').length === 1) {
					link['name'] = nodeData.otherName;
					link['expression'] = nodeData.otherName;
                    if (linksLength && links[linksLength-1].data) {
                        if (links[linksLength-1].data.targetNodeId) {
                            link['targetNodeId'] = links[linksLength-1].data.targetNodeId;
                            delete link.x;
                            delete link.y;
                        }
                    }
				} else {
                    link['name'] = '';
                    link['expression'] = '';
					if (nodeData.targetType === 'event') {
						if (nodeData.branchType == '1') {
							link['name'] = nodeData.eventList[i].name || nodeData.eventList[i].eventName;
							link['expression'] = nodeData.eventList[i].name;
						} else if (nodeData.branchType == '2') {
							link['name'] = nodeData.eventMultipleBranchList[i].name || nodeData.eventMultipleBranchList[i].eventName;
							link['expression'] = nodeData.eventMultipleBranchList[i].name;
						} 
					} else if (nodeData.targetType === 'target') {
						let name = '';
						if (nodeData.branchType == '1') {
							if (nodeData.targetList[i].code !== '&&') {
								name = `${nodeData.otherTargetName || ''} ${nodeData.targetList[i].code} ${nodeData.targetList[i].number || ''}`;
								if (!nodeData.otherTargetName || !nodeData.targetList[i].number) {
									name = '';
								}
							} else {
								name = `${nodeData.otherTargetName || ''} ${nodeData.targetList[i].first}~${nodeData.targetList[i].second}`;
								if (!nodeData.otherTargetName || !nodeData.targetList[i].first || !nodeData.targetList[i].second) {
									name = '';
								}
							}
							link['name'] = nodeData.targetList[i].name || name;
							link['expression'] = nodeData.targetList[i].name;
						} else if (nodeData.branchType == '2') {
							if (nodeData.targetMultipleBranchList[i].code !== '&&') {
								name = `${nodeData.otherTargetName || ''} ${nodeData.targetMultipleBranchList[i].code} ${nodeData.targetMultipleBranchList[i].number || ''}`;
								if (!nodeData.otherTargetName || !nodeData.targetMultipleBranchList[i].number) {
									name = '';
								}
							} else {
								name = `${nodeData.otherTargetName} ${nodeData.targetMultipleBranchList[i].first}~${nodeData.targetMultipleBranchList[i].second}`;
								if (!nodeData.otherTargetName || !nodeData.targetMultipleBranchList[i].first || !nodeData.targetMultipleBranchList[i].second) {
									name = '';
								}
							}
							link['name'] = nodeData.targetMultipleBranchList[i].name || name;
							link['expression'] = nodeData.targetMultipleBranchList[i].name;
						}
					}
				}
			} else {
				link['name'] = 'else分支';
				link['expression'] = 'else分支';
            }

            that.pipeLineDefinition.edgeDefinitionList.push(link);

            let linkNode = that.createLink(link, 'trigger');
            linkNode.data = link;
            linkList.push(linkNode);
        }

        if (linkList.length) {
            that.graph.addCells(linkList);
        }
		
		//删除不需要的字段
		delete that.pipelineNodeCommunicationService.nodeData.eventList;
		delete that.pipelineNodeCommunicationService.nodeData.targetList;
		delete that.pipelineNodeCommunicationService.nodeData.eventMultipleBranchList;
		delete that.pipelineNodeCommunicationService.nodeData.targetMultipleBranchList;
		delete that.pipelineNodeCommunicationService.nodeData.conditions;
		delete that.pipelineNodeCommunicationService.nodeData.otherName;
		delete that.pipelineNodeCommunicationService.nodeData.otherTarget;
		delete that.pipelineNodeCommunicationService.nodeData.otherTargetName;
	}

	//处理push投放组件数据
	processPushNode(node: any) {
		let that = this;

		let content = that.pipelineNodeCommunicationService.nodeData.message;
		let equitys = that.reqData.pipelineEquityConfigDefinitionDtos;

		if (content && equitys) {
			content = content.replace(/&amp;/g, '&');
			let reg = /\$\{[\s\S]+?\}/g;
			let length = equitys.length;
			let equityList = content.match(reg);
			if (equityList && equityList.length > 0) {
				that.pipelineNodeCommunicationService.nodeData['equitys'] = {};
				for (let i = 0; i < length; i++) {
					if (equityList.indexOf('${' + equitys[i].name + '}') >= 0) {
						that.pipelineNodeCommunicationService.nodeData['equitys'][equitys[i].name] = equitys[i].code;
					}
				}
			}
		}
	}

	/**
	 * 处理入口组件数据
	 */
	processInletNode(node: any) {
		let that = this;
		if (that.pipelineNodeCommunicationService.nodeData.crowdType === '3') {
			that.pipelineNodeCommunicationService.nodeData.selectCrowdData && that.crowdResourceService.createDMPCrowd(that.pipelineNodeCommunicationService.nodeData.selectCrowdData)
			.then().catch((err: any) => {
				let error = that.errorHandlingService.getMsg(err);
				that.showMessageNews('error', error.message);
			});
		}
		delete that.pipelineNodeCommunicationService.nodeData.selectCrowdData;
	}

	/**
	 * 分流器连线删除数据处理
	 * @param link  jointjs 线的数据
	 * @param node  加在组件节点上的数据 node.data
	 * @param splitNode jointjs 组件节点的数据
	 */
	splitNodeDeleteLine(link: any, node: any, splitNode: any) {
		let that = this;

		let lineIndex = 0;
		let deleteIndex = 0;

        let nodeIndex = node.index;
        let name = link.data && link.data.name;
        let lineId = link.data && link.data.id;

		let lines = that.graph.getConnectedLinks(splitNode, {outbound: true});
		if (lines.length <= 1) {
			that.graph.addCell(link);
			that.showMessageNews('error', '分流器分支不能少于2个');
			return;
		}
		if (that.isDetail) {
			that.graph.addCell(link);
			that.showMessageNews('error', '请在右边栏修改分支数量');
			return;
		}
		for (let i = 0; i < that.pipeLineDefinition.nodeDefinitionList[nodeIndex].branchList.length; i++) {
			if (that.pipeLineDefinition.nodeDefinitionList[nodeIndex].branchList[i].name === name) {
				deleteIndex = i;
				break;
			}
		}
		that.pipeLineDefinition.nodeDefinitionList[nodeIndex].branchList.splice(deleteIndex, 1);
		that.pipeLineDefinition.nodeDefinitionList[nodeIndex].count = that.pipeLineDefinition.nodeDefinitionList[nodeIndex].branchList.length;
		let length = that.pipeLineDefinition.edgeDefinitionList.length;
		for (let i = 0; i < length; i++) {
			if (that.pipeLineDefinition.edgeDefinitionList[i].id === lineId) {
				lineIndex = i;
				break;
			}
		}
		that.pipeLineDefinition.edgeDefinitionList.splice(lineIndex, 1);
		if (that.pipeLineDefinition.nodeDefinitionList[nodeIndex].splitType == '2') {
			that.changeBranchPercent(that.pipeLineDefinition.nodeDefinitionList[nodeIndex].branchList, that.pipeLineDefinition.nodeDefinitionList[nodeIndex].count);
		}
		that.updatePipeLine();
	}

	/**
	 * 分流器为占比时 删除分支后处理分支占比
	 */
	changeBranchPercent(branchList: any, count: number) {
		let max = 100 - count + 1;
		let mean = +(100 / count).toFixed(0);
		for (let i = 0; i < count; i++) {
			if (i !== count - 1) {
				branchList[i].percent = mean;
			} else if (i === count - 1) {
				branchList[i].percent = 100 - (mean * (count - 1));
			}
		}
	}

	/**
	 * 触发器连线删除数据处理函数
	 * @param link jointjs 线的数据
	 * @param node jointjs 组件节点的数据
	 */
	triggerNodeDeleteLine(link: any, node: any) {
		let that = this;

        let id = link.data && link.data.id;
        let index = link.data && link.data.index;

		let nodeIndex = node.data && node.data.index;
		let lineList = that.graph.getConnectedLinks(node, {outbound: true});
		let lineListLength = lineList.length;

		if ((node.data && node.data.branchType == '1')) {
		    if (lineListLength <= 1) {
                that.graph.addCell(link);
                that.showMessageNews('error', '触发器单分支不能少于2个');
                return;
            }
            if (link && link.data && link.data.index == lineListLength) {
                that.graph.addCell(link);
                that.showMessageNews('error', '触发器单分支不能删除else分支');
                return;
            }
		}

		if (lineListLength <= 0) {
			that.graph.addCell(link);
			that.showMessageNews('error', '触发器多分支不能少于1个');
			return;
		}
		if (that.isDetail) {
			that.graph.addCell(link);
			that.showMessageNews('error', '请在右边栏添加删除分支');
			return;
		}

		for (let i = 0; i < lineListLength; i++) {
			//修改所有属于当前触发器的线的index
			if (lineList[i].data && lineList[i].data.index > index) {
				lineList[i].data.index = lineList[i].data.index - 1;
			}
		}
		let deleteIndex = 0; //要删除的线 在edgeDefinitionList的位置
		for (let i = 0; i < that.pipeLineDefinition.edgeDefinitionList.length; i ++) {
			if (that.pipeLineDefinition.edgeDefinitionList[i].id === id) {
				deleteIndex = i;
			}
			//修改所有属于当前触发器的线的index
			if (that.pipeLineDefinition.edgeDefinitionList[i].sourceNodeId === node.data.id && that.pipeLineDefinition.edgeDefinitionList[i].index > index) {
				that.pipeLineDefinition.edgeDefinitionList[i].index = that.pipeLineDefinition.edgeDefinitionList[i].index - 1;
			}
		}
		that.pipeLineDefinition.edgeDefinitionList.splice(deleteIndex, 1);
		that.pipeLineDefinition.nodeDefinitionList[nodeIndex].mainExpression.splice(index, 1);
		that.updatePipeLine();
	}

	//生成线
	createLink(linkData: any, type?: string) {
		let that = this;
		let tempLink = {
			attrs: {
				'.connection': {
					stroke: '#C3CBD6', 'stroke-width': 1
				},
				// '.marker-source': { fill: '#C3CBD6', stroke: '#C3CBD6', d: 'M 10 0 L 0 5 L 10 10 z', transform: 'scale(0.001)' },
				'.marker-target': { fill: '#C3CBD6', stroke: '#C3CBD6', d: 'M 10 0 L 0 5 L 10 10 z' }
			},
			labelPosition: 'c',
			router: { name: 'manhattan' },
			connector: { name: 'normal' }
		};
		if (linkData.sourceNodeId) {
			tempLink['source'] = {id: that.nodeMap[linkData.sourceNodeId], port: 'out'};
		}
		if (linkData.targetNodeId) {
			tempLink['target'] = {id: that.nodeMap[linkData.targetNodeId], port: 'in'};
		} else {
			tempLink['target'] = {x: linkData.x, y: linkData.y}
		}
		if (type) {
			tempLink.router.name = 'normal';
		}
		if (linkData.vertices && linkData.vertices.length != 0) {
			tempLink['vertices'] = _.cloneDeep(linkData.vertices);
		}
		tempLink['labels'] = [{
			position: 0.5,
			attrs: {
				text: {
					text: linkData.name || ''
				}
			}
		}];
		let link = new joint.dia.Link(tempLink);
		link.data = linkData;
		return link;
	}

	//随机生成节点ID或连线ID
	createNodeId () {
		let tempTime = Date.now() + ''; 
		for (let i = 0; i < 4; i++) {
			let temp = Math.floor(Math.random() * 10);
			tempTime = tempTime + temp;
		}
		return tempTime;
	}

	//选择时间区间后，更新营销流程时间
    onSelect(date: any) {
		let that = this;
		that.reqData['startTime'] = date.start;
		that.reqData['endTime'] = date.end;
		that.reqData['version'] = '1.0';
		that.pipelineNodeCommunicationService.formatPipeLineData(that.pipeLineDefinition.nodeDefinitionList);
		that.pipeLineDefinition['version'] = '1.0';
		that.reqData['diagram'] = JSON.stringify(that.pipeLineDefinition);
		// 选择时间后直接更新活动时间
		that.pipelineDefinitionResourceService.updatePipeline(that.status, that.reqData).then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				let error = that.errorHandlingService.getMsg(data);
                that.showMessageNews('error', error.message);
                return;
			}
			that.oldPipeLineName = null;
			that.isEdit = false;
			that.pipelineNodeCommunicationService.startTime = new Date(that.reqData['startTime']);
			that.pipelineNodeCommunicationService.endTime = new Date(that.reqData['endTime']);
		}).catch((err: any) => {
			let error = that.errorHandlingService.getMsg(err);
			that.showMessageNews('error', error.message);
		});
	}

	//显示右边content
	showDetail() {
		let that = this;
		that.isDetail = true;
		that.changeRightContentOverflow(false);
	}

	//隐藏右边的content
	hideDetail() {
		this.isDetail = false;
		this.showRightContent = '';
        this.selectNodeData = this.pipelineNodeCommunicationService.nodeData = null;
        this.pipelineNodeCommunicationService.nodeLinks = [];
	}

	//默认配置节点信息
	initOperatorModel(type?: string) {
		let that = this;
		let json: any = {
			type: 'devs.MyImageModel',
			size: {
				width: 52,
				height: 64
			},
			attrs: {
				'.label': {
					'font-size': 12,
					y: 52
				},
				image: {
					// 'xlink:href': 'http://127.0.0.1:9999/public/images/component-entrance.svg',  
					x: 4,
					'width': 44,
					'height': 44,
				},
				rect: {
					'fill-opacity': 0,
					'stroke-width': 2,
					'width': 50,
					'height': 44
				},
				'.rect': {
					'stroke': '#EA5359',
					display: 'none'
				}
			},
			ports: {
				groups: {
					inPorts: {
						position: {
							name: 'left'
						},
						attrs: {
							circle: {
								r: 4,
								'stroke': '#5697f1',
								'fill': '#5697f1',
								// 'stroke-width': 5,
								//无法拖出线
								magnet: 'passive'
							}
						}
					},
					outPorts: {
						position: {
							name: 'right'
						},
						attrs: {
							circle: {
								r: 4,
								'stroke': '#5697f1',
								'stroke-width': 2,
								magnet: true
							}
						}
					}
				}
			}
		};
		if (type === 'entrance') {
			json.ports['items'] = [{
				id: 'out',
				group: 'outPorts'
			}];
		} else if (type === 'end') {
			json.ports['items'] = [{
				id: 'in',
				group: 'inPorts'
			}];
		} else if (type === 'trigger' || type === 'split') {
			json.ports.groups.outPorts.attrs.circle.magnet = 'passive';
			json.ports.groups.outPorts.attrs.circle['fill'] = '#5697f1';
			json.ports['items'] = [{
				id: 'in',
				group: 'inPorts'
			}, {
				id: 'out',
				group: 'outPorts'
			}];
		} else {
			json.ports['items'] = [{
				id: 'in',
				group: 'inPorts'
			}, {
				id: 'out',
				group: 'outPorts'
			}];
		}
		if (!that.editFlag) {
			json.ports.groups.outPorts.attrs.circle.magnet = 'passive';
		}
		let model = joint.shapes.basic.Rect.extend({
			markup: '<g class="rotatable"><image /><text class="label"/><rect class="rect"></rect></g>',
			defaults: _.defaultsDeep(json, joint.shapes.devs.Model.prototype.defaults)
		});
		return model;
	}

	//新建节点
	createOperator(operatorModel: any, operatorInfo: any){
		let operator = new operatorModel({
            position: {
                x: parseInt(operatorInfo.X),
                y: parseInt(operatorInfo.Y)
            },
            attrs: {
                '.label': {
                    text: operatorInfo.name || ''
                },
                image: {
                    'xlink:href': operatorInfo.icon,
                }
            }
		});
		return operator;
	}

	//拖入节点信息
	drag(e: any, data: any) {
		let that = this;
		
		let curNodeList = that.graph.getCells();
		let curNodeIsEnd = curNodeList.find((node: any) => { // 判断绘画区域是否已经存在end组件 或 entrance组件
			if (!node.data) {
				return false;
            }
			return node.data.type === 'end' ? true : false;
        });
        let curNodeIsEntrance = curNodeList.find((node: any) => { // 判断绘画区域是否已经存在end组件 或 entrance组件
			if (!node.data) {
				return false;
            }
			return node.data.type === 'entrance' ? true : false;
		});
        if (curNodeIsEnd) { // 如果存在，则不能再添加end组件 或 入口
			if (data.id === 9) {
				that.curNodeIsEndFlag = true;
			} else {
				that.curNodeIsEndFlag = false;				
			}
        }
        if (curNodeIsEntrance) { // 如果存在，则不能再添加end组件 或 入口
			if (data.id === 1) {
				that.curNodeIsEntranceFlag = true;
			} else {
				that.curNodeIsEntranceFlag = false;				
			}
		}

		let nodeData = {icon: data.icon, id: data.id, name: data.name};

		e.dataTransfer.setData('dataInfo', JSON.stringify(nodeData));
	}

	//允许拖入
	allowDrop(e: any) {
		e.preventDefault();
	}

	//拖入添加的节点
	drop(e: any) {
		e.preventDefault();
		let that = this;

		if (that.curNodeIsEndFlag || that.curNodeIsEntranceFlag || !that.editFlag) {
			return;
        }

		if (!e.dataTransfer.getData('dataInfo')) {
			return;
		}

		let data: any = JSON.parse(e.dataTransfer.getData('dataInfo'));
		data.type = that.typeList[data.id - 1].name;
		if (!data.type && data.name == '结束') {
            data.type = 'end';
		}

		let id = that.createNodeId()
		
		if (data.type == 'push' || data.type == 'shortMessage') {
			data.name = data.name + id.substring(id.length - 4);
		}

		let model: any = that.initOperatorModel(data.type);
		let nodeInfo: any = _.defaultsDeep({
			X: parseInt(e.offsetX) - that.orignX,
			Y: parseInt(e.offsetY) - that.orignY,
		}, data);

		let node: any = that.createOperator(model, nodeInfo);
		node.data = data;
		node.data['x'] = e.offsetX - +that.orignX;
		node.data['y'] = e.offsetY - +that.orignY;
		node.data['index'] = that.pipeLineDefinition.nodeDefinitionList.length;
		node.data['id'] = id;
		that.nodeMap[node.data.id] = node.id;

		let nodeData = _.cloneDeep(node.data);
		delete nodeData.index;
		that.pipeLineDefinition.nodeDefinitionList.push(nodeData);
		that.showRightContent = node.data['type'];
		that.selectNodeData = that.pipelineNodeCommunicationService.nodeData = node.data;
		
		that.updatePipeLine();
		that.graph.addCell(node);

        if (node.data && node.data.type != 'end') {
            that.showDetail();
        } else {
            that.hideDetail();
        }
	}

	//修改营销流程名称
	editNameInput() {
		let that = this;

		if (!that.editFlag) {
			return;
		}
		that.isEdit = true;
		that.oldPipeLineName = that.pipeLineName;
	}

	//提交修改营销流程名称
	updateName() {
		let that = this;

		that.pipeLineName = that.pipeLineName?that.utilesService.trim(that.pipeLineName):that.pipeLineName;
		if (!that.pipeLineName) {
			that.showMessageNews('error', '营销流程名称不能为空');
			return;
		}
        if(that.pipeLineName.length > 26) {
			that.showMessageNews('error', '营销流程名称不能超过26个字符');	
			return;		
		}
		that.reqData.name = that.pipeLineName;
		that.reqData['version'] = '1.0';
		let diagram = JSON.parse(that.reqData.diagram);
		for (let i = 0; i < diagram.nodeDefinitionList.length; i++) {
			delete diagram.nodeDefinitionList[i].index;
		}
		diagram['version'] = '1.0';
		diagram.name = that.pipeLineName;
		let reqData = Object.assign({}, that.reqData);
		reqData.diagram = JSON.stringify(diagram);
		that.pipelineDefinitionResourceService.updatePipeline(that.status, reqData).then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				let error = that.errorHandlingService.getMsg(data);
                that.showMessageNews('error', error.message);
                return;
			}
			that.oldPipeLineName = null;
			that.isEdit = false;
		}).catch((err: any) => {
			let error = that.errorHandlingService.getMsg(err);
			that.showMessageNews('error', error.message);
		});
	}

	//取消修改营销流程名称
	cancelUpdateName() {
		let that = this;
		that.pipeLineName = that.oldPipeLineName;
		that.checkTitleNameWidth(that.oldPipeLineName);
		that.isEdit = false;
		that.oldPipeLineName = null;
	}

	//保存草稿
	saveDraft(type: string) {
		let that = this;
		if (that.isDetail) {
			if (that.showRightContent === 'rule') {
				that.pipeLineDefinition = Object.assign(that.pipeLineDefinition, that.pipelineNodeCommunicationService.rule);
				that.updatePipeLine(type);
				return;
			} else if (that.pipelineNodeCommunicationService.nodeData){
				that.processPipeNode(that.pipelineNodeCommunicationService.nodeData.id);
                that.updatePipeLine();
				that.goBack();
			}
		} else {
			that.updatePipeLine(type);
		}
	}

	//pipeline数据更新
	updatePipeLine(type?: string) {
		let that = this;
		if (!that.editFlag) {
			return;
		}
		that.pipelineNodeCommunicationService.formatPipeLineData(that.pipeLineDefinition.nodeDefinitionList);
		that.reqData['version'] = '1.0';
		that.pipeLineDefinition['version'] = '1.0';
		that.reqData['diagram'] = JSON.stringify(that.pipeLineDefinition);
		return that.pipelineDefinitionResourceService.updatePipeline(that.status, that.reqData).then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				let error = that.errorHandlingService.getMsg(data);
                that.showMessageNews('error', error.message);
                return;
			}
            if (type) {
                that.goBack();
            }
            // console.log('==>>', data);
        }).catch((err) => {
            let error = that.errorHandlingService.getMsg(err);
			that.showMessageNews('error', error.message);
        })
	}

	//pipeLine数据检测
	check() {
		let that = this;
		that.status = 0;

		if (!that.editFlag) {
			return;
		}

        if (that.isDetail && that.pipelineNodeCommunicationService.nodeData) {
            that.processPipeNode(that.pipelineNodeCommunicationService.nodeData.id);
        } else if (that.selectNodeData && that.selectNodeData.index >= 0) {
            that.processPipeNode(that.selectNodeData.id);
        }

        that.updatePipeLine().then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				let error = that.errorHandlingService.getMsg(data);
				that.showMessageNews('error', error.message);
                return ;
			}
			return that.pipelineDefinitionResourceService.check(that.reqData)
		}).then((result: any) => {
			let data = JSON.parse(result._body);
			if (data.retCode || data.msgDes || data.errMessage) {
				that.showMessageNews('error', data.msgDes);		
				return;		
			}
			let length = data.length;
			if (length > 0) {
				let newErrNodeList = [];
				for (let i = 0; i < length; i++) {
                    let errMessage = '';

					newErrNodeList.push(data[i].nodeId);
					let node = that.graph.getCell(that.nodeMap[data[i].nodeId]);
					if (!node) {
						continue;
					}

					data[i].errMsg.map((result: string, j: number) => {
						if (j === 0) {
							errMessage += `${result}`;
						} else {
							errMessage += `\n${result}`;
						}
					});
					node.attr({
						'.rect': {
							display: 'inline-block'
						},
						'.label': {
							text: errMessage,
							fill: '#DF5E63'
						}
					})
				};

				if (that.errNodeList.length > 0) {
                    let nodeList = _.difference(that.errNodeList, newErrNodeList);
                    for (let i = 0; i < nodeList.length; i++) {
						let node = that.graph.getCell(that.nodeMap[nodeList[i]]);
						if (!node) {
							continue;
						}
						node.attr({
							'.rect': {
								display: 'none'
							},
							'.label': {
								text: node.data && node.data.name || '',
								fill: '#000'
							}
						});
					}
				}
				that.errNodeList = newErrNodeList;
			} else {
				let length = that.errNodeList.length;
				for (let i = 0; i < length; i++) {
					let node = that.graph.getCell(that.nodeMap[that.errNodeList[i]]);
					if (!node) {
						continue;
					}
					node.attr({
						'.rect': {
							display: 'none'
						},
						'.label': {
							text: node.data && node.data.name || '',
							fill: '#000'
						}
					});
				}
				that.showMessageNews('info', '校验通过');
			}
		}).catch((error) => {
			console.log(error)
		});
	}

	//提交pipeLine 需要检测通过
	//提交成功跳转详情页面
	save() {
		let that = this;

		if (!that.editFlag) {
			return;
		}
		if (!that.reqData.name) {
			that.showMessageNews('error', '请修改默认营销流程名称后提交！');
			return;
		}
		let pipeLineId = that.reqData.id;
		that.pipelineDefinitionResourceService.submit(pipeLineId).then((result: any) => {
            if (result && (result.retCode || result.msgDes)) {
                let error = that.errorHandlingService.getMsg(result);
                that.showMessageNews('error', error.message);
                return;
            }
			that.goBack();
		}).catch((err) => {
			let error = that.errorHandlingService.getMsg(err);
			that.showMessageNews('error', error.message);
		});
	}

	//返回详情页面
	goBack() {
		let that = this;
		that.router.navigate(['/marketing', that.campaignId]);
	}

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

	// 是否可以编辑
	initEditFlag() {
        let that = this;
        that.campaignResourceService.missionExceptional$.subscribe(data => {
            let status = data['status'];
            
            if (that.campaignStatus === 3) {
                that.editFlag = false;
            }
            if (status == 1 || status == 2 || status == 4 || status == 7) {
                that.editFlag = true;
            } else {
                that.editFlag = false;
			}
			if (that.reqData.endTime < Date.now()) {
				that.editFlag = false;
			}
			that.pipelineNodeCommunicationService.editFlag = that.editFlag;
        });
	}

	//显示全局规则
	showRule() {
		let that = this;
		that.showRightContent = 'rule';
		that.showDetail();
	}

	// 判断titleName的长度
	checkTitleNameWidth(event: any) {
		let that = this;
		let len = 0;
		for (var i = 0; i < event.length; i++) {
		  if (event.charCodeAt(i) > 255) {
			len += 16;
		  }
		  else {
			len += 10;
		  }
		}
		that.titleNameWidth = len;
	}

	//修改右边栏overflow样式
	changeRightContentOverflow(data: boolean) {
		let that = this;
		if (data) {
			that.overflow = false;
		} else {
			that.overflow = true;
		}
	}

	/**
	 * 收起左边栏
	 */
	packUp() {
		let that = this;
		that.isOperatorShow = !that.isOperatorShow;
	}

	/**
	 * 显示报表弹框
	 */
	showReport() {
		let that = this;
		that.showReportDialog = true;
	}

	/**
	 * 实时创建分流器活触发器生成连线
	 * @param data 
	 * 	type split/trigger 判断是分流器还是触发器
	 *  lineType d/a/c 判断是增加线还是删除线还是修改
	 *  id 线上id（自己创建的）
	 * 	index 第几条线
	 *  name 线上显示的名称
	 *  expression 线上保存的表达式
	 *  deleteType all  占时只有all状态 lineType 为d时使用 删除该节点所有的线
	 */
	createLines(data: any) {
		let that = this;
		if (!data || !data.id) {
			return;
		}
		let node = that.graph.getCell(that.nodeMap[data.id]);
		let links = that.graph.getConnectedLinks(node, {outbound: true});
		let linksLength = links.length;
		if (data.lineType === 'd') {
			//删除连线
			if (!data.deleteType) {
				for (let i = 0; i < linksLength; i++) {
					if (links[i].data.index === data.index) {
						that.removeFlag = true;
						that.graph.removeCells([links[i]]);
						that.removeFlag = false;
					}
				}
			} else if (data.deleteType === 'all') {
				for (let i = 0; i < linksLength; i++) {
					that.removeFlag = true;
					that.graph.removeCells([links[i]]);
					that.removeFlag = false;
				}
			}
		} else if (data.lineType === 'a') {
			//添加连线
			let link = {
				id: that.createNodeId(),
				pipelineDefinitionId: that.pipeLineId,
				sourceNodeId: data.id,
				x: parseInt(node.data.x) + 250,
				y: parseInt(node.data.y) - Math.min(parseInt(node.data.y)/2, 100) + data.index * 40,
				index: data.index,
				name: data.name || '',
				expression: data.expression || ''
			};
			that.pipeLineDefinition.edgeDefinitionList.push(link);
			let linkNode = that.createLink(link, 'splitOrTrigger');
			linkNode.data = link;
			that.graph.addCells([linkNode]);
		} else if (data.lineType === 'c') {
			//修改连线数据
			let length = that.pipeLineDefinition.edgeDefinitionList.length;
			for (let i = 0; i < length; i++) {
				if (data.id === that.pipeLineDefinition.edgeDefinitionList[i].id) {
					that.pipeLineDefinition.edgeDefinitionList[i].name = data.name || '';
					that.pipeLineDefinition.edgeDefinitionList[i].expression = data.expression || '';
				}
			}
			for (let i = 0; i < linksLength; i++) {
				if (links[i].data.index === data.index) {
					links[i].data.name = data.name || '';
					links[i].data.expression = data.expression || '';
					links[i].set('labels', [{
						position: 0.5,
						attrs: {
							text: {
								text: data.name || ''
							}
						}
					}]);
				}
			}
		}
	}
}