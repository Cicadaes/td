import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { MainService } from './main.service';
import { ActivatedRoute,Router,RouterModule, Routes  } from '@angular/router';
import { UserService } from '../service/user.service';
import {CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
@Component({
    selector: 'my-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.less'],
    providers: [UserService]
})
export class MainComponent implements OnInit, OnDestroy {
    title: Array<any>;

    userInfo: any = {};//登录用户信息；
    constructor(
        private service: MainService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private cmModalService:CmModalService
    ) {
        this.title = this.service.title;
        this.service.missionTitle$.subscribe(title => {
            this.title = title;
        });

        // this.userService.getUserInfo().then(data => {
        //     this.userInfo = data;
        // }).catch(err => {});
    }

    ngOnInit() {

    }

    signOut(data: any) {
        let url = this.route.snapshot['_routerState'].url.split('/');
        let that = this;
        if (url[url.length - 2] == 'reportDetail' && data.url != url[url.length - 1]) {
            this.cmModalService.confirm({
                title: `确定要退出当前页面`,
                showConfirmLoading: true,
                onOk() {
                    that.router.navigate([`/main/${data.url}`]); 
                },
                onCancel() {

                }
            });
        }else{
            this.router.navigate([`/main/${data.url}`]); 
        }
    }

    ngOnDestroy() {

    }

    /**
     * 登出
     */
    /*logout(){
        this.userService.logout().then(data =>{
            window.location.href = `${data.logOutUrlPrefix}${document.location.origin}${data.redirect}` + document.location.href;
        }).catch(err => {});
    }*/

    toggleCollapsed() {

    }
}