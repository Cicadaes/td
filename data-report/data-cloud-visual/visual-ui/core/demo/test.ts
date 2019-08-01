/**
 * Created by wangshouyun on 2017/3/23.
 */

import {EventEmitter} from '../src/events/emitter.event';
import {EventType} from '../src/events/type.event';

export class Test {

    public static init (dws:any) {
        var isRelativeStage = false;
        var relativeStage = document.querySelector('[relative-stage]');
        relativeStage.addEventListener('click', function (e:any) {
            if (isRelativeStage) {
                isRelativeStage = false;
                relativeStage['style'].backgroundColor = '#ffffff';
            } else {
                isRelativeStage = true;
                relativeStage['style'].backgroundColor = '#cc0033';
            }
            EventEmitter.trigger("relativeStage", isRelativeStage);
        });
        var leftAlign = document.querySelector('[left-align]');
        leftAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.left);
        });
        var rightAlign = document.querySelector('[right-align]');
        rightAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.right);
        });
        var topAlign = document.querySelector('[top-align]');
        topAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.top);
        });
        var bottomAlign = document.querySelector('[bottom-align]');
        bottomAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.bottom);
        });
        var verticalCenterAlign = document.querySelector('[vertical-center-align]');
        verticalCenterAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.vertical_center);
        });
        var horizCenterAlign = document.querySelector('[horiz-center-align]');
        horizCenterAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.horiz_center);
        });
        var dataButtonAlign = document.querySelector('[data-button-align]');
        var scopeID:string;
        EventEmitter.register(EventType.SELECTCHART, function (e:any, d:any) {
            scopeID = d[0].scopeID;
        }, this);
        dataButtonAlign.addEventListener('click', function (e:any) {
          
            EventEmitter.trigger(EventType.DATACHANGE,
                {
                    scopeID: scopeID,
                    result: [{value:181450}]
                });
        });
        dataButtonAlign.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.STYLECHANGE,
                {
                    scopeID: scopeID,
                    result: {
                        backgroundColor: '#f00',
                        banner_background: '#f00',
                        font_fontSize: '18px',
                        font_background: '#000'
                    }
                });
        });
        /*var verticalGapAlign = document.querySelector('[vertical-gap-align]');
        verticalGapAlign.addEventListener('click', function (e) {
        EventEmitter.trigger("actionAlign", "verticalGap");
        });
        var horizGapAlgin = document.querySelector('[horiz-gap-algin]');
        horizGapAlgin.addEventListener('click', function (e) {
        EventEmitter.trigger("actionAlign", "horizGap");
        });*/

        var dataButtonDrag = document.querySelector('[data-button-drag]');
        dataButtonDrag.addEventListener('dragstart', function (e:any) {
            e.dataTransfer.setData("chartType", "2");
        });
        var dataButtonDragPart = document.querySelector('[data-button-dragpart]');
        dataButtonDragPart.addEventListener('dragstart', function (e:any) {
            e.dataTransfer.setData("chartType", "14");
        });
        var dataButtonDragLine = document.querySelector('[data-button-dragline]');
        dataButtonDragLine.addEventListener('dragstart', function (e:any) {
            e.dataTransfer.setData("chartType", "11");
        });
        var dataButtonDragBar = document.querySelector('[data-button-dragbar]');
        dataButtonDragBar.addEventListener('dragstart', function (e:any) {
            e.dataTransfer.setData("chartType", "5");
        });
        var dataButtonDragArea = document.querySelector('[data-button-dragarea]');
        dataButtonDragArea.addEventListener('dragstart', function (e:any) {
            e.dataTransfer.setData("chartType", "10");
        });
        var dataButtonDragStrip = document.querySelector('[data-button-dragstrip]');
        dataButtonDragStrip.addEventListener('dragstart', function (e:any) {
            e.dataTransfer.setData("chartType", "7");
        });



        var Area = document.querySelector('[button-Area]');
        Area.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Area");
        });
        var Banner = document.querySelector('[button-Banner]');
        Banner.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Banner");
        });
        var Bar = document.querySelector('[button-Bar]');
        Bar.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Bar");
        });
        var ChinaMap = document.querySelector('[button-ChinaMap]');
        ChinaMap.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "ChinaMap");
        });
        var Circle = document.querySelector('[button-Circle]');
        Circle.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Circle");
        });
        var Dateformat = document.querySelector('[button-Dateformat]');
        Dateformat.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Dateformat");
        });

        var Font = document.querySelector('[button-Font]');
        Font.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Font");
        });
        var Funnel = document.querySelector('[button-Funnel]');
        Funnel.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Funnel");
        });
        var Line = document.querySelector('[button-Line]');
        Line.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Line");
        });
        var Pie = document.querySelector('[button-Pie]');
        Pie.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Pie");
        });
        var Priview = document.querySelector('[button-Priview]');
        Priview.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Priview");
        });

        var Radar = document.querySelector('[button-Radar]');
        Radar.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Radar");
        });
        var Strip = document.querySelector('[button-Strip]');
        Strip.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Strip");
        });
        var Table = document.querySelector('[button-Table]');
        Table.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Table");
        });
        var Test1 = document.querySelector('[button-Test]');
        Test1.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Test");
        });
        var Upload = document.querySelector('[button-Upload]');
        Upload.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Upload");
        });

        var dataButtonEdit = document.querySelector('[data-button-edit]');
        dataButtonEdit.addEventListener('click', function (e:any) {
            if (dataButtonEdit.getAttribute('isedit') == "true") {
                dataButtonEdit.setAttribute('isedit', "false");
                EventEmitter.trigger(EventType.EDITMODEL, { model: "read" });
            } else {
                dataButtonEdit.setAttribute('isedit', "true");
                EventEmitter.trigger(EventType.EDITMODEL, { model: "edit" });
            }
        });

        var dataButtonData = document.querySelector('[data-button-data]');
        dataButtonData.addEventListener('click', function (e:any) {
            console.log(dws.getInstance().data);
        });
    };

}