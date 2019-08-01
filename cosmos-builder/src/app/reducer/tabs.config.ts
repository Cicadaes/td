import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';

export function tabsReducer(state: number = 0, action: Action) {
    switch (action.type) {
        case '文件夹':
            return 0;
        case '报表':
            return 1;
        default:
            return 0;
    };
}