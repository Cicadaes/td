import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';

export const STEP1ISFALSE = 'STEP1ISFALSE';

export function metadataReducer(state: any = { "save": true }, action: Action) {
    switch (action.type) {
        case 'step1IsFalse':
            return {
                "action": "step1IsFalse",
                'step1IsFalse': false
            };
        case 'step1IsTrue':
            return {
                "action": "step1IsTrue",
                'step1IsTrue': true
            };
        case 'step2ListIsFalse':
            return {
                "action": "step2ListIsFalse",
                'step2ListIsFalse': false
            };
        case 'step2ListIsTrue':
            return {
                "action": "step2ListIsTrue",
                'step2ListIsTrue': true
            };
        case 'step3InfoIsFalse':
            return {
                "action": "step3InfoIsFalse",
                'step3InfoIsFalse': false
            };
        case 'step3InfoIsTrue':
            return {
                "action": "step3InfoIsTrue",
                'step3InfoIsTrue': true
            };
        case 'step3ListIsFalse':
            return {
                "action": "step3ListIsFalse",
                'step3ListIsFalse': false
            };
        case 'step3ListIsTrue':
            return {
                "action": "step3ListIsTrue",
                'step3ListIsTrue': true
            };
        default:
            return state;
    };
}