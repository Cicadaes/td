import {Component, Input, Output} from '@angular/core';
import {NzNotificationService, UploadFile} from 'ng-cosmos-ui';
import {NzMessageService} from 'ng-cosmos-ui';

let $scope;

@Component({
    selector: 'app-event-mgt-import-modal',
    templateUrl: './event-mgt-import-modal.component.html',
    styleUrls: ['./event-mgt-import-modal.component.less']
})

export class EventMgtImportModalComponent {

    public nls: any;
    public data: any;

    @Input()
    private set _productId($value: any) {

        $scope.data.productid = $value;

    }

    constructor(private message: NzMessageService,
                private notification: NzNotificationService) {

        this.nls = {
            text: '单击或拖动文件到该区域上传',
            subtext: '支持 xls、xlsx 类型的文件',
            notificationTitleBySuccess: '上传成功',
            notificationTitleByWarning: '上传失败',
            notificationText1: '只能上传 xls、xlsx 类型的文件',
            notificationText2: '服务器错误'
        };

        this.data = {
            // null
        };

        $scope = this;

    }

    /**
     * 处理上传前
     */
    handlerBeforeUpload($file: any) {

        if ($file && $file.name) {
            if ($file.name.indexOf('.xls') !== -1 || $file.name.indexOf('.xlsx') !== -1) {
                return true;
            } else {
                $scope.notification.create('warning', $scope.nls.notificationTitleByWarning, $scope.nls.notificationText1);
            }
        }
        return false;

    }

    /**
     * 处理上传后
     */
    handleChange({file, fileList}) {

        switch (file.status) {

            case 'done' :
//                    $scope.notification.create('success', $scope.nls.notificationTitleBySuccess, file.name);

                this.message.create('success', file.response.msg);

                break;
            case 'error' :
                this.message.create('error', file.response.msg);
                // $scope.notification.create('warning', $scope.nls.notificationTitleBySuccess, $scope.nls.notificationText2);
                break;

        }

    }

}
