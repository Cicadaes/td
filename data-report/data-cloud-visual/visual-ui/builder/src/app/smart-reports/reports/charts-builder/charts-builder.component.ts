import {BaseCRUDService} from './../../services/basecrud.service';
import {StageService} from './../../services/stage.service';
import {StageResourceService} from './../../services/stage-service/stage.resource.service';
import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
// import { ChartsDragToBuild } from './charts-drag.spc';
import {DemoDataFunc} from './demoDataFunc';

@Component({
    selector: 'charts-builder',
    templateUrl: 'charts-builder.component.html',
    // styleUrls:['charts-builder.component.css']
    styles: [`
	
	.smart-reports-list .smart-reports-item  em  img{
    width: 25px;
}

	.smart-reports-list .smart-reports-item{
		position: relative
	}
	
	
	
	.smart-reports-list .smart-reports-item  span{
		position: absolute;
		left: calc(50% - 34px);
		bottom: -24px;
		background: #707070;
		border-radius: 3px;
		color: #fff;
		font-size: 12px;
		z-index: 2;
		padding: 4px 5px;
		-webkit-transform: scale(0);
		-moz-transform: scale(0);
		transform: scale(0);
		-webkit-transition: all ease 0.2s;
		-moz-transition: all ease 0.2s;
		transition: all ease 0.2s;
		font-family: "宋体";
	}
	
	.smart-reports-list .smart-reports-item:hover span{
		-webkit-transform: scale(1);
		-moz-transform: scale(1);
		transform: scale(1);
	}
	`]
})

export class ChartsBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
    chartTypeList: Array<any>;

    _chartTypeList: Array<any>;
    chartGroupList: Array<any>;

    baseUrl: string;
    chartGroupTitle: string;
    smartTips: boolean = false;

    // @ViewChild('container') containerViewChild: ElementRef;
    // public container: ElementRef;

    private showMore: boolean

    constructor(private stageResourceService: StageResourceService, private stageService: StageService) {

    }

    handlerCateGroups() {

        let data = DemoDataFunc.getGroupData();
        this.stageService.StyleViewMetadata = data;
        this.handlerListMore(data)

        this.stageResourceService.pathURL().then(() => {
            this.baseUrl = BaseCRUDService.BASEURL;
        }).catch(err => {
            console.log(err)
        })
    }

    handlerListMore(d: any) {
        let container = document.querySelector('#charts-builder');
        let container_width = container['offsetWidth'],
            item_width = 60;

        let range = Math.floor(container_width / item_width);
        if (d.length > range) {
            this.showMore = true;
            this.chartTypeList = d;
            this._chartTypeList = d.slice(range)
        } else {
            this.showMore = false;
            this.chartTypeList = d
        }
    }

    ngOnInit() {
        this.handlerCateGroups()
    }

    //h5 drag
    dragstart(e: any, type: any) {
        // e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("chartType", type.type);
        // e.preventDefault()
    }

    dragend(e: any, type: any) {
        //test

    }

    //test drag data
    ngAfterViewInit() {
    }

    ngOnDestroy() {
        window.onresize = null

    }

    //点击组获取图表
    getChartGroup(d: any) {
        let smartChart = document.querySelector("#smartLeft");
        smartChart.className = "smart-left smartwidth";

        let data: any = {
            title: d.groupName,
            data: DemoDataFunc.getDataByGroupId(d.id)
        }
        if (data.data.length > 0) {
            this.stageService.StyleViewMetadata = data.data;
            this.chartGroupTitle = data.title;
            this.chartGroupList = data.data;
            this.smartTips = false;
        } else {
            this.smartTips = true;
            this.chartGroupList = [];
            this.chartGroupTitle = "暂无"
        }

        d.chartHover = true;
        for (let item of this.chartTypeList) {
            if (item.groupName != this.chartGroupTitle && item.chartHover) {
                item.chartHover = false;
            }
        }
    }

    delChartGroup(d: any) {
    }

    closeChartGroup() {
        let smartChart = document.querySelector("#smartLeft");
        smartChart.className = "smart-left";
    }

    mouseoutChartGroup() {
        let smartChart = document.querySelector("#smartLeft");
        smartChart.className = "smart-left";
    }

    mouseoverChartGroup() {
        let smartChart = document.querySelector("#smartLeft");
        smartChart.className = "smart-left smartwidth";
    }

}