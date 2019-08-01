import { Component, OnInit, EventEmitter } from '@angular/core';
import '../../../public/css/styles.css';
import { ActivatedRoute , Params , Router, Routes } from '@angular/router';
import { CampaignResourceService } from "../services/campaign/campaign.resource.service";
import { ChangeBreadNameCommunicationService } from "../services/communication/change-bread-name.communication.service"
import { IndexSerivice } from "../services/campaign/index.service";
import { TranslateService } from "ng2-translate";
import { PipelineDefinitionResourceService } from "../services/admin/pipeline-definition.resource.service";
import { AllDetailDataCommunication } from '../services/communication/all-detail-data.communication.service';
@Component({
    selector: 'my-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
    providers: [CampaignResourceService, PipelineDefinitionResourceService]
})
export class HeaderComponent implements OnInit {

    private titleList: any = {
        marketing: '营销活动',
        createmarketing: '新建营销活动',
        marketingreport: '营销效果报告',
        smsreport: '投放效果报告',
        pushreport: '投放效果报告',
        adreport: '投放效果报告'
    };

    navListDefault: any = [{
        name: '营销活动',
        url: '/marketing'
    }];
    
    navList: any = [];

    isSetPage: boolean = false; //是否是配置页面

    constructor(
        public router: Router, 
        public route: ActivatedRoute,
        public campaignResourceService: CampaignResourceService,
        public changeBreadNameCommunicationService: ChangeBreadNameCommunicationService,
        public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
        public allDetailDataCommunication: AllDetailDataCommunication,
        public indexSerivice: IndexSerivice,
        public translate: TranslateService
    ){      
        let that = this;
        //添加语言支持
        translate.addLangs(['zh-CN', 'en']);
        //设置默认语言，一般在无法匹配的时候使用
        translate.setDefaultLang('en');

        //获取当前浏览器环境的语言比如en、 zh
        let broswerLang = translate.getBrowserLang();
        translate.use(broswerLang.match(/en|zh-CN/) ? broswerLang : 'zh-CN');
        indexSerivice.firstRequest().then(() => {
            indexSerivice.show = true;
        });
        
        allDetailDataCommunication.GetCampaign$.subscribe(data => {
            that.navList[1].name = data.name; //当活动名字修改时只在 面包屑有两层的时候
        })
    }
    
    ngOnInit() {
        let that = this;
        that.router.events.subscribe((navEnd) => {
            that.navList = that.navListDefault.concat();
            let routerList = that.navListDefault.concat();
            if (navEnd.url != '/') {
                let pathList = navEnd.url.split('/');
                let url = '/marketing';
                that.getRouter(pathList, 0, url, pathList.length, routerList, function (data: any) {
                    if (data !== 'err') {
                        that.navList = data;
                    }
                });
            }
        });
        that.changeBreadNameCommunicationService.missionAnnounced$.subscribe((data:any)=>{
            that.navList[1].name = data;     //当活动名字修改时只在 面包屑有两层的时候
        });
    }

    getRouter(pathList: any, index: number, url: any, length: number, routerList: any, fn: any) {
        let that = this;
        if (index < length)  {
            if (pathList[index] && pathList[index] != 'marketing') {
                if (routerList.length == 1 && !isNaN(+pathList[index])) {
                    that.allDetailDataCommunication.campaignId = +pathList[index];
                    url += '/' + pathList[index];
                    let json = {
                        name: that.allDetailDataCommunication.campaignData && that.allDetailDataCommunication.campaignData.name || '',
                        url: url
                    }
                    routerList.push(json);
                    index++;
                    that.getRouter(pathList, index, url, length, routerList, fn);
                } else {
                    let json;
                    if (pathList[index] === 'report') {
                        that.allDetailDataCommunication.campaignId = +pathList[index + 1];
                        let firstJson = {
                            name: that.allDetailDataCommunication.campaignData && that.allDetailDataCommunication.campaignData.name || '',
                            url: url + '/' + +pathList[index + 1]
                        }
                        routerList.push(firstJson);
                        json = {
                            name: '营销效果报告',
                            url: url + '/' + pathList[index] + '/' + pathList[index + 1]
                        };
                    } else if (pathList[index] === 'smsreport') {
                        json = {
                            name: '投放效果报告',
                            url: url + '/' + pathList[index] + '/' + pathList[index + 1]
                        };
                    } else if (pathList[index] === 'pushreport') {
                        json = {
                            name: '投放效果报告',
                            url: url + '/' + pathList[index] + '/' + pathList[index + 1]
                        };
                    } else if (pathList[index] === 'edmreport') {
                        json = {
                            name: '邮件效果报告',
                            url: url + '/' + pathList[index] + '/' + pathList[index + 1]
                        }
                    } else if (pathList[index] === 'campaignAdmin' || pathList[index] === 'funnelAdmin' || pathList[index] === 'effectAdmin' || pathList[index] === 'mktProcessAdmin' || pathList[index] === 'eventConfig' || pathList[index] === 'indexConfig' || pathList[index] === 'applyPushConfig'  || pathList[index] === 'crowdDimension') {
                        that.isSetPage = true;
                    } else if (pathList[index] === 'automation') {
                        //因为营销流程 是最后页面所以获取到营销流程名字后 直接返回
                        let pipeLineId = pathList[index + 1];
                        let routerName = pathList[index];
                        that.pipelineDefinitionResourceService.findPipeLine(pipeLineId).then((data: any) => {
                            json = {
                                name: data.name || '新建营销流程',
                                url: url + '/' + routerName + '/' + pipeLineId
                            };
                            routerList.push(json);
                            fn(routerList);
                            return;
                        })
                    } else if (pathList[index].split(';')[0] === 'personas') {
                        let list = pathList[index].split(';');
                        let data = {};
                        for (let i = 1; i < list.length; i++) {
                            let tempList = list[i].split('=');
                            let temp = tempList[1]
                            if (i === list.length - 1) {
                                temp = decodeURIComponent(temp);
                            }
                            data[tempList[0]] = temp;
                        }
                        json = {
                            name: decodeURIComponent(list[list.length - 1].split('=')[1]),
                            url: [url + '/' + list[0], data]
                        };
                    }
                    if(json) {
                        routerList.push(json);
                    }
                    index++;
                    that.getRouter(pathList, index, url, length, routerList, fn);
                }
            } else {
                index++;
                that.getRouter(pathList, index, url, length, routerList, fn);
            }
        } else {
            fn(routerList);
        }
    }

}
