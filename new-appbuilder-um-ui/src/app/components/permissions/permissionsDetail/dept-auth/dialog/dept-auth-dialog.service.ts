import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class deptAuthDialogService {
    addActionUrl = '/dataauth/dataauth/roleHierarchies';

    constructor(private http: HttpClient) {

    }

    addAction(action: any) {
        return this.http.post(`${this.addActionUrl}`, action)
    }

}