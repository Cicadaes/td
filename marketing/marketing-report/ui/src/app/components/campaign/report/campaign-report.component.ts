import { Component } from '@angular/core';
import {SelectItem} from 'primeng/components/common/api';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { Message } from 'primeng/primeng';
import * as moment from 'moment';

import { AppConfResourceService } from '../../../services/campaign/app_conf.resource.service';
import { CampaignResourceService } from "../../../services/campaign/campaign.resource.service";
import { EffectService } from "../../../services/report/effect.communication.service";
import { CrowdResourceService } from "../../../services/campaign/crowd.resource.service";
import { SegmentResourceService } from "../../../services/campaign/segment.resource.service";
import { CampaignLaunchUnitResourceService } from "../../../services/campaign/campaign_launch_unit.resource.service";
import { ErrorHandlingService } from "../../../services/exceptional/error-handling.service";
import { CampaignDetailExceptionalCommunication } from "../../../services/exceptional/campaign-detail-exceptional.service";

@Component({
  selector: 'my-create-marketing',
  templateUrl: 'campaign-report.component.html',
  styleUrls: ['campaign-report.component.css'],
  providers: [ EffectService, CampaignResourceService, CrowdResourceService, SegmentResourceService, CampaignLaunchUnitResourceService, CampaignDetailExceptionalCommunication ]
})
export class CampaignReportComponent {
    crowdIndex: number;   //不知道何用

    msgs: Message[] = []; //右上角弹出错误数据

    campaignId: number;             //活动Id
    campaignInfo: any = {};         //活动详情数据
    showGoalAtta: boolean = false;  //没有设置目标   页面显示空白
    funnelShow: boolean = false;    //是否显示漏斗分析 用于延迟加载漏斗分析页面数据
    effectItemList: any = [];       //投放概览列表

    effectShow: boolean = false;   //是否显示效果分析 用于选中后加载效果分析页面

    segmentGroup: any = [];         //投放目标贡献详情列表的表头

    selectedTargetInfo: any = {};   //选中的目标计划 数据
    selectedTargetIndex:number = 0;//选中的计划的下标

    crowdNameList: SelectItem[] = [] //人群名称列表
    pushNameList: SelectItem[] = [] //投放名称列表
    allUnitId: any[]=[];        //所有投放单元的Id
    selectCrowd: any;              //选中的人群
    selectPush: any;               //选中的投放
    selectList: any[] = [];  //已选择的子人群 但未保存
    childCrowdList: any[] = []; //已选中并保存的子人群
    segments: any = [];             //已选择的投放id列表 
    segmentList: any [] = [];   //投放目标贡献详情使用的投放id

    api: any;  //条件筛选弹出层 api

    showCharts: boolean = false; //是否显示折线图
    //折线图数据
    xdata:any[] = [];
    series:any[] = [];
    legend:any = {};
    chartsFn: any = {};
    //对比的颜色库
    colors:any = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

