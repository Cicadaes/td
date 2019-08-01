import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddUserAuthDialogService {

    constructor(private http: HttpClient) {
    }

}