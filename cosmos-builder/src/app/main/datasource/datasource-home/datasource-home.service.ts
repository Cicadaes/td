import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DatasourceHomeService {

    title: Array<any> = ["报表配置"];
    // Observable string sources
    private grabbleSource = new Subject<any>();


    // Observable string streams
    missionGrabble$ = this.grabbleSource.asObservable();

    homeValue(value: any) {
        this.grabbleSource.next(value);
    }
}