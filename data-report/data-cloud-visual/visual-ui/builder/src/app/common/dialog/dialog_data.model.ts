export class DialogData {

    /** 对话框标题 */
    title: string
    /** 对话框内容 */
    content: string
    /** 取消按钮的展示标签 */
    cancelLabel: string = "取消"
    /** 点击取消按钮时回调的函数 */
    onCancel: () => any
    /** 多个确定按钮 */
    confirms: DialogConfirm[] = []
    icon: any;

}

export class DialogConfirm {

    /** 确定按钮的展示标签 */
    confirmLabel: string = "确定"
    /** 点击确定按钮时回调的函数 */
    onConfirm: () => any

}
