import { Component, OnInit, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { FuncAuthCheckTreeService } from './func-auth-checktree.service';

@Component({
    selector: 'func-auth-checktree',
    templateUrl: './func-auth-checktree.component.html',
    styleUrls: ['./func-auth-checktree.component.css']
})

export class FuncAuthCheckTreeComponent implements OnInit{
    @Input() roleId : number;

    resourceTreeDatas:any[] = [];

    constructor(private service: FuncAuthCheckTreeService) {
    }


    ngOnInit() {

        let roleFuncType: any = {};
        roleFuncType.vroleId = this.roleId;
        this.service.querySuperRoleFuncType(roleFuncType).then((func:any)=>{
            if (func.success == true) {
                //隐藏审计日志
                let data = func.data;
                let arr = [];
                for(let i=0;i<data[0].children.length;i++){
                    // if(data[0].children[i].label != "审计日志" && data[0].children[i].label != "日志"){
                        arr.push(data[0].children[i]);
                    // }
                }
                data[0].children = arr;
                this.resourceTreeDatas = data;
                this.checkedTreeDatas(this.resourceTreeDatas);
                this.disabledTreeDatas(this.resourceTreeDatas);
            }
        }).catch((err:any)=>{
            console.log(err);
        });
    }

    ngOnDestroy() {

    }

    disabledTreeDatas(datas:any[]){
        if(datas && datas.length > 0){
            for(let i = 0;i < datas.length;i++){
                datas[i].disabled = true;
                if(datas[i].children && datas[i].children.length > 0){
                    this.disabledTreeDatas(datas[i].children);
                }
            }
        }
    }

    checkedTreeDatas(datas:any[]){
        if(datas && datas.length > 0){
            for(let i = 0;i < datas.length;i++){
                datas[i].checked = true;
                if(datas[i].children && datas[i].children.length > 0){
                    this.checkedTreeDatas(datas[i].children);
                }
            }
        }
    }
}