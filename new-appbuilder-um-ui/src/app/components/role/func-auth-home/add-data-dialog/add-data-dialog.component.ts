import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FuncAuthHomeService } from '../func-auth-home.service';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-data-dialog',
    templateUrl: './add-data-dialog.component.html',
    providers:[FormBuilder]
})
export class AddDataDialogComponent {
    _tenantId = null;
    _roleId = null;
    @Input() set tenantId (tenantId){
        this._tenantId = tenantId;
    };
    @Input() set roleId (roleId){
        this._roleId = roleId;
    };
    @Output() toSubmit = new EventEmitter<any>();
    targetObj = { id: null, label:''}
    isVisible = false;
    isConfirmLoading = false;
    targetList = [];
    restList = [];
    validateForm: FormGroup;
    authBeans = [];
    originData = null;
    dataInstances = [];

    errorInfo = {
        dataObjIsEmpty: {
            show: false,
            info: '您还没有创建数据对象，请先创建数据对象'
        },
        dataInstanceIsEmpty: {
            show: false,
            info: '该数据对象没有创建对象实例，请先创建对象实例'
        },
        authBeanIsEmpty: {
            show: false,
            info: '该数据对象没有操作权限，请先创建操作权限'
        },
        dataObjRequired: {
            show: false,
            info: '请选择数据对象'
        },
        dataInstanceRequired: {
            show: false,
            info: '请选择对象实例'
        },
        authBeanRequired: {
            show: false,
            info: '请勾选操作权限'
        }
    };

    constructor( 
        private fb: FormBuilder,
        private funcAuthHomeService: FuncAuthHomeService,
        private notification: NzNotificationService
        ) {
        
          this.validateForm = this.fb.group({
            targetName: [this.targetObj],
        });
    }

    ngOnInit(){ 

    }

