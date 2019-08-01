import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class MediaExploreSourceService { // 媒体
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // POST  /api/mediaExplore/list  获取媒体探索列表
  getMediaExploreList(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/mediaExplore/list', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
  // GET  /api/mediaExplore/get/   查询某个媒体探索
  getOneMediaExplore(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/mediaExplore/get/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  //   POST /api/mediaExplore/insert  新增媒体探索
  insertMediaExplore(parmas: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/mediaExplore/insert', parmas)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  //   POST /api/mediaExplore/update  更新媒体探索
  updateMediaExplore(parmas: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/mediaExplore/update', parmas)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/mediaExplore/list-all   获取所有媒体探索 （不分页）
  getMediaExploreListAll(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/mediaExplore/list-all`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }  
  
  // GET  /api/channel/mapping/list   用户可选的媒体列表
  getChannelMappingList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/channel/mapping/list`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  } 
  // GET  /api/mediaExplore/get-audiencesData/{id}  获取媒体探索受众数据
  getAudiencesData(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/mediaExplore/get-audiencesData/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/mediaExplore/get-Overlap/{id}  获取重叠度数据
  getMediaOverlap(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/mediaExplore/get-Overlap/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}