import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
@Injectable()
export class ChangeBreadNameCommunicationService {

    public isChanged: boolean = false  //是否修改了名字
    private missionAnnouncedSource = new Subject<string>();
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    announceMission(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }
    constructor(){}

}