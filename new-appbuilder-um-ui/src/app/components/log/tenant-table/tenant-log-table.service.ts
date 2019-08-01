import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class TenantLogTableService {
    constructor(private http: HttpClient) {
    }
}