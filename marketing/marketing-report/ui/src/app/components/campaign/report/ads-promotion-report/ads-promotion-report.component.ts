import { Component } from '@angular/core';
import {
	SliderModule,
	ButtonModule
} from 'primeng/primeng';

@Component({
	selector: 'ads-promotion-report',
	templateUrl: 'ads-promotion-report.component.html',
	styleUrls: ['ads-promotion-report.component.css'],
	providers: []
})

export class AdsPromotionReportComponent {
	cols:any[];
	conts:any[];
	footers:any[];
	barShow:boolean = false;
	chartShow:boolean = true;
	rangeVal: number = 86;
	lists:any[] = [
		{num:6666,name:'曝光',id:1},
		{num:6666,name:'独立曝光',id:2},
		{num:6666,name:'曝光IP',id:3},
		{num:6666,name:'曝光频次',id:4},
		{num:6666,name:'点击',id:5},
		{num:6666,name:'独立点击',id:6},
		{num:6666,name:'点击IP',id:7},
		{num:6666,name:'点击频次',id:8},
		{num:6666,name:'点击率',id:9}
	];
	xdata:any[];
	series:any[];
	clickText:string = '';
	ngOnInit(){
		this.xdata = [
			'华为','苹果','三星','vivo','oppo','gege','guohao','zzz'
		];
		this.series = [
			{  
				smooth:true,
                name: '',  
                type: 'line',  
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 35.6, 62.2]  
            },
            {  
            	smooth:true,
                name: '',  
                type: 'line',  
                data: [20.0, 49, 7.0, 123.2, 25.6, 76.7, 135.6, 162.2]  
            }
		];
		this.cols = [
            {field: 'a', header: ''},
            {field: 'b', header: '发送数'},
            {field: 'c', header: '发送率'},
            {field: 'd', header: '到达数'},
            {field: 'e', header: '展示率'},
            {field: 'f', header: '展示数'},
            {field: 'g', header: '点击率'},
            {field: 'h', header: '点击数'}
        ];
        this.conts = [
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'},
            {a: 'Apple', b: '51%', c: '40%', d: '$54,406.00', e: '$43,342',f:'fff',g:'ggg',h:'hhh'}
        ];
        this.footers = [
        	{footer:'总计'},
        	{footer:'111'},
        	{footer:'222'},
        	{footer:'333'},
        	{footer:'444'},
        	{footer:'555'},
        	{footer:'666'},
        	{footer:'777'}
        ];
	};
	onclick(event:any){
    	this.clickText = event.currentTarget.innerText;
    	let len = event.currentTarget.parentNode.children;
    	
    	for(let i=0;i<len.length;i++){
    		len[i].classList.add('ui-button-secondary');
    	}
    	event.currentTarget.classList.remove('ui-button-secondary');
    	
    };
	onChart(change:boolean){
    	this.chartShow = true;
    	this.barShow = false;
    };
    onBar(change:boolean){
    	
    	this.chartShow = false;
    	this.barShow = true;
    }
	
	
}