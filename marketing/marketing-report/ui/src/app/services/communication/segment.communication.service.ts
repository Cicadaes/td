import { Injectable } from '@angular/core';

@Injectable()
export class SegmentCommunicationService {

    segmentInfo:any = {};

    smsSegmentInfo:any = {};

    edmSegmentInfo:any = {};

    subCrowdName: string = '';//子人群名称

    isUpdate: number = 2;  //判断是编辑还是查看还是新建 0是查看 1是编辑 2是新建

    panelIndex: number = 0;  //选中的投放模式 0 应用  1 短信  2 邮件

    startDate: any; //营销活动开始时间

    endDate: any;  //营销活动结束时间

    unitId: number;  //当前修改的投放属于的投放单元ID

    isFirstSegmentForScene: boolean = false;  //判断是不是场景人群创建的第一个投放

    isSegmentForSceneSub: boolean = false;  //判断是不是场景子人群创建的投放

    isError: any = {};  //判断页面是否有错误

    quoteList: any = []; //变量数组

    appConf: any = [{}];       //推送通道配置数据

    pid: number;   //推送通道用的pid

    tempFormData: any = {};//新建投放上传的formData

    isSceneCrowd: boolean = false;  //是否是场景人群 用来判断投放的投放时间显示

    segmentListLength: number = 0;  //记录当前投放单元的投放数量

    crowdId: any = "";  //人群ID

    crowdVersion: any = "";  //人群版本

    crowdType: any = "";  //人群类型

    constructor(){
        let that = this;
    }

    //重新build投放数据(别的地方清数据的时候需要使用)
    resetSegmentInfo(){
        let that = this;
        that.segmentInfo = {};
		that.smsSegmentInfo = {};
		that.edmSegmentInfo = {};
    }

}