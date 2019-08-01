export class Globals {
    constructor() {
    }

    /**
     * 获取？号后面带的所有参数
     * 有转换成json返回 无返回{}
     */
    getParams() {
        const url = document.location.href;
        const params = url.split('?')[1];
        if (!params) {
            return {};
        } else {
            const tempList = params.split('&');
            const json = {};
            for (let i = 0; i < tempList.length; i++) {
                const temp = tempList[i].split('=');
                if (temp.length === 2) {
                    json[temp[0]] = temp[1];
                }
            }
            return json;
        }
    }

    /**
     * 获取近几日的日期范围
     */
    getDateRangeByLastDay(value: any) {
        let end = Date.now();
        let num: number;
        if (value === 'yesterday') {
            num = -1;
        } else {
            num = parseFloat(value);
        }
        const start = end + 3600 * 24 * num * 1000;
        if (value === 'yesterday') {
            end = start;
        }
        const date: any = {
            start: start,
            end: end
        };
        return date;
    }

    /**
     * 获取格式化的日期
     */
    dateFormat(time: any, type: any): any {
        let year, month, day, hours, minutes, seconds;
        if (time) {
            year = new Date(time).getFullYear();
            year = year < 10 ? '0' + year : year;
            month = new Date(time).getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            day = new Date(time).getDate();
            day = day < 10 ? '0' + day : day;
            hours = new Date(time).getHours();
            hours = hours < 10 ? '0' + hours : hours;
            minutes = new Date(time).getMinutes();
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = new Date(time).getSeconds();
            seconds = seconds < 10 ? '0' + seconds : seconds;
            if (type === 'seconds') {
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            } else {
                return `${year}-${month}-${day}`;
            }
        }
    }

    /**
     * 日期格式化
     * @param time
     * @param sign
     * @returns {any}
     */
    dateFormat1(time: any, sign: any): any {
        sign = sign || '/';
        let year, month, day;
        if (time) {
            time = time.toString();
            year = time.substring(0, 4);
            month = time.substring(4, 6);
            day = time.substring(6, 8);
            return `${year}${sign}${month}${sign}${day}`;
        }
    }

    /**
     * 获取格式化number的日期
     */
    dateFormatNumber(time: any, type: any): any {
        let year, month, day, hours, minutes, seconds;
        if (time) {
            year = new Date(time).getFullYear();
            year = year < 10 ? '0' + year : year;
            month = new Date(time).getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            day = new Date(time).getDate();
            day = day < 10 ? '0' + day : day;
            hours = new Date(time).getHours();
            hours = hours < 10 ? '0' + hours : hours;
            minutes = new Date(time).getMinutes();
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = new Date(time).getSeconds();
            seconds = seconds < 10 ? '0' + seconds : seconds;
            if (type === 'seconds') {
                return `${year}${month}${day}${hours}${minutes}${seconds}`;
            } else {
                return `${year}${month}${day}`;
            }
        }
    }

    /**
     * 获取格式化为零点的日期时间戳
     */
    getDateZeroTime(time: any): any {
        const nowTimeDate = new Date(time);
        nowTimeDate.setHours(0, 0, 0, 0);
        const realATime = nowTimeDate.getTime();
        return realATime;
    }

    /**
     * 获取时间差的天数
     */
    getDateDays(start: any, end: any): any {
        const daysTime = end.getTime() - start.getTime();
        return Math.floor(daysTime / (24 * 3600 * 1000));
    }

    /**
     * 跳转页面选中oneUI菜单的URL
     */
    getOneUIMenuUrl(hash: string) {
        const url = location.origin + location.pathname + '#' + hash;
        return url;
    }

    /**
     * 验证URL规则
     * @param {string} str_url
     * @returns {boolean}
     */
    checkUrl(str_url: string) {
        if (str_url) {
            str_url = str_url.toLowerCase();
        }
        const strRegex = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/;
        const re = new RegExp(strRegex);
        return re.test(str_url);
    }

    /**
     * 设置本地存储值
     * @param {string} key
     * @param data
     */
    setStorageLocal(key: string, data: any) {
        if (key && data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }

    /**
     * 获取本地存储对象值
     * @param key
     * @returns {any}
     */
    getStorageLocal(key) {
        let data: any;
        if (localStorage.getItem(key) && localStorage.getItem(key) !== 'undefined') {
            data = JSON.parse(localStorage.getItem(key));
        }
        return data;
    }

    /**
     * 获取产品id
     * @returns {any}
     */
    getProductIdByStorage() {
        let productId: any;
        if (localStorage.getItem('productId') && localStorage.getItem('productId') !== 'undefined') {
            productId = localStorage.getItem('productId');
        }
        return productId;
    }

    /**
     * 数字保留小数点
     * @param num
     * @returns {any}
     */
    toDecimal(num) {
        let result = parseFloat(num);
        if (isNaN(result)) {
            return false;
        }
        result = Math.round(num * 100) / 100;
        let s_x = result.toString();
        let pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }

    /**
     * 数字格式化千分位
     * @param value
     * @returns {string}
     */
    toThousands(value: any) {
        let num = (value || 0).toString(), result = '';
        let isDecimal = false;
        let numAttr;
        if (num.indexOf('.') !== -1) {
            isDecimal = true;
            numAttr = num.split('.');
            num = numAttr[0];
        }
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        if (isDecimal && numAttr.length > 1) {
            result = result + '.' + numAttr[1];
        }
        return result;
    }

    /**
     * 获取数组最小值
     * @param {any[]} list
     * @param {string} attr
     * @returns {number}
     */
    getArrayMin(list: any[], attr: string) {
        let min = 0;
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (attr) {
                    if (list[i][attr] < min) {
                        min = list[i][attr];
                    }
                } else {
                    if (list[i] < min) {
                        min = list[i];
                    }
                }
            }
        }
        return min;
    }

    /**
     * 获取数组最大值
     * @param {any[]} list
     * @param {string} attr
     * @returns {number}
     */
    getArrayMax(list: any[], attr: string) {
        let max = 0;
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (attr) {
                    if (parseFloat(list[i][attr]) > max) {
                        max = parseFloat(list[i][attr]);
                    }
                } else {
                    if (parseFloat(list[i]) > max) {
                        max = parseFloat(list[i]);
                    }
                }
            }
        }
        return max;
    }

    /**
     * 重置body样式
     */
    resetBodyStyle() {
        setTimeout(() => {
            const body_el = document.getElementsByTagName('body');
            body_el[0].style.overflow = 'auto';
            body_el[0].style['padding-right'] = '0';
        }, 500);
    }

    /**
     * 过滤前后空格
     * @param {string} str
     * @returns {string}
     */
    trim(str: string) {
        if (str) {
            return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        } else {
            return '';
        }
    }

    /**
     * 只能输入数字、中文和英文
     */
    trimTag(str: string) {
        if (str) {
            return str.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
        } else {
            return '';
        }
    }

}
