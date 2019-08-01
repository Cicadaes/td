/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {TableTemplate} from "./table.template";
import {TableModel} from './table.model';
import {Utils} from '../../../../public/scripts/utils';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";
import {PATHJSON} from '../../../../public/path/path';

export class TableComponent extends BaseComponent {
    private chartData: any = null;
    private tableData: TableModel = null;
    private colLength: number = null;
    private body: any = null;
    private datatype: any = null;
    private tablebody: any = null;
    private indicatorRFM: any = null;
    private tableBarFilterRF: any = null;
    private crowdName: any = null;
    private tableBaryearMonth: any = null;
    private tableBarDate: any = null;
    private tableBarbrand: any = null;
    private tableBarchannel: any = null;
    private tableBarfilter: any = {};
    private barTableListData: any = null;
    private crowdCount: any = 0;
    private lifeCycle: string = "";
    private saveChangeObj: any = {};
    private downloadBody: any = null;
    private orderByFlag: any = null;

    private dataConfig: any = {};

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
        this.init();
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.dataConfig = changeObj.result;
        if (!this.isEmptyObject(changeObj.result)) {
            this.saveChangeObj = changeObj.result;
            if (changeObj.result.options) $.extend(this.tableData.options, changeObj.result.options);

            this.body = this.buildbody(changeObj.result);

            if (changeObj.result.type) {
                this.datatype = changeObj.result.type;
                if (this.datatype == 'tableRFM') {
                    $('div[tableSelect]', "#" + this.scopeID).show();
                    //渲染title
                    if (this.tableData.options.hasSelectLine) {
                        this.renderSelectLine(this.tableData);
                    }
                }
            }
            if (changeObj.result.downloadType) {
                this.downloadBody = DataSourceConfig.getConfigByKey(changeObj.result.downloadType);
            }
            if (changeObj.result.readyBuildQuery) {
                this.postChange(this.body);
            }
        } else {
            return;
        }

    }

    public downloadData() {
        this.downloadBoolean = true;
        this.postChange(this.downloadBody);
        this.downloadBoolean = false;
    }

    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "table";
        return this.body;
    }

    //处理数据
    public handleData(json: any) {
        if (this.datatype == 'tableRFM') {
            $('#' + this.scopeID).addClass('table-bordered');
            let tablehead: any = {'row': ''};
            let tablebody = json.data;
            let row: Array<any> = [];
            let length = tablebody.length;
            this.colLength = 1;
            //获取行,表头
            for (let i = 0; i < length; i++) {
                let rowName = tablebody[i]['R'];
                let headname = tablebody[i]['F'];
                if (row.indexOf(rowName) < 0) row.push(rowName);
                if (!tablehead[headname]) {
                    tablehead[headname] = headname;
                    this.colLength++;
                }
            }

            //排序
            let metric = this.body['metrics'][0]['field'];
            tablebody.sort(function (a: any, b: any) {
                return b[metric] - a[metric];
            })

            //增加排序字段
            tablebody.forEach(function (obj: any, index: any) {
                obj['rank'] = (index + 1);
            })

            //table  row
            let tabledata: Array<any> = [];
            let rowlength = row.length;
            for (let j = 0; j < rowlength; j++) {
                tabledata[j] = {
                    'row': row[j]
                };
                tablebody.forEach(function (obj: any) {
                    if (obj['R'] == row[j]) {
                        tabledata[j][obj['F']] = obj[metric]
                        tabledata[j][obj['F'] + 'rank'] = obj['rank']
                    }
                })
            }
            this.tablebody = tablebody;
            this.tableData.table_Data['data'] = tabledata;
            this.tableData.table_Data['head'] = tablehead;

            this.getbarTableDataList(this.tableData.table_Data);

        } else {
            this.tableData.table_Data['head'] = {};
            this.tableData.table_Data['data'] = json.data;
            this.tableData.options['totalPage'] = Math.ceil(json.total / this.tableData.options['pageSize'])
            this.tableData.options['totalNumber'] = json.total;
            //thead
            for (let key in json.data[0]) {
                if (key.split('_').length > 1) {
                    switch (key.split('_')[key.split('_').length - 1]) {
                        case '环比':
                            this.tableData.table_Data['head'][key] = '环比';
                            break;
                        case '占比':
                            this.tableData.table_Data['head'][key] = '占比';
                            break;
                    }

                } else {
                    this.tableData.table_Data['head'][key] = key;
                    if (key == "date") {
                        this.tableData.table_Data['head'][key] = "日期";
                    }
                }
            }
        }

    }

    private handleLifeCycleData(data: Array<any>) {
        let lifeCycleData: Array<any> = [];
        lifeCycleData = data;
        lifeCycleData = Utils.handleLifeCycleMap(lifeCycleData, "客户分类");
        for (let item of lifeCycleData) {
            for (let key in item) {
                if (key.indexOf("占比") !== -1) {
                    if (item[key].indexOf("%") == -1) {
                        item[key] = item[key] + "%";
                    }
                }
            }
        }
        return lifeCycleData
    }

    public dataChange(data: any): void {

        if (data && data['data'] && data['data'].length > 0) {
            if (this.lifeCycle = "lifeCycle") {
                data.data = this.handleLifeCycleData(data.data)
            }
            data['tabletype'] = "tabletype";

            //处理数据
            this.handleData(data);

            //渲染table
            this.renderTable(this.tableData.table_Data);
            //console.log("this.tableData.table_Data",this.tableData)

            //渲染tablefoot
            if (this.tableData.options.foottype) {
                this.creatTableFooter(this.tableData);
            }

            //设置宽度
            this.setTableWidth(this.tableData.table_Data);

            //绑定事件
            this.eventBindHtml();
            $('.table_pageSize_title').html(this.tableData.options['pageSize'] + '条');

        } else {
            $('#' + this.scopeID).find('div[tableContainer]').empty().append('<div class="nodata">暂无数据</div>');
        }
        this.eventBindHtml();
    }

    public getbarTableDataList(data: any) {
        this.barTableListData = {'filterF': [], 'filterR': []};

        if (data.head) {
            for (let key in data.head) {
                if (data.head[key].length > 0 && key != 'total') this.barTableListData['filterF'].push(data.head[key]);
            }
        }

        if (data.data && data.data.length > 0) {
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i]['row'] != 'total') this.barTableListData['filterR'].push(data.data[i]['row'])
            }
        }

        // console.log(this.barTableListData)
    }

    public filterChange(event: any, data: any): void {
        //取过滤器的值
        this.getFilterData($(document));

        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);

        if(this.downloadBody != null){
            this.downloadBody = DataSourceConfig.mergeBodyByFilter(this.downloadBody, data);
        }

        if(data.date){
            this.tableData.options = {
                'hasSelectLine':true,
                'pageSize': 10,//每页显示数量
                'pageNumber': 1,//当前页码
                'totalPage': 16,//页码总数
                'totalNumber': 160,//数量总条数
                'count': 3,//当前页前后分页个数
                'foottype': 'paginate',//底部显示类型
                'pageCount': [10,15,20]//每页显示数量
            }
            this.body["limit"]=[1,10]
        }
        //console.log("=======>this.body",this.body)
        this.postChange(this.body)
    }

    public mergeFilterChange(event: any, target: any): void {
        super.onFilterChange(this, target);
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {
    }

    public renderSelectLine(json: any) {
        if (this.tableData.tableRFM_indicators) {
            $('.table-selectline-title', "#" + this.scopeID).text(json.tableRFM_indicators[0]['name']);

            let optionList = '<ul>';
            for (let i = 0; i < json.tableRFM_indicators.length; i++) {
                optionList += '<li data-id=' + json.tableRFM_indicators[i]['id'] + '>' + json.tableRFM_indicators[i]['name'] + '</li>';
            }
            optionList += '<ul>';
            $('.table-selectline-list', "#" + this.scopeID).empty().append(optionList);
        }

    }

    public renderTable(json: any) {
        $('div[tableContainer]', "#" + this.scopeID).empty();

        let table = "<table class='table'>"
        let tableHead = json.head;
        this.colLength = 0;
        table += "<thead><tr style='background:#3385ff;'>";
        for (let p in tableHead) {
            table += "<th><span>" + tableHead[p] + "</span>";
            if (this.datatype == '来源分析' && tableHead[p] != '地区') {
                if(this.orderByFlag){
                    let name = "sortableUp";
                    (this.body["orderBy"][0]['function'] == 'DESC')?name="sortableDown":name="sortableUp";
                    if(this.body["orderBy"][0]['field'] == tableHead[p]){
                        table += '<span class="sortable '+name+'" code="' + tableHead[p] + '"><i class="triangleUp"></i><i class="triangleDown currentSort"></i></span>';
                    }else {
                        table += '<span class="sortable" code="' + tableHead[p] + '"><i class="triangleUp"></i><i class="triangleDown currentSort"></i></span>';
                    }
                }else{
                    table += '<span class="sortable" code="' + tableHead[p] + '"><i class="triangleUp"></i><i class="triangleDown currentSort"></i></span>';
                }
            }
            this.colLength++;
            table += "</th>";
        }
        table += "</tr></thead><tbody id='bd'>";

        let tbodyData = json.data;
        $.each(tbodyData, function (i: any, v: any) {  // i:0,1,2  v:{};
            //var tData = "";
            let trColor;
            if (i % 2 == 0) {
                trColor = "even";
            }
            else {
                trColor = "odd";
            }

            table += "<tr class='" + trColor + "'>";
            for (let k in tableHead) {
                let className = '';
                if (k == '运营状态') { //运营状态 列
                    switch (v[tableHead[k]]) {
                        case 1:
                            className = 'failed';
                            break;
                        case 2:
                            className = 'success';
                            break;
                    }
                    table += "<td><span class='" + className + "'></span>";
                } else {
                    let text = v[k] == null ? '-' : (v[k] + '').replace(/\<\=/g, '≤').replace(/\</g, '&lt;');
                    let value = text;
                    if(this.datatype != 'tableRFM'){
                        if(isNaN(Number(text))){
                            value = text;
                        }else{
                            value = Number(text).toLocaleString();
                        }
                        
                    }else {
                        value = Utils.changeNumber(text);
                    }
                   
                    
                    
                    let rankClass = v[k + 'rank'] == null ? '' : 'opacity' + v[k + 'rank'];
                    table += "<td class='" + rankClass + "'><span>" + value + "</span>";
                }

                if (v[k + '_状态']) {
                    table += "<span class='" + v[k + '_状态'] + "'>" + "</span>"
                }
                table += "</td>"
            }

            table += "</tr>";
        });
        table += "</tbody></table>";

        $('div[tableContainer]', "#" + this.scopeID).append(table);

    };

    //创建tabelfooter
    public creatTableFooter(json: any) {
        switch (json.options.foottype) {
            case "paginate":
                this.renderPaginate(json);
                break;
            case "loadmore":
                this.loadMoreData(json);
                break;
        }

    };

    //渲染分页
    public renderPaginate(json: any) {

        let pagination = "<div class='table_foot clrfix'>"

        //每页显示
        pagination += "<div class='table_pagePer fl'><span class='fl'>每页显示</span><div class='table_pageSizeBox fl'><div class='table_pageSize'><span class='table_pageSize_title'>10条</span><i class='triangle_icon'></i></div><ul class='table_sizeList hide'>"

        //显示条数列表
        for (let i = 0; i < json.options.pageCount.length; i++) {
            pagination += "<li type='" + i + "'>" + json.options.pageCount[i] + '条' + "</li>";
        }

        pagination += "</ul></div></div>"

        //首页
        pagination += "<div class='table_page fr clrfix'><a href='javascript:;' class='table_first fl'>首页</a><div class='table_pages fl clrfix'>"

        //显示分页
        pagination = this.renderPagelist(json.options, pagination);

        //显示末页
        pagination += "</div><a href='javascript:;' class='table_last fl'>末页</a></div>";

        //插入容器内
        $('div[tableContainer]', "#" + this.scopeID).append(pagination);

    }

    //渲染pagelist
    public renderPagelist(opt: any, pagination: any) {
        if (opt.totalPage < 10) {
            for (let i = 1; i <= opt.totalPage; i++) {
                let classname = opt.pageNumber == i ? "table_currentPage" : "";
                pagination += '<a href="javascript:;" class="' + classname + '">' + (i) + '</a>';
            }

        } else {
            if (opt.pageNumber - opt.count > 1 && opt.pageNumber != 1 && opt.totalPage != opt.count) {
                var home = '1';
                pagination += '<a href="javascript:;">' + home + '</a><span>...</span>';
            }
            let start = (opt.pageNumber - opt.count) <= 1 ? 1 : (opt.pageNumber - opt.count);
            let end = (opt.pageNumber + opt.count) >= opt.totalPage ? opt.totalPage : (opt.pageNumber + opt.count);
            for (; start <= end; start++) {
                if (start <= opt.totalPage && start >= 1) {
                    if (start != opt.pageNumber) {
                        pagination += '<a href="javascript:;">' + start + '</a>';
                    } else {
                        pagination += '<a href="javascript:;" class="table_currentPage">' + start + '</a>';
                    }
                }
            }
            if (opt.pageNumber + opt.count < opt.totalPage && opt.pageNumber >= 1 && opt.totalPage > opt.count) {
                let end = opt.totalPage;
                pagination += '<span>...</span><a href="javascript:;">' + end + '</a>';
            }
        }
        return pagination;
    }

    //设置表格宽度
    public setTableWidth(json: any) {
        let width = $("#" + this.scopeID).find("table").width();
        let tdWidth = width / this.colLength;
        $("#" + this.scopeID).find("td").width(tdWidth);
    }

    //渲染加载更多
    public loadMoreData(json: any) {
        let foot = '<div class="table_foot"><div class="loadmoreBtn"><span>显示更多</span><i></i></div></div>';
        if($("#" + this.scopeID)[0]["lastChild"]["className"] == "table_foot"){
            return;
        }
        //插入容器内
        $("#" + this.scopeID).append(foot);
    }

    //渲染弹框
    private renderModal(json: any) {

        let html = '<div class="tableModal tableBarModal">' +
            '<div class="tableModalContent tableBarModalContent">' +
            '<div class="tableModalHeader clrfix">' +
            '<span class="fl">另存人群</span>' +
            '<span class="closeModal fr tableBarCancel">×</span>' +
            '</div>' +
            '<div class="tableModalBody clrfix">' +
            '<div name="crowdName" class="clrfix">' +
            '<div class="tableBar-30 fl">人群命名</div>' +
            '<div class="tableBar-70 fl">' +
            '<input type="text" placeholder="请输入人群名称" class="tableBarInput" tableBarSearch>' +
            '<div class="tableBarErrorTips crowdNameErrorTips" tableBarErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '<div class="clrfix" name="date">' +
            '<div class="tableBar-30 fl">日期</div>' +
            '<div class="tableBar-70 fl" tableBarDate></div>' +
            '</div>' +
            '<div name="brand" class="clrfix">' +
            '<div class="tableBar-30 fl">品牌</div>' +
            '<div class="tableBar-70 fl" tableBarBrand></div>' +
            '</div>' +
            '<div class="clrfix" name="qudao">' +
            '<div class="tableBar-30 fl">渠道</div>' +
            '<div class="tableBar-70 fl" tableBarChannel></div>' +
            '</div>' +
            '<div name="" class="clrfix">' +
            '<div class="tableBar-30 fl">筛选</div>' +
            '<div class="tableBar-70 fl clrfix" tableBarCheckRadio>  ' +
            '<div class="w-30 fl">' +
            '<span class="tablefilterRF" value="filterR">R值</span>' +
            '</div> ' +
            '<div class="w-30 fl">并且</div>' +
            '<div class="w-30 fl">' +
            '<span class="tablefilterRF" value="filterF">F值</span>' +
            '</div>' +
            '<div class="tableBar-list-data fl clrfix" tableBarListData>' +
            '<ul></ul>' +
            '</div>' +
            '<div class="tableBarErrorTips fl filterErrorTips" tableBarErrorTips></div> ' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="tableModalFooter clrfix">' +
            '<button type="button" class="confirm fr tableBarConfirm">确认</button>' +
            '<button type="button" class="cancel fr tableBarCancel">取消</button>' +
            '</div>' +
            '</div> ' +
            '</div>'

        return html;
    }

    //发送请求
    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    //绑定事件
    protected eventBindHtml() {
        let that = this;

        $('#' + that.scopeID).find('.table-selectline').off('click');
        $('#' + that.scopeID).find('.table-selectline-list').off('click');
        $('.table_pageSize', '#' + that.scopeID).off('click');
        $('.table_sizeList', '#' + that.scopeID).off('click');
        $('.table_page', '#' + that.scopeID).off('click');
        $('.loadmoreBtn', '#' + that.scopeID).off('click');
        $('.sortable', '#' + that.scopeID).off('click');

        //显示select
        $('#' + that.scopeID).find('.table-selectline').click((event: any) => {
            $('#' + that.scopeID).find('.table-selectline-list').show();
            $(document).find('.rfmFilter_list_layer').hide();

            event.stopPropagation();
        });

        //选择select
        $('#' + that.scopeID).find('.table-selectline-list').on('click', 'li', (event: any) => {
            let $target = $(event.target);
            $('#' + that.scopeID).find('.table-selectline-title').html($target.html());
            $('#' + that.scopeID).find('.table-selectline-list').hide();

            that.body['metrics'][0]['field'] = $target.attr('data-id');
            that.postChange(that.body);

            event.stopPropagation();
        });

        //显示、隐藏每页显示下拉框
        $('.table_pageSize', '#' + that.scopeID).on('click', function (e) {
            let $tableSizeList = $(this).siblings('.table_sizeList');
            if ($tableSizeList.hasClass('hide')) {
                $tableSizeList.removeClass('hide').addClass('open');
            } else if ($tableSizeList.hasClass('open')) {
                $tableSizeList.removeClass('open').addClass('hide');
            }
            e.stopPropagation();

        })

        $(document).click(function (e) {
            $('.table_sizeList').removeClass('open').addClass('hide');
            $('#' + this.scopeID).find('.table-selectline').hide();
        })

        //选择下拉列表
        $('.table_sizeList', '#' + that.scopeID).on('click', 'li', (e) => {
            let $target = $(e.target);
            let type = Number($target.attr('type'));
            if (that.tableData.options['pageSize'] == this.tableData.options['pageCount'][type]) return;
            that.tableData.options['pageSize'] = this.tableData.options['pageCount'][type]
            that.tableData.options['pageNumber'] = 1;
            $target.parents('.table_pagePer').find('.table_pageSize_title').html(that.tableData.options['pageSize'] + '条');

            //重新buildbody,onchange
            that.body.limit[1] = this.tableData.options['pageCount'][type];
            that.postChange(that.body);
        })

        //点击页码
        $('.table_page', '#' + that.scopeID).on('click', 'a', (e) => {
            let $target = $(e.target);

            //重新buildbody,onchange       
            if ($target.hasClass('table_first')) {
                that.body.limit[0] = 1;

            } else if ($target.hasClass('table_last')) {
                that.body.limit[0] = that.tableData.options.totalPage;
            } else {
                that.body.limit[0] = Number($target.html());
            }

            that.tableData.options['pageNumber'] = that.body.limit[0];
            that.postChange(that.body);
        });

        //点击加载更多
        $('.loadmoreBtn', '#' + that.scopeID).on('click', (e) => {

            //重新buildbody,onchange
            that.body.limit[1] += 10;
            if (that.body.limit[1] - that.tableData.options['totalNumber'] > 10) {
                $(this).parents('.table_foot').html('没有更多');
                return;
            }

            that.postChange(that.body);

        });

        //排序
        $('.sortable', '#' + that.scopeID).on('click', (e) => {
            let field = $(e.target).parents('.sortable').attr('code');

            //重新buildbody,onchange
            if (that.body["orderBy"]) {
                that.orderByFlag = true;
                that.body["orderBy"][0]['field'] = field;
                that.body["orderBy"][0]['function'] = that.body["orderBy"][0]['function'] == 'DESC' ? 'ASC' : 'DESC';
                that.postChange(that.body);
            }

        });

        let $componentBody = $(document.body).find('.stage');
        $componentBody.off('click.table');
        $('#' + that.scopeID).find('.saveCrowdBtn').off('click');

        //另存人群
        $('#' + that.scopeID).find('.saveCrowdBtn').click((event: any) => {
            $('.modal-backdrop-report-form').remove();
            //渲染弹框
            let modal = that.renderModal('');
            $componentBody.append(modal);

            that.crowdName = null;
            that.tableBarfilter = {'filterR': [], 'filterF': []};
            $('.tableBarModal').show();
            //根据DATA返回的数据渲染list
            that.tableBarFilterRF = 'filterR';
            let listData = that.barTableListData ? that.barTableListData[that.tableBarFilterRF] : null;
            that.renderListHtml(listData);
            //取过滤器的值放入html里
            $componentBody.find('div[tablebardate]').html(that.tableBarDate);
            $componentBody.find('div[tablebarbrand]').html(that.tableBarbrand);
            $componentBody.find('div[tablebarchannel]').html(that.tableBarchannel);

            $(document.body).find('.stage').append("<div class='modal-backdrop modal-backdrop-report-form'></div>");
            event.stopPropagation();
        })

        //click radio
        $componentBody.on('click.table', '.tablefilterRF', (event: any) => {
            let $target = $(event.target);
            if ($target && $target.attr('value') !== null) {
                that.tableBarFilterRF = $target.attr('value');
            }

            if (that.barTableListData !== null) {
                that.renderListHtml(that.barTableListData[that.tableBarFilterRF]);
            }

            let tableBarfilter = that.tableBarfilter[that.tableBarFilterRF];
            let $liList = $(document).find('div[tablebarlistdata] li');
            if (tableBarfilter && tableBarfilter.length > 0) that.decidePieBarFilterArray($liList, tableBarfilter);
            event.stopPropagation();
        })

        //输入人群命名
        $componentBody.on('keyup.table', 'input[tableBarSearch]', (event: any) => {
            let keyUpText = $(event.target).val().trim();
            if (keyUpText.length <= 0) {
                $componentBody.find("input[tableBarSearch]").addClass("tableBarErrorBorder");
                $componentBody.find(".crowdNameErrorTips").text("人群名称不能为空")
            } else {
                $componentBody.find("input[tableBarSearch]").removeClass("tableBarErrorBorder");
                $componentBody.find(".crowdNameErrorTips").text("")
            }
            that.crowdName = keyUpText;
            event.stopPropagation();
        })

        //选择筛选条件
        $componentBody.on('click.table', 'div[tableBarListData]', (event: any) => {
            let $target = $(event.target);
            if (!$target.hasClass("tableBarChoose")) {
                $target.addClass("tableBarChoose");
                (that.tableBarfilter[that.tableBarFilterRF]).push($target.text())
                $componentBody.find(".filterErrorTips").text("");
            } else {
                $target.removeClass("tableBarChoose");
                //从数组里删除
                that.removePieBarFilterArray($target.text())
            }
            event.stopPropagation();
        });

        //确认
        $componentBody.on('click.table', '.tableBarConfirm', (event: any) => {
            that.getCrowdCount();
            if (!that.crowdName) {
                $componentBody.find("input[tableBarSearch]").addClass("tableBarErrorBorder");
                $componentBody.find(".crowdNameErrorTips").text("人群名称不能为空");
                return false;
            } else if (that.barTableListData == null) {
                $componentBody.find(".filterErrorTips").text("筛选值暂无数据，无法另存为人群");
                return false;
            } else if (that.crowdName && that.tableBarfilter['filterR'].length <= 0 && that.tableBarfilter['filterF'].length <= 0) {
                $componentBody.find(".filterErrorTips").text("请至少选择一个筛选值，否则无法另存为人群");
                return false;
            } else if (that.crowdCount <= 0) {
                $componentBody.find(".filterErrorTips").text("客户数量为0，无法另存为人群");
                return false;
            } else {
                let filterF: any, filterR: any, brand: any, channel: any;
                if (that.tableBarfilter['filterF'].length > 0) filterF = {'filterF': (that.getKeyByfilterRF(that.tableBarfilter['filterF'])).toString()};
                if (that.tableBarfilter['filterR'].length > 0) filterR = {'filterR': (that.getKeyByfilterRF(that.tableBarfilter['filterR'])).toString()};

                brand = that.tableBarbrand == '全部品牌' ? "ALL" : that.tableBarbrand;
                channel = that.tableBarchannel == '全部渠道' ? "ALL" : that.tableBarchannel;
                //发送请求
                let buildQueryObj: any = Object.assign(
                    that.transformInput('crowdName', that.crowdName),//人群名称
                    that.transformInput('yearMonth', that.tableBaryearMonth),//日期
                    that.transformInput('brand', brand),//品牌
                    that.transformInput('channel', channel),//渠道
                    filterR,
                    filterF
                )
                $.ajax({
                    //开发地址
                    url: PATHJSON.urlHostRFM + '/dmp-web/crowd/crowds/saveRFCrowd',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(buildQueryObj),
                    success: function (data: any) {
                        $('.modal-backdrop-report-form').remove();
                        $('.tableBarModal').remove();
                    },
                    error: function (data: any) {
                        let msg = data.responseJSON.msg;
                        $componentBody.find("input[tableBarSearch]").addClass("tableBarErrorBorder");
                        $componentBody.find(".crowdNameErrorTips").text(msg);

                    }
                })
            }

            event.stopPropagation();
        })

        //取消
        $componentBody.on('click.table', '.tableBarCancel', (event: any) => {
            $('.modal-backdrop-report-form').remove();
            $('.tableBarModal').remove();
            event.stopPropagation();
        })
    }

    private getKeyByfilterRF(filterArray: any) {
        let mapFR = {
            'F=1': 1,
            'F=2': 2,
            'F=3': 3,
            'F=4': 4,
            'F=5': 5,
            'R≤30': 5,
            '30<R≤90': 4,
            '90<R≤180': 3,
            '180<R≤360': 2,
            'R>360': 1
        };
        let keyArr: any = [];
        if (filterArray.length > 0) {
            for (let i = 0; i < filterArray.length; i++) {
                if (mapFR[filterArray[i]]) keyArr.push(mapFR[filterArray[i]]);
            }
        }
        return keyArr;
    }

    private renderListHtml(data: any) {

        if (data && data.length > 0) {
            $(document.body).find("div[tableBarListData] ul").empty();
            let optionList: any = "";
            for (let i = 0; i < data.length; i++) {
                if (data[i]) optionList += '<li>' + (data[i] + '').replace(/\<\=/g, '≤').replace(/\</g, '&lt;') + '</li>'
            }
            $(document.body).find("div[tableBarListData] ul").html(optionList);
        }
    }

    //取过滤器的值
    private getFilterData($componentBody: any) {
        let chart: Object = this.mergeFilterObj !== null ? this.mergeFilterObj['chart'] : null;
        for (let key in chart) {
            switch (key) {
                case "date":
                    this.tableBarDate = chart[key]
                    break;
                case "yearMonth":
                    //日期
                    this.tableBaryearMonth = chart[key];
                    break;
                case "brand":
                    //品牌
                    if (chart[key] == "all") {
                        this.tableBarbrand = "全部品牌"
                    } else {
                        this.tableBarbrand = chart[key];
                    }

                    break;
                case "channel":
                    //渠道
                    if (chart[key] == "all") {
                        this.tableBarchannel = "全部渠道";
                    } else {
                        this.tableBarchannel = chart[key];
                    }

                    break;
            }
        }
    };

    private removePieBarFilterArray($target: any) {
        if ((this.tableBarfilter[this.tableBarFilterRF]).length > 0) {
            let length = (this.tableBarfilter[this.tableBarFilterRF]).length;
            for (let i = length - 1; i >= 0; i--) {
                if ((this.tableBarfilter[this.tableBarFilterRF])[i] == $target) {
                    (this.tableBarfilter[this.tableBarFilterRF]).splice(i, 1)
                }
            }
        }
    }

    private decidePieBarFilterArray($list: any, checkedFilter: any) {
        if (checkedFilter.length > 0) {
            for (let i = ($list.length) - 1; i >= 0; i--) {
                if (checkedFilter.indexOf($($list[i]).text()) >= 0) {
                    $($list[i]).addClass('tableBarChoose');
                }
            }
        }
    }

    private getCrowdCount() {
        this.crowdCount = 0;
        if (this.tableBarfilter['filterR'].length > 0 && this.tableBarfilter['filterF'].length > 0) {
            for (let i = 0; i < this.tableBarfilter['filterR'].length; i++) {
                for (let j = 0; j < this.tableBarfilter['filterF'].length; j++) {
                    for (let k = 0; k < this.tablebody.length; k++) {
                        if (this.tableBarfilter['filterR'][i] == this.tablebody[k]['R'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;') && this.tableBarfilter['filterF'][i] == this.tablebody[k]['F'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;')) {
                            this.crowdCount += (this.tablebody[k][this.body['metrics'][0]['field']] - 0);
                        }
                    }
                }
            }
        } else if (this.tableBarfilter['filterR'].length > 0 && this.tableBarfilter['filterF'].length <= 0) {
            for (let i = 0; i < this.tableBarfilter['filterR'].length; i++) {
                for (let k = 0; k < this.tablebody.length; k++) {
                    if (this.tableBarfilter['filterR'][i] == this.tablebody[k]['R'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;') && this.tablebody[k]['R'] != 'total') {
                        this.crowdCount += (this.tablebody[k][this.body['metrics'][0]['field']] - 0);
                    }
                }

            }
        } else if (this.tableBarfilter['filterR'].length <= 0 && this.tableBarfilter['filterF'].length > 0) {

            for (let j = 0; j < this.tableBarfilter['filterF'].length; j++) {
                for (let k = 0; k < this.tablebody.length; k++) {
                    if (this.tablebody[k]['F'] != 'total' && this.tableBarfilter['filterF'][j] == this.tablebody[k]['F'].replace(/\<\=/g, '≤').replace(/\</g, '&lt;')) {
                        this.crowdCount += (this.tablebody[k][this.body['metrics'][0]['field']] - 0);
                    }
                }
            }

        }

    }

}