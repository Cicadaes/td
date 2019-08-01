import { Injectable } from '@angular/core';
@Injectable()
export class ConfigService {
    //用于存放各种状态 组合信息 权限相关
    indexSelect: boolean = false;  //首页 活动总览/活动列表 选择 默认选择活动总览
}