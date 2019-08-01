import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class TenantsService {
    getTenantsUrl = '/console-api/tenant/queryTenantList';
    constructor(private http: HttpClient) {
    }
}
