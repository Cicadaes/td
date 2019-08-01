import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppErrorService extends CurdService {
  appParentDate: any = []; // 父组件时间

  constructor(private injector: Injector) {
    super(injector);
  }

  // *********************  错误分析相关接口  ******************************
  getErrorOverview(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/summary`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getErrorTendency(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/trend`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getErrorTop(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/ten`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getErrorList(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/list`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  // *********************  错误分析详情相关接口  ******************************
  getErrorSummary(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/digest`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getErrorDetailTendency(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/detailTrend`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getErrorDetailTop(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/detailTen`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getErrorDetailList(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/detail`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  download(parmas: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/export`;
    return this.http.post(url, parmas).pipe(catchError(this.handleError));
  }

  downloadDetail(parmas: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/detailExport`;
    return this.http.post(url, parmas).pipe(catchError(this.handleError));
  }

  // *********************  错误分析详情字典接口  ******************************
  getDic(params: any) {
    const url = `${this.reportBaseUrl}/errorAnalysis/dic`;
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }

  getParentDate() {
    this.appParentDate = [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
    if (sessionStorage.getItem('appParentDate')) {
      this.appParentDate = JSON.parse(sessionStorage.getItem('appParentDate'))['date'];
    }
    return this.appParentDate;
  }

  setParentDate(data: any) {
    let obj = {};
    obj['date'] = data;
    this.appParentDate = sessionStorage.setItem('appParentDate', JSON.stringify(obj));
  }

  clearParentDate() {
    if (sessionStorage.getItem('appParentDate')) {
      sessionStorage.removeItem('appParentDate');
    }
  }
}
