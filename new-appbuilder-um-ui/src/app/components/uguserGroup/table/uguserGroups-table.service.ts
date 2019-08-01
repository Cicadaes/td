import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from "../../common/services/crud.service";
import { Http } from "@angular/http";
@Injectable()
export class UgUserGroupsTableService extends CRUDService {

  getUserGroupsUrl: string = '/console-api/user/queryUserGroupByUser';
  getUserGroups(params: any) {
    return this.poste(this.getUserGroupsUrl, params);
  }

  queryRoleByUserGroupUrl: string = '/console-api/userGroup/queryRoleByUserGroup';
  queryRoleByUserGroup(params: any) {
    return this.poste(this.queryRoleByUserGroupUrl, params);
  }

  insertOrUpdateUserGroup = '/console-api/userGroup/insertOrUpdateUserGroup';
  updateUserGroup(params: any) {
    return this.poste(this.insertOrUpdateUserGroup, params);
  }

  constructor(public http: Http) {
    super(http);
  }

  // 移除单个用户使用批量删除的接口
  revokeUser: string = '/console-api/role/revokeUser';
  deleteUserGroupsFromUser(userId: number, uids: string) {
    return this.poste(this.revokeUser, {
      userId: userId,
      vroleIdSet: uids
    })
  }

}
