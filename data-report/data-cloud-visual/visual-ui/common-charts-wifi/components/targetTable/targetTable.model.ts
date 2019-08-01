import {BaseModel} from "datwill-sdk/lib/views/base/model.base";

/**
 * Created by zhaoxue on 2017-03-29.
 */

export class targetTableModel extends BaseModel{
   
    table1_Data = {
        "head": {"col1": "名称", "col2": "指标类型", "col3": "起止时间", "col4": "目标数据", "col5": "当前数据", "col6": "达成率","col7": "运营状态"},
        "data": [{"col1": "新客考核", "col2": "指标类型", "col3": "2017-5-7~2017-6-1", "col4": "50万", "ntm": "40万", "eh": "0%","col7":""},
            {"col1": "新客考核1", "col2": "指标类型", "col3": "2017-5-7~2017-6-1", "col4": "50万", "ntm": "40万", "eh": "60%","col7":""},
            {"col1": "新客考核2", "col2": "指标类型", "col3": "2017-5-7~2017-6-1", "col4": "50万", "ntm": "40万", "eh": "80%","col7":""},
            {"col1": "新客考核3", "col2": "指标类型", "col3": "2017-5-7~2017-6-1", "col4": "50万", "ntm": "40万", "eh": "80","col7":""},
            {"col1": "新客考核4", "col2": "指标类型", "col3": "2017-5-7~2017-6-1", "col4": "50万", "ntm": "40万", "eh": "80","col7":""},
            {"col1": "新客考核5", "col2": "指标类型", "col3": "2017-5-7~2017-6-1", "col4": "50万", "ntm": "40万", "eh": "80","col7":""}
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
