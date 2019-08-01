import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class SuperLogTableService {

    constructor(private http: HttpClient) {
    }
}