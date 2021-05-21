import { makeObservable, action, observable } from "mobx";

export class WindowStore {
    rootStore;
    tool = true;
    stage = true;
    controller = true;
    animationComponent = false;

    constructor(root) {
        makeObservable(this, {
            tool:observable,
            stage:observable,
            controller:observable,
            animationComponent:observable,
            toggle:action,
        });


        this.rootStore = root;

    }

    toggle(window, bool){
        this[window] = bool;
    }
}