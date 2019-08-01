import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import JSEncrypt from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  public headers: HttpHeaders;
  public baseUrl: string;
  public baseAPIUrl: string;

  constructor(public http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,GET,PUT,DELETE,OPTIONS',
      'Content-Type': 'application/json'
    });
    this.baseAPIUrl = '/portal-api';
  }
  public getAppConfig(): Promise<any> {
    const url = `${this.baseAPIUrl}/portal/appConfig`;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((response: any) => {
        return response;
      })
      .catch(this.handleError);
  }

  public getAppMenu(appCode: string): Promise<any> {
    const url = `${this.baseAPIUrl}/portal/appSpecificConfig/${appCode}`;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError);
  }

  public pushMenuDetail(data: any): Promise<any> {
    const url = `${this.baseAPIUrl}/portal/rest/clickMenuLog`;
    return this.http
      .post(url, data, { headers: this.headers })
      .toPromise()
      .then((res: any) => res.json())
      .catch(this.handleError);
  }

  public logoutOneUI(): Promise<any> {
    const url = `${this.baseAPIUrl}/portal/logout`;
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((response: any) => {
        return response;
      })
      .catch(this.handleError);
  }

  public updataPasswd(param: any): Promise<any> {
    const url = `${this.baseAPIUrl}/portal/rest/password`;
    return this.http
      .put(url, JSON.stringify(param), {
        headers: this.headers,
        responseType: 'text'
      })
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }
  public updataUserName(param: any): Promise<any> {
    const url = `${this.baseAPIUrl}/portal/rest/user`;
    return this.http
      .put(url, JSON.stringify(param), {
        headers: this.headers,
        responseType: 'text'
      })
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  // 去左空格
  ltrim(str: string) {
    return str.replace(/(^\s*)/g, '');
  }

  // 去右空格
  rtrim(str: string) {
    return str.replace(/(\s*$)/g, '');
  }

  // 去左右空格
  trim(str: string) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  encode64(input: string) {
    const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';
    let i = 0;
    let output = '';
    let chr1: any = 0,
      chr2: any = 0,
      chr3: any = 0;
    let enc1,
      enc2,
      enc3,
      enc4 = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
      // chr1 = 0;
      // chr2 = 0;
      // chr3 = 0;
      // enc1 = 0;
      // enc2 = 0;
      // enc3 = 0;
      // enc4 = 0;
    } while (i < input.length);

    return output;
  }

  public encodersa(text: any) {
    var pubkey =
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsvf99jKTMbrpis/C1fIOyOH3rlwLjoJQzGUFE+sKSg3qLfOpHJHANAGAxCuUAubYn557hm++I9hi9iS5RyZ30VOtMp6T5lZD64osJtwOzpfuC3acseytkI8fDpJJyKZgCbSsOh4RUQUab4wNEdtrrs1Dp5jlT7LtNGsqW9DVnYwIDAQAB'; // tslint:disable-line
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubkey); // pubkey是公钥内容
    var encrypted = encrypt.encrypt(text);
    return encrypted;
  }

  /**
   * 错误处理
   * @param error
   */
  public handleError(error: any): Promise<any> {
    if (error.status === 401 || error.status === 403) {
      this.redirect();
      return Promise.reject(error);
    } else {
      let err: string;
      try {
        const data = error.error;
        if (typeof data === 'object' && data.constructor === Array) {
          err = data[0];
        } else if (typeof data === 'string' && data.constructor === String) {
          err = data;
        } else {
          if (data && data.message) {
            err = data.message;
          } else if (data && data.msg) {
            err = data.msg;
          } else {
            err = '页面错误，请稍后重试。';
          }
        }
      } catch (e) {
        err = error.message || error;
      }
      return Promise.reject(err);
    }
  }

  protected redirect(): void {
    const url = `${this.baseAPIUrl}/portal/cas`;

    this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then((res: any) => {
        const redirect = res.securityUrl;
        const service = res.casServerLoginUrl;
        document.location.href =
          `${service}?service=${location.origin}${redirect}?spring-security-redirect=` + document.location.href;
      })
      .catch(err => {});
  }
}
