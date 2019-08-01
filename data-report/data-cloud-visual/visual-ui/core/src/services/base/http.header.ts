/**
 * Created by wangshouyun on 2017/3/8.
 */
export class HttpHeader {

    constructor(config?: any) {

        for (let key in config) {
            this[key] = config[key];
        }

    }

}