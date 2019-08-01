import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
export class CommonService {

  displayloader = false;
  displayLoader(status: any) {
    this.displayloader = status;
  }
  // Success callback
  public extractData(res: Response) {
    const body: any = res.json();
    return body;
  }

  // Error callback
  public handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    // debugger;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }

  public getParams(params: any): string {
    var arr = [];
    for (var name in params) {
      if(true) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(JSON.stringify(params[name])));
      }
    }
    return '?' + arr.join("&");
  }

}
