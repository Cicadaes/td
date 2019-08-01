import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf, Observable, throwError as observableThrowError, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  public headers: HttpHeaders;
  public baseUrl: string;
  public baseAPIUrl: string;
  // Assuming this would be cached somehow from a login call.
  public authTokenStale: string = '';
  public authTokenNew: string = '';
  public currentToken: string;

  private ptk = new Subject<any>();
  ptk$ = this.ptk.asObservable();
  setPtk(tk: any) {
    this.ptk.next(tk);
  }

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,GET,PUT,DELETE,OPTIONS',
      'Content-Type': 'application/json'
    });
    this.baseUrl = '/portal';
    this.baseAPIUrl = '/portal-api';
    this.currentToken = this.authTokenStale;
  }

  getAuthToken() {
    this.currentToken = localStorage.getItem('token') || '';
    return this.currentToken;
  }

  refreshToken(): Observable<string> {
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */
    this.getRemoteToken();

    this.currentToken = this.authTokenNew;

    // Just to keep HttpClient from getting tree shaken.
    // alert(this.currentToken)

    return observableOf(this.authTokenNew).pipe(delay(200));
  }

  async getRemoteToken() {
    return this.http
      .get(`${this.baseAPIUrl}/portal/getToken`)
      .toPromise()
      .then((response: any) => {
        localStorage.setItem('token', response.token);
        this.setCookies('x-client-token', response.token);
        // this.setPtk(response.token);
        this.authTokenNew = response.token;
        // console.clear();
      });
  }

  setCookies(name: any, value: any) {
    try {
      let Days = 2;
      let exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURI(value)};expires=${exp.toUTCString()};path=/;`;
    } catch (e) {
      throw new Error('SetCookies: ' + e.message);
    }
  }

  public redirect() {
    const url = `${this.baseAPIUrl}/portal/cas`;
    this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((res: any) => {
        const redirect = res.securityUrl;
        const service = res.casServerLoginUrl;
        document.location.href =
          `${service}?service=${location.origin}${redirect}?spring-security-redirect=` + document.location.href;
        localStorage.clear();
      })
      .catch(err => {});
    return observableThrowError('');
  }
}
