import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UsersService {
    getUsersUrl = '/console-api/user/queryUserList';

    constructor(private http: HttpClient) {
    }
   
}