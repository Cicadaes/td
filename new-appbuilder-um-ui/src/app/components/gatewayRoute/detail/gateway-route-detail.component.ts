import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { GatewayRouteervice } from './../gateway-route.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-gateway-route-detail',
    templateUrl: './gateway-route-detail.component.html',
    styleUrls: ['./gateway-route-detail.component.css']
})
export class GatewayRouteDetailComponent implements OnInit {
    _data: any = {};               // 路由详情
    id: any;
    constructor(
        private service: GatewayRouteervice,
        private route: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private nzNotificationService: NzNotificationService) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.getWayRouteDetail(this.id);
    }

    // 获取路由详情
    getWayRouteDetail(id: any) {
        this.service.getWayRouteDetail(id).then((response: any) => {
            if (response.code === 200) {
                this._data = response.data;
            } else {
                this.nzNotificationService.create('warning', '错误提示', response.message);
            }

        }).catch((err: any) => {
        });
    }

    // 产变路由状态
    changeStatus(value: any, item: any) {
        const that = this;
        let title, content;
        if (item.status === 1 || item.status === '1' || item.status === true) {
            title = `你确定要下线${item.name}吗？`;
            content = `下线后，API网关将不能使用此规则进行请求路由转发。`;
        } else {
            title = `你确定要发布${item.name}吗？`;
            content = `发布后，API网关可以使用此规则进行请求路由转发。`;
        }
        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = item.id;
                obj['status'] = item.status ? 0 : 1;
                that.service.updateWayRoute(obj).then((data: any) => {
                    if (data.code === 200) {
                        this.getWayRouteDetail(this.id);
                    } else {
                        this.nzNotificationService.create('warning', '错误提示', data.message);
                    }
                }).catch((err: any) => {
                });
            }
        });
    }
}
