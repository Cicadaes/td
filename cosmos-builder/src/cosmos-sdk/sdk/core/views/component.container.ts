import { Container } from "./container";
import { Scope } from "../utils/scope";
import { DataStore } from '../stores/data.store';
import { EventEmitter } from '../events/emitter.event';
import { View } from "./view";
import { Component } from "./component";

export class ComponentContainer extends Container {

    public component: Component;
    constructor(query: any,component:Component) {
        super(query);
        this.component = component;
        this.addChild(this.component);

    }

}