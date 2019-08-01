import {TestBed, inject} from "@angular/core/testing";
import {UserGroupService} from "./user-group.service";
import {HttpClientModule} from "@angular/common/http";
import {Globals} from "../../utils/globals";
import {CommonService} from "../../common/services/common.service";
import {CurdService} from "../../curd.service";

describe('UserGroupService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [UserGroupService,
                Globals,
                CommonService,
                CurdService]
        });
    });

    it('should be created', inject([UserGroupService], (service: UserGroupService) => {
        expect(service).toBeTruthy();
    }));
});
