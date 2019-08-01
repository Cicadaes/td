import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddTenantPageService } from './add-tenant-page.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-tenant-page',
    templateUrl: './add-tenant-page.component.html',
})
export class AddTenantPageComponent {
    @Input() tenant: boolean;
    @Input() isShow: boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddTenantFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadTenantTable: boolean = false;
    tenantId: number;
    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadTenantTable = false;
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

    submitAddTenantForm(data: any) {
        this.isNeedSubmitAddTenantFormData = false;
        if (data.status == 'VALID') {
            this.isConfirmLoading = true;
            if (data.value && data.value.aemail) {
                data.value.aemail = data.value.aemail.replace(/(^\s*)|(\s*$)/g, "");
            }

            if (data.value && data.value.contactEmail) {
                data.value.contactEmail = data.value.contactEmail.replace(/(^\s*)|(\s*$)/g, "");
            }

            this.service.addTenant(data.value).then((data: any) => {
                if (data.success) {
                    this.router.navigate(['/tenants']);
                } else {
                    this.showErrorDialog("保存失败");
                    this.isConfirmLoading = false;
                }
            })
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddTenantFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    getTenantDetails() {
        this.service.getTenantById(this.tenantId).then((data: any) => {
            if (data.total && data.total > 0) {
                this.tenant = data.list[0];
            }
        });
    }

    ngOnInit() {
        this.tenantId = this.route.snapshot.params['id'];
        if (this.tenantId) {
            this.getTenantDetails();
        }
        // this.router.events
        //   .filter(event => event instanceof NavigationEnd)  // 筛选原始的Observable：this.router.events
        //   .subscribe((event) => {
        //     console.log(event)
        //   })
        this.route.params.subscribe((data: any) => {
            // 保存当前项目Id和PipelineId
            !this.tenant && (this.tenant = data.id)
        })

    }

    showErrorDialog(msg: any) {
        this.confirmServ.error({
            nzTitle: msg,
            nzOnCancel: () => {
            }
        });
    }
    constructor(private service: AddTenantPageService, private router: Router, private route: ActivatedRoute, private confirmServ: NzModalService) {

    }

}
