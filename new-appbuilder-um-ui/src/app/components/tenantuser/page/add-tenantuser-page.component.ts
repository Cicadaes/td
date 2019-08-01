import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddTenantuserPageService } from './add-tenantuser-page.service';
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-user-page',
    templateUrl: './add-tenantuser-page.component.html',
})
export class AddTenantuserPageComponent {
    @Input() user: boolean;
    @Input() isShow: boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    tenantId: number;
    isNeedSubmitAddUserFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUserTable: boolean = false;
    id: number;
    isPage = true;
    isOper: boolean = false;
    deptIds: any[];

    private _submit: EventEmitter<any> = new EventEmitter()

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadUserTable = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isShow && changes.isShow.currentValue) {
            this.isShow = changes.isShow.currentValue;
        } else {
            this.isShow = false;
        }
        if (this.isShow) {
            this.showModal();
        }
    }

    reflashUserDetail() {
        this.service.getUgUserById(this.id).then((data: any) => {
            if (data.success) {
                this.user = data.data;
            }
        });
    }

    submitAddUserForm(data: any) {
        this.isNeedSubmitAddUserFormData = false;
        if (data.status == 'VALID') {
            this.isConfirmLoading = true;
            data.value.tenantId = this.tenantId;
            // delete data.value.deptIdLabel
            this.service.getUgUserList(data.value).then((vrslt: any) => {
                if (vrslt.total && vrslt.total > 0) {
                    this.isConfirmLoading = false;
                    /*this.confirmServ.info({
                        nzTitle: '提示',
                        nzContent: "该账户已经注册，请联系管理员找回密码"
                    });*/
                } else {
                    if (data.value && data.value.email) {
                        data.value.email = data.value.email.replace(/(^\s*)|(\s*$)/g, "");
                    }
                    data.value.tenantId = this.tenantId;
                    this.service.addUser(data.value).then((data: any) => {
                        if (data.success) {
                            if (this.isOper) {
                                this.router.navigate(['/tenants/tenantusers/' + this.tenantId]);
                            } else {
                                this.router.navigate(['/tenantusers']);
                            }
                        } else {
                            alert(data.result)
                        }
                    });
                }
            });

        }
    }

    handleOk = (e: any) => {
        this._submit.emit()
        // this.isNeedSubmitAddUserFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
        this.router.navigateByUrl('/tenants/tenantusers/' + this.tenantId);
    }

    ngOnInit() {
        if (this.activeRoute.snapshot.params['tenantId'] != null) {
            this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        } else if (window['appConfig'] && window['appConfig'].tenant) {
            this.tenantId = window['appConfig'].tenant.id;
        } else {
            this.tenantId = 0;
        }
        let roles = window['appConfig'].roleList;
        roles.forEach((c: any, index: any) => {
            if (c.id == 2) {
                this.isOper = true;
            }
        })
        this.id = this.route.snapshot.params['id'];
        this.isNeedSubmitAddUserFormData = false;
        this.reflashUserDetail();
        this.isPage = true;
    }

    constructor(private service: AddTenantuserPageService, private activeRoute: ActivatedRoute, private route: ActivatedRoute, private router: Router, private confirmServ: NzModalService) {

    }

}
