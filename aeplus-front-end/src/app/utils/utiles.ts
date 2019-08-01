/**
 * 用于存放公共方法
 * 占时存放pipeLine调用的一些方法
 */
export class Utiles {
    constructor() {
    }

    //减
    floatSub(arg1: any, arg2: any) {
        let r1, r2, m, n;
        try {
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }

    //乘
    floatMul(arg1: any, arg2: any) {
        let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split('.')[1].length;
        } catch (e) {
        }
        try {
            m += s2.split('.')[1].length;
        } catch (e) {
        }
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    }

    //除
    floatDiv(arg1: any, arg2: any) {
        let t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split('.')[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split('.')[1].length;
        } catch (e) {
        }

        r1 = Number(arg1.toString().replace('.', ''));

        r2 = Number(arg2.toString().replace('.', ''));
        return (r1 / r2) * Math.pow(10, t2 - t1);

    }

    /**
     * 格式化时间 
     * type 1 yyyy-MM-dd HH:mm:ss  2 yyyy-MM-dd
     */
    formatDate(time: any, type?: number) {
        if (!type) {
            type = 1;
        }
        if (!time) {
            return ''
        }
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        let tempString = '';
        if (type === 1) {
            tempString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        } else {
            tempString = `${year}-${month}-${day}`;
        }
        return tempString;
    }
}