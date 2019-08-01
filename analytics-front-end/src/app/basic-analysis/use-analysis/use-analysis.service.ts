import { Injectable, Injector } from '@angular/core';
import { CurdService } from 'src/app/curd.service';
import * as constantData from '../../../assets/data/public-constant-data';

@Injectable()
export class UseAnalysisService extends CurdService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * 根据cubeId获取属性
   */
  getAttributes() {
    let url = '/report-api/metadata/metaObjects/query/attributes';
    let param = {
      cubeId: constantData['cubeId'],
      product_id: localStorage.getItem('productId')
    };
    return this.http.post(url, param);
  }

  /**
   * 根据属性获取属性值
   * @param dicKey
   */
  getAttributeValue(dicKey: string, pageIndex?: number) {
    let url = '/report-api/config/dicts/dicItems';
    let param = {
      cubeId: constantData['cubeId'],
      dicKey: dicKey,
      page: pageIndex || 1,
      pageSize: 20,
      product_id: localStorage.getItem('productId')
    };
    return this.http.post(url, param);
  }

  /**
   * 获取用户单次使用时长（柱图）
   * @param param
   */
  getSingleUseDurationBar(param: any) {
    let url = '/reportservice/usageAnalysis/singleUseDuration';
    return this.http.post(url, param);
  }

  /**
   * 获取用户平均单次使用时长
   * @param param
   */
  getAvgUseDuration(param: any) {
    let url = '/reportservice/usageAnalysis/averageSingleUseDuration';
    return this.http.post(url, param);
  }

  /**
   * 单次使用时长明细数据下载
   * @param param
   */
  downloadSingleUse(param: any) {
    let url = '/reportservice/usageAnalysis/averageSingleUseDuration/download';
    return this.http.post(url, param);
  }

  /**
   * 查询按照次数划分的使用频率（柱图）
   * @param param
   */
  getUsageAnalysisBar(param: any) {
    let url = '/reportservice/usageAnalysis/useRate';
    return this.http.post(url, param);
  }

  /**
   * 人均启动次数趋势图及明细按照日期返回对应数据接口
   * @param param
   */
  getUseRateDetail(param: any) {
    let url = '/reportservice/usageAnalysis/useRateDetail';
    return this.http.post(url, param);
  }

  /**
   * 人均启动次数明细下载接口
   * @param param
   */
  downloadUseRate(param: any) {
    let url = '/reportservice/usageAnalysis/useRateDetail/download';
    return this.http.post(url, param);
  }

  /**
   * 访问深度折线图及明细接口
   * @param param
   */
  getVisitDepthDetail(param: any) {
    let url = '/reportservice/usageAnalysis/visitDepth';
    return this.http.post(url, param);
  }

  /**
   * 访问深度下载
   * @param param
   */
  downloadVisitDepth(param: any) {
    let url = '/reportservice/usageAnalysis/visitDepth/download';
    return this.http.post(url, param);
  }
}
