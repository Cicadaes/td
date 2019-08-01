import { Component, Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CRUDService } from "../../../common/services/crud.service";

@Injectable()
export class AppTableService extends CRUDService {
  getAppUrl: string = window['appConfig']['apiCode'] + '/appController/queryList';
  getApps(params: any) {
    return this.http.post(`${this.getAppUrl}`, params)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError)

  }
  // 校验URL
  private checkUrl: string = window['appConfig']['apiCode'] + '/appController/checkApp'

  /**
   * 校验是否重复
   * @param  {any}    param [description]
   * @return {[type]}       [description]
   */
  public checkRepeat(params: any) {
    return this.http.post(`${this.checkUrl}`, params)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError)
  }

  constructor(public http: Http) {
    super(http)
  }

}
