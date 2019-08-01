import { Injectable } from '@angular/core';

@Injectable()
export class UnitDataCommunicationService {

    public isShowChildList: boolean = false;  //是否可以显示子人群列表

    public isCreatePush: boolean = false; //是否可以刷新即重新计算人群  true可以 false不可以 为false 不可创建投放

    public isSceneCrowd: boolean = false;  //是否是场景人群 用来判断投放的投放时间显示

    public segmentListLength: number = 0;  //记录当前投放单元的投放数量

    public crowdId: any = "";  //人群ID

    public crowdVersion: any = "";  //人群版本

    public crowdType: any = "";  //人群类型

    public calcStatus: any = ""; //计算状态

    constructor(){}

}