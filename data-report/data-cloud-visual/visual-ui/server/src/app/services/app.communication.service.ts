/**
 * Created by wangshouyun on 2017/1/6.
 */

import {Injectable} from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {BaseCommunicationService} from "./base.communication.service";

@Injectable()
export class AppCommunicationService extends BaseCommunicationService {

  allModulePermissions: any
  btnlistPermissions: Array<string> = []

  // 是否离开当前pipeline
  private isLeavePipeline = new Subject<any>();
  isLeavePipelineAnnounce$ = this.isLeavePipeline.asObservable();
  setIsLeavePipeline(isLeavePipeline: any) {
    this.isLeavePipeline.next(isLeavePipeline)
  }

  // 是否是另存为跳转
  private isShowLeaveConfirm = new Subject<boolean>();
  isShowLeaveConfirmAnnounce$ = this.isShowLeaveConfirm.asObservable();
  setIsShowLeaveConfirm(isShowLeaveConfirm: boolean) {
    this.isShowLeaveConfirm.next(isShowLeaveConfirm)
  }

  // 发布模块权限
  private modulePermissions = new Subject<any>();
  modulePermissionsAnnounce$ = this.modulePermissions.asObservable();
  announceModulePermissions(permissions: any) {
    this.allModulePermissions = permissions.modulePermissions
    this.btnlistPermissions = permissions.btnlistPermissions
    this.modulePermissions.next(permissions.modulePermissions)
  }

  private loginSuccessMissions = new Subject<any>();
  loginSuccessMission$ = this.loginSuccessMissions.asObservable();
  treeBool:boolean = false;
  loginSuccessMission(loginBool:boolean){
    if(loginBool){
      this.treeBool = true;
    }
  }

}
