import {ConfirmationService} from 'primeng/primeng';
import {StageService} from './../../../services/stage.service';
import {Component, OnInit} from '@angular/core';

import {DialogCommunicationService} from "../../../common/dialog/dialog.communication.service";
import {DialogData, DialogConfirm} from "../../../common/dialog/dialog_data.model";
import {ChartsConfigService} from "./../../../services/config.service"

@Component({
    selector: 'charts-pages',
    templateUrl: 'charts-pages.component.html',
    // styleUrls: ['charts-pages.component.css']
})

export class ChartsPagesComponent implements OnInit {
    pages: any;
    pageList: boolean = false;

    constructor(private stageService: StageService,
                private dialogCommunicationService: DialogCommunicationService,
                private chartsConfigService: ChartsConfigService) {

    }

    ngOnInit() {
        this.pages = {};
        this.pages = this.stageService.stagePages;
    }

    createPage() {
        console.log(this.pages.currentIndex, this.pages)
        if (this.stageService.getStageBoolean) {
            this.stageService.getStageBoolean = false;
        }

        //clear config view
        this.stageService.clearReportConfigs();

        //view
        let stageLength = this.stageService.StageBaseData.stages.length;
        this.pages.current = stageLength;
        this.pages.currentIndex = stageLength;
        this.pages.total = stageLength + 1;

        //create stage
        this.stageService.StageInstance.createPage();

        //update pages & queens
        this.stageService.StageBaseData.stages.push({
            name: '第' + (this.pages.current + 1) + '页',
            // editbool: false,
            backgroundColor: '',
            backgroundImage: '',
            zIndex: 0,
            size: null,
            components: []
        })

        this.stageService.stageDataBoolean = true;
        this.stageService.dragChart(this.stageService.stageDataBoolean)
    }

    public sourceViewData: any;
    public sourceReportBoolean: boolean = false;

    changePage(index: number) {
        if (index === this.pages.current) {
            return
        }

        //cache stage base data, merge old page data
        this.stageService.clearReportConfigs();
        console.log(this.pages.current)

        this.pages.currentIndex = this.pages.current = index;
        let resultData = this.stageService.getStagePageChangeData(index);

        if (resultData.components.length < 1) {
            this.stageService.stageDataBoolean = true;
        } else {
            this.stageService.stageDataBoolean = false;
        }
        this.stageService.dragChart(this.stageService.stageDataBoolean);

        //review
        this.stageService.StageInstance.changePage(resultData)
        this.stageService.reBindEvents();
        this.stageService.missionStageDataFormatSource.next();
        if (!this.stageService.chartMode) {
            this.stageService.StageInstance.preViewModel = false;
        }

        this.pageList = false;
    }

    changeFromName(page: any) {
        if (!this.stageService.illegalChar(page.name)) {
            this.dialogCommunicationService.addMessage({
                severity: 'error',
                summary: "报表页名称不能包含特殊字符（\/:*?<>|）",
                detail: ""
            });
            return false;
        }
        return true;
    }

    //重命名
    editPage(page: any) {
        page.editbool = true;
    }

    //重命名确定
    confirmEditName(page: any) {
        if (!this.changeFromName(page)) {
            return;
        }
        page.editbool = false;
    }

    deletePage(index: number) {
        let dialog = new DialogData();
        dialog.icon = "jinggao";
        dialog.title = "删除舞台";
        dialog.content = `确定要删除舞台第${index + 1}页?`;
        let confirm: DialogConfirm = new DialogConfirm();
        confirm.onConfirm = () => {
            this.stageService.delStageBaseDataByIndex(index);
            this.pages.total = this.stageService.StageBaseData.stages.length;

            if (index == this.pages.currentIndex) {
                if (index == 0) {
                    this.pages.currentIndex = this.stageService.stagePages.current = index;
                } else {
                    this.pages.currentIndex = this.stageService.stagePages.current = index - 1;
                }

                let resultData = this.stageService.getStagePageChangeData(this.pages.currentIndex)
                //review
                this.stageService.StageInstance.changePage(resultData);
                this.stageService.reBindEvents();
                this.stageService.missionStageDataFormatSource.next();
                if (!this.stageService.chartMode) {
                    this.stageService.StageInstance.preViewModel = false;
                }

            } else if (index < this.pages.currentIndex) {
                this.pages.currentIndex = this.stageService.stagePages.current = this.pages.currentIndex - 1;
            }

        };
        dialog.confirms.push(confirm);
        this.dialogCommunicationService.showDialog(dialog)
    }

    setPageMoreTop(event: any, index: number) {
        if (!this.stageService.chartMode) {
            let $smartMore = document.getElementById('smart-page-' + index + '-more'),
                $smartList = document.getElementById('smart-page-list'),
                $target = event.target,
                top: any = parseInt($smartMore.style.top),
                offsetTop = $target.offsetTop,
                $window = window,
                wHeight = $window.innerHeight,
                _height = 0;

            _height = $smartList.offsetHeight;

            if (wHeight - offsetTop <= _height) {
                if ($target.className == "icons_svg edit-icon") {
                    offsetTop = $target.parentNode.offsetTop
                } else if ($target.tagName == "LI") {
                    offsetTop = $target.parentNode.parentNode.parentNode.offsetTop;
                }
                $smartMore.style.top = offsetTop - $smartList.scrollTop + 'px';
            } else {
                if ($target.className == "icons_svg edit-icon") {
                    offsetTop = $target.parentNode.offsetTop
                } else if ($target.tagName == "LI") {
                    offsetTop = $target.parentNode.parentNode.parentNode.offsetTop;
                } else if ($target.tagName == "A") {
                    offsetTop = $target.offsetTop - $smartList.scrollTop;
                }
                $smartMore.style.top = offsetTop + 'px';
            }
        }

    }

    smartPages(e: any) {
        this.pageList = true;
    }

}