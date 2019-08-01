import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';

export function previewReducer(state: boolean = true, action: Action) {
    switch (action.type) {
        case 'show':
            return true;
        case 'disabled':
            return false;
        default:
            return false;
    };
}