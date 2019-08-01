import { Component, Input, Output, OnInit } from '@angular/core';

import { CreateSegmentAppCommunicationService } from "../../../../../../../../../services/communication/create-segment-app.communication.service";
import { SegmentCommunicationService } from "../../../../../../../../../services/communication/segment.communication.service";

@Component({
    selector: 'push-text-editor',
    templateUrl: 'push-text-editor.component.html',
    styleUrls: ['push-text-editor.component.css']
})

export class PushTextEditorComponent {
    pushData: any;

    editorContent: string;

    pushText: any;

    pieceIndex: number = 0;

    testColor: any;

    isEditor: boolean = true; //是否使用富文本

    titleShow: boolean = false;
    constructor(
        private createSegmentAppCommunicationService: CreateSegmentAppCommunicationService,
        private segmentCommunicationService: SegmentCommunicationService
    ){
        let that = this;
        that.initConf();
        that.createSegmentAppCommunicationService.missionSelectFlowCount$.subscribe(data => {
            that.pieceIndex = data.index;
            that.initConf();
        })
    }

    initConf(){
        let that = this;
        let pushData = that.segmentCommunicationService.segmentInfo;
        if (pushData.platform == 'ios') {
            that.pushData = pushData.iosData;
        } else {
            that.pushData = pushData.androidData;
        }
        if (that.pushData[this.pieceIndex].action === 2) {
            that.pushData[this.pieceIndex].action = false;
        } else if (that.pushData[this.pieceIndex].action === 0) {
            that.pushData[this.pieceIndex].action = true;
        } else {
            that.pushData[this.pieceIndex].action = false;
        }
    }

    jsonInsert(data: string) {
        let inputText = document.querySelector('.ql-editor');
        inputText['focus']();
        this.doGetCaretPosition(inputText, data);
    }

    doGetCaretPosition(oField: any, value: any) {
        var iCaretPos = 0;
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                let range = sel.getRangeAt(0);
                range.deleteContents();
                let el = document.createElement('div');
                el.innerHTML = value;
                let frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    }
    //校验标题字数
    checkInput () {
        this.segmentCommunicationService.isError.title = false;
        this.titleShow = false;

        if (this.pushData[this.pieceIndex].title && this.pushData[this.pieceIndex].title.length > 30){
            this.titleShow = true;
            this.pushData[this.pieceIndex].title = this.pushData[this.pieceIndex].title.substring(0,30);
        }
    }
}