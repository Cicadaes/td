import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class textLinkService {

    private showSource = new Subject<any>();
    missionshowSource$ = this.showSource.asObservable();
    private  isSave = new Subject<any>();
    missionisSave$ = this.isSave.asObservable();
    private  updateFunnel= new Subject<any>();
    missionupdateFunnel$ = this.updateFunnel.asObservable();
    private removaFunnel= new Subject<any>();
    missionremovaFunnel$ = this.removaFunnel.asObservable();

     // 监听显示
     showSourceOK(data?:any) {
        this.showSource.next(data);
    }
    // 监听保存
    SAVE(data:any){
        this.isSave.next(data);
    }
    // 监听下拉框
    UpdateFunnel(cube:any,query:any){
        let obj = {};
        obj['cube'] = cube;
        obj['query'] = query;
        this.updateFunnel.next(obj);
    }
    //删除
    Removafunnel(cube:any,query:any){
        let obj = {};
        obj['cube'] = cube;
        obj['query'] = query;
        this.removaFunnel.next(obj);
    } 
}