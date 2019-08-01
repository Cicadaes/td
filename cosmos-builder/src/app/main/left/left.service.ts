import { Http } from '@angular/http';
import { Injectable } from '@angular/core';



@Injectable()
export class LeftService {

    constructor(private http: Http) {

    }

    public getMenu(url: string = "assets/data/menu.json"): Promise<any> {
        return this.http.get(url).toPromise()
            .then(res => res.json().data);
    }
}