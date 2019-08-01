import { Single } from "../single";

export class PreviewMode {

    _previewMode: boolean = false;

    constructor(single: Single) {
        if (!(single instanceof Single)) {
            throw ("....");
        }
    }

    private static _instance: PreviewMode = null;

    public static getInstance(): PreviewMode {
        if (!PreviewMode._instance) {
            PreviewMode._instance = new PreviewMode(new Single());
        }
        return PreviewMode._instance;
    }

    public static savePreviewMode(previewMode: boolean) {
        PreviewMode.getInstance()._previewMode = previewMode;
    }

    public static getPreviewMode() {
        return PreviewMode.getInstance()._previewMode;
    }
}
