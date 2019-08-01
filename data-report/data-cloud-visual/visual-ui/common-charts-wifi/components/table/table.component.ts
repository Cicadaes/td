/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {TableTemplate} from "./table.template";
import {TableModel} from './table.model';
import * as $ from 'jquery';

export class TableComponent extends BaseComponent {
    private chartData: any = null;
    private tableData: TableModel = null;
    private colLength: number = null;
    private jsondata = {
        "head": {"col1": "门户网站", "col2": "注册用户", "col3": "pv", "col4": "uv", "col5": "5", "col6": "6"},
        "data": [{"col1": "凤凰网", "col2": "20", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "搜狐", "col2": "30", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"},
            {"col1": "网易", "col2": "40", "col3": "3", "col4": "4", "ntm": "5", "eh": "6"}]
    };

   constructor() {

        super();

        let template = new TableTemplate(this.scopeID, TableComponent);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.tableData = new TableModel();
    }

    public beforeShow(): void {

    }

    public afterShow(): void {

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    // public dataChange(data: any): void {
    //     console.log(data, 1111);
    //     // let jsondata = this.handledata(data);
    //     //
    //     // this.getTableInfo(jsondata)
    // }

    public dataChange(data: any): void {
        console.log(data)
         data['tabletype'] = "tabletype";
        //  内容
        
      
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {
        this.init();
    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
        console.log(this.scopeID,this.tableData);    
        this.colLength = this.getObjLength(this.tableData.table1_Data.head);
        this.getTableInfo(this.tableData.table1_Data);
    
        //渲染tablefoot
        if(this.tableData.foottype){
            this.creatTableFooter(this.tableData);
        }

        this.setTableWidth(this.tableData.table1_Data);
    }

    public getObjLength(obj={}){
        let length : number = 0;
       
            for(let i in obj){
                length++;
            }            
       return length;
    }

    public in_array(a: any, v: any) {
        let i = 0;
        for (i = 0; i < a.length; i++) {
            if (v === a[i]) {
                return i;
            }
        }
        return -1;
    }

    
    
    public handledata(json: any) {
    
        let TdObj = json.table_Data;
        let col: Array<any> = [];
        let date: Array<any> = [];
        let type: Array<any> = [];
        let ObjArr: any = {};
        // $.each(TdObj, (i: any, n: any) => {
        TdObj.prototype.each = function (i: any, n: any) {
            for (let p in n) {
                if (-1 == this.in_array(col, p)) {
                    col.push(p);
                }
                if (p == col[0] && (-1 == this.in_array(date, n[p]))) {
                    date.push(n[p]);
                    ObjArr[n[p]] = new Object();
                }
                if (col.length > 1 && p == col[1] && (-1 == this.in_array(type, n[p]))) {
                    type.push(n[p]);
    
                    ObjArr[n[col[0]]][n[p]] = null;
                }
                if (col.length > 2 && p == col[2]) {
                    ObjArr[n[col[0]]][n[col[1]]] = n[p];
                }
            }
        };
    
        console.log(ObjArr);
        //var arr1 = [""].concat(date);
        ObjArr.head = new Object();
        ObjArr.head["col1"] = "";
        for (let z = 0; z < date.length; z++) {
            ObjArr.head["col" + (z + 2)] = [date[z]];
        }
    
        //ObjArr.head.push(arr1);
        ObjArr.data = [];
        for (let m = 0; m < type.length; m++) {
            let row = new Object();
            row["col1"] = type[m];
            for (let z = 0; z < date.length; z++) {
                if ("" != ObjArr[date[z]] && ObjArr[date[z]][type[m]]) {
                    row["col" + (z + 2)] = ObjArr[date[z]][type[m]] ? ObjArr[date[z]][type[m]] : "";
                }
                else {
                    row["col" + (z + 2)] = 0;
                }
            }
    
            ObjArr.data.push(row);
        }
        console.log(ObjArr);
        return ObjArr;
    };
    
    public getTableInfo(json: any) {
        $("#" + this.scopeID).empty();
    
        let table = "<table class='table'>"
        let tableHead = json.head;
        table += "<thead><tr style='background:#3385ff;'>";
    
        //console.log(tableHead);
        for (let p in tableHead) {
            table += "<th>" + tableHead[p] + "</th>";
        }
    
        table += "</tr></thead><tbody id='bd'>";

        //获取需要展示的数据
        let start = (this.tableData.pageNumber -1)*this.tableData.pageSize;
        let end = start +this.tableData.pageSize;
        let typeData = json.data.slice(start,end);
        $.each(typeData, function (i:any, n:any) {
            //var tData = "";
            let trColor;
            if (i % 2 == 0) {
                trColor = "even";
            }
            else {
                trColor = "odd";
            }
    
            table += "<tr class='" + trColor + "'>";
            //console.log(n)
            if (1) {
                for (let d in n) {
                    table += "<td>" + n[d] + "</td>";
                }
            }
    
            table += "</tr>";
        });
        table += "</tbody></table>";
        $("#" + this.scopeID).append(table);
   
    };

    //创建tabelfooter
     public creatTableFooter (json: any){

        switch(json.foottype){
            case "paginate":
            this.renderPaginate(json);
            break;
            case "loadmore":
            this.loadMoreData(json);
            break;

        }

     };

     //渲染分页
     public renderPaginate(json: any){
        let pagination = "<div class='table_pagination clrfix'>"

        //每页显示

        pagination += "<div class='table_pagePer fl'><span class='fl'>每页显示</span><div class='table_pageSizeBox fl'><span class='table_pageSize'>10条</span><i class='triangle_icon'></i><ul class='table_sizeList'>"

        //显示条数列表
        for(let i = 0;i<json.pageCount.length;i++){
          
             pagination += "<li>"+ json.pageCount[i] +"</li>";
        }

        pagination += "</ul></div></div>"

        //首页

        pagination += "<div class='table_page fr'><span class='table_first fl'>首页</span><ul class='table_pages fl'>"
        
        //显示分页
        for(let i = 1;i <= json.totalPage; i++){
             let classname = json.pageNumber == i? "table_currentPage": "";
             pagination += "<li class=fl '"+ classname +"'>"+(i)+"</li>";

        }

        //显示末页
        pagination += "</ul><span class='table_last fl'>末页</span></div>";

        //插入容器内
        $("#" + this.scopeID).append(pagination);

     }

     //设置表格宽度
     public setTableWidth(json:any){
        let width = $("#" + this.scopeID).find("table").width();      
        let tdWidth = width / this.colLength;
        $("#" + this.scopeID).find("td").width(tdWidth);
     }

     //渲染加载更多
     public loadMoreData(json: any){


     }

}