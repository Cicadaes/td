import { Component, Input, Output, EventEmitter,OnChanges , SimpleChanges} from '@angular/core';
import { AddUgUserPageService } from './add-uguser-page.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

@Component({
    selector: 'add-uguser-page',
    templateUrl: './add-uguser-page.component.html',
})
export class AddUgUserPageComponent {
    @Input() user : boolean;
    @Input() isShow:boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitAddUgUserFormData:boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadUgUserTable:boolean = false;
    id = 0;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadUgUserTable = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.isShow && changes.isShow.currentValue){
            this.isShow = changes.isShow.currentValue;
        }else{
            this.isShow = false;
        }
        if(this.isShow){
            this.showModal();
        }
    }

    submitAddUgUserForm(data:any){
        this.isNeedSubmitAddUgUserFormData = false;
        if(data.status == 'VALID'){
            this.isConfirmLoading = true;
            // let param = data.value;
           
            this.service.addUgUser(data.value).then((data: any) => {
                if(data.success){
                    this.router.navigate(['/ugusers']);
                }else{
                    alert(data.result)
                }
            })
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddUgUserFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    reflashUserDetail(){
        this.service.getUgUserById(this.id).then((data: any) => {
            if(data.success){
                this.user=data.data;
            }
        });
    }

    ngOnInit() {
        this.id=this.route.snapshot.params['id'];
        this.isNeedSubmitAddUgUserFormData = false;
        this.reflashUserDetail();
    }

    constructor(private service: AddUgUserPageService,private route: ActivatedRoute,private router: Router) {

    }

}