export interface BaseInterface {
    onCreate(): void;

    onDestroy(): void;

    onDataChange(scope: string, data: any): void;

    onStyleChange(scope: string, style: any): void;

    onSizeChange(): void;
}