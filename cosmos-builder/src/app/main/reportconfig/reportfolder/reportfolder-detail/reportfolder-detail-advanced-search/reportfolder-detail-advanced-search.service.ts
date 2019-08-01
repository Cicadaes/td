import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportfolderDetailAdvancedSearchService {
    private grabbleSource = new Subject<any>();


    // Observable string streams
    missionGrabble$ = this.grabbleSource.asObservable();

    homeValue(value: any) {
        this.grabbleSource.next(value);
    }
}