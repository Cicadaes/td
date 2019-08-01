import { Injectable } from '@angular/core';

@Injectable()
export class UtilesService {

    dayOfWeek: any = {
        "1":"MON",
        "2":"TUE",
        "3":"WED",
        "4":"THU",
        "5":"FRI",
        "6":"SAT",
        "7":"SUN",
    }

    constructor() {}

    /**
     * 按照字节长度截取
    */
	cutByte(str: string,lenth: number){
		let that = this,
			len = +lenth;
		function n2(a: any) { var n = a / 2 | 0; return (n > 0 ? n : 1) } //用于二分法查找
		if (!(str + "").length || !len || len <= 0)  return "";
		if (that.getChartLenth(str) <= len) return str; //整个函数中最耗时的一个判断,欢迎优化
		let lenS = len
			, _lenS = 0
			, _strl = 0
		while (_strl <= lenS) {
			let _lenS1 = n2(lenS - _strl)
			_strl += that.getChartLenth(str.substr(_lenS, _lenS1))
			_lenS += _lenS1
		}
		return str.substr(0, _lenS - 1);
	}

    /** 
     * 获取字符串的字符长度
    */
    getChartLenth(str: string){
        let   i,len,code;     
		if (str == null || str == "") return 0;
		len = str.length;
		for (i = 0; i < str.length; i++) {
			code = str.charCodeAt(i);
			if (code > 255) { len++; }
		}     
        return   len;     
	}

    /**
	 * 校验是否是Url
	 */
	isURL(str_url: string) {
		var strRegex = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
			var re=new RegExp(strRegex); 
			//re.test() 
			if (re.test(str_url)) { 
				return true; 
			} else { 
				return false; 
			} 
	}

    /**
	 * 校验是否是手机号码
	 */
	isCellphoneNumber(number: any) {
		var myreg= /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(number)) {  
            return false;  
        } else {  
            return true;  
        }  
    }
    
    /**
	 * 校验是否是Email
     * Params
     *      str:邮箱
     * return 
     *      true/false
	 */
	isEmail(str: any) {
        var reg = new RegExp("^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$");
        // var reg = new RegExp("^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$");
        if(!reg.test(str)){
    　　　　return false;
    　　}else{
    　　　　return true;
    　　}
    }
    
    /**
     * 20121026转2012-10-26类型  (展示报表时会使用)
     */
    formatterDate(time: any): any {
        let year, month, day
        if (time) {
            year = time.slice(0, 4);
            month = time.slice(4, 6);
            day = time.slice(6, 8);
            return `${year}-${month}-${day}`
        }
    }

    /**
     * 获取内容里的参数信息（短信里面的自定义参数）ex：${name},${email}  return [name,email]
     * @param content 
     */
    getParamFromContent(content: string): any{
        let arr = [],str,conL;
        var reg = new RegExp('\\$\\{[^\$\{\}]+\}',"mg");
        while(null != (str = reg.exec(content))){
            conL = str[0].length;
            arr.push(str[0].substring(2,conL-1));
        }
        return arr;
    }

    /**
     * 根据入参转换为cron
     * sendType:发送方式  3、每天 4、每周 5、每月
     * cycleVal：sendType为4、5时  cycleVal代表星期和日期
     * cycleHour：循环发送的小时
     * cycleMinute：循环发送的分钟
     */
    transformToCron(sendType: any, cycleVal: any, cycleHour: any, cycleMinute: any) {
        let cron = "";
        if (sendType == 3) {
          return cron += '0 '+ cycleMinute + " " + cycleHour + " * * ?";
        } else if (sendType == 4) {
          return cron += '0 '+ cycleMinute + " " + cycleHour + " ? * " + cycleVal;
        } else if (sendType == 5) {
          return cron += '0 '+ cycleMinute + " " + cycleHour + " " + cycleVal +" * ?"
        }
    }

    /**
     * 创建投放时，设置循环投放时间使用
     * 根据cron转换为
     * data{
    *   sendType:发送方式  3、每天 4、每周 5、每月
    *   cycleVal：sendType为4、5时  cycleVal代表星期和日期
    *   cycleHour：循环发送的小时
    *   cycleMinute：循环发送的分钟
    *  }
     */
    transformToObj(cron: any) {
        let obj = {};
        let cronArr = cron.split(" ");
        if (!cronArr || cronArr.length <= 0) {
            return undefined;
        }
        //循环发送的小时和分钟
        obj["cycleHour"] = cronArr[2];
        obj["cycleMinute"] = cronArr[1];

        //判断循环发送的类型
        if ("?" != cronArr[cronArr.length - 1]) { // 表达式最后一位如果不是“？”就代表每周
            obj["sendType"] = 4;
            obj["cycleVal"] = cronArr[cronArr.length - 1];
        } else if ("*" != cronArr[3]) { //cron 表达式第四位代表日期
            obj["sendType"] = 5;
            obj["cycleVal"] = cronArr[3];
        } else { //默认每天
            obj["sendType"] = 3;
        }
        return obj;
    }


    /* 去左空格 */
    ltrim(str: string) {
        return str.replace(/(^\s*)/g, "");
    }

    /* 去右空格 */
    rtrim(str: string) {
        return str.replace(/(\s*$)/g, "");
    }

    /* 去左右空格 */
    trim(str: string) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    isEmptyObject(e: any) {
        let t;
        for (t in e) {
            return !1;
        }
        return !0
    }
}