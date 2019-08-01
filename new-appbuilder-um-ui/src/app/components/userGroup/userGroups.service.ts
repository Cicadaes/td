import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UserGroupsService {
    getUserGroupsUrl = '/console-api/userGroup/queryUserGroupList';

    constructor(private http: HttpClient) {
    }
}
