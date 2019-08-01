import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddActionDialogService {
    addActionUrl = 'https://api.randomuser.me/';

    constructor(private http: HttpClient) {

    }

    addAction(action: any) {
        return this.http.post(`${this.addActionUrl}`, {
            params: action
        });
    }
}
