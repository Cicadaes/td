import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {DatapushCommunicationService} from "../../../services/report-service/reportpush.communication.service";
import {ReportPublishingCommunicationService} from "../../../services/report-service/reportpublishing.service";

import {DialogCommunicationService} from "../../../services/dialog/dialog.communication.service";

@Component({
    selector: 'reportalist-dialog',
    templateUrl: 'reportalist-dialog.component.html',
    styleUrls: ['reportalist-dialog.component.css']
})

export class ReportalistDialogComponent implements OnInit {
    @Input() config:any;

    private display: boolean = false;
    private dialogWidth: number = 810;
    private powerTitle: any = "授权";
    private showerrTip:boolean = false;
    private powerBoolean: boolean = true;
    private peoplePower: boolean = false;
    private roleBoolean: boolean = false;
    private AddPermissionsRoles: boolean = true;
    private reportId: number;
    private reportType:string = "";
    //编辑授权
    private editRoleName:string = "";
    private editRead: number;
    private editRoleId:any;
    private allPoeplePowerArray: Array<any> = [];
    //已授权list
    private authorizedArray: Array<any> = [];
    //添加角色权限名称
    private peoplePowerName: string = "添加角色权限";
    //角色权限列表
    private peoplePowerArray: Array<any> = [];
    //添加后角色权限list
    private peoplePowerListArray: Array<any> = [];


    constructor(private communication: DatapushCommunicationService,
                private datacauseCommunicationService: ReportPublishingCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionPublishingConfirmed$.subscribe((data:any) =>{
            this.powerBoolean = true;
            this.reportId = data.obj.id;
            this.reportType = data.type;
            this.getReportPeoplePower();
        })
    }

    ngOnInit() {

    }

    //取消
    cancel(){
        this.display = false;
    }

    //添加权限
    addPower(){
        this.powerBoolean = false;
        this.AddPermissionsRoles = true;
        this.powerTitle = "添加角色权限";
        this.reportType = "add";
        this.compareDeletePower(this.authorizedArray,this.peoplePowerArray);
    }

    //编辑权限
    editProjectPower(power:any){
        this.powerBoolean = false;
        this.AddPermissionsRoles = false;
        this.powerTitle = "编辑角色权限";
        this.editRoleName = power.roleName;
        this.editRead = power.read;
        this.editRoleId = power.roleId;
    }

    //删除权限
    deleteProjectPower(power:any){
        this.communication.removeReportpower(this.reportId,power.roleId)
            .then((d:any) =>{
                this.deleteValue(this.authorizedArray,power);
                this.setPoeplePower(power,this.allPoeplePowerArray);
                this.dialogCommunicationService.addMessage({ severity: 'success', summary: d.msg, detail: '' })
            })
            .catch(err => { this.dialogCommunicationService.addMessage({ severity: 'error', summary: '删除授权失败', detail: err._body }) })

    }


    //添加角色权限
    addPeoplePower(){
        this.peoplePower = this.peoplePower ? false : true;
    }

    //确定选择权限
    onChange(event:any){
        this.editRead = event ? 1 : 0;
    }

    //删除角色权限
    deletePeoplePower(power: any){
        this.deleteValue(this.peoplePowerListArray,power);
        this.setPoeplePower(power,this.allPoeplePowerArray);
        this.peoplePower = false;
    }

    //选择角色权限
    choosePeoplePower(power:any){
        this.peoplePower = false;
        this.peoplePowerName = power.roleName;
        this.peoplePowerListArray.push({
            roleName: power.roleName,
            roleId: power.rid,
            read: 0 //false
        });
        this.deleteValue(this.peoplePowerArray,power);
        this.peoplePowerName = "添加角色权限";
    }

    // 删除给原数组赋值
    setPoeplePower(delObj:any,allPeoplePowerArr:Array<any>){
        debugger
        let newObj:any = {};
        for(let item of allPeoplePowerArr){
            if(delObj.roleId == item.rid){
                newObj = item;
            }
        }
        this.peoplePowerArray.push(newObj)
    }

    //取消添加角色权限
    cancelAddPeoplePower(peoplePowerListArr:Array<any>,allPeoplePowerArr:Array<any>,peoplePowerArr:Array<any>){
        for(let i of peoplePowerListArr){
            for(let j of allPeoplePowerArr){
                if(i.roleId == j.rid){
                    peoplePowerArr.push(j);
                }
            }
        }
    }

