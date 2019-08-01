/**
 * Created by zhaoxue on 2017-03-01.
 */
var dataOurTime = {
	date : function(val1, val2) {
		if (val2 != null && val2 == 0) {
			return "0000-00-00 00:00:00";
		}
		var date = new Date(val1);
		var str = date.getFullYear();
		str += "-";
		str += (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : 0 + "" + (date.getMonth() + 1);
		str += "-";
		str += date.getDate() > 9 ? date.getDate() + "" : 0 + "" + date.getDate();
		str += " ";
		str += date.getHours() > 9 ? date.getHours() : 0 + "" + date.getHours();
		str += ":";
		str += date.getMinutes() > 9 ? date.getMinutes() : 0 + "" + date.getMinutes();
		str += ":";
		str += date.getSeconds() > 9 ? date.getSeconds() : 0 + "" + date.getSeconds();
		return str;
	},
    dataTime: function(date1,date2) {
            var type1 = typeof date1, type2 = typeof date2;
            if(type1 == 'string')
                date1 = this.stringToTime(date1);
            else if(date1.getTime)
                date1 = date1.getTime();
            if(type2 == 'string')
                date2 = this.stringToTime(date2);
            else if(date2.getTime)
                date2 = date2.getTime();

			var theTime = (date1 - date2) / 1000;// 秒
			var theTime1 = 0;// 分
			var theTime2 = 0;// 小时
			if(theTime > 60) {
				theTime1 = parseInt(theTime/60);
				theTime = parseInt(theTime%60);
				if(theTime1 > 60) {
					theTime2 = parseInt(theTime1/60);
					theTime1 = parseInt(theTime1%60);
				}
			}
			var result = ""+parseInt(theTime)+"秒";
			if(theTime1 > 0) {
				result = ""+parseInt(theTime1)+"分"+result;
			}
			if(theTime2 > 0) {
				result = ""+parseInt(theTime2)+"小时"+result;
			}
			return result;

	},
    stringToTime: function(string){
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1)-1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime();

    }
}
module.exports = dataOurTime;