import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class filterFixedService {
    private  isSave = new Subject<any>();
    private  isShowSource = new Subject<any>();
    private  updateFilter= new Subject<any>();
    missionisSave$ = this.isSave.asObservable();
    missionisShowSource$ = this.isShowSource.asObservable();
    missionupdateFilter$ = this.updateFilter.asObservable();

    // 监听创建过滤器
    showSource(value: boolean, type: string,cubeId:any){
        let obj = {};
        obj['value'] = value;
        obj['type'] = type;
        // obj['data'] = data;
        obj['cubeId'] = cubeId;
        this.isShowSource.next(obj);
    }
    // 监听保存
    SAVE(){
        this.isSave.next();
    }
    // 监听修改
    UpdateFilter(cube:any,filter:any){
        let obj = {};
        obj['cube'] = cube;
        obj['name'] = filter;
        this.updateFilter.next(obj);
    }
}