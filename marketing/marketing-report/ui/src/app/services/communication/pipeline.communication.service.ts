import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PipelineCommunicationService {

    private lineChange = new Subject<any>();

    lineChange$ = this.lineChange.asObservable();

    lineChangeMission(data: any) {
        this.lineChange.next(data);
    }
}