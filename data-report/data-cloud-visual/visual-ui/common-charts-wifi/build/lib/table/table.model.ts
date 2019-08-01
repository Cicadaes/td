import {BaseModel} from "datwill-sdk/lib/views/base/model.base";

/**
 * Created by zhaoxue on 2017-03-29.
 */

export class TableModel extends BaseModel{
   
    table1_Data = {
        "head": {"col1": "门户网站", "col2": "注册用户", "col3": "pv", "col4": "uv", "col5": "5", "col6": "6"},
        "data": [{"col1": "凤凰网", "col2": "20", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "搜狐", "col2": "30", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"}
         ]
    };
    
    backgroundColor = '#fff';
    echart_color = ['#EB8E4A','#5AC99E', '#3399FF', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
    pageSize= 5;
    pageNumber=1;
    totalPage=2;
    totalNumber=6;
    direction=0;
    foottype="paginate";
    pageCount=['10条','15条','20条']
   
}
