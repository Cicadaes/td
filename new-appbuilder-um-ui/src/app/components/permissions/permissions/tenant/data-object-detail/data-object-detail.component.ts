import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { permissionsService } from '../../permissions.service';
import { ActivatedRoute } from '@angular/router';
import { DataObjectOperateComponent } from './data-object-operate/data-object-operate.component';
import { DataObjectInstanceOperateComponent } from './data-object-instance-operate/data-object-instance-operate.component';
import { DataObjectDetailService } from './data-object-detail.service';
import { NzNotificationService, NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-data-object-detail',
    templateUrl: './data-object-detail.component.html',
    styleUrls: ['./data-object-detail.component.css']
})
export class DataObjectDetailComponent implements OnInit {

    isShowModal: boolean = false;                                   // 展示弹窗
    modalTitle: string;                                             // 弹框标题
    modalContent: any;                                              // 弹框内容（提交使用）

    dataObjId: string;                                              // 数据对象ID
    dataObjInfo: any = {};                                          // 数据对象信息
    operateInfo: any = {};                                          // 数据对象操作信息
    instanceOperateInfo: any = {};                                  // 数据对象实例操作信息

    @ViewChild(DataObjectOperateComponent)
    operateComponent: DataObjectOperateComponent;                   // 数据对象操作实例

    @ViewChild(DataObjectInstanceOperateComponent)
    instanceOperateComponent: DataObjectInstanceOperateComponent;   // 数据对象实例操作对象

    constructor(
        private permissionsService: permissionsService,
        private activeRoute: ActivatedRoute,
        private dataObjectDetailService: DataObjectDetailService,
        private notificationService: NzNotificationService,
        private confirmServ: NzModalService
    ) {
        this.dataObjId = this.activeRoute.snapshot.params['targetId'];
    }

    ngOnInit() {
        this.getDataObjDetail();
    }

    /**
     * 获取数据对象详情
     */
    getDataObjDetail() {
        this.permissionsService.getDataObjDetail(this.dataObjId).then(response => {
            if (response['code'] === 200) {
                this.dataObjInfo = response['data'];
            }
        });
    }

    /**
     * 添加数据对象操作
     * @param event 
     */
    addDataObjOper(event: Event) {
        this.isShowModal = true;
        this.modalContent = 'dataObjOperateModal';
        this.modalTitle = '新建数据对象操作';
        this.operateInfo = {};
    }

    /**
     * 编辑数据对象操作
     * @param data 
     */
    editorOperate(data: any) {
        this.isShowModal = true;
        this.modalContent = 'dataObjOperateModal';
        this.operateInfo = data;
        this.modalTitle = '编辑数据对象操作';
    }

    /**
     * 删除数据对象操作
     * @param data 
     */
    deleteOperate(data: any) {
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '删除此操作将无法恢复，您确认删除吗？',
            nzOnOk: () => {
                this.dataObjectDetailService.deleteDataObjOperate(data.id).then((response: any) => {
                    if (response['code'] === 200) {
                        this.getDataObjOperateList();
                    } else {
                        this.notificationService.warning('warning', response['message']);
                    }
                });
            }
        });
    }

    /**
     * 获取数据对象操作列表
     */
    getDataObjOperateList() {
        let param = {
            targetId: this.dataObjId
        }
        this.dataObjectDetailService.getDataObjOperateList(param).then(response => {
            if (response['code'] === 200) {
                this.dataObjInfo.targetOperatorList = response['data'];
            }
        });
    }

    /**
     * 添加数据对象实例操作
     * @param event 
     */
    addDataObjInstanceOper(event: Event) {
        this.isShowModal = true;
        this.modalTitle = '新建数据对象实例操作';
        this.modalContent = 'dataObjInstanceOperateModal';
        this.instanceOperateInfo = {};
    }

    /**
     * 编辑数据对象实例操作
     * @param data 
     */
    editorInstanceOperate(data: any) {
        this.isShowModal = true;
        this.modalContent = 'dataObjInstanceOperateModal';
        this.instanceOperateInfo = data;
        this.modalTitle = '编辑数据对象实例操作';
    }

    /**
     * 删除数据对象实例操作
     * @param data 
     */
    deleteInstanceOperate(data: any) {
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '删除此操作将无法恢复，您确认删除吗？',
            nzOnOk: () => {
                this.dataObjectDetailService.deleteDataObjInstanceOperate(data.id).then((response: any) => {
                    if (response['code'] === 200) {
                        this.getDataObjInstanceOperateList();
                    } else {
                        this.notificationService.warning('warning', response['message']);
                    }
                });
            }
        });
    }

    /**
     * 获取数据对象实例操作列表
     */
    getDataObjInstanceOperateList() {
        let param = {
            targetId: this.dataObjId
        }
        this.dataObjectDetailService.getDataObjInstanceOperateList(param).then(response => {
            if (response['code'] === 200) {
                this.dataObjInfo.targetInstanceOperatorVoList = response['data'];
            }
        });
    }

    /**
     * 弹框确认
     * @param event 
     */
    modalSubmit(event: Event) {
        let param = {};
        param['targetId'] = this.dataObjId;
        if (this.modalContent === 'dataObjOperateModal') {    // 数据对象操作弹框
            if (!this.operateComponent.changeName() || !this.operateComponent.changeCode() || !this.operateComponent.changeDescription()) {
                return;
            }
            param = Object.assign(param, this.operateComponent.operateInfo);
            param['description'] = this.operateComponent.operateInfo.description && this.operateComponent.operateInfo.description.trim();
            if (param['id']) {
                this.dataObjectDetailService.updateDataObjOperate(param).then(response => {
                    if (response['code'] === 200) {
                        this.isShowModal = false;
                        this.getDataObjOperateList();
                    } else {
                        this.notificationService.error('error', response['message']);
                    }
                });
            } else {
                this.dataObjectDetailService.saveDataObjOperate(param).then(response => {
                    if (response['code'] === 200) {
                        this.isShowModal = false;
                        this.getDataObjOperateList();
                    } else {
                        this.notificationService.error('error', response['message']);
                    }
                });
            }
        } else {                                    // 数据对象实例操作弹框
            if (!this.instanceOperateComponent.changeName() || !this.instanceOperateComponent.changeCode() || !this.instanceOperateComponent.changeDescription()) {
                return;
            }
            param = Object.assign(param, this.instanceOperateComponent.instanceOperateInfo);
            param['description'] = this.instanceOperateComponent.instanceOperateInfo.description && this.instanceOperateComponent.instanceOperateInfo.description.trim();
            if (param['id']) {
                this.dataObjectDetailService.updateDataObjInstanceOperate(param).then(response => {
                    if (response['code'] === 200) {
                        this.isShowModal = false;
                        this.getDataObjInstanceOperateList();
                    } else {
                        this.notificationService.error('error', response['message']);
                    }
                });
            } else {
                this.dataObjectDetailService.saveDataObjInstanceOperate(param).then(response => {
                    if (response['code'] === 200) {
                        this.isShowModal = false;
                        this.getDataObjInstanceOperateList();
                    } else {
                        this.notificationService.error('error', response['message']);
                    }
                });
            }
        }
    }

    /**
     * 关闭弹框
     */
    handleCancel() {
        this.isShowModal = false;
    }

}
