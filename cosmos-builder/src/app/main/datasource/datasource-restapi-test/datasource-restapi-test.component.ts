import { Component, OnInit, OnDestroy ,Input} from '@angular/core';

@Component({
    selector: 'datasource-restapi-test',
    templateUrl: './datasource-restapi-test.component.html',
    styleUrls: ['./datasource-restapi-test.component.less']
})
export class datasourceRestapiTestComponent implements OnInit, OnDestroy {

    isVisibleTop = false;
    isVisibleMiddle = false;

    showModalTop = () => {
        this.isVisibleTop = true;
    };


    showModalMiddle = () => {
        this.isVisibleMiddle = true;
    };


    handleOkTop = (e: any) => {
        this.isVisibleTop = false;
    };


    handleCancelTop = (e: any) => {
        this.isVisibleTop = false;
    };


    handleOkMiddle = (e: any) => {
        this.isVisibleMiddle = false;
    };


    handleCancelMiddle = (e: any) => {
        // console.log(e);
        this.isVisibleMiddle = false;
    };

    ngOnInit() {
    }

    ngOnDestroy() {

    }

}

