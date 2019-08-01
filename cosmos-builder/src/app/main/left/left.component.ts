import { MainService } from './../main.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LeftService } from './left.service';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'left',
    templateUrl: './left.component.html',
    styleUrls: ['./left.component.less']
})
export class LeftComponent implements OnInit, OnDestroy, AfterViewInit {

    isCollapsed: boolean;
    menuList: Array<any>;
    firstLevelMenu: Array<any> = [];
    menuTheme: string;
    isOpen: boolean = true;
    title: Array<any>;

    constructor(
        private menuService: LeftService, 
        private mainService: MainService,
        private route: ActivatedRoute,
    ) {
        
        this.isCollapsed = this.mainService.isCollapsed;
        this.mainService.missionMenu$.subscribe(menu => {
            this.isCollapsed = menu;
        });
    }

    setMenuSelected(url:string){
        let len = this.firstLevelMenu.length;
        let NoneSelected = true;
        for(let i = 0; i < len; i++){
            let menuItem =  this.firstLevelMenu[i];
            if(url.indexOf(menuItem.owns) > 0){
                menuItem.partialSelected = true;
                NoneSelected = false;
            }else{
                menuItem.partialSelected = false;
            }
        }

        //没有匹配则设置第一个选中
        if(NoneSelected){
            this.firstLevelMenu[0]['partialSelected'] = true;
        }
    }

    ngOnInit() {

    }
    toggleCollapsed() {
        this.mainService.menuMission(!this.mainService.isCollapsed);
    }

    changeOpen() {
        this.isOpen = !this.isOpen;
    }

    ngOnDestroy() {

    }

    ngAfterViewInit(){
        this.menuService.getMenu().then(menuList => {
            let length = menuList.length;
            this.firstLevelMenu = menuList.slice(0, length - 1)
        }).then(()=>{
            let url = this.route.snapshot['_routerState']['url'] + '';
                if(this.firstLevelMenu.length > 0){
                    this.setMenuSelected(url);
                }
        }).catch(()=>{
            
        });
    }

}