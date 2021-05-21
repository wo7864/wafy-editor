import { makeObservable, observable, action } from "mobx";

export class StageStore {
    rootStore;
    width = 1000;
    height = 600;

    tmpMousePos = {
        x: -1,
        y: -1,
    }
    tmpStageSize = {
        width: -1,
        height: -1,
    }
    isResizing = false;
    scrollTop = 0
    constructor(root) {
        makeObservable(this, {
            width: observable,
            height: observable,
            isResizing: observable,
            scrollTop:observable,
            startResize: action,
            resize: action,
            endResize: action,
            setWidth: action,
            setHeight: action,
            setScroll: action,
        });


        this.rootStore = root;



    }

    startResize(e, direction) {
        this.isResizing = direction;

        this.tmpMousePos = { x: e.clientX, y: e.clientY };
        this.tmpStageSize = { width: this.width, height: this.height };
        document.body.addEventListener('mousemove', this.resize, true);
        document.body.addEventListener('mouseup', this.endResize, { once: true });
    }

    resize = (e) => {
        if (this.isResizing === "left")
            this.setWidth(this.tmpStageSize.width + (this.tmpMousePos.x - e.clientX))
        else
            this.setWidth(this.tmpStageSize.width - (this.tmpMousePos.x - e.clientX));
    }

    endResize = () => {
        document.body.removeEventListener('mousemove', this.resize, true);
        this.isResizing = false;
    }

    setWidth = value => this.width = Number(value);
    setHeight = value =>  this.height = Number(value);
    setScroll = value => this.scrollTop = Math.round(Number(value), -2)


}