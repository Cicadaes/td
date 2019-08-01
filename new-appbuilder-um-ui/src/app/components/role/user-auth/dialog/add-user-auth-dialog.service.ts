import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddUserAuthDialogService {

    constructor(private http: HttpClient) {
    }

}