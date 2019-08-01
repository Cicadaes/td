import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ActionsService {

    getActionsUrl = 'https://api.randomuser.me/';

    constructor(private http: HttpClient) {
    }

}