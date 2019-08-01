import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ExportActionDialogService } from './export-action-dialog.service';
import { Router, ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';

@Component({
    selector: 'export-action-dialog',
    templateUrl: './export-action-dialog.component.html',
    styleUrls: ['./export-action-dialog.component.css']
})
export class ExportActionDialogComponent implements OnInit, OnChanges {
    @Input() appid: boolean;
    @Input() isShow = false;
    @Output() onClose = new EventEmitter<any>();
    @Input() set export(value: any) {
        this.tooltipFlag = false;
        this.handleOk(event);
    }
    organizationTreeData: any = {};
    isNeedSubmitAddActionFormData: boolean;
    isVisible = false;
    isConfirmLoading = false;
    tooltipFlag = false;
    resourceTreeDatas: any[] = [];
    checkedFunIds = '';

    constructor(
        private service: ExportActionDialogService,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.refreshData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isShow && changes.isShow.currentValue) {
            this.isShow = changes.isShow.currentValue;
        } else {
            this.isShow = false;
        }
        if (this.isShow) {
            this.tooltipFlag = false;
            this.showModal();
        }
    }

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
    }

    refreshData(reset = false) {
        const params = { appId: this.activatedRoute.snapshot.params['id'] };
        this.service.queryFunctions(params).subscribe((data: any) => {
            this.resourceTreeDatas = data.data;
        });

    }

    queryOrganizationTreeData() {
        this.organizationTreeData = {
            hasChecked: true, // 需要复选框
            needMenu: false, // 需要菜单
            data: []
        };
    }

    onChangeOrganizationTreeData(data: any) {
        if (data != null) {
            if (data.length > 0) {
                this.pushIds(data);
            }
            if (data.checked) {
                this.tooltipFlag = false;
                this.checkedFunIds += data.id + ',';
                if (data.children.length > 0) {
                    this.pushIds(data.children);
                }
            } else {
                this.checkedFunIds = '';
            }
        }

        const arr: any = [];
        this.getCheckedId(this.resourceTreeDatas, arr);
        this.checkedFunIds = arr.join(',');
    }


    /**
     * 获取所有checked的项的ID
     * @param  {any}    data [description]
     * @param  {any =    []}          arr [description]
     * @return {[type]}      [description]
     */
    private getCheckedId(data: any, arr: any = []) {
        if (data && data.length) {
            data.forEach((item: any) => {
                if (item.checked) {
                    arr.push(item.id);
                }
                this.getCheckedId(item.children, arr);
            });
        }
        return arr;
    }

    pushIds(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
                this.checkedFunIds += data[i].id + ',';
            }
            if (data[i].children.length > 0) {
                this.pushIds(data[i].children);
            }
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddActionFormData = true;
        if (this.checkedFunIds.length > 0) {
            const params1: any = { ids: this.checkedFunIds };
            this.service.exportFunctions(params1).subscribe((data: any) => {
                this.onClose.emit(this.isVisible);
                const list = JSON.stringify(data.list);
                const blob = new Blob([list]);
                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', objectUrl);
                const filename = data.name;
                a.setAttribute('download', filename);
                a.click();
                URL.revokeObjectURL(objectUrl);
                this.isVisible = false;
                this.refreshData();
                this.checkedFunIds = '';
                // this.export = !this.export;
            });
        } else {
            // this.export = !this.export;
            this.tooltipFlag = true;
            return;
        }

    }

    handleCancel = (e: any) => {
        this.refreshData();
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }
}
