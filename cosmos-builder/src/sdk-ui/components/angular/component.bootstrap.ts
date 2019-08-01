import { ComponentFactoryResolver, ApplicationRef, ComponentRef } from '@angular/core';
import { Communication } from 'cosmos-td-sdk';

export default class ComponentBootstrap {

    public static appRef: ApplicationRef = null;
    public static resolver: ComponentFactoryResolver = null;

    public static bootstrap(root: HTMLElement, ComponentClass: any): ComponentRef<{}> {
        const factory = ComponentBootstrap.resolver.resolveComponentFactory(ComponentClass);
        return ComponentBootstrap.appRef.bootstrap(factory, root);
    }

}