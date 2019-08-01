import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShowCreateSegmentCommunicationService {

    private showCreateSegment = new Subject<any>();

    showDialog$ = this.showCreateSegment.asObservable();
    
    private hideDialog = new Subject<any>();
    
    hide$ = this.hideDialog.asObservable();

    showDialogMission(data: any) {
        this.showCreateSegment.next(data);
    }

    hideMisson(bl: boolean) {
        this.hideDialog.next(bl);
    }
}