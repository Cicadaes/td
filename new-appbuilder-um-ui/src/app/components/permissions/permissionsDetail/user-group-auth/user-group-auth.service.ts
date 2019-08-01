import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserGroupAuthService {

    constructor(private http: HttpClient) {
    }
}