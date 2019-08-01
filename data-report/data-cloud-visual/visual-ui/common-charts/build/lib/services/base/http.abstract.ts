/**
 * Created by wangshouyun on 2017/3/8.
 */
import {HttpHeader} from "./http.header";

export abstract class AHttp {

    protected getXmlHttp(): any {
        let xmlhttp: any;
        if (window['XMLHttpRequest']) {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest();
        }
        else {
            // IE6, IE5 浏览器执行代码
            //xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    }

    protected getParams(params: any): string {

        let paramString = "";
        for (let key in params) {
            paramString += encodeURI(key) + "=" + encodeURI(params[key]) + "&";
        }

        return paramString.substr(0, paramString.length - 1);
    }


    abstract get(url: string, params?: any, header?: HttpHeader): Promise<any>;

    abstract post(url: string, body?: any, header?: HttpHeader): Promise<any>;

    abstract put(url: string, body?: any, header?: HttpHeader): Promise<any> ;

    abstract put(url: string, id: number, header?: HttpHeader): Promise<any> ;
}