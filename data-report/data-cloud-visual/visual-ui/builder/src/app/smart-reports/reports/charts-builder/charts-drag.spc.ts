export class ChartsDragToBuild {
    private target: any;
    private moveTartget: any;
    private targetPar: any;
    private tartgetLi: any;
    private targetPosX: any;
    private targetPosY: any;
    constructor() {

    }

    protected initDrag(e: any) {
        let self = this;
        self.target = e.target,
            self.targetPar = self.target.parentNode,
            self.tartgetLi = self.targetPar.parentNode;
        if ((self.target.nodeName === 'EM' || self.target.nodeName === 'SPAN') && self.targetPar.nodeName === 'A') {
            self.handlerClone(e);
            //start
            document.onmousemove = (e) => {
                this.handlerDrag(e)
            }

            //end
            document.onmouseup = () => {
                this.handlerUp()
            }

        }
        e.preventDefault()
    }

    private handlerClone(e: any) {
        let self = this;
        let offsetX = e.pageX,
            offsetY = e.pageY,
            clientX = e.clientX,
            clientY = e.clientY;
        let targetWidth = self.targetPar.offsetWidth,
            targetHeight = self.targetPar.offsetHeight;
        document.body.style['userSelect'] = 'none';
        self.targetPosX = targetWidth / 2,
            self.targetPosY = targetHeight / 2;

        self.moveTartget = self.targetPar.cloneNode(true);
        self.moveTartget.setAttribute('class', 'clonex');
        self.moveTartget.style.cssText = `left:${clientX - self.targetPosX}px;top:${clientY - self.targetPosY}px`;

        self.tartgetLi.appendChild(self.moveTartget);
        self.targetPar.setAttribute('class', 'active');
    }

    private handlerDrag(e: any) {
        this.moveTartget.style.top = `${e.clientY - this.targetPosY}px`;
        this.moveTartget.style.left = `${e.clientX - this.targetPosX}px`;
        return false
    }

    private handlerUp() {
        this.targetPar.removeAttribute('class');
        this.tartgetLi.removeChild(this.moveTartget);
        document.body.setAttribute('style', '');
        document.onmousemove = null;
        document.onmouseup = null
    }





}