    /**
     * 获取实例列表
     */
    getRestDetail(){
        this.funcAuthHomeService.queryRestDetail({
            targetId: this.targetObj['id'],
            tenantId: this._tenantId,
        }).then(data => {
            if(data && data.code == 200 && data.data.length){
                let restList = [];
                data.data.forEach(item => {
                    restList.push({
                        key: item.id,
                        title: item.name
                    })
                });

                this.restList = restList;
            } else {
                this.restList = [];
            }
        });
    }

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }

    showModal(){
        this.funcAuthHomeService.queryDataauthByRoleId({
            tenantId: this._tenantId,
            roleId: this._roleId
        }).then(data => {
            if(data.code == 200 && data.data){
                this.originData = data.data;
                let dataOptions = [];
                data.data.forEach(item => {
                    dataOptions.push({
                        label: item.targetName,
                        id: item.targetId
                    });
                });
                this.targetList = dataOptions;

                if(this.targetList.length){
                    let targetObj = {
                        id: this.targetList[0]['id'],
                        label: this.targetList[0]['label']
                    }
                    this.changeTargetId(targetObj);
                } 
                
                this.isConfirmLoading = false;
                this.isVisible = true;
                    
            } else {
                this.originData = [];
            }
        });
        
    }

    compareFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

    /**
     * 改变数据对象
     */
    changeTargetId($event){
        this.resetValidStatus();
        this.targetObj = $event;
        if(this.targetList.length){
            this.getRestDetail();
        }
        if( this.targetObj.id || this.targetObj.id == 0){
            this.authBeans = [];
            this.funcAuthHomeService.getDetailAuthByTargetId(this.targetObj.id).then(data => {
                console.log(data)
                if(data.code == 200 && data.data){
                    this.authBeans = data.data;
                     
                    let dependentIdArr = [];
                    // 将有关联关系的数据存起来
                    this.authBeans.forEach(element => {
                    if (element['hasAuth'] && element['dependentId']) {
                        dependentIdArr.push(element['dependentId']);
                    }
                    });
                    // 设置关联的操作权限不可用
                    this.authBeans.forEach(element => {
                    if (element['hasAuth'] && dependentIdArr.indexOf(element['operatorId']) != -1) {
                        element['disabled'] = true;
                    }
                    })
                } else {
                    this.authBeans = [];
                }
            })
        }
        
    }

    /**
     * 新建
     */
    submitAddDataForm() {
        if (!this.targetList.length) {
            this.resetValidStatus();
            this.errorInfo.dataObjIsEmpty.show = true;
        } else if(this.targetList.length && !this.restList.length) {
            this.resetValidStatus();
            this.errorInfo.dataInstanceIsEmpty.show = true;
        } else if(this.targetList.length && this.restList.length && !this.authBeans.length) {
            this.resetValidStatus();
            this.errorInfo.authBeanIsEmpty.show = true;
        } else if (!this.targetObj.id && this.targetObj.id != 0){
            this.resetValidStatus();
            this.errorInfo.dataObjRequired.show = true;
        } else if (!this.dataInstances.length){
            this.resetValidStatus();
            this.errorInfo.dataInstanceRequired.show = true;
        } else if(!this.checkAuthBeanRequired()) {
            this.resetValidStatus();
            this.errorInfo.authBeanRequired.show = true;
        } else {
            this.resetValidStatus();
            let obj =  this.originData.filter(item => {
                return item.targetId == this.targetObj.id;
            })[0];
           
            let updateData = [];
            this.dataInstances.forEach(item => {
                let newItem = Object.assign({}, obj);
                newItem.dataId = item.key;
                newItem.dataName = item.title;
                newItem.authBeans = this.authBeans;
                updateData.push(newItem);
            });
            this.funcAuthHomeService.createDetailAuth(updateData).then(res => {
                if(res.code == 200) {
                    this.handleOk(null);
                } else {
                    this.notification.error('error', res.message);
                }
            })

        }
    }

    /**
     * 验证操作权限必选
     */
    checkAuthBeanRequired(){
        let len = this.authBeans.length;
        for (let i = 0; i < len; i++){
            if(this.authBeans[i]['hasAuth']){
                return true;
            }
        }
        return false;
    }

    /**
     * 重置提示信息
     */
    resetValidStatus(){
        Object.keys(this.errorInfo).forEach(item => {
            this.errorInfo[item].show = false;
        })
    }

    handleOk = (e: any) => {
        this.toSubmit.emit(true);
        this.isVisible = false;
        this.targetObj = { id: null, label:''};
        this.authBeans = [];
        this.restList = [];
        this.targetList = [];
        this.dataInstances = [];
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.targetObj = { id: null, label:''};
        this.authBeans = [];
        this.restList = [];
        this.targetList = [];
        this.dataInstances = [];
    }
    searchData(ret: {}): void {
        console.log('nzSearchChange', ret);
    }
    
    selectData(ret: {}): void {
        console.log('nzSelectChange', ret);
    }
    
    /**
     * 改变数据对象实例
     */
    changeData(ret: {}): void {
        this.resetValidStatus();
        if(ret['from'] == 'left'){// 左到右，合并
            this.dataInstances = [...this.dataInstances, ...(ret['list'])];
        }
        if(ret['from'] == 'right'){// 右到左，排除
            ret['list'].forEach(item => {
                let len = this.dataInstances.length;
                for(let i = 0; i < len; i++){
                    if (this.dataInstances[i]['key'] == item['key']) {
                        this.dataInstances.splice(i,1);
                        break;
                    }
                }
            });
        }
    }
    
     /**
     * 勾选对象实例操作权限
     * @param data 
     */
    authBeanChange($event: any,data: any) {
        this.resetValidStatus();
        data['hasAuth'] = $event;
        if (!data['dependentId']) {
            return;
        }
        this.authBeans.forEach(element => {
            if (data['dependentId'] === element['operatorId']) {
                data['hasAuth'] && (element['hasAuth'] = data['hasAuth']);
                element['disabled'] = data['hasAuth'] ? true : this.checkAuthBeanHasDependent(element, data);
            }
        });
    }

   /**
    * 检查依赖的操作是否被除了当前操作外的其他操作依赖
    * @param dependentData 依赖的操作
    * @param targetData 当前操作
    */
    checkAuthBeanHasDependent(dependentData: any, targetData: any){
        let len = this.authBeans.length;
        for(let i = 0; i < len; i++){
            let authbean = this.authBeans[i];
            if (targetData['dependentId'] === dependentData['operatorId'] 
            && authbean['operatorId'] != dependentData['operatorId'] 
            && authbean['operatorId'] != targetData['operatorId'] 
            && authbean['hasAuth']) {
                return true;
            }
        }
        return false;
    }
}