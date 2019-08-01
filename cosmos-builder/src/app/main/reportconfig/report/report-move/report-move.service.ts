import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import {Http} from "@angular/http";
import { CRUDService } from "../../../../service/crud.service";

@Injectable()
export class ReportMoveService extends CRUDService{
    private grabbleSource = new Subject<any>();
    private showMove = new Subject<any>();
    public folderId=1;
    constructor(public http: Http) {
        super(http);
        this.updateRouter = "reports";//修改
        this.getRouter = "reports";//详情页面
    }

    missionGrabble$ = this.grabbleSource.asObservable();
    missionshowMove$ = this.showMove.asObservable();

    homeValue(value: any) {
       this.folderId = value.id;
    }   
    isShowMove(data: any) {
        this.showMove.next(data);
    }  
}