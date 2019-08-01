/**
 * Created by wangshouyun on 2017/3/23.
 */

import {EventEmitter} from '../node_modules/datwill-sdk/lib/events/emitter.event';
import {EventType} from '../node_modules/datwill-sdk/lib/events/type.event';
import {DemoData} from './demoData';


export class Test {

    public static init(dws: any) {

        let demoData: DemoData = new DemoData();

        var isRelativeStage = false;
        var relativeStage = document.querySelector('[relative-stage]');
        relativeStage.addEventListener('click', function (e: any) {
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
        leftAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.left);
        });
        var rightAlign = document.querySelector('[right-align]');
        rightAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.right);
        });
        var topAlign = document.querySelector('[top-align]');
        topAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.top);
        });
        var bottomAlign = document.querySelector('[bottom-align]');
        bottomAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.bottom);
        });
        var verticalCenterAlign = document.querySelector('[vertical-center-align]');
        verticalCenterAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.vertical_center);
        });
        var horizCenterAlign = document.querySelector('[horiz-center-align]');
        horizCenterAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.ALIGN.action, EventType.ALIGN.horiz_center);
        });
        var dataButtonAlign = document.querySelector('[data-button-align]');
        var scopeID: string;
        var type:string = 'null';
        EventEmitter.register(EventType.SELECTCHART, function (e: any, d: any) {
            if (d.length > 0) {
                scopeID = d[0].scopeID;
                type = d[0].type;
            }
        }, this);
        dataButtonAlign.addEventListener('click', function (e: any) {

            EventEmitter.trigger(EventType.DATACHANGE,
                {
                    scopeID: scopeID,
                    result: demoData.getDataByKey(type)
                });
        });
        dataButtonAlign.addEventListener('click', function (e: any) {
            EventEmitter.trigger(EventType.STYLECHANGE,
                {
                    scopeID: scopeID,
                    result: {
                        backgroundColor: '#ccc',
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
        var StackedBar = document.querySelector('[button-StackedBar]');
        StackedBar.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "StackedBar");
        });

        var dataButtonDragPart = document.querySelector('[data-button-dragpart]');
        dataButtonDragPart.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "14");
        });
       var dataButtonDragtargetTable = document.querySelector('[data-button-dragtargetTable]');
        dataButtonDragtargetTable.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "20");
        });

        var dataButtonDragIndexPriview = document.querySelector('[data-button-dragindexPriview]');
        dataButtonDragIndexPriview.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "30");
        });

        var buttonFilter = document.querySelector('[button-filter]');
        buttonFilter.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "Filter");
        });

        var dataButtonEdit = document.querySelector('[data-button-edit]');
        dataButtonEdit.addEventListener('click', function (e: any) {
            console.log(dws.getInstance());
            if (dataButtonEdit.getAttribute('isedit') == "true") {
                dataButtonEdit.setAttribute('isedit', "false");
                dws.getInstance().preViewModel = true;
            } else {
                dataButtonEdit.setAttribute('isedit', "true");
                dws.getInstance().preViewModel = false;
            }
        });

        var dataButtonScatter = document.querySelector('[data-button-scatter]');
        dataButtonScatter.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "16");
        });

        var dataButtonData = document.querySelector('[data-button-data]');
        dataButtonData.addEventListener('click', function (e: any) {
            console.log(dws.getInstance().data);
        });


        var Line = document.querySelector('[button-Line]');
        Line.addEventListener('dragstart', function (e: any) {
            e.dataTransfer.setData("chartType", "17");
        });

        var dataButtonChangeSelect = document.querySelector('[data-button-changeSelect]');
        dataButtonChangeSelect.addEventListener('click', function (e:any) {

            document.getElementById('textarea').style.display = "none";

        });

        var dataButtonOpenSelect = document.querySelector('[data-button-openSelect]');
        dataButtonOpenSelect.addEventListener('click', function (e:any) {

            document.getElementById('textarea').style.display = "block";

        });

        var dataButtonchangeTitle = document.querySelector('[data-button-changeTitle]');
        dataButtonchangeTitle.addEventListener('click', function (e:any) {
            document.getElementById('changeTitle').style.display = "block";
            EventEmitter.trigger(EventType.STYLECHANGE, {
                scopeID: 'drf2jh2j5tskbbda',
                result: {
                    title_font: "隐藏title"
                }
            });
        });

        var dataButtonchangeTitleHide = document.querySelector('[data-button-changeTitleHide]');
        dataButtonchangeTitleHide.addEventListener('click', function (e:any) {
            document.getElementById('changeTitle').style.display = "none";
        });

        var dataButtonchangeTitleTrue = document.querySelector('[changeTitleTrue]');
        dataButtonchangeTitleTrue.addEventListener('change', function (e:any) {
            console.log(e)
            if(e.target.value == '显示title'){
                (document.querySelector('[changeTitleShow]') as HTMLInputElement).style.display = "block";
                EventEmitter.trigger(EventType.STYLECHANGE, {
                    scopeID: 'drf2jh2j5tskbbda',
                    result: {
                        title_font: (document.querySelector('[changeTitleShow]') as HTMLInputElement).value
                    }
                });
            }
        });


        var dataButtonchangeTitleShow = document.querySelector('[changeTitleShow]');
        dataButtonchangeTitleShow.addEventListener('keyup', function (e:any) {
            console.log(e)
            EventEmitter.trigger(EventType.STYLECHANGE, {
                scopeID: 'drf2jh2j5tskbbda',
                result: {
                    title_font: e.target.value
                }
            });
        });

        var dataButtonchangeTitleFalse = document.querySelector('[changeTitleFalse]');
        dataButtonchangeTitleFalse.addEventListener('change', function (e:any) {
            if(e.target.value == '隐藏title'){
                (document.querySelector('[changeTitleShow]') as HTMLInputElement).style.display = "none";
                EventEmitter.trigger(EventType.STYLECHANGE, {
                    scopeID: 'drf2jh2j5tskbbda',
                    result: {
                        title_font: e.target.value
                    }
                });
            }
        });

        var dataButtonChangeTextarea = document.querySelector('[textarea-button]');
        dataButtonChangeTextarea.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.DOSETTINGCHANGE, {
                scopeID: 'drf2jh2j5tskbbda',
                settingObj: {
                    code: "Metric_value_1",
                    result: JSON.parse((document.getElementById('textarea-value') as HTMLInputElement).value)
                }
            });
            	
        });
      var dataButtonChangedataSource = document.querySelector('[dataSource-button]');
        dataButtonChangedataSource.addEventListener('click', function (e:any) {
            EventEmitter.trigger(EventType.DOSETTINGCHANGE, {
                scopeID: 'aw6knmndkx24zdrz',
                settingObj: {
                    code: "dataSource_id",
                    result: 3
                }
            });
            	
        });

    };

}