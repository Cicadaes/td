import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class EditAppExtendDialogService {
  addUrl = window['appConfig']['apiCode'] + '/appController/insertAppAttribute';

  constructor(private http: HttpClient) {

  }

  // 校验URL
  private checkUrl: string = window['appConfig']['apiCode'] + '/appController/checkAppAttribute'

  /**
   * 校验是否重复
   * @param  {any}    param [description]
   * @return {[type]}       [description]
   */
  public checkRepeat(params: any) {
    return this.http.post(`${this.checkUrl}`, params)
  }

  editAppAtttibute(app: any, appId: any) {
    return this.http.post(`${this.addUrl}`, {
      params: app,
      appId: appId
    })
  }

}
