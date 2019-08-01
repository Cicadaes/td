import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class SettingsService {

    constructor(private http: HttpClient) {
    }
}
