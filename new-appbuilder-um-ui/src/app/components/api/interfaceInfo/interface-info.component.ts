import { Component, Input, SimpleChanges, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../api.service';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-interface-info',
    templateUrl: './interface-info.component.html',
    styleUrls: ['./interface-info.component.css']
})
export class InterfaceInfoComponent implements OnInit, OnChanges {
    /**
     * @param flag  是处于编辑、新建、查看状态
     * @param obj   接口的先关数据
    */
    @Input() set interfaceDetail(value: any) {
        this._interfaceDetail = value;
        if (value && value.flag) {
            this.compontentFlag = value.flag;
            this.infoFlag.emit(this.compontentFlag);
            if (value.obj && value.obj.id) {
                this.getInterfaceDetail(value.obj.id);
            }
        }
    }

    @Output() infoFlag = new EventEmitter<any>();
    _interfaceDetail: any = {};          // 传递过来的id等相关接口数据
    interfaceDetailDate: any = {};       // api接口查询出来的某个数据
    compontentFlag: any = 'any';         // 显示某个组件的状态

    constructor(
        private apiService: ApiService,
        private notification: NzNotificationService,
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {

    }


    // 获取当前接口的详情信息
    getInterfaceDetail(id: any) {
        this.apiService.getInterfaceDetail(id).then((response: any) => {
            if (response.code === 200) {
                this.interfaceDetailDate = response.data;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 改变组件的状态
    toEdit(obj: any) {
        // this.compontentFlag = flag;
        // this.interfaceDetailDate = _.assign({}, this.interfaceDetailDate);
        this.compontentFlag = obj.flag;
        this.interfaceDetailDate = _.assign({}, obj.obj);
        this.infoFlag.emit(this.compontentFlag);
    }

    toSee(obj: any) {
        this.apiService.getInterfaceDetail(obj.data.id).then((response: any) => {
            if (response.code === 200) {
                this.compontentFlag = obj.flag;
                this.interfaceDetailDate = _.assign({}, response.data);
                this.infoFlag.emit(this.compontentFlag);
                // this.interfaceDetailDate = _.assign({}, obj.data);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
        // asnyc this.getInterfaceDetail(obj.data.id);
        // await this.interfaceDetailDate = _.assign({}, obj.data);
    }
}
