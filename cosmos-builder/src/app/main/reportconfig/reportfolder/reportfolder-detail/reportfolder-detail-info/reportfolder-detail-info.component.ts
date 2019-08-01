import { Observable } from 'rxjs';
import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ReportfolderDetailModifyComponent } from '../reportfolder-detail-modify/reportfolder-detail-modify.component';
import { AfterViewInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { ReportfolderdetailService } from '../reportfolder-detail.service';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../../config/config.msg';
import { ReportfolderDetailAdvancedSearchService } from '../reportfolder-detail-advanced-search/reportfolder-detail-advanced-search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'reportfolder-detail-info',
    templateUrl: './reportfolder-detail-info.component.html',
    styleUrls: ['./reportfolder-detail-info.component.less'],
    providers: [FormBuilder]
})
export class ReportfolderDetailInfoComponent implements OnInit, OnDestroy {
    inputValue: string;
    id: any;
    _checked = true;
    reportfoldereData: any = {};//详情
    isCollapse = false;
    subscription: Subscription;//重复订阅问题

    //调用子组件的是否展示弹窗事件
    @ViewChild(ReportfolderDetailModifyComponent)
    private modify: ReportfolderDetailModifyComponent;

    show() {
        this.modify.showModalMiddle()
    }
    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
    }

    constructor(
        private fb: FormBuilder,
        private reportfolderdetailService: ReportfolderdetailService,
        private route: ActivatedRoute,
        private confirmServ: CmModalService,
        private router: Router,
        private _notification: CmNotificationService,
        private reportfolderDetailAdvancedSearchService: ReportfolderDetailAdvancedSearchService,
    ) {
        this.id = this.route.snapshot.params.id;
        this.subscription = this.reportfolderDetailAdvancedSearchService.missionGrabble$.subscribe((grabble: any) => {
            // console.log(grabble); 
            this.getData()
        });
    }

    ngOnInit() {
        this.getData();
    }
    getData() {
        this.reportfolderdetailService.get(this.id).then((response: any) => {
            this.reportfoldereData = response;
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error']);
        });
    }
    showConfirm = () => {
        let self = this;
        this.confirmServ.confirm({
            title: `确认删除文件夹${this.reportfoldereData.name}吗`,
            showConfirmLoading: true,
            onOk() {
                self.removeRefolder()
            },
            onCancel() {
            }
        });
    };
    info(text: any) {
        this.confirmServ.info({
            title: text,
        });
    }
    removeRefolder() {
        this.reportfolderdetailService.remove(this.id).then((response: any) => {
            if (JSON.parse(response._body).success) {
                this.router.navigate(['/main/reportconfig']);
                return this._notification.success(JSON.parse(response._body).msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(JSON.parse(response._body).msg, "", msg['notification']['error'])
            }
        }).catch((err: any) => {
            return this._notification.error(err, "", msg['notification']['error'])
        });
    }


    ngOnDestroy() {

    }
}

