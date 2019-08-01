import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';
import { ApiAccountService } from '../api-account.service';

@Component({
    selector: 'app-api-account-detail',
    templateUrl: './api-account-detail.component.html',
    styleUrls: ['./api-account-detail.component.css']
})
export class ApiAccountDetailComponent implements OnInit {
    _data: any = {};               // 路由详情
    id: any;
    btnFlag = true;                // true 表示当前按钮是隐藏状态  false 查看状态   默认是隐藏
    apiSecret: any;
    rolecode: any;
    constructor(
        private service: ApiAccountService,
        private route: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private nzNotificationService: NzNotificationService) {
            this.rolecode = window['appConfig'].rolecode;
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.getAccountsDetail(this.id);
    }

    // 获取路由详情
    getAccountsDetail(id: any) {
        this.service.getAccountsDetail(id).then((response: any) => {
            if (response.code === 200) {
                this.btnFlag = !this.btnFlag;
                this._data = response.data;
                this.changeApiSecret();
            } else {
                this.nzNotificationService.create('warning', '错误提示', response.message);
            }

        }).catch((err: any) => {
        });
    }

    // 改变ApiSecret的隐藏显示
    changeApiSecret() {
        this.btnFlag = !this.btnFlag;
        const str = this._data['apiSecret'];
        if (this.btnFlag && str && str.length > 4) {
            this.apiSecret = str.substring(0, 2) + '******' + str.substring(str.length - 2, str.length);
        } else {
            this.apiSecret = str;
        }
    }

    // 产变路由状态
    changeStatus(value: any, item: any) {
        const that = this;
        let title, content;
        if (item.status === 1 || item.status === '1' || item.status === true) {
            title = `你确定要禁用${item.companyName}的${item.name}吗？`;
            content = `禁用后，租户将不能使用此API账号访问有权限的API，你确定吗？`;
        } else {
            title = `你确定要启用${item.companyName}的${item.name}吗？`;
            content = `启用后，租户将可以使用此API账号访问有权限的API，你确定吗？`;
        }
        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = item.id;
                obj['status'] = item.status ? 0 : 1;
                that.service.updateAccounts(obj).then((data: any) => {
                    if (data.code === 200) {
                        this.getAccountsDetail(this.id);
                    } else {
                        this.nzNotificationService.create('warning', '错误提示', data.message);
                    }
                }).catch((err: any) => {
                });
            }
        });
    }
}
