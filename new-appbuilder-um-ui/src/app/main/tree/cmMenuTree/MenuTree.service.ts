import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OrgMenuTreeService {
    private grabbleSource = new Subject<any>();
    missionmoveChangeData$ = this.grabbleSource.asObservable();
    update(data: any) {
        this.grabbleSource.next(data);
    }
}
