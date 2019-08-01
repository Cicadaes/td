import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'goal-select',
    templateUrl: 'goal-select.component.html',
    styleUrls: ['goal-select.component.css']
})

export class GoalSelectComponent {
    display: boolean;
    CrowdNameList: SelectItem[];
    selectCrowd: any;
    crowdIndex: number;

    PushNameList: SelectItem[];
    selectPush: any;

    selectList: any[];

    @Input()
    set show(bl: boolean) {
        this.display = bl;
    }

    @Output() hide = new EventEmitter<boolean>();

    constructor(){
        this.CrowdNameList = [];
        this.CrowdNameList.push({label:'全部', value: {name:'全部', id: '1'}});
        this.CrowdNameList.push({label:'牛股网渠道客户', value: {name:'牛股网渠道客户', id: '2'}});
        this.CrowdNameList.push({label:'淘股吧客户', value: {name:'淘股吧客户', id: '3'}});
        this.selectCrowd = this.CrowdNameList[0].value;
        this.PushNameList = [];
        this.PushNameList.push({label:'全部', value: {name:'全部', id: '1'}});
        this.PushNameList.push({label:'活动宣传预热通知', value: {name:'活动宣传预热通知', id: '2'}});
        this.PushNameList.push({label:'推送未响应用户短信通知', value: {name:'推送未响应用户短信通知', id: '3'}});
        this.PushNameList.push({label:'活动企宣', value: {name:'活动企宣', id: '4'}});
        this.selectPush = this.PushNameList[0].value;
        this.selectList = [];
    }

    selectContrastData() {
        let json = {
            label: this.selectCrowd.name + '-' + this.selectPush.name,
            crowdId: this.selectCrowd.id,
            pushId: this.selectPush.id
        };
        if(!this.distinct(this.selectList, json)){
            this.selectList.push(json);
        }
    }

    distinct(list: any[], data: any) {
        let flag: boolean = false;
        let length: number = list.length;
        for(let i: number = 0; i < length; i++) {
            if(data.crowdId === list[i].crowdId && data.pushId === list[i].pushId) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    
    deleteSelectContrast(index: number) {
        this.selectList.splice(index, 1);
    }

    dismissModel(){
        this.display = false;
        this.hide.emit(this.display);
    }
}