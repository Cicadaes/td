import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { CurdService } from '../../curd.service';

@Injectable()
export class ProcessManageService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  // /marketing-api/campaign/pipelineDefinitions/rows  查询流程列表
  getProcessList(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get('/marketing-api/campaign/pipelines/rows' + stringParams).pipe(catchError(this.handleError));
  }

  // /marketing-api/campaign/pipelineDefinitions/rows 查询历史操作列表
  //    getOperationHistoryList(params: any) {
  //        return this.http.get('/marketing-api/campaign/pipelines/rows' + stringParams).pipe(
  //            catchError(this.handleError)
  //        );
  //    }

  // /marketing-api/campaign/pipelines/rejectPipeline 拒绝接口
  insertReason(params: any) {
    return this.http
      .patch('/marketing-api/campaign/pipelines/rejectPipeline', params)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/campaign/pipelines/approvePipeline/{id} 批准接口
  approve(id: any) {
    return this.http
      .patch(`/marketing-api/campaign/pipelines/approvePipeline/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/campaign/pipelines/offlinePipelineDefinition/{id} 下线接口
  downLine(id: any) {
    return this.http
      .patch(`/marketing-api/campaign/pipelines/offlinePipeline/${id}`, {})
      .pipe(catchError(this.handleError));
  }
}
