import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UgUsersService {
    getUgUsersUrl = '/console-api/user/queryUserList';

    constructor(private http: HttpClient) {
    }
   
}