/**
 * Created by ZHAOXUE on 2017/12/08.
 */

export class PATHJSON {
    //开发
    // public static urlHost = "http://172.23.4.44:9097";
    // public static urlHostLifeCycleList = "http://172.23.6.189";
    // public static urlHostRFM = "http://172.23.6.189";

    // 绫致
    public static urlHost(){
        let str = ""
        if(window.location.host == '172.23.6.189' || window.location.host == 'localhost'){
            str = "http://172.23.4.44:9097"
        }else{
            str = "http://10.150.33.122:9500"
        }
        return str;
    };
    public static urlHostLifeCycleList = window.location.origin;
    public static urlHostRFM = window.location.origin;
}