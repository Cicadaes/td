import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private missionRouterChange = new Subject<any>(); //路由跳转

  constructor() {}

  missionRouterChange$ = this.missionRouterChange.asObservable();
  routerChangeMission(data: any) {
    this.missionRouterChange.next(data);
  }
}