    //对比权限赋值name
    comparePeoplePower(authorizedArr:Array<any>,peoplePowerArr:Array<any>){
        for(let i=0; i< peoplePowerArr.length;i++){
            for(let j=0; j< authorizedArr.length;j++){
                if(authorizedArr[j].roleId == peoplePowerArr[i].rid){
                    authorizedArr[j].roleName = peoplePowerArr[i].roleName;
                }
            }
        }
    }

    //对比删除
    compareDeletePower(authorizedArr:Array<any>,peoplePowerArr:Array<any>){
        for(let i=peoplePowerArr.length -1; i>=0;i--){
            for(let j=0; j< authorizedArr.length;j++){
                if(authorizedArr[j].roleId == peoplePowerArr[i].rid){
                    peoplePowerArr.splice(i,1)
                    break;
                }
            }
        }
    }

    //公共方法
    deleteValue(valueArr:Array<any>,event:any){
        for (let i = 0; i < valueArr.length; i++) {
            if (valueArr[i].rid  == event.rid && valueArr[i].roleId  == event.roleId) {
                valueArr.splice(i, 1);
            }
        }
    }


    //取消选择
    remove(){
        this.powerBoolean = true;
        this.powerTitle = "授权";
        this.cancelAddPeoplePower(this.peoplePowerListArray,this.allPoeplePowerArray,this.peoplePowerArray);
        this.peoplePowerName = "添加角色权限";
        this.peoplePowerListArray = [];
        this.peoplePower = false;
    }

    //确定添加角色
    confirmAddPower(peoplePowerListArr:Array<any>,authorizedArr:Array<any>){
        for(let item of peoplePowerListArr){
            item.read = item.read ? 1 : 0;
            authorizedArr.push(item);
        }
    }
    //确定编辑修改read
    confirmChangePower(editRoleId:string,authorizedArr:Array<any>){
        for(let item of authorizedArr){
            if(item.roleId == editRoleId){
                item.read = this.editRead;
            }
        }
    }

    //确定选择
    confirm(){
        if(this.reportType == "editor"){
            let editArr: Array<any> = [{roleName: this.editRoleName,roleId: this.editRoleId,read: this.editRead}];
            this.communication.createReportpower(this.reportId,editArr)
                .then((d:any) =>{
                    this.powerBoolean = true;
                    this.powerTitle = "授权";
                    this.confirmChangePower(this.editRoleId, this.authorizedArray);
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: '编辑授权成功', detail: '' })
                })
                .catch(err => { this.dialogCommunicationService.addMessage({ severity: 'error', summary: '编辑授权失败', detail: err._body }) })
        }else{
            this.changeRead(this.peoplePowerListArray);
            this.communication.createReportpower(this.reportId,this.peoplePowerListArray)
                .then((d:any) =>{
                    this.powerBoolean = true;
                    this.powerTitle = "授权";
                    this.confirmAddPower(this.peoplePowerListArray,this.authorizedArray);
                    this.peoplePowerListArray = [];
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: '授权成功', detail: '' })
                })
                .catch(err => { this.dialogCommunicationService.addMessage({ severity: 'error', summary: '授权失败', detail: err._body }) })
        }
    }

    //改变read值
    changeRead(peoplePowerListArr: Array<any>){
        for(let item of peoplePowerListArr){
            if(item.read == true){
                item.read = 1;
            }else{
                item.read = 0;
            }
        }
    }

    //请求所有权限
    getAllPeoplePower(){
        this.communication.queryAllpower()
            .then((data:any) => {
                this.allPoeplePowerArray = data;
                this.peoplePowerArray = JSON.parse(JSON.stringify(this.allPoeplePowerArray));
                this.display = true;
                console.log(data);
                this.comparePeoplePower(this.authorizedArray,this.peoplePowerArray);
            })
            .catch(err => { this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: err._body }) })
    }



    //获取当前报表的权限角色
    getReportPeoplePower(){
        this.communication.queryRepotpower(this.reportId)
            .then((data:any) => {
                this.authorizedArray = data;
                this.getAllPeoplePower();
            })
            .catch(err => { this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: err._body }) })
    }


}
