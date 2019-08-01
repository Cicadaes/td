import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'


@Injectable()
export class AppCommunicationService {

  // 当前用户的信息
  public userInfo: any

  // 应用详情页导航获取详情标题
  private appName = new Subject<String>();
  appNameAnnounce$ = this.appName.asObservable();

  setAppName(appName: string = '') {
    this.appName.next(appName)
  }


}
