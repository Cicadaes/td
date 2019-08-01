import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';

export function loginReducer(state: any = false, action: Action) {
    switch (action.type) {
        case 'login':
            return true;
        case 'logout':
            return false;
        default:
            return state;
    };
}