    constructor(
        private campaignResourceService: CampaignResourceService,
        private effectService: EffectService,
        private crowdResourceService: CrowdResourceService,
        private segmentResourceService: SegmentResourceService,
        private campaignLaunchUnitResourceService: CampaignLaunchUnitResourceService,
        private router: Router,
        private route: ActivatedRoute,
        private errorHandlingService: ErrorHandlingService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ){
        let that = this;
        that.campaignId = that.route.params['value']['id'] //从路由获取活动ID

        campaignResourceService.get(that.campaignId).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
            that.campaignInfo = data;
        }).catch(err => {
            that.error(err);
        });

        let param = {
            campaignId: that.campaignId,
            segments: that.segments
        };
        
        //总投放概览
        that.effectService.getEffectOverview(param).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
            if(data && data.length > 0) {
                that.showGoalAtta = true;
                that.effectItemList = data;
                that.buildTargetDetailGroup(data);
                that.selectedTargetInfo = data[0];
                that.getEffectTrend();
                that.getCrowdList();
            }
        }).catch(err => {
            that.error(err);
        });

        //监听错误信息
        campaignDetailExceptionalCommunication.missionExceptional$.subscribe(data => {
            if (data) {
                that.error(data);
            }  
        })
    }
    
    //加载漏斗分析页面
    handle(event: any){
        let that = this;
        if (event.index == 1) {
            that.funnelShow = true;
            that.effectShow = false;
        } else if (event.index == 2) {
            that.funnelShow = false;
            that.effectShow = true;
        }
        if (event.index !== 0 && that.api) {
            that.api.hide();
        }
    }

    //选中目标框
    chooseTarget(event:any,index:number){
        let that = this;
        let oT = that.getTarget(event);
        let len = oT.parentNode.children;
    	for(let i=0;i<len.length;i++){
    		len[i].classList.remove('active');
    	}
    	oT.classList.add('active');
        that.selectedTargetInfo = that.effectItemList[index];
        that.selectedTargetIndex = index;
        that.getEffectTrend();
    }

    //选中目标框后获取其父节点
    getTarget(event:any){
        let obj = document.querySelector('.taget-content');
        let target = event.target;
        if(target.className.indexOf('taget-content')!==-1){return target;}
        if(target == obj){return false;}
        while(target.className.indexOf('taget-content') === -1){
            target = target.parentNode;
        }
        return target;
    }

    //获取趋势分析数据
    getEffectTrend() {
        let that  = this;
        that.effectService.getEffectTrend(that.campaignId, that.selectedTargetInfo.targetConfigId, that.segments).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
            if (data.length) {
                that.fromateEffect(data);
            }
        }).catch(err => {
            that.error(err);
        });
    }

    //格式化总体趋势概览
    fromateEffect(data: any) {
        let that = this;
        let actualSum:any = [];
        let length = data.length;
        let xdataList: any = [];
        let seriesList: any = [];
        let legendList: any = [];
        let formatData;
        for (let i = 0; i < length; i++) {
            let list = data[i].item;
            let dataList: any = [];     //横坐标数据
            actualSum.push(data[i].value);
            for (let key in list) {
                that.showCharts = true;
                // let tempXdata = that.formateDate(key);
                // formatData = moment(tempXdata).format("YYYY-MM-DD");
                formatData = key;
                if (xdataList.indexOf(formatData) === -1) {
                    xdataList.push(formatData);
                } 
                dataList.push(list[key]);
            }
            seriesList.push({
                name: data[i].segmentName,
                smooth: true,
                type: 'line',
                data: dataList
            });
            legendList.push({
                name: data[i].segmentName,
                icon: 'circle'
            });
        }
        let dataLength = seriesList[0].data.length;
        let value;
        if (that.segments.length==0) {
            value = that.selectedTargetInfo.value;
        } else {
            value = that.selectedTargetInfo.actualValue;
        }
        let json = {
            name: '计划目标',
            smooth: true,
            type: 'line',
            symbol: 'circle',
            hoverAnimation: false,
            symbolSize: 10,
            label: {
                normal: {
                    show: true,
                    position: 'bottom',
                    formatter: function(params: any) {
                        let number = params.value;
                        let tempNumber = number;
                        if (number && /^[0-9]*$/.test(number)) {
                            number += '';
                            let length = Math.floor(number.length / 3);
                            tempNumber = number.split('');
                            for (let i = 0; i < length; i++) {
                                tempNumber.splice(-(((i + 1) * 3) + i), 0, ',');
                            }
                            if (tempNumber[0] == ',') {
                                tempNumber.shift();
                            }
                            tempNumber = tempNumber.join('');
                        }
                        return `${params.seriesName}\n${tempNumber}`;
                    }
                },
                emphasis: {
                    show: true,
                    position: 'bottom',
                    formatter: function(params: any) {
                        return `${params.seriesName}: ${params.value}`;
                    }
                } 
            },
            markLine: {
                symbol: ['', ''],
                animation: true,
                data: [{yAxis: value}],
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter: function(params: any) {
                            return '';
                        }
                    },
                    emphasis: {
                        show: true,
                        position: 'bottom',
                        formatter: function(params: any) {
                            return '';
                        }
                    } 
                },
            }
        }
        let tempData = [];
        for (let i = 0; i < dataLength - 1; i++) {
            tempData.push('');
        }
        if (that.segments.length==0) {
            tempData.push(that.selectedTargetInfo.value);
        } else {
            json.name = '实际值'
            tempData.push(that.selectedTargetInfo.actualValue)
        }
        json['data'] = tempData;
        seriesList.push(json)
        that.legend = legendList;
        that.xdata = xdataList;
        that.series = seriesList;
        that.chartsFn = function(params: any) {
            for(let j = 0; j < params.length - 1; j++){
                params[j].seriesName = data[j].name;
            }
            let text = formateDate((params[0].name).toString());
            function formateDate(param: string) {
                let year = param.substring(0,4);
                let month = param.substring(5,7);
                let day = param.substring(8,10);
                return year + '-' + month + '-' + day;
            }
            function formatNumber(number: string) {
                number = number + ''
                if (!/^[0-9]*$/.test(number)) {
                    return number;
                }
                let length = Math.floor(number.length / 3);
                let tempNumber = number.split('');
                for (let i = 0; i < length; i++) {
                    tempNumber.splice(-(((i + 1) * 3) + i), 0, ',');
                }
                if (tempNumber[0] == ',') {
                    tempNumber.shift();
                }
                return tempNumber.join('');
            }
            let res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:10px;margin-bottom:16px;">' + text + '<span style="margin:0 0 0 90px;">达成/达成率</span></div>';
            for(var i=0;i<params.length - 1;i++){
                res += '<p><span style="color:'+params[i].color+';margin-right:8px;">●</span>'+params[i]['seriesName']+'<span style="color:#5697f1;float: right;">'+ formatNumber(params[i]['value']) + ' / '+ (params[i]['value']/actualSum[i]*100).toFixed(2) +'%</span></p>'
            }
            return res;
        }
    }

    //格式化后端传来的时间
    formateDate(param: any) {
        if(param){
            let date = param.toString();
            let year = date.substring(0,4);
            let month = date.substring(4,6);
            let day = date.substring(6,8);
            return year + '/' + month + '/' + day;
        }
    }

    //获取人群列表
    getCrowdList() {
        let that = this;
        //获取人群列表
        let json = {
            campaignId: that.campaignId,
            pageSize: 9999
        }
        that.campaignLaunchUnitResourceService.getList(json).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
            data = data.data;
            if (data && data.length > 0) {
                that.crowdNameList.push({label: '全部', value: 'all'});
                for(let i = 0; i < data.length; i++) {
                    that.crowdNameList.push({label: data[i].crowdName, value: {id: data[i].id, name: data[i].crowdName}});
                    that.allUnitId.push(data[i].id);
                }
                that.initPushNameList();
            } else {
                that.crowdNameList.push({label: '无', value: null});
                that.pushNameList.push({label: '无', value: null});
            }
            that.selectCrowd = that.crowdNameList[0].value;
        })
    }

    //初始化投放列表
    initPushNameList(){
        let that = this;
        that.pushNameList = [];
        that.pushNameList.push({label:'全部', value: 'allp'});
        that.selectPush = this.pushNameList[0].value;
    }

    //显示弹出框
    showOverlayPanel(event: any, papi: any) {
        this.api = papi
        papi.toggle(event);
    }

    //选着人群触发
    changeCrowd() {
        let that = this;
        that.pushNameList = [];
        if(!that.selectCrowd){//投放单元为“无”的时候
            return ;
        }
        if ('all' == that.selectCrowd) {
            that.pushNameList.push({label: '全部', value: 'allp'});
            that.selectPush = 'allp';
        } else {
            let json = {
                campaignLaunchUnitId: that.selectCrowd.id
            }
            that.segmentResourceService.getSegmentsList(json).then(data => {
                if (data && (data.retCode || data.msgDes)) {
                    that.error(data);
                    return;
                }
                that.setSegmentList(data.data);
            }).catch(err => {
                that.error(err);
            });
        }
    }

    //设置投放数据
    setSegmentList(data: any) {
        let that = this;
        that.pushNameList = [];
        if(data && data.length > 0) {
            that.pushNameList.push({label: '全部', value: 'allp'});
            for(let i = 0; i < data.length; i++) {
                that.pushNameList.push({label: data[i].name, value: {id: data[i].id, name: data[i].name}});
            }
        } else {
            that.pushNameList.push({label: '无', value: null});
        }
        that.selectPush = that.pushNameList[0].value;
    }

    //添加对比
    selectContrastData() {
        let that = this;
        let json = {};
        //人群和投放都选择全部
        if (that.selectCrowd == 'all' && that.selectPush == 'allp') {
            for(let i = 0; i < that.crowdNameList.length; i++){
                if (that.crowdNameList[i].value == 'all') {
                    continue;
                }
                let data = {
                    campaignLaunchUnitId: that.crowdNameList[i].value['id']
                };
                that.segmentResourceService.getSegmentsList(data).then(data => {
                    if (data && (data.retCode || data.msgDes)) {
                        that.error(data);
                        return;
                    }
                    let segmentList = data.data;
                    for (let j = 0; j < segmentList.length; j++) {
                        json = {
                            label: that.crowdNameList[i].value.name + '-' + segmentList[j].name,
                            unitId: that.crowdNameList[i].value.id,
                            pushId: segmentList[j].id
                        };
                        if (!that.distinct(that.selectList, json)) {
                            that.selectList.push(json);
                        }
                    }
                }).catch(err => {
                    that.error(err);
                });
            }
        } else if (that.selectCrowd != 'all' && that.selectPush == 'allp') {  //投放列表选择全部
            for(let i = 0; i < that.pushNameList.length; i++) {
                if(that.pushNameList[i].value == 'allp') {
                    continue;
                }
                json = {
                    label: that.selectCrowd.name + '-' + that.pushNameList[i].value.name,
                    unitId: that.selectCrowd.id,
                    pushId: that.pushNameList[i].value.id
                };
                if (!that.distinct(that.selectList, json)) {
                    that.selectList.push(json);
                }
            }
        } else {
            let length1 = that.selectCrowd.name.length;
            let length2 = that.selectPush.name.length;
            if(length1>8) {
                that.selectPush.name = that.selectPush.name.substring(0,8)
            } 
            if(length2>8) {
                that.selectCrowd.name = that.selectCrowd.name.substring(0,8)
            } 
            json = {
                label: that.selectCrowd.name + '-' + that.selectPush.name,
                unitId: that.selectCrowd.id,
                pushId: that.selectPush.id
            };
            if (!that.distinct(that.selectList, json)) {
                that.selectList.push(json);
            }
            
        }
    }

    //添加对比时的去重
    distinct(list: any[], data: any) {
        let flag: boolean = false;
        let length: number = list.length;
        for(let i: number = 0; i < length; i++) {
            if(data.unitId === list[i].unitId && data.pushId === list[i].pushId) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    //删除条件筛选
    deleteSelectContrast(index: number) {
        this.selectList.splice(index, 1);
    }

    //保存条件筛选
    save(hide: any) {
        let that = this;
        hide.hide();
        that.childCrowdList = that.selectList.concat();
        that.segments = [];
        that.segmentList = [];
        if (that.childCrowdList && that.childCrowdList.length > 0) {
            for(let i = 0; i < that.childCrowdList.length; i++) {
                that.segments.push(that.childCrowdList[i].pushId);
                that.segmentList.push(that.childCrowdList[i].label);
                //设置添加对比后的颜色
                if(i >= that.colors.length){
                    that.childCrowdList[i]["color"] = that.colors[i-that.colors.length];
                }else{
                    that.childCrowdList[i]["color"] = that.colors[i];
                }
            }
        }
        that.getEffectTrend();
        let param = {
            campaignId: that.campaignId,
            segments: that.segments
        };
        //总投放概览
        that.effectService.getEffectOverview(param).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
            if(data && data.length > 0) {
                that.effectItemList = data;
                that.buildTargetDetailGroup(data)
            }
        }).catch(err => {
            that.error(err);
        });
    }

    //取消条件筛选
    dismiss(hide: any) {
        let that = this;
        that.selectList = that.childCrowdList.concat();
        hide.hide();
    }

    //处理数据转换成table的表头
    buildTargetDetailGroup(data:any){
        let that = this;
        that.segmentGroup = [];
        for(let i = 0; i < data.length; i++){
            //动态设置表头
            that.segmentGroup.push({
                field: data[i].targetConfigId,
                name: data[i]['name'] + '- 实际：',
                value: data[i]['actualValue']
            });
        }
    }

    //前往活动详情页
    toCampaignDetail(){
        this.router.navigate(['/marketing', this.campaignId]);
    }

    //下载贡献详情
    downloadTargetDetail(){
        let that = this;
        window.location.href = `${that.effectService.baseUrl}/${that.effectService.getRouter}/campaign/${that.campaignId}/detail/download?campaignName=${that.campaignInfo.name}`;
    }
    //新增删除条件筛选
    delChild(i:any){
        let that = this;
        that.childCrowdList.splice(i,1);
        that.selectList = this.childCrowdList.concat();
        that.segments = [];
        that.segmentList = [];
        if (that.childCrowdList && that.childCrowdList.length > 0) {
            for(let i = 0; i < that.childCrowdList.length; i++) {
                that.segments.push(that.childCrowdList[i].pushId);
                that.segmentList.push(that.childCrowdList[i].label);
                //设置添加对比后的颜色
                if(i >= that.colors.length){
                    that.childCrowdList[i]["color"] = that.colors[i-that.colors.length];
                }else{
                    that.childCrowdList[i]["color"] = that.colors[i];
                }
            }
        }
        that.getEffectTrend();
        let param = {
            campaignId: that.campaignId,
            segments: that.segments
        };
        //总投放概览
        that.effectService.getEffectOverview(param).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
            if(data && data.length > 0) {
                that.effectItemList = data;
                that.buildTargetDetailGroup(data)
            }
        }).catch(err => {
            that.error(err);
        });
    }

    //错误处理
    error(err: any) {
        let that = this;
        let errMsg = '';
        if (err && err.msgDes) {
            errMsg = err.msgDes;
        } else if (err.message) {
            errMsg = err.message;
        } else if ((typeof err == 'string') && err.constructor == String) {
            errMsg = err;
        }
        that.msgs.push({severity:'error', summary:'错误', detail: errMsg});
    }
}
